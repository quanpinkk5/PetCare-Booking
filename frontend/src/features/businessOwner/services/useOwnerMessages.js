import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { authApi } from '../../auth/services/authApi.js';
import { ownerMessageApi } from './messageApi.js';
import { mergeOwnerMessages, ownerConversationData, ownerMessageData } from './messageView.js';

export function useOwnerMessages(ownerId) {
  const [chats, setChats] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [histories, setHistories] = useState({});
  const [loadedId, setLoadedId] = useState(null);
  const [loading, setLoading] = useState(Boolean(ownerId));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [syncError, setSyncError] = useState('');
  const sendLock = useRef(false);
  const socketRef = useRef(null);
  const selected = chats.find((c) => c.id === selectedId) || chats[0] || null;
  const conversationId = selected?.id;

  useEffect(() => {
    if (!ownerId) return;
    let active = true;
    let syncing = false;
    const controller = new AbortController();
    const socket = io('http://localhost:5000', { auth: (cb) => cb({ token: authApi.getAccessToken() }) });
    socketRef.current = socket;
    const sync = async () => {
      if (!active || syncing) return;
      syncing = true;
      try {
        const response = await ownerMessageApi.conversations(controller.signal);
        if (active) {
          const list = response.data.map(ownerConversationData);
          setChats(list);
          setSelectedId((id) => list.some((c) => c.id === id) ? id : list[0]?.id || null);
          setSyncError('');
        }
      } catch (err) { if (active) setSyncError(err.message); }
      finally { syncing = false; if (active) setLoading(false); }
    };
    socket.on('connect', sync);
    socket.on('connect_error', async () => {
      const oldToken = authApi.getAccessToken();
      await sync();
      if (active && oldToken !== authApi.getAccessToken()) socket.connect();
    });
    socket.on('conversation:updated', sync);
    sync();
    const timer = setInterval(sync, 10000);
    return () => { active = false; controller.abort(); clearInterval(timer); socket.disconnect(); };
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId || !conversationId) return;
    let active = true;
    let syncing = false;
    const controller = new AbortController();
    const socket = socketRef.current;
    const sync = async () => {
      if (!active || syncing) return;
      syncing = true;
      try {
        const response = await ownerMessageApi.history(conversationId, controller.signal);
        if (!active) return;
        setHistories((old) => ({ ...old, [conversationId]: mergeOwnerMessages(old[conversationId] || [], response.data.map((m) => ownerMessageData(m, ownerId))) }));
        setLoadedId(conversationId);
        if (document.visibilityState === 'visible') {
          await ownerMessageApi.read(conversationId);
          if (active) setChats((old) => old.map((c) => c.id === conversationId ? { ...c, unread: 0 } : c));
        }
        if (active) setSyncError('');
      } catch (err) { if (active) setSyncError(err.message); }
      finally { syncing = false; }
    };
    const join = () => {
      socket.emit('conversation:join', { conversationId }, (response) => {
        if (active && !response?.success) setSyncError(response?.message || 'Không thể tham gia hội thoại');
        if (active) sync();
      });
    };
    const onMessage = (message) => {
      if (String(message.conversationId) === conversationId) sync();
    };
    const onConversation = (event) => { if (String(event._id) === conversationId) sync(); };
    const onRead = (event) => {
      if (!active || event.conversationId !== conversationId || event.readBy === ownerId) return;
      setHistories((old) => ({ ...old, [conversationId]: (old[conversationId] || []).map((m) =>
        m.sender === 'shop' && new Date(m.createdAt) <= new Date(event.readAt) ? { ...m, isRead: true } : m) }));
    };
    socket.on('connect', join);
    socket.on('message:new', onMessage);
    socket.on('conversation:updated', onConversation);
    socket.on('message:read:update', onRead);
    if (socket.connected) join();
    const onVisible = () => { if (document.visibilityState === 'visible') sync(); };
    document.addEventListener('visibilitychange', onVisible);
    sync();
    const timer = setInterval(sync, 10000);
    return () => {
      active = false; controller.abort(); clearInterval(timer);
      socket.off('connect', join); socket.off('message:new', onMessage);
      socket.off('conversation:updated', onConversation); socket.off('message:read:update', onRead);
      document.removeEventListener('visibilitychange', onVisible);
      if (socket.connected) socket.emit('conversation:leave', { conversationId });
    };
  }, [ownerId, conversationId]);

  const sendMessage = async (text) => {
    if (!conversationId || !text.trim() || sendLock.current) return false;
    sendLock.current = true;
    setSending(true); setError('');
    try {
      const response = await ownerMessageApi.send(conversationId, text.trim());
      const message = ownerMessageData(response.data.message, ownerId);
      setHistories((old) => ({ ...old, [conversationId]: mergeOwnerMessages(old[conversationId] || [], [message]) }));
      setChats((old) => old.map((c) => c.id === conversationId ? { ...c, lastMsg: message.text, time: message.time, updatedAt: message.createdAt } : c)
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)));
      return true;
    } catch (err) { setError(err.message); return false; }
    finally { sendLock.current = false; setSending(false); }
  };
  const toggleImportant = async () => {
    if (!selected) return;
    try {
      const response = await ownerMessageApi.important(selected.id, !selected.important);
      setChats((old) => old.map((c) => c.id === selected.id ? { ...c, important: response.important,
        tags: [...c.tags.filter((t) => t !== 'Quan trọng'), ...(response.important ? ['Quan trọng'] : [])] } : c));
      setError('');
    } catch (err) { setError(err.message); }
  };
  return { chats, selected, messages: histories[conversationId] || [], loading,
    loadingMessages: Boolean(conversationId && loadedId !== conversationId), sending, error: error || syncError,
    selectChat: (id) => { setSelectedId(id); setError(''); }, sendMessage, toggleImportant };
}
