export interface Notification {
  id?: string;
  title: string;
  content: string;
  profileId: number;
  isRead: boolean;
  link?: string;
  contentMediaFiles?: { mediaUrl: string }[];
  profileMediaFiles?: { mediaUrl: string }[];
  createdAt?: string;
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
  hasUnreadNotifications: boolean;
}

export interface NotificationActions {
  setShowNotifications: (show: boolean) => void;
  setHasUnreadNotifications: (hasUnread: boolean) => void;
  initNotificationSocketListeners: (profileId: number) => void;
  getNotifications: (profileId: number) => Promise<void>;
  getNotificationCounter: (profileId: number) => Promise<void>;
  updateNotificationCounter: (counter: NotificationCounter) => void;
  updateNotifications: (notifications: Notification[]) => void;
  updateNotificationsAndCounterAsRead: () => Promise<void>;
  sendNotification: (notification: Notification, profileId: number) => void;
  clearNotifications: () => void;
}

export interface NotificationStore
  extends NotificationState,
    NotificationActions {}
