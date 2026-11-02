/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from './AuthContext';
import { DEFAULT_NOTIFICATION_SETTINGS } from '../features/businessOwner/data/notificationData';
import { ownerNotificationApi, loadOwnerNotifications } from '../features/businessOwner/services/notificationApi';
import { ownerNotificationData } from '../features/businessOwner/services/notificationView';
import { io } from 'socket.io-client';
import { authApi } from '../features/auth/services/authApi';

const BusinessNotificationContext = createContext(null);
export function BusinessNotificationProvider({ children }) {
  const { user, isAuthLoading } = useAuth();
  const ownerId = !isAuthLoading && user?.role === 'BUSINESS_OWNER' ? String(user._id || user.id) : '';
  return <OwnerNotificationProvider key={ownerId} ownerId={ownerId}>{children}</OwnerNotificationProvider>;
}
function OwnerNotificationProvider({ ownerId, children }) {
  const [records, setRecords] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [settingsLoading, setSettingsLoading] = useState(Boolean(ownerId));
  const [loading, setLoading] = useState(Boolean(ownerId));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const alive = useRef(false);
  const pending = useRef(false);
  const version = useRef(0);
  const controller = useRef(null);
  const refreshQueued = useRef(false);
  const refreshNotifications = useCallback(async () => {
    if (!ownerId) return false;
    if (pending.current) { refreshQueued.current = true; return false; }
    const requestVersion = ++version.current;
    controller.current?.abort();
    const requestController = new AbortController();
    controller.current = requestController;
    setLoading(true);
    try {
      const data = await loadOwnerNotifications({ signal: requestController.signal });
      if (!alive.current || version.current !== requestVersion) return false;
      setRecords(data); setError('');
      return true;
    } catch (err) {
      if (alive.current && version.current === requestVersion && !requestController.signal.aborted) setError(err.message);
      return false;
    } finally {
      if (alive.current && version.current === requestVersion) setLoading(false);
    }
  }, [ownerId]);
  useEffect(() => {
    alive.current = true;
    const socket = ownerId ? io('http://localhost:5000', {
      auth: (callback) => callback({ token: authApi.getAccessToken() }),
    }) : null;
    socket?.on('notification:new', refreshNotifications);
    socket?.on('connect', refreshNotifications);
    socket?.on('connect_error', async () => {
      const token = authApi.getAccessToken();
      await refreshNotifications();
      if (alive.current && token !== authApi.getAccessToken()) socket.connect();
    });
    const initialLoad = window.setTimeout(refreshNotifications, 0);
    const refresh = () => { if (document.visibilityState === 'visible') refreshNotifications(); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    const timer = window.setInterval(refresh, 30000);
    return () => {
      alive.current = false; version.current += 1; controller.current?.abort();
      socket?.disconnect();
      window.clearTimeout(initialLoad); window.clearInterval(timer);
      window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh);
    };
  }, [ownerId, refreshNotifications]);
  useEffect(() => {
    if (!ownerId) return;
    const request = new AbortController();
    ownerNotificationApi.settings({ signal: request.signal }).then((response) => {
      if (!request.signal.aborted) setSettings(response.data);
    }).catch((err) => { if (!request.signal.aborted) setError(err.message); })
      .finally(() => { if (!request.signal.aborted) setSettingsLoading(false); });
    return () => request.abort();
  }, [ownerId]);

  // Cancel stale reads so they cannot restore deleted items or old read flags.
  const mutate = async (request, apply) => {
    if (!ownerId || pending.current) return false;
    pending.current = true; version.current += 1; controller.current?.abort();
    setLoading(false); setBusy(true);
    try {
      const response = await request();
      if (!alive.current) return false;
      apply(response); setError('');
      return response;
    } catch (err) {
      if (alive.current) setError(err.message || 'Không thể cập nhật thông báo.');
      return false;
    } finally {
      pending.current = false;
      if (alive.current) {
        setBusy(false);
        if (refreshQueued.current) { refreshQueued.current = false; refreshNotifications(); }
      }
    }
  };
  const setRead = (id, isRead) => mutate(() => ownerNotificationApi.setRead(id, isRead),
    (response) => setRecords((previous) => previous.map((item) => item._id === id ? response.data : item)));
  const notifications = records.map(ownerNotificationData);
  const markMultipleAsRead = (ids) => mutate(() => ownerNotificationApi.markMultipleRead(ids), (response) => {
    const selected = new Set(ids);
    setRecords((previous) => previous.map((item) => selected.has(item._id) ? { ...item, isRead: true, readAt: response.readAt } : item));
  });
  const deleteMultiple = (ids) => mutate(() => ownerNotificationApi.removeMultiple(ids), () => {
    const selected = new Set(ids); setRecords((previous) => previous.filter((item) => !selected.has(item._id)));
  });
  const value = {
    notifications, unreadCount: notifications.filter((item) => !item.isRead).length,
    highPriorityCount: notifications.filter((item) => !item.isRead && item.priority === 'high').length,
    loading, error, busy, settings, settingsLoading, refreshNotifications,
    updateSettings: (data) => mutate(() => ownerNotificationApi.saveSettings(data), (response) => setSettings(response.data)),
    markAsRead: (id) => setRead(id, true), markAsUnread: (id) => setRead(id, false),
    markAllAsRead: () => mutate(ownerNotificationApi.markAllRead, () => setRecords((previous) => previous.map((item) => ({ ...item, isRead: true })))),
    markMultipleAsRead, deleteMultiple,
    deleteNotification: (id) => mutate(() => ownerNotificationApi.remove(id), () => setRecords((previous) => previous.filter((item) => item._id !== id))),
    clearReadNotifications: () => mutate(ownerNotificationApi.clearRead, () => setRecords((previous) => previous.filter((item) => !item.isRead))),
  };
  return <BusinessNotificationContext.Provider value={value}>{children}</BusinessNotificationContext.Provider>;
}
export { BusinessNotificationContext };
export const useBusinessNotifications = () => {
  const context = useContext(BusinessNotificationContext);
  if (!context) throw new Error('useBusinessNotifications must be used within a BusinessNotificationProvider');
  return context;
};
