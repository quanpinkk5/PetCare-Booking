const assert = require("node:assert/strict");
const { before, test } = require("node:test");
const jwt = require("jsonwebtoken");
const User = require("../src/models/User");
const Business = require("../src/models/Business");
const Branch = require("../src/models/Branch");
const Service = require("../src/models/Service");
const BranchService = require("../src/models/BranchService");
const routes = require("../src/routes/businessOwner/branchServicesRoutes");
const owner = { _id: "507f1f77bcf86cd799439011", role: "BUSINESS_OWNER", status: "ACTIVE" };
const business = { _id: "507f1f77bcf86cd799439012" };
const branch = { _id: "507f1f77bcf86cd799439013", businessId: business._id, status: "ACTIVE", name: "Branch" };
const service = { _id: "507f1f77bcf86cd799439014", businessId: business._id, status: "ACTIVE", serviceType: "APPOINTMENT", name: "Service" };
const offering = { _id: "507f1f77bcf86cd799439015", branchId: branch._id, serviceId: service._id, price: 0, capacity: 4, durationMinutes: 60, pricingUnit: "PER_SERVICE", petTypes: ["DOG"], status: "ACTIVE" };
const payload = { branchId: branch._id, serviceId: service._id, price: 0, capacity: 4, durationMinutes: 60, pricingUnit: "PER_SERVICE", petTypes: ["DOG"], status: "ACTIVE" };
let token;
before(() => { process.env.JWT_SECRET = "owner-offering-test"; token = jwt.sign({ userId: owner._id, tokenVersion: 0 }, process.env.JWT_SECRET); });
const request = (method = "GET", url = "/branchServices", body = {}, auth = token) => new Promise((resolve, reject) => {
    const req = { method, url, query: Object.fromEntries(new URL(url, "http://test").searchParams), body, headers: auth ? { authorization: `Bearer ${auth}` } : {} };
    const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { resolve({ status: this.statusCode, ...data }); } };
    routes.handle(req, res, (error) => reject(error || Error("Route did not respond")));
});
const auth = (t) => t.mock.method(User, "findById", async () => owner);
const owned = (t) => {
    auth(t);
    t.mock.method(Branch, "findById", async () => branch);
    t.mock.method(Business, "findOne", async (filter) => { assert.equal(filter.ownerId, owner._id); return business; });
    t.mock.method(Service, "findById", async () => service);
    t.mock.method(Service, "findOne", async (filter) => { assert.equal(filter.businessId, business._id); return service; });
};

test("offering endpoints require authentication and the owner role", async (t) => {
    for (const [method, url] of [["GET", "/branchServices"], ["GET", `/branchServices/${offering._id}`], ["POST", "/branchServices"], ["PATCH", `/branchServices/${offering._id}`]]) {
        assert.equal((await request(method, url, {}, null)).status, 401);
    }
    t.mock.method(User, "findById", async () => ({ ...owner, role: "CUSTOMER" }));
    assert.equal((await request()).status, 403); assert.equal((await request("POST", "/branchServices", payload)).status, 403);
    assert.equal((await request("PATCH", `/branchServices/${offering._id}`, { price: 10 })).status, 403);
});

test("all-branch list scopes options, relations and offerings to the owner's business", async (t) => {
    auth(t);
    t.mock.method(Business, "findOne", (filter) => { assert.deepEqual(filter, { ownerId: owner._id }); return { select: () => ({ lean: async () => business }) }; });
    t.mock.method(Branch, "find", (filter) => { assert.deepEqual(filter, { businessId: business._id }); return { select: () => ({ sort: () => ({ lean: async () => [branch] }) }) }; });
    t.mock.method(Service, "find", (filter) => { assert.deepEqual(filter, { businessId: business._id }); return { select: () => ({ populate: () => ({ sort: () => ({ lean: async () => [service] }) }) }) }; });
    t.mock.method(BranchService, "find", (filter) => {
        assert.deepEqual(filter, { branchId: { $in: [branch._id] } });
        return { populate: () => ({ populate: (spec) => { assert.deepEqual(spec.match, { businessId: business._id }); return { sort: () => ({ lean: async () => [offering] }) }; } }) };
    });
    const result = await request();
    assert.equal(result.data[0]._id, offering._id); assert.equal(result.branches[0]._id, branch._id); assert.equal(result.services[0]._id, service._id);
    assert.equal((await request("GET", "/branchServices?branchId=507f1f77bcf86cd799439099")).status, 404);
    assert.equal((await request("GET", `/branchServices?branchId=${branch._id}`)).status, 200);
});

test("missing businesses return empty options; invalid branch filters fail before database access", async (t) => {
    auth(t);
    const read = t.mock.method(Business, "findOne", () => ({ select: () => ({ lean: async () => null }) }));
    const result = await request(); assert.deepEqual(result.data, []); assert.deepEqual(result.branches, []); assert.equal(result.business, null);
    assert.equal((await request("GET", "/branchServices?branchId=invalid")).status, 400); assert.equal(read.mock.callCount(), 1);
});

test("create stores numeric prices and valid configuration under the owned branch", async (t) => {
    owned(t);
    t.mock.method(BranchService, "findOne", async () => null);
    t.mock.method(BranchService, "create", async (data) => { assert.equal(data.price, 0); assert.equal(data.capacity, 4); return { _id: offering._id, ...data }; });
    const result = await request("POST", "/branchServices", payload);
    assert.equal(result.status, 201); assert.equal(result.data.serviceId, service._id);
});

test("duplicate service/branch pairs return 409 including unique-index races", async (t) => {
    owned(t);
    t.mock.method(BranchService, "findOne", async () => offering);
    assert.equal((await request("POST", "/branchServices", payload)).status, 409);
    t.mock.method(BranchService, "findOne", async () => null);
    t.mock.method(BranchService, "create", async () => { throw Object.assign(Error("duplicate"), { code: 11000 }); });
    assert.equal((await request("POST", "/branchServices", payload)).status, 409);
});

test("creation rejects foreign services, inactive parents and mismatched units or missing duration", async (t) => {
    owned(t);
    t.mock.method(Service, "findById", async () => ({ ...service, businessId: "foreign" }));
    assert.equal((await request("POST", "/branchServices", payload)).status, 400);
    t.mock.method(Service, "findById", async () => ({ ...service, status: "INACTIVE" }));
    assert.equal((await request("POST", "/branchServices", payload)).status, 400);
    t.mock.method(Service, "findById", async () => service);
    t.mock.method(Branch, "findById", async () => ({ ...branch, status: "INACTIVE" }));
    assert.equal((await request("POST", "/branchServices", payload)).status, 400);
    t.mock.method(Branch, "findById", async () => branch);
    assert.equal((await request("POST", "/branchServices", { ...payload, pricingUnit: "PER_DAY" })).status, 400);
    assert.equal((await request("POST", "/branchServices", { ...payload, durationMinutes: undefined })).status, 400);
});

test("boarding creation uses PER_DAY and can omit an appointment duration", async (t) => {
    owned(t);
    t.mock.method(Service, "findById", async () => ({ ...service, serviceType: "BOARDING" }));
    t.mock.method(BranchService, "findOne", async () => null);
    t.mock.method(BranchService, "create", async (data) => data);
    assert.equal((await request("POST", "/branchServices", { ...payload, pricingUnit: "PER_DAY", durationMinutes: undefined })).status, 201);
});

test("detail and updates reject another owner's branch without saving", async (t) => {
    owned(t);
    const save = t.mock.fn(async () => {});
    t.mock.method(BranchService, "findById", async () => ({ ...offering, save }));
    t.mock.method(Business, "findOne", async () => null);
    assert.equal((await request("GET", `/branchServices/${offering._id}`)).status, 404);
    assert.equal((await request("PATCH", `/branchServices/${offering._id}`, { price: 10 })).status, 404); assert.equal(save.mock.callCount(), 0);
});

test("detail returns stored fields and updates persist price, duration, capacity, pets and status", async (t) => {
    owned(t);
    const stored = { ...offering, populate: async () => {}, save: async () => {} };
    t.mock.method(BranchService, "findById", async () => stored);
    assert.equal((await request("GET", `/branchServices/${offering._id}`)).data.price, 0);
    const result = await request("PATCH", `/branchServices/${offering._id}`, { price: 120000, durationMinutes: 90, capacity: 3, petTypes: ["CAT"], status: "INACTIVE" });
    assert.equal(result.status, 200); assert.equal(stored.price, 120000); assert.equal(stored.durationMinutes, 90); assert.equal(stored.capacity, 3);
    assert.deepEqual(stored.petTypes, ["CAT"]); assert.equal(stored.status, "INACTIVE"); assert.equal(stored.serviceId, service._id);
});

test("activation requires active parents and a complete booking configuration", async (t) => {
    owned(t);
    t.mock.method(BranchService, "findById", async () => ({ ...offering, durationMinutes: null, save: async () => {}, populate: async () => {} }));
    assert.equal((await request("PATCH", `/branchServices/${offering._id}`, { status: "ACTIVE" })).status, 400);
    assert.equal((await request("PATCH", `/branchServices/${offering._id}`, { status: "INACTIVE" })).status, 200);
    t.mock.method(BranchService, "findById", async () => ({ ...offering }));
    t.mock.method(Service, "findOne", async () => ({ ...service, status: "INACTIVE" }));
    assert.equal((await request("PATCH", `/branchServices/${offering._id}`, { status: "ACTIVE" })).status, 400);
});

test("unsupported fields and malformed numbers are rejected before reading an offering", async (t) => {
    auth(t);
    const read = t.mock.method(BranchService, "findById", () => { throw Error("Unexpected read"); });
    for (const body of [{ serviceId: service._id }, { name: "Cannot rename" }, { price: "100" }, { price: -1 }, { capacity: 0 }, { durationMinutes: 1.5 }, { petTypes: ["DOG", "DOG"] }, { status: "BAD" }, {}, []]) {
        assert.equal((await request("PATCH", `/branchServices/${offering._id}`, body)).status, 400);
    }
    assert.equal((await request("PATCH", "/branchServices/invalid", { price: 1 })).status, 400); assert.equal(read.mock.callCount(), 0);
});
