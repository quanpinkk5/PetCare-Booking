import assert from "node:assert/strict";
import { test } from "node:test";
import { authApi } from "../src/features/auth/services/authApi.js";
import { petDiaryApi } from "../src/features/businessOwner/services/petDiaryApi.js";
import { diaryBookingToRow, diaryLocalDateTime, diaryPayload, diaryTimeline } from "../src/features/businessOwner/data/petDiaryApiData.js";

test("diary list, timeline, creation and editing share authenticated backend routes", async (t) => {
  authApi.setAccessToken("owner-token");
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(options.headers.Authorization, "Bearer owner-token"); assert.equal(options.credentials, "include");
    calls.push([new URL(url).pathname, options.method || "GET", options.body && JSON.parse(options.body)]);
    if (url.includes("pet-diaries")) {
      const params = new URL(url).searchParams;
      assert.equal(params.get("date"), "2020-01-02"); assert.equal(params.get("branchId"), "branch-1"); assert.equal(params.get("page"), "2"); assert.equal(params.get("search"), "Milo & Me");
    }
    return Response.json({ data: {} });
  });
  const payload = diaryPayload({ activityType: "grooming", description: " Clean ", activityTime: "2020-01-02T10:00", images: "https://example.com/a.jpg" });
  await petDiaryApi.list({ search: "Milo & Me", date: "2020-01-02", branchId: "branch-1", page: 2 });
  await petDiaryApi.getDiaries("stay-1"); await petDiaryApi.createDiary("stay-1", payload); await petDiaryApi.updateDiary("stay-1", "diary-1", payload);
  assert.deepEqual(calls, [
    ["/api/business-owner/pet-diaries", "GET", undefined],
    ["/api/business-owner/boarding/stay-1/diaries", "GET", undefined],
    ["/api/business-owner/boarding/stay-1/diaries", "POST", payload],
    ["/api/business-owner/boarding/stay-1/diaries/diary-1", "PATCH", payload],
  ]);
});

test("API failures reach the save form instead of pretending to save", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ message: "Stay completed" }, { status: 409 }));
  await assert.rejects(petDiaryApi.createDiary("stay", {}), /Stay completed/);
  await assert.rejects(petDiaryApi.updateDiary("stay", "diary", {}), /Stay completed/);
});

test("row adapter keeps stay and diary IDs, real profile, activity and image count", () => {
  const row = diaryBookingToRow({ _id: "stay-1", bookingCode: "BK001", status: "IN_PROGRESS", petId: { _id: "pet-1", name: "Milo", weight: 0, avatar: "https://example.com/pet.jpg" },
    customerId: { fullName: "Customer", phone: "0123" }, boardingDetails: { roomName: "A1" },
    latestDiary: { _id: "diary-1", activityType: "hygiene", description: "Clean", activityTime: "2020-01-01T03:00:00Z", images: ["https://example.com/a.jpg", "https://example.com/b.jpg"] } });
  assert.equal(row.id, "stay-1"); assert.equal(row.diaryId, "diary-1"); assert.equal(row.name, "Milo"); assert.equal(row.owner, "Customer");
  assert.equal(row.weight, "0 kg"); assert.equal(row.photos, 2); assert.equal(row.note, "Clean"); assert.match(row.actionTime, /10:00/);
  assert.equal(row.room, "A1"); assert.equal(row.activityType, "hygiene");
  const empty = diaryBookingToRow({ _id: "empty", status: "COMPLETED" });
  assert.equal(empty.photos, 0); assert.equal(empty.diaryId, undefined); assert.equal(empty.img, ""); assert.equal(empty.note, "");
  assert.equal(empty.weight, "Chưa rõ cân nặng"); assert.equal(empty.status, "Đã Check-out");
});

test("timeline uses stored activities, photos and author instead of shared sample data", () => {
  assert.deepEqual(diaryTimeline(), []);
  const [entry] = diaryTimeline([{ _id: "entry", activityType: "rest", activityTime: "2020-01-01T17:30:00Z", description: "Sleeping", images: ["https://example.com/a.jpg"], createdBy: { fullName: "Carer" } }]);
  assert.equal(entry.id, "entry"); assert.equal(entry.type, "Nghỉ ngơi"); assert.equal(entry.author, "Carer"); assert.equal(entry.desc, "Sleeping");
  assert.match(entry.time, /00:30 02\/01\/2020/); assert.equal(entry.images.length, 1);
});

test("form time preserves the original Vietnam date on edit and serializes to UTC", () => {
  assert.equal(diaryLocalDateTime("2020-01-01T17:30:00Z"), "2020-01-02T00:30:00.000");
  const original = "2020-01-01T17:30:45.123Z";
  assert.equal(diaryPayload({ activityType: "rest", description: "Sleep", activityTime: diaryLocalDateTime(original) }).activityTime, original);
  const payload = diaryPayload({ activityType: "rest", description: " Sleep ", activityTime: "2020-01-02T00:30", images: " https://example.com/a.jpg\n\nhttps://example.com/b.jpg " });
  assert.deepEqual(payload, { activityType: "rest", description: "Sleep", activityTime: "2020-01-01T17:30:00.000Z", images: ["https://example.com/a.jpg", "https://example.com/b.jpg"] });
  for (const input of [{ ...payload, description: " " }, { ...payload, activityType: "unknown" }, { ...payload, activityTime: "2099-01-01T12:00" },
    { ...payload, activityTime: "bad" }, { ...payload, activityTime: "2020-02-30T12:00" }, { ...payload, activityTime: "2020-01-02T12:00", images: "data:image/png;base64,abc" }]) {
    assert.throws(() => diaryPayload({ ...input, images: typeof input.images === "string" ? input.images : "" }));
  }
});

test("editing an older timeline activity targets its own ID, timestamp, note and photos", async (t) => {
  const latestRow = { bookingId: "stay-1", diaryId: "latest", activityType: "meal", activityTime: "2020-01-02T03:00:00Z", note: "Latest meal", images: ["https://example.com/latest.jpg"], photos: 1 };
  const [, older] = diaryTimeline([
    { _id: "latest", activityType: "meal", activityTime: latestRow.activityTime, description: latestRow.note, images: latestRow.images },
    { _id: "older", activityType: "rest", activityTime: "2020-01-01T01:15:30.123Z", description: "Earlier rest", images: [] },
  ]);
  const selected = { ...latestRow, ...older.editData };
  assert.equal(selected.bookingId, "stay-1"); assert.equal(selected.diaryId, "older");
  assert.equal(selected.note, "Earlier rest"); assert.equal(selected.photos, 0); assert.deepEqual(selected.images, []);
  const payload = diaryPayload({ activityType: selected.activityType, description: selected.note, activityTime: diaryLocalDateTime(selected.activityTime), images: selected.images.join("\n") });
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(new URL(url).pathname, "/api/business-owner/boarding/stay-1/diaries/older");
    assert.equal(options.method, "PATCH");
    assert.deepEqual(JSON.parse(options.body), { activityType: "rest", description: "Earlier rest", activityTime: "2020-01-01T01:15:30.123Z", images: [] });
    return Response.json({ success: true });
  });
  await petDiaryApi.updateDiary(selected.bookingId, selected.diaryId, payload);
});
