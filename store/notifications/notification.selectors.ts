import { useNotificationStore } from "./notification.store";
import { Notification } from "./notification.type";

// ==================== Basic Selectors ====================

//initial notifications socket listener
export const useInitializeNotificationSocket = () =>
  useNotificationStore((state) => state.initNotificationSocketListeners);

//set show notifications
export const useShowNotifications = (): boolean =>
  useNotificationStore((state) => state.showNotifications);

// set show notifications action
export const useSetShowNotifications = () =>
  useNotificationStore((state) => state.setShowNotifications);

//get notifications from backend action
export const useGetNotifications = () =>
  useNotificationStore((state) => state.getNotifications);

//get notifications
export const useNotifications = (): Notification[] =>
  useNotificationStore((state) => state.notifications);

//send notification action
export const useSendNotification = () =>
  useNotificationStore((state) => state.sendNotification);

//get has unread notifications
export const useHasUnreadNotifications = (): boolean =>
  useNotificationStore((state) => state.hasUnreadNotifications);

//get notification counter
export const useNotificationCounter = () =>
  useNotificationStore((state) => state.notificationCounter);

//get notification counter from backend action
export const useGetNotificationCounter = () =>
  useNotificationStore((state) => state.getNotificationCounter);

export const useUpdateNotificationCounter = () =>
  useNotificationStore((state) => state.updateNotificationCounter);

export const useUpdateNotifications = () =>
  useNotificationStore((state) => state.updateNotifications);

export const useUpdateNotificationsAndCounterAsRead = () =>
  useNotificationStore((state) => state.updateNotificationsAndCounterAsRead);

export const useClearNotifications = () =>
  useNotificationStore((state) => state.clearNotifications);

// Notification actions (like messages.selectors)
export const useNotificationActions = () => {
  return {};
};
