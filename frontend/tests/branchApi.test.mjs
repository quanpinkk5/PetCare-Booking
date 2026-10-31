import assert from "node:assert/strict";
import { test } from "node:test";
import { branchApi } from "../src/features/businessOwner/services/branchApi.js";
import { branchToRow, filterBranchRows, normalizeBranchHours } from "../src/features/businessOwner/data/branchApiData.js";
import { authApi } from "../src/features/auth/services/authApi.js";
import { openingHoursText } from "../src/features/customer/services/businessData.js";

test("branch list, details, creation and updates use authenticated backend routes", async (t) => {
    authApi.setAccessToken("token");
    const calls = [];
    t.mock.method(globalThis, "fetch", async (url, options) => {
        assert.equal(options.headers.Authorization, "Bearer token");
        assert.equal(options.credentials, "include");
        calls.push([new URL(url).pathname, options.method || "GET", options.body && JSON.parse(options.body)]);
        return Response.json({ data: [] });
    });
    await branchApi.list(); await branchApi.detail("branch-1");
    await branchApi.create({ businessId: "business-1", name: "New" });
    await branchApi.update("branch-1", { status: "INACTIVE" });
    assert.deepEqual(calls, [
        ["/api/businessOwner/branches", "GET", undefined], ["/api/businessOwner/branches/branch-1", "GET", undefined],
        ["/api/businessOwner/branches", "POST", { businessId: "business-1", name: "New" }],
        ["/api/businessOwner/branches/branch-1", "PATCH", { status: "INACTIVE" }],
    ]);
});

test("expired branch requests refresh once and failures reach the page or form", async (t) => {
    authApi.setAccessToken("expired");
    let refreshes = 0;
    t.mock.method(globalThis, "fetch", async (url, options) => {
        if (url.endsWith("/auth/refresh")) { refreshes++; return Response.json({ data: { accessToken: "fresh" } }); }
        return options.headers.Authorization === "Bearer fresh" ? Response.json({ data: [] }) : Response.json({ message: "Expired" }, { status: 401 });
    });
    await branchApi.list(); assert.equal(refreshes, 1);
    t.mock.method(globalThis, "fetch", async () => Response.json({ message: "Không có quyền" }, { status: 403 }));
    await assert.rejects(branchApi.update("other", { name: "Changed" }), /Không có quyền/);
});

test("branch rows preserve IDs, genuine zero statistics and neutral missing data", () => {
    const row = branchToRow({ _id: "mongo-id", name: "Chi nhánh thật", address: {}, status: "INACTIVE", serviceCount: 0, monthlyBookings: 0, previousMonthBookings: 0 });
    assert.equal(row.id, "mongo-id"); assert.equal(row.status, "Tạm dừng");
    assert.equal(row.services, 0); assert.equal(row.bookings, 0); assert.equal(row.trend, "neutral");
    assert.equal(row.trendVal, "Chưa có số liệu so sánh"); assert.equal(row.img, "");
    assert.equal(row.hours, "Chưa cập nhật giờ mở cửa");
    assert.equal(branchToRow({ monthlyBookings: 5, previousMonthBookings: 10 }).trendVal, "-50.0% so với tháng trước");
});

test("keyword, status and district filters combine using actual branch data", () => {
    const rows = [
        branchToRow({ _id: "1", name: "Spa Đà Nẵng", address: { detail: "Số 1", district: "Hải Châu" }, status: "ACTIVE" }),
        branchToRow({ _id: "2", name: "Spa Hà Nội", address: { district: "Cầu Giấy" }, status: "INACTIVE" }),
    ];
    assert.deepEqual(filterBranchRows(rows, " spa ", "ACTIVE", "Hải Châu").map((item) => item.id), ["1"]);
    assert.deepEqual(filterBranchRows(rows, "CẦU GIẤY", "all", "all").map((item) => item.id), ["2"]);
    assert.deepEqual(filterBranchRows(rows, "", "INACTIVE", "Hải Châu"), []);
});

test("legacy hours are editable and saved hours appear on public branch details", () => {
    const hours = normalizeBranchHours([{ day: "T2", openTime: "08:00", closeTime: "18:00" }, { day: "CN", isClosed: true }]);
    assert.deepEqual(hours, [{ day: "T2", time: "08:00 - 18:00" }, { day: "CN", time: "Đóng cửa" }]);
    assert.deepEqual(openingHoursText(hours), ["T2: 08:00 - 18:00", "CN: Đóng cửa"]);
});
