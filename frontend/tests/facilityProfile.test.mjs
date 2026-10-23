import assert from "node:assert/strict";
import { test } from "node:test";
import { facilityApi } from "../src/features/businessOwner/services/facilityApi.js";
import { buildFacilityProfile } from "../src/features/businessOwner/data/facilityProfileData.js";
import { authApi } from "../src/features/auth/services/authApi.js";

test("facility profile uses business APIs and retries after token refresh", async (t) => {
  authApi.setAccessToken("expired");
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url.endsWith("/auth/refresh")) return Response.json({ data: { accessToken: "fresh" } });
    if (options.headers.Authorization !== "Bearer fresh") return Response.json({ message: "Expired" }, { status: 401 });
    calls.push([new URL(url).pathname, options]);
    return Response.json({ data: { name: "Updated business" } });
  });
  await facilityApi.getProfile();
  await facilityApi.updateBusiness("business-1", { name: "Updated business" });
  assert.equal(calls[0][0], "/api/businessOwner/businesses/profile");
  assert.equal(calls[0][1].credentials, "include");
  assert.equal(calls[1][0], "/api/businessOwner/businesses/business-1");
  assert.equal(calls[1][1].method, "PATCH");
  assert.deepEqual(JSON.parse(calls[1][1].body), { name: "Updated business" });
});

test("facility cards use business data even when its branch has different values", () => {
  const profile = buildFacilityProfile({
    business: { _id: "business-1", name: "Thương hiệu thật", status: "PENDING", description: "Mô tả thương hiệu", logo: "brand.png",
      phone: "0901234567", images: ["business.jpg"], openingHours: [{ day: "CN", time: "Đóng cửa" }] },
    branches: [{ name: "Chi nhánh khác", phone: "other", images: ["branch.jpg"], address: { province: "Hà Nội" } }],
    stats: { branches: 1, activeBranches: 1, services: 0, totalReviews: 0, averageRating: 0 },
  });
  assert.equal(profile.id, "business-1");
  assert.equal(profile.name, "Thương hiệu thật");
  assert.equal(profile.description, "Mô tả thương hiệu");
  assert.equal(profile.logo, "brand.png");
  assert.equal(profile.status, "Chờ duyệt");
  assert.equal(profile.contact[0].value, "0901234567");
  assert.deepEqual(profile.gallery, ["business.jpg"]);
  assert.equal(profile.quick[2].value, "Hà Nội");
  assert.equal(profile.stats[2].value, "—");
});

test("a business with no branches still has a complete profile and honest empty values", () => {
  const profile = buildFacilityProfile({ business: { _id: "business-1", name: "New business", status: "APPROVED" },
    stats: { branches: 0, activeBranches: 0, services: 0, totalReviews: 0, averageRating: 0 } });
  assert.equal(profile.name, "New business");
  assert.equal(profile.status, "Đã duyệt");
  assert.equal(profile.stats[0].value, "0 Chi nhánh");
  assert.deepEqual(profile.gallery, []);
  assert.deepEqual(profile.schedule, []);
  assert.equal(profile.contact[0].value, "Chưa cập nhật");
});
