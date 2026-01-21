import { useNotificationStore } from "./notification.store";
import { Notification } from "./notification.type";

// ==================== Basic Selectors ====================

//set show notifications
export const useShowNotifications = (): boolean =>
  useNotificationStore((state) => state.showNotifications);

// set show notifications action
export const useSetShowNotifications = () =>
  useNotificationStore((state) => state.setShowNotifications);

// Notification actions (like messages.selectors)
export const useNotificationActions = () => {
  return {};
};
