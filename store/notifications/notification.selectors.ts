import { useNotificationStore } from "./notification.store";
import { Notification } from "./notification.type";

// ==================== Basic Selectors ====================

//set show notifications
export const useShowNotifications = (): boolean =>
  useNotificationStore((state) => state.showNotifications);

// set show notifications action
export const useSetShowNotifications = () =>
  useNotificationStore((state) => state.setShowNotifications);

// Get all notifications
export const useNotifications = () =>
  useNotificationStore((state) => state.notifications);

// Get unread notifications
export const useUnreadNotifications = () =>
  useNotificationStore((state) => state.notifications.filter((n) => !n.read));

// Get notification by id
export const getNotificationById = (id: string) => {
  return useNotificationStore.getState().notifications.find((n) => n.id === id);
};

// Notification actions (like messages.selectors)
export const useNotificationActions = () => {
  return {
    addNotification,
    markAsRead,
    removeNotification,
    clearNotifications,
  };
};
