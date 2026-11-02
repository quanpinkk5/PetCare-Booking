const assert = require("node:assert/strict");
const { before, test } = require("node:test");
const jwt = require("jsonwebtoken");
const User = require("../src/models/User");
const Business = require("../src/models/Business");
const Branch = require("../src/models/Branch");
const BranchService = require("../src/models/BranchService");
const Booking = require("../src/models/Booking");
const PetDiary = require("../src/models/PetDiary");
const listRoutes = require("../src/routes/businessOwner/petDiaryRoutes");
const boardingRoutes = require("../src/routes/businessOwner/boardingRoutes");

const ids = Array.from({ length: 7 }, (_, index) => `507f1f77bcf86cd79943901${index}`);
const [ownerId, businessId, branchId, serviceId, bookingId, petId, diaryId] = ids;
const owner = { _id: ownerId, role: "BUSINESS_OWNER", status: "ACTIVE" };
const booking = { _id: bookingId, petId, branchServiceId: serviceId, bookingType: "BOARDING", status: "IN_PROGRESS", boardingDetails: { actualCheckInAt: new Date("2020-01-01T00:00:00Z") } };
const payload = { activityType: "meal", description: " Ate well ", activityTime: "2020-01-02T03:00:00Z", images: ["https://example.com/meal.jpg"] };
let token;
before(() => { process.env.JWT_SECRET = "owner-diary-test"; token = jwt.sign({ userId: ownerId, tokenVersion: 0 }, process.env.JWT_SECRET); });
const query = (value) => {
  const result = { then: (resolve, reject) => Promise.resolve(value).then(resolve, reject) };
  for (const method of ["select", "populate", "sort", "lean", "skip", "limit"]) result[method] = () => result;
  return result;
};
const request = (router, method, url, body = {}, auth = token) => new Promise((resolve, reject) => {
  const req = { method, url, query: Object.fromEntries(new URL(url, "http://test").searchParams), body, headers: auth ? { authorization: `Bearer ${auth}` } : {} };
  const res = { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(data) { resolve({ status: this.statusCode, ...data }); } };
  router.handle(req, res, (error) => reject(error || Error("Route did not respond")));
});
const authenticate = (t) => t.mock.method(User, "findById", async () => owner);
const scope = (t, owned = true) => {
  t.mock.method(Booking, "findOne", (filter) => { assert.equal(filter.bookingType, "BOARDING"); return query(booking); });
  t.mock.method(Business, "find", (filter) => { assert.equal(filter.ownerId, ownerId); return query([{ _id: businessId }]); });
  t.mock.method(Branch, "find", (filter) => { assert.deepEqual(filter.businessId, { $in: [businessId] }); return query([{ _id: branchId, name: "Owned branch" }]); });
  t.mock.method(BranchService, "findOne", (filter) => { assert.equal(filter._id, serviceId); assert.deepEqual(filter.branchId, { $in: [branchId] }); return query(owned ? { _id: serviceId } : null); });
};

test("all diary routes enforce authentication and the owner role", async (t) => {
  const paths = [[listRoutes, "GET", "/"], [boardingRoutes, "GET", `/${bookingId}/diaries`], [boardingRoutes, "POST", `/${bookingId}/diaries`], [boardingRoutes, "PATCH", `/${bookingId}/diaries/${diaryId}`]];
  for (const [router, method, url] of paths) assert.equal((await request(router, method, url, payload, null)).status, 401);
  t.mock.method(User, "findById", async () => ({ ...owner, role: "CUSTOMER" }));
  for (const [router, method, url] of paths) assert.equal((await request(router, method, url, payload)).status, 403);
});

test("invalid filters and diary fields fail before database access", async (t) => {
  authenticate(t);
  const read = t.mock.method(Business, "find", () => { throw Error("Unexpected query"); });
  for (const filter of ["date=2026-02-30", "branchId=bad", "activityType=bad", "page=0", "limit=101", "search=" + "a".repeat(101)]) {
    assert.equal((await request(listRoutes, "GET", `/?${filter}`)).status, 400);
  }
  for (const body of [{ ...payload, ownerId }, { ...payload, activityType: "bad" }, { ...payload, description: " " },
    { ...payload, activityTime: "2099-01-01T00:00:00Z" }, { ...payload, activityTime: "2020-01-01T00:00" },
    { ...payload, activityTime: "2020-02-30T00:00:00Z" },
    { ...payload, images: ["javascript:bad"] }, { ...payload, images: Array(6).fill("https://example.com/a") }]) {
    assert.equal((await request(boardingRoutes, "POST", `/${bookingId}/diaries`, body)).status, 400);
    assert.equal((await request(boardingRoutes, "PATCH", `/${bookingId}/diaries/${diaryId}`, body)).status, 400);
  }
  assert.equal(read.mock.callCount(), 0);
});

test("list scopes bookings and latest diaries to owned branches with server pagination", async (t) => {
  authenticate(t); scope(t);
  t.mock.method(BranchService, "find", (filter) => { assert.deepEqual(filter.branchId, { $in: [branchId] }); return query([{ _id: serviceId }]); });
  const populated = { ...booking, petId: { _id: petId, name: "Milo" } };
  const checkFilter = (filter) => { assert.equal(filter.bookingType, "BOARDING"); assert.deepEqual(filter.branchServiceId, { $in: [serviceId] }); assert.deepEqual(filter.status, { $in: ["IN_PROGRESS", "COMPLETED"] }); };
  t.mock.method(Booking, "countDocuments", async (filter) => { checkFilter(filter); return 12; });
  t.mock.method(Booking, "find", (filter) => {
    checkFilter(filter);
    const chain = query([populated]);
    chain.skip = (value) => { assert.equal(value, 5); return chain; };
    chain.limit = (value) => { assert.equal(value, 5); return chain; };
    return chain;
  });
  t.mock.method(PetDiary, "find", (filter) => {
    assert.deepEqual(filter.bookingId, { $in: [bookingId] });
    return query([{ _id: diaryId, bookingId, description: "latest" }, { _id: "older", bookingId, description: "older" }]);
  });
  const result = await request(listRoutes, "GET", "/?page=2&limit=5");
  assert.equal(result.status, 200); assert.equal(result.data.bookings[0].latestDiary.description, "latest");
  assert.deepEqual(result.data.pagination, { page: 2, limit: 5, total: 12, totalPages: 3 });
  assert.equal(result.data.branches[0]._id, branchId);
});

test("activity and Vietnam calendar date filters apply to both booking eligibility and the shown activity", async (t) => {
  authenticate(t); scope(t);
  t.mock.method(BranchService, "find", () => query([{ _id: serviceId }]));
  t.mock.method(Booking, "find", () => query([booking]));
  t.mock.method(Booking, "countDocuments", async (filter) => { assert.deepEqual(filter._id, { $in: [bookingId] }); return 1; });
  const check = (filter) => {
    assert.equal(filter.activityType, "grooming"); assert.deepEqual(filter.bookingId, { $in: [bookingId] });
    assert.equal(filter.activityTime.$gte.toISOString(), "2020-01-01T17:00:00.000Z");
    assert.equal(filter.activityTime.$lt.toISOString(), "2020-01-02T17:00:00.000Z");
  };
  t.mock.method(PetDiary, "distinct", async (field, filter) => { assert.equal(field, "bookingId"); check(filter); return [bookingId]; });
  t.mock.method(PetDiary, "find", (filter) => { check(filter); return query([]); });
  assert.equal((await request(listRoutes, "GET", `/?branchId=${branchId}&date=2020-01-02&activityType=grooming`)).status, 200);
  assert.equal((await request(listRoutes, "GET", `/?branchId=${ownerId}`)).status, 404);
});

test("empty businesses and stays without diaries return honest empty states", async (t) => {
  authenticate(t);
  t.mock.method(Business, "find", () => query([]));
  t.mock.method(Branch, "find", () => query([]));
  t.mock.method(BranchService, "find", () => query([]));
  t.mock.method(Booking, "find", () => query([]));
  t.mock.method(Booking, "countDocuments", async () => 0);
  t.mock.method(PetDiary, "find", () => query([]));
  const result = await request(listRoutes, "GET", "/");
  assert.deepEqual(result.data.bookings, []); assert.deepEqual(result.data.branches, []); assert.equal(result.data.pagination.total, 0);
});

test("foreign bookings cannot expose, create or edit diaries", async (t) => {
  authenticate(t); scope(t, false);
  const create = t.mock.method(PetDiary, "create", () => { throw Error("Unexpected write"); });
  const update = t.mock.method(PetDiary, "findOneAndUpdate", () => { throw Error("Unexpected write"); });
  assert.equal((await request(boardingRoutes, "GET", `/${bookingId}/diaries`)).status, 404);
  assert.equal((await request(boardingRoutes, "POST", `/${bookingId}/diaries`, payload)).status, 404);
  assert.equal((await request(boardingRoutes, "PATCH", `/${bookingId}/diaries/${diaryId}`, payload)).status, 404);
  assert.equal(create.mock.callCount(), 0); assert.equal(update.mock.callCount(), 0);
});

test("new activities persist real booking, pet, creator, time and images", async (t) => {
  authenticate(t); scope(t);
  t.mock.method(PetDiary, "create", async (data) => {
    assert.equal(data.bookingId, bookingId); assert.equal(data.petId, petId); assert.equal(data.createdBy, ownerId);
    assert.equal(data.description, "Ate well"); assert.deepEqual(data.images, payload.images);
    assert.equal(data.activityTime.toISOString(), payload.activityTime.replace("Z", ".000Z"));
    return { ...data, _id: diaryId, populate: async () => {} };
  });
  for (const activityType of ["meal", "hygiene", "grooming", "rest"]) {
    assert.equal((await request(boardingRoutes, "POST", `/${bookingId}/diaries`, { ...payload, activityType })).status, 201);
  }
});

test("updates target one diary under its owned booking and preserve the original creator", async (t) => {
  authenticate(t); scope(t);
  t.mock.method(PetDiary, "findOneAndUpdate", (filter, update, options) => {
    assert.deepEqual(filter, { _id: diaryId, bookingId }); assert.equal(update.$set.description, "Ate well");
    assert.equal(update.$set.createdBy, undefined); assert.equal(update.$set.petId, undefined); assert.equal(options.runValidators, true);
    return query({ _id: diaryId, ...update.$set });
  });
  assert.equal((await request(boardingRoutes, "PATCH", `/${bookingId}/diaries/${diaryId}`, payload)).status, 200);
  t.mock.method(PetDiary, "findOneAndUpdate", () => query(null));
  assert.equal((await request(boardingRoutes, "PATCH", `/${bookingId}/diaries/${diaryId}`, payload)).status, 404);
});

test("completed stays and activities before actual check-in cannot be mutated", async (t) => {
  authenticate(t); scope(t);
  const create = t.mock.method(PetDiary, "create", () => { throw Error("Unexpected write"); });
  const update = t.mock.method(PetDiary, "findOneAndUpdate", () => { throw Error("Unexpected write"); });
  const early = { ...payload, activityTime: "2019-12-31T00:00:00Z" };
  assert.equal((await request(boardingRoutes, "POST", `/${bookingId}/diaries`, early)).status, 400);
  assert.equal((await request(boardingRoutes, "PATCH", `/${bookingId}/diaries/${diaryId}`, early)).status, 400);
  t.mock.method(Booking, "findOne", () => query({ ...booking, status: "COMPLETED" }));
  assert.equal((await request(boardingRoutes, "POST", `/${bookingId}/diaries`, payload)).status, 409);
  assert.equal((await request(boardingRoutes, "PATCH", `/${bookingId}/diaries/${diaryId}`, payload)).status, 409);
  assert.equal(create.mock.callCount(), 0); assert.equal(update.mock.callCount(), 0);
});

test("timeline reads only the selected owned stay and includes stored authors", async (t) => {
  authenticate(t); scope(t);
  t.mock.method(PetDiary, "find", (filter) => {
    assert.deepEqual(filter, { bookingId });
    return query([{ _id: diaryId, createdBy: { fullName: "Owner" }, ...payload }]);
  });
  const result = await request(boardingRoutes, "GET", `/${bookingId}/diaries`);
  assert.equal(result.status, 200); assert.equal(result.data.diaries[0].createdBy.fullName, "Owner");
});
