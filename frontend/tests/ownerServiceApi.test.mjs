import assert from "node:assert/strict";
import { test } from "node:test";
import { authApi } from "../src/features/auth/services/authApi.js";
import { ownerServiceApi } from "../src/features/businessOwner/services/ownerServiceApi.js";
import { serviceToRow, servicePayload, filterServices } from "../src/features/businessOwner/data/serviceApiData.js";

test("owner service operations use authenticated catalog APIs and real category IDs", async (t) => {
    authApi.setAccessToken("owner-token");
    const calls = [];
    t.mock.method(globalThis, "fetch", async (url, options) => {
        assert.equal(options.headers.Authorization, "Bearer owner-token");
        assert.equal(options.credentials, "include");
        calls.push([new URL(url).pathname, options.method || "GET", options.body && JSON.parse(options.body)]);
        return Response.json({ data: [] });
    });
    await ownerServiceApi.list(); await ownerServiceApi.categories(); await ownerServiceApi.detail("service-1");
    await ownerServiceApi.create({ name: "New", businessId: "business-1", categoryId: "category-1" });
    await ownerServiceApi.update("service-1", { status: "INACTIVE" });
    assert.deepEqual(calls, [
        ["/api/businessOwner/services", "GET", undefined], ["/api/customer/service-categories", "GET", undefined],
        ["/api/businessOwner/services/service-1", "GET", undefined],
        ["/api/businessOwner/services", "POST", { name: "New", businessId: "business-1", categoryId: "category-1" }],
        ["/api/businessOwner/services/service-1", "PATCH", { status: "INACTIVE" }],
    ]);
});

test("expired owner service sessions refresh once and validation errors reach the form", async (t) => {
    authApi.setAccessToken("expired");
    let refreshes = 0;
    t.mock.method(globalThis, "fetch", async (url, options) => {
        if (url.endsWith("/auth/refresh")) { refreshes++; return Response.json({ data: { accessToken: "fresh" } }); }
        return options.headers.Authorization === "Bearer fresh" ? Response.json({ data: [] }) : Response.json({ message: "Expired" }, { status: 401 });
    });
    await ownerServiceApi.list(); assert.equal(refreshes, 1);
    t.mock.method(globalThis, "fetch", async () => Response.json({ message: "Danh mục không tồn tại" }, { status: 404 }));
    await assert.rejects(ownerServiceApi.create({}), /Danh mục không tồn tại/);
});

test("service rows summarize actual branch offering prices, pets and duration including free offerings", () => {
    const row = serviceToRow({ _id: "mongo-id", name: "Spa", description: "Mô tả", serviceType: "APPOINTMENT", status: "ACTIVE",
        categoryId: { _id: "category-id", name: "Spa" }, monthlyBookings: 5, previousMonthBookings: 10,
        offerings: [{ price: 0, pricingUnit: "PER_SERVICE", durationMinutes: 30, petTypes: ["DOG"] },
            { price: 200000, pricingUnit: "PER_SERVICE", durationMinutes: 60, petTypes: ["DOG", "CAT"] }] });
    assert.equal(row.id, "mongo-id"); assert.equal(row.categoryValue, "category-id");
    assert.equal(row.price, "0 - 200.000 đ"); assert.equal(row.unit, "/ lần");
    assert.equal(row.duration, "30 - 60 phút"); assert.equal(row.pets, "Chó, Mèo");
    assert.equal(row.bookings, 5); assert.equal(row.trend, "-50.0% so với tháng trước");
});

test("unconfigured services never inherit mock prices, pet species, durations or bookings", () => {
    const row = serviceToRow({ _id: "service", name: "New", serviceType: "BOARDING", status: "INACTIVE" });
    assert.equal(row.price, "Chưa cấu hình"); assert.equal(row.duration, "Chưa cấu hình");
    assert.equal(row.pets, "Chưa cấu hình"); assert.equal(row.bookings, 0);
    assert.equal(row.status, "Tạm ngưng"); assert.equal(row.trendDirection, "neutral");
});

test("catalog payloads exclude branch pricing and preserve an unchanged inactive category", () => {
    const form = { name: " Service ", desc: " Description ", type: "Hẹn lịch", status: "Tạm ngưng", images: " https://example.com/1.jpg\n\n",
        isHighlight: true, categoryId: "old-category", price: "200.000", pets: "Chó", duration: "60" };
    const create = servicePayload(form, null, "business-id");
    assert.equal(create.businessId, "business-id"); assert.equal(create.categoryId, "old-category");
    assert.equal(create.name, "Service"); assert.equal(create.isHighlight, true);
    for (const field of ["price", "pets", "duration", "unit"]) assert.equal(create[field], undefined);
    const update = servicePayload(form, { categoryValue: "old-category" }, "business-id");
    assert.equal(update.businessId, undefined); assert.equal(update.categoryId, undefined);
    assert.equal(servicePayload({ ...form, categoryId: "new-category" }, { categoryValue: "old-category" }).categoryId, "new-category");
});

test("service filters combine keyword, type and state without changing input data", () => {
    const rows = [serviceToRow({ _id: "1", name: "Tắm Spa", description: "Cắt lông", status: "ACTIVE", serviceType: "APPOINTMENT" }),
        serviceToRow({ _id: "2", name: "Khách sạn", status: "INACTIVE", serviceType: "BOARDING" })];
    assert.deepEqual(filterServices(rows, " CẮT LÔNG ", "Hẹn lịch", "Đang hoạt động").map((item) => item.id), ["1"]);
    assert.deepEqual(filterServices(rows, "", "Lưu trú", "Đang hoạt động"), []);
    assert.equal(rows.length, 2);
});
