const MAX_MESSAGES = 100;

export function chatbotHistoryKey(user) {
  const userId = user?._id || user?.id;
  return `petcare_chatbot_history_v1:${userId ? `user:${userId}` : 'guest'}`;
}

export function readChatbotHistory(storage, key) {
  try {
    const data = JSON.parse(storage.getItem(key));
    if (data?.version !== 1 || !Array.isArray(data.messages)) return null;
    const messages = data.messages.filter(m => m && typeof m.id === 'string' &&
      ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content.length <= 20000)
      .slice(-MAX_MESSAGES).map(m => ({
        id: m.id, role: m.role, content: m.content,
        mode: m.mode === 'fallback' ? 'fallback' : 'gemini',
        notice: typeof m.notice === 'string' ? m.notice : undefined,
        recommendations: Array.isArray(m.recommendations) ? m.recommendations.filter(o => o &&
          typeof o.id === 'string' && typeof o.serviceName === 'string' && Number.isFinite(o.price) &&
          typeof o.branch?.name === 'string' && typeof o.branch?.businessName === 'string' &&
          typeof o.branch?.url === 'string' && typeof o.bookingUrl === 'string' &&
          Array.isArray(o.petTypes) && o.petTypes.every(p => ['DOG', 'CAT'].includes(p))).slice(0, 3) : [],
      }));
    if (!messages.length) return null;
    return { messages, suggestions: Array.isArray(data.suggestions) ? data.suggestions.filter(s => typeof s === 'string').slice(0, 5) : [] };
  } catch {
    return null;
  }
}

export function writeChatbotHistory(storage, key, messages, suggestions) {
  try {
    if (!messages.some(m => m.role === 'user')) storage.removeItem(key);
    else storage.setItem(key, JSON.stringify({ version: 1, messages: messages.slice(-MAX_MESSAGES), suggestions }));
    return true;
  } catch {
    return false;
  }
}
