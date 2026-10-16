/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import {
  INITIAL_BUSINESS_NOTIFICATIONS,
  DEFAULT_NOTIFICATION_SETTINGS,
} from "../features/businessOwner/data/notificationData";

const STORAGE_KEY = "petcare_business_notifications_v2";
const SETTINGS_KEY = "petcare_biz_notification_settings_v1";

const BusinessNotificationContext = createContext(null);

export const BusinessNotificationProvider = ({ children }) => {
  // Notifications state
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load business notifications from localStorage", e);
    }
    return INITIAL_BUSINESS_NOTIFICATIONS;
  });

  // Settings state
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to load business notification settings", e);
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  });

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error("Failed to save business notifications to localStorage", e);
    }
  }, [notifications]);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save business notification settings", e);
    }
  }, [settings]);

  // Unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((item) => !item.isRead).length;
  }, [notifications]);

  // High priority count
  const highPriorityCount = useMemo(() => {
    return notifications.filter((item) => !item.isRead && item.priority === "high").length;
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

  // Mark multiple as read
  const markMultipleAsRead = (ids) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    setNotifications((prev) =>
      prev.map((item) => (idSet.has(item.id) ? { ...item, isRead: true } : item))
    );
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Delete multiple notifications
  const deleteMultiple = (ids) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    setNotifications((prev) => prev.filter((item) => !idSet.has(item.id)));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Clear only read notifications
  const clearReadNotifications = () => {
    setNotifications((prev) => prev.filter((item) => !item.isRead));
  };

  // Reset back to initial demo data
  const resetNotifications = () => {
    setNotifications(INITIAL_BUSINESS_NOTIFICATIONS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BUSINESS_NOTIFICATIONS));
    } catch (e) {
      console.error(e);
    }
  };

  // Add new notification
  const addNotification = (newItem) => {
    const itemWithDefaults = {
      id: `BIZ-NOTIF-${Date.now()}`,
      timeAgo: "Vừa xong",
      createdAt: new Date().toISOString(),
      isRead: false,
      priority: "normal",
      branch: "Chi nhánh Cầu Giấy",
      ...newItem,
    };
    setNotifications((prev) => [itemWithDefaults, ...prev]);
  };

  // Update settings
  const updateSettings = (partial) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const value = {
    notifications,
    unreadCount,
    highPriorityCount,
    settings,
    updateSettings,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    markMultipleAsRead,
    deleteNotification,
    deleteMultiple,
    clearAllNotifications,
    clearReadNotifications,
    resetNotifications,
    addNotification,
  };

  return (
    <BusinessNotificationContext.Provider value={value}>
      {children}
    </BusinessNotificationContext.Provider>
  );
};

export { BusinessNotificationContext };

export const useBusinessNotifications = () => {
  const context = useContext(BusinessNotificationContext);
  if (!context) {
    throw new Error("useBusinessNotifications must be used within a BusinessNotificationProvider");
  }
  return context;
};
