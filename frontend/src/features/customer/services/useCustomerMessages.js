import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { authApi } from '../../auth/services/authApi.js';
import { messageApi } from './messageApi.js';
import { bookingApi } from './bookingApi.js';
import { businessApi } from './businessApi.js';
import { businessMessageChats, conversationBookingData, conversationData, mergeMessages, messageData } from './messageData.js';

const emitWithAck = (socket, event, payload) => new Promise((resolve, reject) => {
  socket.timeout(10000).emit(event, payload, (error, response) => {
    if (error) return reject(new Error('Chưa nhận được xác nhận từ máy chủ. Vui lòng kiểm tra lịch sử trước khi gửi lại.'));
    if (!response?.success) return reject(new Error(response?.message || 'Không thể thực hiện thao tác.'));
    resolve(response);
  });
});

export const useCustomerMessages = (customerId, targetId, targetBusinessId) => {
  const [chats, setChats] = useState([]);
  const [targetBusiness, setTargetBusiness] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [allMessages, setAllMessages] = useState({});
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadedId, setLoadedId] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [syncError, setSyncError] = useState('');
  const socketRef = useRef(null);
  const sendLock = useRef(false);
  const visibleChats = businessMessageChats(chats, targetBusiness);
  const selectedChat = visibleChats.find((chat) => chat.id === (selectedId || targetId))
    || (targetBusinessId ? visibleChats.find((chat) => chat.businessId === targetBusinessId && !chat.bookingId) : visibleChats[0]);
  const conversationId = selectedChat?.isDraft ? undefined : selectedChat?.id;
  const draftBusinessId = selectedChat?.isDraft ? selectedChat.businessId : null;
  const bookingId = selectedChat?.bookingId;
  const avatar = selectedChat?.avatarText;

  useEffect(() => {
    if (!customerId || !targetBusinessId) return;
    let active = true;
    businessApi.detail(targetBusinessId).then((response) => {
      if (active) setTargetBusiness(response.data);
    }).catch((error) => { if (active) setError(error.message); });
    return () => { active = false; };
  }, [customerId, targetBusinessId]);

  useEffect(() => {
    if (!bookingId) return;
    let active = true;
    bookingApi.detail(bookingId).then((response) => {
      if (active) setDetails((previous) => ({ ...previous, [bookingId]: conversationBookingData(response.data) }));
    }).catch((error) => { if (active) setError(error.message); });
    return () => { active = false; };
  }, [bookingId]);

  useEffect(() => {
    if (!customerId) return;
    let active = true;
    let syncing = false;
    const socket = io('http://localhost:5000', {
      auth: (callback) => callback({ token: authApi.getAccessToken() }),
    });
    socketRef.current = socket;
    const refreshChats = async () => {
      const response = await messageApi.conversations();
      if (active) {
        const list = response.data.map(conversationData);
        setChats(list);
        setSelectedId((previous) => {
          if (previous && list.some((chat) => chat.id === previous)) return previous;
          if (targetBusinessId) return list.find((chat) => chat.businessId === targetBusinessId && !chat.bookingId)?.id;
          return list.some((chat) => chat.id === targetId) ? targetId : list[0]?.id;
        });
        setLoading(false);
      }
    };
    const read = async () => {
      if (!conversationId) return;
      if (socket.connected) {
        await emitWithAck(socket, 'conversation:join', { conversationId });
        await emitWithAck(socket, 'message:read', { conversationId });
      } else await messageApi.read(conversationId);
      if (active) setChats((previous) => previous.map((chat) => chat.id === conversationId ? { ...chat, unread: 0 } : chat));
    };
    const sync = async () => {
      if (syncing || !active) return;
      syncing = true;
      try {
        if (conversationId) {
          const response = await messageApi.history(conversationId);
          if (!active) return;
          setAllMessages((previous) => ({ ...previous,
            [conversationId]: mergeMessages(previous[conversationId] || [], response.data.map((message) => messageData(message, customerId, avatar))),
          }));
          setLoadedId(conversationId);
          await read();
        }
        await refreshChats();
        if (active) setSyncError('');
      } catch (error) {
        if (active) setSyncError(error.message);
        if (active) setLoading(false);
      } finally { syncing = false; }
    };
    socket.on('connect', sync);
    socket.on('connect_error', async () => {
      const oldToken = authApi.getAccessToken();
      try {
        await refreshChats();
        if (active && oldToken !== authApi.getAccessToken()) socket.connect();
      } catch (error) { if (active) setSyncError(error.message); }
    });
    socket.on('message:new', (message) => {
      if (!active || String(message.conversationId) !== conversationId) return;
      setAllMessages((previous) => ({ ...previous,
        [conversationId]: mergeMessages(previous[conversationId] || [], [messageData(message, customerId, avatar)]),
      }));
      if (String(message.senderId?._id || message.senderId) !== customerId) {
        read().catch((error) => { if (active) setSyncError(error.message); });
      }
    });
    socket.on('conversation:updated', sync);
    socket.on('message:read:update', (event) => {
      if (!active || event.conversationId !== conversationId || event.readBy === customerId) return;
      setAllMessages((previous) => ({ ...previous, [conversationId]: (previous[conversationId] || []).map((message) =>
        message.sender === 'user' && new Date(message.createdAt) <= new Date(event.readAt) ? { ...message, isRead: true } : message),
      }));
    });
    sync();
    const interval = setInterval(sync, 10000);
    return () => {
      active = false;
      clearInterval(interval);
      socket.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [customerId, conversationId, avatar, targetId, targetBusinessId]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || (!conversationId && !draftBusinessId) || sendLock.current) return false;
    sendLock.current = true;
    setSending(true);
    setError('');
    try {
      const socket = socketRef.current;
      let message;
      if (socket?.connected && conversationId) {
        await emitWithAck(socket, 'conversation:join', { conversationId });
        const response = await emitWithAck(socket, 'message:send', { conversationId, content: text.trim() });
        message = response.data;
      } else {
        const response = await messageApi.send({ ...(conversationId ? { conversationId } : { businessId: draftBusinessId }), content: text.trim() });
        message = response.data.message;
      }
      const savedConversationId = String(message.conversationId);
      setAllMessages((previous) => ({ ...previous,
        [savedConversationId]: mergeMessages(previous[savedConversationId] || [], [messageData(message, customerId, avatar)]),
      }));
      if (draftBusinessId) {
        const chat = conversationData({ _id: savedConversationId, businessId: targetBusiness,
          lastMessage: message.content, lastMessageAt: message.createdAt });
        setChats((previous) => [chat, ...previous.filter((item) => item.id !== savedConversationId)]);
        setSelectedId(savedConversationId);
        setLoadedId(savedConversationId);
      } else setChats((previous) => previous.map((chat) => chat.id === conversationId
        ? { ...chat, lastMessage: message.content, time: conversationData({ lastMessageAt: message.createdAt }).time, updatedAt: message.createdAt }
        : chat).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      sendLock.current = false;
      setSending(false);
    }
  }, [conversationId, customerId, avatar, draftBusinessId, targetBusiness]);

  return {
    chats: visibleChats, selectedChat: selectedChat ? { ...selectedChat, ...details[bookingId] } : null,
    messages: allMessages[conversationId] || [], loading,
    loadingMessages: Boolean(conversationId && loadedId !== conversationId),
    sending, error: error || syncError, selectChat: (chat) => { setSelectedId(chat.id); setError(''); }, sendMessage,
  };
};
