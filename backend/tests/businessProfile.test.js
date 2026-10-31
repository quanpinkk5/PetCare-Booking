const assert = require("node:assert/strict");
const { test, before } = require("node:test");
const jwt = require("jsonwebtoken");
const Business = require("../src/models/Business");
const Branch = require("../src/models/Branch");
const Service = require("../src/models/Service");
const Review = require("../src/models/Review");
const User = require("../src/models/User");
const routes = require("../src/routes/businessOwner/businessesRoutes");

const owner = { _id: "507f1f77bcf86cd799439011", role: "BUSINESS_OWNER", status: "ACTIVE", fullName: "Chủ cơ sở", email: "owner@example.com", password: "private" };
const business = { _id: "507f1f77bcf86cd799439012", ownerId: owner._id, name: "Thương hiệu", status: "PENDING" };
let token;
before(() => {
  process.env.JWT_SECRET = "business-profile-test";
  token = jwt.sign({ userId: owner._id, tokenVersion: 0 }, process.env.JWT_SECRET);
});
const request = (method = "GET", url = "/businesses/profile", body = {}, authorization = token) => new Promise((resolve, reject) => {
  const req = { method, url, body, headers: authorization ? { authorization: `Bearer ${authorization}` } : {} };
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { resolve({ status: this.statusCode, ...data }); } };
  routes.handle(req, res, (error) => reject(error || Error("Route did not respond")));
});

test("business profile routes require login and the owner role", async (t) => {
  assert.equal((await request("GET", "/businesses/profile", {}, null)).status, 401);
  t.mock.method(User, "findById", async () => ({ ...owner, role: "CUSTOMER" }));
  assert.equal((await request()).status, 403);
  assert.equal((await request("PATCH", `/businesses/${business._id}`, { name: "Updated" })).status, 403);
});

test("profile resolves authenticated business with its branches, services and visible reviews", async (t) => {
  t.mock.method(User, "findById", async () => owner);
  t.mock.method(Business, "findOne", (filter) => {
    assert.deepEqual(filter, { ownerId: owner._id });
    return { lean: async () => business };
  });
  t.mock.method(Branch, "find", (filter) => {
    assert.deepEqual(filter, { businessId: business._id });
    return { select: () => ({ sort: () => ({ lean: async () => [{ status: "ACTIVE" }, { status: "INACTIVE" }] }) }) };
  });
  t.mock.method(Service, "countDocuments", async (filter) => {
    assert.deepEqual(filter, { businessId: business._id, status: "ACTIVE" }); return 3;
  });
  t.mock.method(Review, "aggregate", async (pipeline) => {
    assert.deepEqual(pipeline[0], { $match: { businessId: business._id, status: "VISIBLE" } });
    return [{ averageRating: 4.5, totalReviews: 2 }];
  });
  const result = await request();
  assert.equal(result.status, 200);
  assert.equal(result.data.business.name, business.name);
  assert.deepEqual(result.data.stats, { branches: 2, activeBranches: 1, services: 3, averageRating: 4.5, totalReviews: 2 });
  assert.equal(result.data.owner.password, undefined);
});

test("businesses with no branches still have profiles; missing businesses return an empty state", async (t) => {
  t.mock.method(User, "findById", async () => owner);
  t.mock.method(Business, "findOne", () => ({ lean: async () => null }));
  assert.equal((await request()).data.business, null);
  t.mock.method(Business, "findOne", () => ({ lean: async () => business }));
  t.mock.method(Branch, "find", () => ({ select: () => ({ sort: () => ({ lean: async () => [] }) }) }));
  t.mock.method(Service, "countDocuments", async () => 0);
  t.mock.method(Review, "aggregate", async () => []);
  const result = await request();
  assert.equal(result.data.business._id, business._id);
  assert.equal(result.data.stats.branches, 0);
  assert.equal(result.data.stats.totalReviews, 0);
});

test("business update persists profile fields using an atomic ownership guard", async (t) => {
  t.mock.method(User, "findById", async () => owner);
  const payload = { name: " Updated ", description: " Mô tả ", phone: "0901234567", address: { detail: " Số 1 " },
    logo: "https://example.com/logo.png", images: ["https://example.com/image.png"],
    openingHours: [{ day: " CN ", time: " Đóng cửa " }], policies: [" Chính sách "], note: " Lưu ý " };
  t.mock.method(Business, "findOneAndUpdate", async (filter, operation, options) => {
    assert.deepEqual(filter, { _id: business._id, ownerId: owner._id });
    assert.deepEqual(options, { new: true, runValidators: true });
    assert.equal(operation.$set.name, "Updated");
    assert.equal(operation.$set["address.detail"], "Số 1");
    assert.equal(operation.$set.status, undefined);
    assert.deepEqual(operation.$set.openingHours, [{ day: "CN", time: "Đóng cửa" }]);
    return { ...business, ...operation.$set };
  });
  const result = await request("PATCH", `/businesses/${business._id}`, payload);
  assert.equal(result.status, 200);
  assert.equal(result.data.name, "Updated");
  assert.equal(result.data.status, "PENDING");
});

test("business update rejects privileged and malformed fields before writes", async (t) => {
  t.mock.method(User, "findById", async () => owner);
  const update = t.mock.method(Business, "findOneAndUpdate", () => { throw Error("Unexpected write"); });
  for (const body of [{ status: "APPROVED" }, { ownerId: "other" }, { averageRating: 5 }, { slug: "other" },
    { name: " " }, { description: {} }, { policies: [42] }, { images: ["javascript:bad"] },
    { openingHours: [null] }, { website: "javascript:bad" }, { address: { detail: {} } }, {}, []]) {
    assert.equal((await request("PATCH", `/businesses/${business._id}`, body)).status, 400);
  }
  assert.equal(update.mock.callCount(), 0);
});

test("another owner's business cannot be updated and malformed IDs fail cleanly", async (t) => {
  t.mock.method(User, "findById", async () => owner);
  t.mock.method(Business, "findOneAndUpdate", async (filter) => { assert.equal(filter.ownerId, owner._id); return null; });
  assert.equal((await request("PATCH", "/businesses/507f1f77bcf86cd799439099", { name: "Changed" })).status, 404);
  assert.equal((await request("PATCH", "/businesses/invalid", { name: "Changed" })).status, 400);
});

const registration = { name: " Cơ sở mới ", description: " Giới thiệu cơ sở ", phone: " 0901234567 ", email: " BRAND@example.com ",
  businessType: " Spa thú cưng ", licenseNumber: " GPKD-123 ", address: { detail: " Số 1 Đường A ", ward: "Phường B", district: "Quận C", province: " Hà Nội " },
  logo: "https://example.com/logo.jpg", images: ["https://example.com/photo.jpg"], website: "https://example.com" };

test("registration creates one owned PENDING business with all information submitted for admin review", async (t) => {
  t.mock.method(User, "findById", async () => owner);
  const filters = [];
  t.mock.method(Business, "findOne", async (filter) => { filters.push(filter); return null; });
  t.mock.method(Business, "create", async (data) => {
    assert.equal(data.ownerId, owner._id); assert.equal(data.status, "PENDING");
    assert.equal(data.name, "Cơ sở mới"); assert.equal(data.description, "Giới thiệu cơ sở");
    assert.equal(data.phone, "0901234567"); assert.equal(data.email, "brand@example.com");
    assert.equal(data.licenseNumber, "GPKD-123"); assert.equal(data.businessType, "Spa thú cưng");
    assert.equal(data.address.detail, "Số 1 Đường A"); assert.equal(data.address.province, "Hà Nội");
    assert.equal(data.slug, "co-so-moi"); assert.equal(data.averageRating, 0);
    return { _id: business._id, ...data };
  });
  const result = await request("POST", "/businesses", registration);
  assert.equal(result.status, 201); assert.equal(result.data.status, "PENDING");
  assert.deepEqual(filters, [{ ownerId: owner._id }, { slug: "co-so-moi" }]);
});

test("registration requires an owner login and validates required details and protected fields before database writes", async (t) => {
  assert.equal((await request("POST", "/businesses", registration, null)).status, 401);
  t.mock.method(User, "findById", async () => ({ ...owner, role: "CUSTOMER" }));
  assert.equal((await request("POST", "/businesses", registration)).status, 403);
  t.mock.method(User, "findById", async () => owner);
  const create = t.mock.method(Business, "create", () => { throw Error("Unexpected write"); });
  const read = t.mock.method(Business, "findOne", () => { throw Error("Unexpected read"); });
  for (const body of [{ ...registration, name: " " }, { ...registration, email: "bad" }, { ...registration, phone: "bad" },
    { ...registration, address: {} }, { ...registration, address: { ...registration.address, detail: 42 } },
    { ...registration, status: "APPROVED" }, { ...registration, ownerId: "other" }, { ...registration, averageRating: 5 },
    { ...registration, logo: "javascript:bad" }, { ...registration, images: [42] }, {}, []]) {
    assert.equal((await request("POST", "/businesses", body)).status, 400);
  }
  assert.equal(read.mock.callCount(), 0); assert.equal(create.mock.callCount(), 0);
});

test("existing registrations and duplicate index races cannot create a second business", async (t) => {
  t.mock.method(User, "findById", async () => owner);
  t.mock.method(Business, "findOne", async () => business);
  const create = t.mock.method(Business, "create", () => { throw Error("Unexpected write"); });
  assert.equal((await request("POST", "/businesses", registration)).status, 409); assert.equal(create.mock.callCount(), 0);
  t.mock.method(Business, "findOne", async () => null);
  t.mock.method(Business, "create", async () => { throw Object.assign(Error("Duplicate"), { code: 11000 }); });
  assert.equal((await request("POST", "/businesses", registration)).status, 409);
});

test("only a rejected, owned business can be resubmitted, always returning to PENDING", async (t) => {
  t.mock.method(User, "findById", async () => owner);
  t.mock.method(Business, "findOneAndUpdate", async (filter, operation, options) => {
    assert.deepEqual(filter, { _id: business._id, ownerId: owner._id, status: "REJECTED" });
    assert.equal(operation.$set.status, "PENDING"); assert.equal(operation.$set.slug, undefined);
    assert.equal(operation.$set.name, "Cơ sở mới"); assert.equal(options.runValidators, true);
    return { ...business, ...operation.$set };
  });
  assert.equal((await request("POST", `/businesses/${business._id}/resubmit`, registration)).data.status, "PENDING");
  t.mock.method(Business, "findOneAndUpdate", async () => null);
  assert.equal((await request("POST", `/businesses/${business._id}/resubmit`, registration)).status, 409);
  assert.equal((await request("POST", `/businesses/${business._id}/resubmit`, { ...registration, status: "APPROVED" })).status, 400);
});

test("the admin review details include the registration address, license and business type", async (t) => {
  const { getBusinessById } = require("../src/controllers/admin/businessAdminController");
  t.mock.method(Business, "findById", () => ({ populate: () => ({ lean: async () => ({ ...business, ...registration, ownerId: null }) }) }));
  t.mock.method(Branch, "find", () => ({ select: () => ({ sort: () => ({ lean: async () => [] }) }) }));
  let result;
  await getBusinessById({ params: { id: business._id } }, { status() { return this; }, json(data) { result = data; } });
  assert.equal(result.data.business.licenseNumber, registration.licenseNumber);
  assert.equal(result.data.business.businessType, registration.businessType);
  assert.deepEqual(result.data.business.address, registration.address);
  assert.equal(result.data.business.website, registration.website);
});
