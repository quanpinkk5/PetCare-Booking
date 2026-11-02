import { apiRequest } from '../../auth/services/authApi.js';

export const chatbotApi = {
  /**
   * Lấy lời chào và danh sách câu hỏi gợi ý ban đầu
   */
  getSuggestions: () => apiRequest('/customer/chatbot/suggestions'),

  /**
   * Gửi tin nhắn đến chatbot AI
   * @param {string} message - Nội dung tin nhắn
   * @param {Array<{role: string, content: string}>} history - Lịch sử trò chuyện
   */
  sendMessage: (message, history = []) =>
    apiRequest('/customer/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),
};
