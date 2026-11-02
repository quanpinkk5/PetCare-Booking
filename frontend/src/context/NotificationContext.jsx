/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from './AuthContext';
import { notificationApi, loadCustomerNotifications } from '../features/customer/services/notificationApi';
import { notificationData } from '../features/customer/services/notificationData';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthLoading } = useAuth();
  const customerId = !isAuthLoading && user?.role === 'CUSTOMER' ? String(user._id || user.id) : '';
  return <CustomerNotificationProvider key={customerId} customerId={customerId}>{children}</CustomerNotificationProvider>;
};

function CustomerNotificationProvider({ customerId, children }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(Boolean(customerId));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const alive = useRef(false);
  const pending = useRef(false);
  const version = useRef(0);
  const controller = useRef(null);

  const refreshNotifications = useCallback(async () => {
    if (!customerId || pending.current) return false;
    const requestVersion = ++version.current;
    controller.current?.abort();
    const requestController = new AbortController();
    controller.current = requestController;
    setLoading(true);
    try {
      const data = await loadCustomerNotifications({ signal: requestController.signal });
      if (!alive.current || version.current !== requestVersion) return false;
      setRecords(data);
      setError('');
      return true;
    } catch (err) {
      if (alive.current && version.current === requestVersion && !requestController.signal.aborted) setError(err.message);
      return false;
    } finally {
      if (alive.current && version.current === requestVersion) setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    alive.current = true;
    const initialLoad = window.setTimeout(refreshNotifications, 0);
    const refresh = () => {
      if (document.visibilityState === 'visible') refreshNotifications();
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    const timer = window.setInterval(refresh, 30000);
    return () => {
      alive.current = false;
      version.current += 1;
      controller.current?.abort();
      window.clearTimeout(initialLoad);
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [refreshNotifications]);

  // Only apply changes confirmed by the server; cancel older reads so they
  // cannot restore notifications or read flags after a successful mutation.
  const mutate = async (request, update) => {
    if (!customerId || pending.current) return false;
    pending.current = true;
    version.current += 1;
    controller.current?.abort();
    setLoading(false);
    setBusy(true);
    try {
      const response = await request();
      if (!alive.current) return false;
      setRecords((previous) => update(previous, response));
      setError('');
      return true;
    } catch (err) {
      if (alive.current) setError(err.message || 'Không thể cập nhật thông báo.');
      return false;
    } finally {
      pending.current = false;
      if (alive.current) setBusy(false);
    }
  };
  const setRead = (id, isRead) => mutate(() => notificationApi.setRead(id, isRead),
    (previous, response) => previous.map((item) => item._id === id ? response.data : item));
  const notifications = records.map(notificationData);
  const value = {
    notifications, unreadCount: notifications.filter((item) => !item.isRead).length,
    loading, error, busy, refreshNotifications,
    markAsRead: (id) => setRead(id, true), markAsUnread: (id) => setRead(id, false),
    markAllAsRead: () => {
      const ids = new Set(records.map((item) => item._id));
      return mutate(notificationApi.markAllRead, (previous) => previous.map((item) => ids.has(item._id) ? { ...item, isRead: true } : item));
    },
    deleteNotification: (id) => mutate(() => notificationApi.remove(id), (previous) => previous.filter((item) => item._id !== id)),
    clearReadNotifications: () => {
      const ids = new Set(records.filter((item) => item.isRead).map((item) => item._id));
      return mutate(notificationApi.clearRead, (previous) => previous.filter((item) => !ids.has(item._id)));
    },
  };
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export { NotificationContext };
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};
