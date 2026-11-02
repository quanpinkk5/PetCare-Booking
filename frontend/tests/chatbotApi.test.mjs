import assert from "node:assert/strict";
import { test } from "node:test";
import { chatbotApi } from "../src/features/customer/services/chatbotApi.js";

test("chatbotApi.getSuggestions issues GET request to /customer/chatbot/suggestions", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:5000/api/customer/chatbot/suggestions");
    assert.equal(options.credentials, "include");
    return {
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          greeting: "Xin chào!",
          suggestions: ["Bảng giá dịch vụ", "Tìm cơ sở"],
        },
      }),
    };
  };

  const res = await chatbotApi.getSuggestions();
  assert.equal(res.success, true);
  assert.equal(res.data.suggestions.length, 2);
});

test("chatbotApi.sendMessage issues POST request with payload", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => {
    globalThis.fetch = originalFetch;
  });

  let capturedBody;
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "http://localhost:5000/api/customer/chatbot");
    assert.equal(options.method, "POST");
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: {
          reply: "Dịch vụ tắm chó mèo có giá từ 150.000đ.",
          suggestions: ["Đặt lịch ngay"],
        },
      }),
    };
  };

  const res = await chatbotApi.sendMessage("Giá tắm chó bao nhiêu?", [
    { role: "user", content: "Chào bạn" },
    { role: "assistant", content: "Chào bạn, mình là PetCare AI" },
  ]);

  assert.equal(capturedBody.message, "Giá tắm chó bao nhiêu?");
  assert.equal(capturedBody.history.length, 2);
  assert.equal(res.success, true);
  assert.ok(res.data.reply.includes("150.000đ"));
});
