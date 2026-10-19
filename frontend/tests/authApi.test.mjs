import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { authApi } from "../src/features/auth/services/authApi.js";

const json = (data, status = 200) => Response.json(data, { status });

beforeEach(() => {
  authApi.setAccessToken(null);
});

test("concurrent session restores share one refresh and keep the new access token", async (t) => {
  let refreshCalls = 0;
  const user = { id: "customer-1", name: "Customer" };

  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(options.credentials, "include");

    if (url.endsWith("/auth/refresh")) {
      refreshCalls += 1;
      // The backend rotates the cookie, so the old token can only be used once.
      return refreshCalls === 1
        ? json({ data: { accessToken: "restored-token" } })
        : json({ message: "Refresh token already used" }, 401);
    }

    assert.equal(options.headers.Authorization, "Bearer restored-token");
    return json({ data: { user } });
  });

  const results = await Promise.all([authApi.refresh(), authApi.refresh()]);

  assert.deepEqual(results, [true, true]);
  assert.equal(refreshCalls, 1);
  assert.deepEqual((await authApi.getMe()).data.user, user);
});

test("concurrent unauthorized profile requests share a refresh and retry successfully", async (t) => {
  let refreshCalls = 0;
  let profileCalls = 0;
  authApi.setAccessToken("expired-token");

  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url.endsWith("/auth/refresh")) {
      refreshCalls += 1;
      return json({ data: { accessToken: "new-token" } });
    }

    profileCalls += 1;
    return options.headers.Authorization === "Bearer new-token"
      ? json({ data: { user: { id: "customer-1" } } })
      : json({ message: "Access token expired" }, 401);
  });

  const results = await Promise.all([authApi.getMe(), authApi.getMe()]);

  assert.equal(refreshCalls, 1);
  assert.equal(profileCalls, 4);
  assert.ok(results.every((result) => result.data.user.id === "customer-1"));
});

test("an invalid session clears the access token and allows a later refresh", async (t) => {
  let refreshCalls = 0;
  authApi.setAccessToken("old-token");

  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url.endsWith("/auth/refresh")) {
      refreshCalls += 1;
      return refreshCalls === 1
        ? json({ message: "Session expired" }, 401)
        : json({ data: { accessToken: "new-token" } });
    }

    assert.equal(options.headers.Authorization, undefined);
    return json({ success: true });
  });

  assert.deepEqual(await Promise.all([authApi.refresh(), authApi.refresh()]), [false, false]);
  await authApi.logout();
  assert.equal(await authApi.refresh(), true);
  assert.equal(refreshCalls, 2);
});

test("a network failure does not leave future refresh calls stuck", async (t) => {
  let refreshCalls = 0;

  t.mock.method(globalThis, "fetch", async () => {
    refreshCalls += 1;
    if (refreshCalls === 1) throw new TypeError("Network unavailable");
    return json({ data: { accessToken: "new-token" } });
  });

  assert.equal(await authApi.refresh(), false);
  assert.equal(await authApi.refresh(), true);
  assert.equal(refreshCalls, 2);
});

test("profile save sends PATCH with the current token and retries after refresh", async (t) => {
  authApi.setAccessToken("expired-token");
  const payload = { fullName: "Nguyễn An", address: { detail: "123 Đường A" } };
  let attempts = 0;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (url.endsWith("/auth/refresh")) {
      return json({ data: { accessToken: "new-token" } });
    }
    assert.ok(url.endsWith("/customer/profile"));
    assert.equal(options.method, "PATCH");
    assert.equal(options.credentials, "include");
    assert.deepEqual(JSON.parse(options.body), payload);
    attempts += 1;
    return options.headers.Authorization === "Bearer new-token"
      ? json({ data: { user: { id: "customer-1", ...payload } } })
      : json({ message: "Token expired" }, 401);
  });
  assert.equal((await authApi.updateProfile(payload)).data.user.fullName, "Nguyễn An");
  assert.equal(attempts, 2);
});

test("profile validation failure reaches the form without a refresh", async (t) => {
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests += 1;
    return json({ success: false, message: "Họ tên không được để trống" }, 400);
  });
  await assert.rejects(authApi.updateProfile({ fullName: " " }), /Họ tên không được để trống/);
  assert.equal(requests, 1);
});

test("expired profile session does not retry indefinitely", async (t) => {
  const urls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    urls.push(url);
    return json({ message: "Bạn chưa đăng nhập" }, 401);
  });
  await assert.rejects(authApi.updateProfile({ phone: "" }), /Bạn chưa đăng nhập/);
  assert.equal(urls.length, 2);
  assert.ok(urls[1].endsWith("/auth/refresh"));
});
