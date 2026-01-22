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

export interface NotificationCounter {
  id: number;
  profileId: number;
  count: number;
}

interface NotificationState {
  notifications: Notification[];
  notificationCounter: NotificationCounter;
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
