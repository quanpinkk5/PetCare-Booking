import assert from "node:assert/strict";
import { test } from "node:test";
import { authApi } from "../src/features/auth/services/authApi.js";
import { branchServiceApi } from "../src/features/businessOwner/services/branchServiceApi.js";
import { branchServiceToRow, branchServicePayload, filterBranchServices, defaultBranchServiceFilters } from "../src/features/businessOwner/data/branchServiceApiData.js";

test("branch offering CRUD uses authenticated backend routes and numeric configuration", async (t) => {
    authApi.setAccessToken("token");
    const calls = [];
    t.mock.method(globalThis, "fetch", async (url, options) => {
        assert.equal(options.headers.Authorization, "Bearer token"); assert.equal(options.credentials, "include");
        calls.push([new URL(url).pathname, options.method || "GET", options.body && JSON.parse(options.body)]);
        return Response.json({ data: [] });
    });
    await branchServiceApi.list(); await branchServiceApi.detail("offering-id");
    await branchServiceApi.create({ branchId: "branch-id", serviceId: "service-id", price: 0 });
    await branchServiceApi.update("offering-id", { status: "INACTIVE" });
    assert.deepEqual(calls, [["/api/businessOwner/branchServices", "GET", undefined], ["/api/businessOwner/branchServices/offering-id", "GET", undefined],
        ["/api/businessOwner/branchServices", "POST", { branchId: "branch-id", serviceId: "service-id", price: 0 }], ["/api/businessOwner/branchServices/offering-id", "PATCH", { status: "INACTIVE" }]]);
});

test("expired offering requests refresh and failed writes propagate without fake success", async (t) => {
    authApi.setAccessToken("expired");
    let refreshes = 0;
    t.mock.method(globalThis, "fetch", async (url, options) => {
        if (url.endsWith("/auth/refresh")) { refreshes++; return Response.json({ data: { accessToken: "fresh" } }); }
        return options.headers.Authorization === "Bearer fresh" ? Response.json({ data: [] }) : Response.json({ message: "Expired" }, { status: 401 });
    });
    await branchServiceApi.list(); assert.equal(refreshes, 1);
    t.mock.method(globalThis, "fetch", async () => Response.json({ message: "Dịch vụ đã tồn tại" }, { status: 409 }));
    await assert.rejects(branchServiceApi.create({}), /Dịch vụ đã tồn tại/);
});

const branch = { _id: "branch", name: "Chi nhánh thật", status: "ACTIVE", address: { detail: "Số 1", province: "Hà Nội" } };
const service = { _id: "service", name: "Spa thật", status: "ACTIVE", serviceType: "APPOINTMENT", categoryId: { _id: "category", name: "Spa" } };

test("offering adapter handles populated or raw relations and preserves actual zero prices", () => {
    const raw = { _id: "offering", branchId: "branch", serviceId: "service", price: 0, capacity: 4, durationMinutes: 30, petTypes: ["DOG"], status: "ACTIVE", pricingUnit: "PER_SERVICE" };
    const row = branchServiceToRow(raw, [branch], [service]);
    assert.equal(row.id, "offering"); assert.equal(row.price, "0đ"); assert.equal(row.raw.price, 0);
    assert.equal(row.duration, "30 phút"); assert.equal(row.capacity, "4 bé/slot"); assert.equal(row.pets, "Chó");
    assert.equal(row.branchAddress, "Số 1, Hà Nội"); assert.equal(row.sourceAvailable, true);
    assert.equal(branchServiceToRow({ ...raw, branchId: branch, serviceId: service }).serviceName, "Spa thật");
    assert.equal(branchServiceToRow({ ...raw, branchId: null, serviceId: null }).sourceAvailable, false);
});

test("all filters combine using relation IDs even when display names are duplicated", () => {
    const rows = [branchServiceToRow({ _id: "1", branchId: branch, serviceId: service, status: "ACTIVE" }),
        branchServiceToRow({ _id: "2", branchId: { ...branch, _id: "branch-other" }, serviceId: service, status: "INACTIVE" })];
    assert.deepEqual(filterBranchServices(rows, { ...defaultBranchServiceFilters, branch: "branch", category: "category", keyword: "SPA THẬT", status: "ACTIVE" }).map((row) => row.id), ["1"]);
    assert.deepEqual(filterBranchServices(rows, { ...defaultBranchServiceFilters, branch: "branch", status: "INACTIVE" }), []);
});

test("form payloads use numeric configuration and never rename or reassign an existing offering", () => {
    const form = { branchId: "branch", serviceId: "service", price: "0", capacity: "4", durationMinutes: "60", petTypes: ["DOG", "CAT"], status: "ACTIVE", serviceName: "Cannot rename" };
    const payload = branchServicePayload(form, service);
    assert.equal(payload.price, 0); assert.equal(payload.durationMinutes, 60); assert.equal(payload.capacity, 4); assert.equal(payload.pricingUnit, "PER_SERVICE");
    const edit = branchServicePayload(form, service, true, { status: "ACTIVE" });
    assert.equal(edit.branchId, undefined); assert.equal(edit.serviceId, undefined); assert.equal(edit.status, undefined); assert.equal(edit.serviceName, undefined);
    const boarding = branchServicePayload(form, { serviceType: "BOARDING" });
    assert.equal(boarding.pricingUnit, "PER_DAY"); assert.equal(boarding.durationMinutes, undefined);
});

test("invalid price, capacity, duration and missing pets cannot become accidental zero values", () => {
    const form = { price: "10", capacity: "2", durationMinutes: "30", petTypes: ["DOG"] };
    for (const invalid of [{ price: "" }, { price: "abc" }, { price: "-1" }, { capacity: "" }, { capacity: "1.5" }, { durationMinutes: "0" }, { petTypes: [] }]) {
        assert.throws(() => branchServicePayload({ ...form, ...invalid }, service));
    }
});
