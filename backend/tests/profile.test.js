const assert = require("node:assert/strict");
const { test, before } = require("node:test");
const jwt = require("jsonwebtoken");
const User = require("../src/models/User");
const profileRoutes = require("../src/routes/customer/profileRoutes");

let token;
const customer = {
  _id: "507f1f77bcf86cd799439011", fullName: "Customer", email: "customer@example.com",
  phone: "", avatar: "", address: {}, role: "CUSTOMER", status: "ACTIVE", tokenVersion: 0,
};

before(() => {
  process.env.JWT_SECRET = "profile-test-secret";
  token = jwt.sign({ userId: customer._id, tokenVersion: 0 }, process.env.JWT_SECRET);
});

// Exercise the actual route and authentication chain without opening a network port.
const patch = (body, authorization = token) => new Promise((resolve, reject) => {
  const req = {
    method: "PATCH", url: "/profile", body,
    headers: authorization ? { authorization: `Bearer ${authorization}` } : {},
  };
  const res = {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(data) { resolve({ status: this.statusCode, json: async () => data }); },
  };
  profileRoutes.handle(req, res, (error) => reject(error || new Error("Route did not respond")));
});

test("profile requires login and CUSTOMER role", async (t) => {
  assert.equal((await patch({ fullName: "Name" }, null)).status, 401);
  t.mock.method(User, "findById", async () => ({ ...customer, role: "ADMIN" }));
  assert.equal((await patch({ fullName: "Name" })).status, 403);
});

test("profile rejects unsupported and invalid values before writing", async (t) => {
  t.mock.method(User, "findById", async () => customer);
  const update = t.mock.method(User, "findOneAndUpdate", () => { throw new Error("Unexpected write"); });
  for (const body of [
    { role: "ADMIN" }, { email: "other@example.com" }, { fullName: "  " },
    { gender: "invalid" }, { birthday: "2025-02-30" }, { birthday: "2999-01-01" },
    { birthday: null }, { bio: "x".repeat(1001) }, { avatar: "blob:temporary" },
    { avatar: `data:image/png;base64,${Buffer.alloc(256 * 1024 + 1).toString("base64")}` },
    { address: "raw string" }, { address: { detail: 123 } }, { address: { role: "ADMIN" } },
    { address: {} }, {}, [],
  ]) {
    const response = await patch(body);
    assert.equal(response.status, 400, JSON.stringify(body).slice(0, 100));
    assert.equal((await response.json()).success, false);
  }
  assert.equal(update.mock.callCount(), 0);
});

test("profile trims and persists editable fields and returns the shared user shape", async (t) => {
  t.mock.method(User, "findById", async () => customer);
  const avatar = "data:image/png;base64,aGVsbG8=";
  t.mock.method(User, "findOneAndUpdate", (filter, operation, options) => {
    assert.deepEqual(filter, { _id: customer._id, role: "CUSTOMER", status: "ACTIVE" });
    assert.equal(options.runValidators, true);
    assert.equal(options.new, true);
    assert.deepEqual(operation.$set, {
      fullName: "Nguyễn An", phone: "0901234567", avatar, gender: "Nữ",
      birthday: "2000-02-29", bio: "Ghi chú", "address.detail": "123 Đường A",
    });
    return { select: async () => ({ ...customer, ...operation.$set, address: { detail: "123 Đường A" } }) };
  });
  const response = await patch({
    fullName: "  Nguyễn An  ", phone: " 0901234567 ", avatar, gender: "Nữ",
    birthday: "2000-02-29", bio: " Ghi chú ", address: { detail: " 123 Đường A " },
  });
  assert.equal(response.status, 200);
  const { data } = await response.json();
  assert.equal(data.user.name, "Nguyễn An");
  assert.equal(data.user.fullName, "Nguyễn An");
  assert.equal(data.user.birthday, "2000-02-29");
  assert.equal(data.user.password, undefined);
});

test("partial address update preserves other address fields", async (t) => {
  t.mock.method(User, "findById", async () => customer);
  t.mock.method(User, "findOneAndUpdate", (_filter, operation) => {
    assert.deepEqual(operation.$set, { "address.ward": "Phường A" });
    return { select: async () => ({ ...customer, address: { province: "HCM", ward: "Phường A" } }) };
  });
  const response = await patch({ address: { ward: " Phường A " } });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).data.user.address.province, "HCM");
});

test("a missing active customer returns a JSON error", async (t) => {
  t.mock.method(User, "findById", async () => customer);
  t.mock.method(User, "findOneAndUpdate", () => ({ select: async () => null }));
  const response = await patch({ phone: "" });
  assert.equal(response.status, 404);
  assert.equal((await response.json()).success, false);
});

test("session restore returns the saved profile fields without sensitive data", async () => {
  const { getMe } = require("../src/controllers/auth/authController");
  const saved = {
    ...customer, fullName: "Nguyễn An", gender: "Nữ", birthday: "2000-02-29", bio: "Ghi chú",
    avatar: "https://example.com/avatar.png", address: { province: "HCM", detail: "123 Đường A" },
    password: "private-hash", resetPasswordTokenHash: "private-token",
  };
  let response;
  await getMe({ user: saved }, {
    status(code) { assert.equal(code, 200); return this; },
    json(data) { response = data; },
  });
  assert.equal(response.data.user.fullName, saved.fullName);
  assert.equal(response.data.user.name, saved.fullName);
  for (const field of ["gender", "birthday", "bio", "avatar", "address"]) {
    assert.deepEqual(response.data.user[field], saved[field]);
  }
  assert.equal(response.data.user.password, undefined);
  assert.equal(response.data.user.resetPasswordTokenHash, undefined);
});
