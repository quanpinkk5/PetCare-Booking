const assert = require("node:assert/strict");
const { before, test } = require("node:test");
const jwt = require("jsonwebtoken");
const User = require("../src/models/User");
const Business = require("../src/models/Business");
const Service = require("../src/models/Service");
const ServiceCategory = require("../src/models/ServiceCategory");
const BranchService = require("../src/models/BranchService");
const Booking = require("../src/models/Booking");
const routes = require("../src/routes/businessOwner/servicesRoutes");

const owner = { _id: "507f1f77bcf86cd799439011", role: "BUSINESS_OWNER", status: "ACTIVE" };
const business = { _id: "507f1f77bcf86cd799439012", name: "Brand" };
const categoryId = "507f1f77bcf86cd799439014";
const service = { _id: "507f1f77bcf86cd799439013", businessId: business._id, categoryId, name: "Spa", serviceType: "APPOINTMENT", status: "ACTIVE" };
let token;
before(() => { process.env.JWT_SECRET = "owner-service-test"; token = jwt.sign({ userId: owner._id, tokenVersion: 0 }, process.env.JWT_SECRET); });
const request = (method = "GET", url = "/services", body = {}, auth = token) => new Promise((resolve, reject) => {
    const req = { method, url, query: Object.fromEntries(new URL(url, "http://test").searchParams), body, headers: auth ? { authorization: `Bearer ${auth}` } : {} };
    const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { resolve({ status: this.statusCode, ...data }); } };
    routes.handle(req, res, (error) => reject(error || Error("Route did not respond")));
});
const mockUser = (t) => t.mock.method(User, "findById", async () => owner);
const mockStats = (t) => {
    t.mock.method(BranchService, "aggregate", async () => []);
    t.mock.method(Booking, "aggregate", async () => []);
};

test("all catalog operations require authentication and BUSINESS_OWNER role", async (t) => {
    for (const [method, url] of [["GET", "/services"], ["GET", `/services/${service._id}`], ["POST", "/services"], ["PATCH", `/services/${service._id}`]]) {
        assert.equal((await request(method, url, {}, null)).status, 401);
    }
    t.mock.method(User, "findById", async () => ({ ...owner, role: "CUSTOMER" }));
    assert.equal((await request()).status, 403);
    assert.equal((await request("POST", "/services", {})).status, 403);
    assert.equal((await request("PATCH", `/services/${service._id}`, { name: "New" })).status, 403);
});

test("catalog list resolves owned business and joins only its service offerings and monthly bookings", async (t) => {
    mockUser(t);
    t.mock.method(Business, "findOne", async (filter) => { assert.deepEqual(filter, { ownerId: owner._id }); return business; });
    t.mock.method(Service, "find", (filter) => {
        assert.deepEqual(filter, { businessId: business._id }); return { populate: () => ({ sort: () => ({ lean: async () => [service] }) }) };
    });
    t.mock.method(BranchService, "aggregate", async (pipeline) => {
        assert.deepEqual(pipeline[0].$match, { serviceId: { $in: [service._id] }, status: "ACTIVE" });
        assert.deepEqual(pipeline[3].$match, { "branch.businessId": business._id, "branch.status": "ACTIVE" });
        return [{ serviceId: service._id, price: 0, durationMinutes: 60, petTypes: ["DOG"], pricingUnit: "PER_SERVICE" }];
    });
    t.mock.method(Booking, "aggregate", async (pipeline) => {
        assert.equal(pipeline[0].$match.status.$ne, "CANCELLED");
        assert.deepEqual(pipeline[3].$match, { "offering.serviceId": { $in: [service._id] } });
        return [{ _id: service._id, current: 4, previous: 2 }];
    });
    const result = await request();
    assert.equal(result.business._id, business._id);
    assert.equal(result.data[0].monthlyBookings, 4); assert.equal(result.data[0].previousMonthBookings, 2);
    assert.equal(result.data[0].offerings[0].price, 0);
});

test("missing businesses and empty catalogs return empty lists; explicit foreign businesses are rejected", async (t) => {
    mockUser(t);
    t.mock.method(Business, "findOne", async () => null);
    assert.deepEqual((await request()).data, []);
    assert.equal((await request("GET", `/services?businessId=${business._id}`)).status, 404);
    t.mock.method(Business, "findOne", async () => business);
    t.mock.method(Service, "find", () => ({ populate: () => ({ sort: () => ({ lean: async () => [] }) }) }));
    const aggregate = t.mock.method(Booking, "aggregate", () => { throw Error("Unexpected query"); });
    assert.deepEqual((await request()).data, []); assert.equal(aggregate.mock.callCount(), 0);
});

test("create stores service catalog fields, category, status and highlight under the authenticated business", async (t) => {
    mockUser(t);
    t.mock.method(Business, "findOne", async (filter) => { assert.deepEqual(filter, { _id: business._id, ownerId: owner._id }); return business; });
    t.mock.method(ServiceCategory, "findOne", async (filter) => { assert.deepEqual(filter, { _id: categoryId, status: "ACTIVE" }); return { _id: categoryId }; });
    t.mock.method(Service, "create", async (data) => {
        assert.equal(data.name, "New service"); assert.equal(data.status, "INACTIVE"); assert.equal(data.isHighlight, true);
        return { _id: service._id, ...data };
    });
    const result = await request("POST", "/services", { businessId: business._id, categoryId, name: " New service ", description: " Info ",
        serviceType: "BOARDING", status: "INACTIVE", isHighlight: true, images: ["https://example.com/photo.jpg"] });
    assert.equal(result.status, 201); assert.equal(result.data.description, "Info");
});

test("create rejects inactive categories and another owner's business before writing", async (t) => {
    mockUser(t);
    const payload = { businessId: business._id, categoryId, name: "New", serviceType: "APPOINTMENT" };
    t.mock.method(Business, "findOne", async () => null);
    assert.equal((await request("POST", "/services", payload)).status, 404);
    t.mock.method(Business, "findOne", async () => business);
    t.mock.method(ServiceCategory, "findOne", async () => null);
    const create = t.mock.method(Service, "create", () => { throw Error("Unexpected write"); });
    assert.equal((await request("POST", "/services", payload)).status, 404); assert.equal(create.mock.callCount(), 0);
});

test("detail and updates enforce business ownership", async (t) => {
    mockUser(t);
    const save = t.mock.fn(async () => {});
    t.mock.method(Service, "findById", async () => ({ ...service, save }));
    t.mock.method(Business, "findOne", async () => null);
    assert.equal((await request("GET", `/services/${service._id}`)).status, 404);
    assert.equal((await request("PATCH", `/services/${service._id}`, { status: "INACTIVE" })).status, 404);
    assert.equal(save.mock.callCount(), 0);
});

test("detail includes fresh offerings and empty statistics without fabricated defaults", async (t) => {
    mockUser(t); mockStats(t);
    const doc = { ...service, populate: async () => {}, toObject: () => service };
    t.mock.method(Service, "findById", async () => doc);
    t.mock.method(Business, "findOne", async () => business);
    const result = await request("GET", `/services/${service._id}`);
    assert.deepEqual(result.data.offerings, []); assert.equal(result.data.monthlyBookings, 0);
});

test("updates persist edits and keep the current category when it is not changed", async (t) => {
    mockUser(t);
    const stored = { ...service, save: async () => {} };
    t.mock.method(Service, "findById", async () => stored);
    t.mock.method(Business, "findOne", async () => business);
    const category = t.mock.method(ServiceCategory, "findOne", () => { throw Error("Unchanged category should not be looked up"); });
    const result = await request("PATCH", `/services/${service._id}`, { name: " Updated ", status: "INACTIVE", isHighlight: true });
    assert.equal(result.data.name, "Updated"); assert.equal(result.data.status, "INACTIVE");
    assert.equal(result.data.isHighlight, true); assert.equal(result.data.categoryId, categoryId); assert.equal(category.mock.callCount(), 0);
});

test("changing type on a configured service is rejected before corrupting branch pricing units", async (t) => {
    mockUser(t);
    const save = t.mock.fn(async () => {});
    t.mock.method(Service, "findById", async () => ({ ...service, save }));
    t.mock.method(Business, "findOne", async () => business);
    t.mock.method(BranchService, "exists", async () => ({ _id: "offering" }));
    assert.equal((await request("PATCH", `/services/${service._id}`, { serviceType: "BOARDING" })).status, 409);
    assert.equal(save.mock.callCount(), 0);
});

test("privileged fields, pricing data and malformed values cannot be saved through the catalog API", async (t) => {
    mockUser(t);
    const read = t.mock.method(Service, "findById", () => { throw Error("Unexpected read"); });
    for (const body of [{ businessId: business._id }, { ownerId: owner._id }, { price: 123 }, { name: " " }, { description: {} },
        { isHighlight: "true" }, { images: ["javascript:bad"] }, { status: "APPROVED" }, { serviceType: "OTHER" }, {}, []]) {
        assert.equal((await request("PATCH", `/services/${service._id}`, body)).status, 400);
    }
    assert.equal((await request("GET", "/services?businessId=invalid")).status, 400);
    assert.equal((await request("PATCH", "/services/invalid", { name: "New" })).status, 400);
    assert.equal(read.mock.callCount(), 0);
});
