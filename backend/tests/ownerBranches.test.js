const assert = require("node:assert/strict");
const { test, before } = require("node:test");
const jwt = require("jsonwebtoken");
const User = require("../src/models/User");
const Business = require("../src/models/Business");
const Branch = require("../src/models/Branch");
const BranchService = require("../src/models/BranchService");
const Booking = require("../src/models/Booking");
const routes = require("../src/routes/businessOwner/branchesRoutes");
const { getMonthBounds } = require("../src/controllers/businessOwner/branchesController");

const owner = { _id: "507f1f77bcf86cd799439011", role: "BUSINESS_OWNER", status: "ACTIVE" };
const business = { _id: "507f1f77bcf86cd799439012", name: "Owner brand" };
const branch = { _id: "507f1f77bcf86cd799439013", businessId: business._id, name: "Branch", status: "ACTIVE" };
let token;
before(() => { process.env.JWT_SECRET = "owner-branches-test"; token = jwt.sign({ userId: owner._id, tokenVersion: 0 }, process.env.JWT_SECRET); });
const request = (method = "GET", url = "/branches", body = {}, auth = token) => new Promise((resolve, reject) => {
    const req = { method, url, body, headers: auth ? { authorization: `Bearer ${auth}` } : {} };
    const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { resolve({ status: this.statusCode, ...data }); } };
    routes.handle(req, res, (error) => reject(error || Error("Route did not respond")));
});

test("all owner branch operations require authentication and role", async (t) => {
    for (const [method, url] of [["GET", "/branches"], ["GET", `/branches/${branch._id}`], ["POST", "/branches"], ["PATCH", `/branches/${branch._id}`]]) {
        assert.equal((await request(method, url, {}, null)).status, 401);
    }
    t.mock.method(User, "findById", async () => ({ ...owner, role: "CUSTOMER" }));
    assert.equal((await request()).status, 403);
    assert.equal((await request("POST", "/branches", {})).status, 403);
    assert.equal((await request("PATCH", `/branches/${branch._id}`, { status: "INACTIVE" })).status, 403);
});

test("list scopes branches and real service/booking metrics to the authenticated owner's business", async (t) => {
    t.mock.method(User, "findById", async () => owner);
    t.mock.method(Business, "findOne", (filter) => {
        assert.deepEqual(filter, { ownerId: owner._id }); return { select: () => ({ lean: async () => business }) };
    });
    t.mock.method(Branch, "find", (filter) => {
        assert.deepEqual(filter, { businessId: business._id }); return { sort: () => ({ lean: async () => [branch] }) };
    });
    t.mock.method(BranchService, "aggregate", async (pipeline) => {
        assert.deepEqual(pipeline[0].$match, { branchId: { $in: [branch._id] }, status: "ACTIVE" });
        assert.deepEqual(pipeline[3].$match, { "service.businessId": business._id, "service.status": "ACTIVE" });
        return [{ _id: branch._id, count: 2 }];
    });
    t.mock.method(Booking, "aggregate", async (pipeline) => {
        assert.equal(pipeline[0].$match.status.$ne, "CANCELLED");
        assert.deepEqual(pipeline[3].$match, { "offering.branchId": { $in: [branch._id] } });
        assert.equal(pipeline[0].$match.$or[1].bookingType, "BOARDING");
        return [{ _id: branch._id, current: 3, previous: 2 }];
    });
    const result = await request();
    assert.equal(result.business._id, business._id);
    assert.equal(result.data[0].serviceCount, 2); assert.equal(result.data[0].monthlyBookings, 3);
    assert.equal(result.data[0].previousMonthBookings, 2);
});

test("missing business and empty branches return honest empty lists without aggregations", async (t) => {
    t.mock.method(User, "findById", async () => owner);
    t.mock.method(Business, "findOne", () => ({ select: () => ({ lean: async () => null }) }));
    assert.deepEqual((await request()).data, []);
    t.mock.method(Business, "findOne", () => ({ select: () => ({ lean: async () => business }) }));
    t.mock.method(Branch, "find", () => ({ sort: () => ({ lean: async () => [] }) }));
    const aggregate = t.mock.method(Booking, "aggregate", () => { throw Error("Unexpected aggregation"); });
    assert.deepEqual((await request()).data, []); assert.equal(aggregate.mock.callCount(), 0);
});

test("create persists branch fields only under an owned business and forces initial ACTIVE status", async (t) => {
    t.mock.method(User, "findById", async () => owner);
    t.mock.method(Business, "findOne", async (filter) => { assert.deepEqual(filter, { _id: business._id, ownerId: owner._id }); return business; });
    t.mock.method(Branch, "create", async (data) => { assert.equal(data.name, "New branch"); assert.equal(data.status, "ACTIVE"); return { _id: branch._id, ...data }; });
    const result = await request("POST", "/branches", { businessId: business._id, name: " New branch ", phone: "0901234567", address: { detail: "Số 1" }, openingHours: [{ day: "T2", time: "08:00 - 18:00" }], images: ["https://example.com/branch.jpg"] });
    assert.equal(result.status, 201); assert.equal(result.data.businessId, business._id);
});

test("branch detail, update and creation block another owner's business", async (t) => {
    t.mock.method(User, "findById", async () => owner);
    const save = t.mock.fn(async () => {});
    t.mock.method(Branch, "findById", async () => ({ ...branch, save }));
    t.mock.method(Business, "findOne", async () => null);
    assert.equal((await request("GET", `/branches/${branch._id}`)).status, 404);
    assert.equal((await request("PATCH", `/branches/${branch._id}`, { name: "Changed" })).status, 404);
    assert.equal((await request("POST", "/branches", { businessId: business._id, name: "New" })).status, 404);
    assert.equal(save.mock.callCount(), 0);
});

test("branch update persists edits and status while preserving omitted fields", async (t) => {
    t.mock.method(User, "findById", async () => owner);
    const stored = { ...branch, images: ["https://example.com/original.jpg"], save: async () => {} };
    t.mock.method(Branch, "findById", async () => stored);
    t.mock.method(Business, "findOne", async () => business);
    const result = await request("PATCH", `/branches/${branch._id}`, { name: " Updated ", status: "INACTIVE" });
    assert.equal(result.data.name, "Updated"); assert.equal(result.data.status, "INACTIVE");
    assert.deepEqual(result.data.images, ["https://example.com/original.jpg"]);
});

test("malformed fields and attempts to change ownership fail before writes", async (t) => {
    t.mock.method(User, "findById", async () => owner);
    const read = t.mock.method(Branch, "findById", () => { throw Error("Unexpected read"); });
    for (const body of [{ businessId: business._id }, { name: 1 }, { name: " " }, { status: "APPROVED" }, { email: "bad" }, { address: { detail: 42 } }, { openingHours: [null] }, { images: ["javascript:bad"] }, {}, []]) {
        assert.equal((await request("PATCH", `/branches/${branch._id}`, body)).status, 400);
    }
    assert.equal((await request("PATCH", "/branches/invalid", { name: "Valid" })).status, 400);
    assert.equal(read.mock.callCount(), 0);
});

test("monthly ranges use Vietnam calendar and handle month/year boundaries", () => {
    const bounds = getMonthBounds(new Date("2026-10-31T18:00:00Z"));
    assert.equal(bounds.current.toISOString(), "2026-11-01T00:00:00.000Z");
    assert.equal(bounds.previous.toISOString(), "2026-10-01T00:00:00.000Z");
    const january = getMonthBounds(new Date("2026-12-31T18:00:00Z"));
    assert.equal(january.previous.toISOString(), "2026-12-01T00:00:00.000Z");
    assert.equal(january.next.toISOString(), "2027-02-01T00:00:00.000Z");
});
