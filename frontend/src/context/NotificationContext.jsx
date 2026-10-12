/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { INITIAL_NOTIFICATIONS } from "../features/customer/data/notificationsData";

const STORAGE_KEY = "petcare_notifications_v1";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load notifications from localStorage", e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error("Failed to save notifications to localStorage", e);
    }
  }, [notifications]);

  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.isRead).length;
  }, [notifications]);

  // Mark single as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  // Mark single as unread
  const markAsUnread = (id) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: false } : item))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isRead: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Reset back to initial demo data
  const resetNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    } catch (e) {
      console.error(e);
    }
  };

  // Add new notification
  const addNotification = (newItem) => {
    const itemWithDefaults = {
      id: `NOTIF-${Date.now()}`,
      timeAgo: "Vừa xong",
      createdAt: new Date().toISOString(),
      isRead: false,
      priority: "normal",
      ...newItem,
    };
    setNotifications((prev) => [itemWithDefaults, ...prev]);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    resetNotifications,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext };

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
