import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chatbotHistoryKey, readChatbotHistory, writeChatbotHistory } from '../src/features/customer/services/chatbotHistory.js';

function memoryStorage() {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: key => data.delete(key) };
}

test('restores conversation and recommendations after reload, scoped by account', () => {
  const storage = memoryStorage();
  const key = chatbotHistoryKey({ _id: 'customer-a' });
  const messages = [
    { id: 'msg-1', role: 'user', content: 'Tắm mèo ở đâu?' },
    { id: 'bot-2', role: 'assistant', content: 'Có gói phù hợp.', mode: 'gemini', recommendations: [{
      id: 'offer-1', serviceName: 'Tắm mèo', price: 100000, petTypes: ['CAT'],
      branch: { name: 'A', businessName: 'PetCare', url: '/businesses/abc' }, bookingUrl: '/booking?branchServiceId=offer-1',
    }] },
  ];
  assert.equal(writeChatbotHistory(storage, key, messages, ['Xem địa chỉ']), true);
  const restored = readChatbotHistory(storage, key);
  assert.equal(restored.messages[0].content, messages[0].content);
  assert.equal(restored.messages[1].recommendations[0].price, 100000);
  assert.deepEqual(restored.suggestions, ['Xem địa chỉ']);
  assert.equal(readChatbotHistory(storage, chatbotHistoryKey({ id: 'customer-b' })), null);
  assert.equal(readChatbotHistory(storage, chatbotHistoryKey(null)), null);
});

test('keeps latest 100 messages and clears persisted history on reset', () => {
  const storage = memoryStorage();
  const key = chatbotHistoryKey(null);
  const messages = Array.from({ length: 110 }, (_, i) => ({ id: `msg-${i}`, role: 'user', content: String(i) }));
  writeChatbotHistory(storage, key, messages, []);
  assert.equal(readChatbotHistory(storage, key).messages.length, 100);
  assert.equal(readChatbotHistory(storage, key).messages[0].content, '10');
  writeChatbotHistory(storage, key, [{ id: 'welcome', role: 'assistant', content: 'Xin chào' }], []);
  assert.equal(readChatbotHistory(storage, key), null);
});

test('handles corrupted history and blocked storage without breaking chat', () => {
  const storage = memoryStorage();
  storage.setItem('bad', '{');
  assert.equal(readChatbotHistory(storage, 'bad'), null);
  storage.setItem('bad', JSON.stringify({ version: 1, messages: [null, { id: 'a', role: 'system', content: 'bad' },
    { id: 'bot-1', role: 'assistant', content: 'Hello', recommendations: [null, { price: 'bad' }] }] }));
  assert.deepEqual(readChatbotHistory(storage, 'bad').messages[0].recommendations, []);
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } };
  assert.equal(readChatbotHistory(blocked, 'a'), null);
  assert.equal(writeChatbotHistory(blocked, 'a', [{ role: 'user' }], []), false);
});
