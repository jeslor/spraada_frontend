export interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  link?: string;
  createdAt: string;
  contentMediaFiles?: { mediaUrl: string }[];
  profileMediaFiles?: { mediaUrl: string }[];
}

interface NotificationState {
  notifications: Notification[];
  showNotifications: boolean;
}

export interface useNotificationActions {
  setShowNotifications: (show: boolean) => void;
  initNotificationSocketListeners: (profileId: number) => void;
  clearNotifications: () => void;
}

export interface NotificationStore
  extends NotificationState,
    useNotificationActions {}
