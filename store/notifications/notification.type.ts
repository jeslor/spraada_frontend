export interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

interface NotificationState {
  notifications: Notification[];
  showNotifications: boolean;
}

export interface useNotificationActions {
  setShowNotifications: (show: boolean) => void;
  clearNotifications: () => void;
}

export interface NotificationStore
  extends NotificationState,
    useNotificationActions {}
