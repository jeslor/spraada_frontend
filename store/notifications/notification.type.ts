export interface Notification {
  id?: string;
  title: string;
  content: string;
  profileId: number;
  read: boolean;
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
}

export interface useNotificationActions {
  setShowNotifications: (show: boolean) => void;
  initNotificationSocketListeners: (profileId: number) => void;
  getNotifications: (profileId: number) => Promise<void>;
  addNewNotification: (notification: Notification) => void;
  getNotificationCounter: (profileId: number) => Promise<void>;
  updateNotificationCounter: (counter: NotificationCounter) => void;
  sendNotification: (notification: Notification, profileId: number) => void;
  clearNotifications: () => void;
}

export interface NotificationStore
  extends NotificationState,
    useNotificationActions {}
