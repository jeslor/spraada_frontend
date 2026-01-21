export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

interface NotificationState {
  notifications: Notification[];
  showNotifications: boolean;
}

export interface useNotificationActions {
  addNotification: (notification: Notification) => void;
  setShowNotifications: (show: boolean) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface NotificationStore
  extends NotificationState,
    useNotificationActions {}
