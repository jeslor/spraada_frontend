import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Notification } from "./notification.type";

const initialState = {
  showNotifications: false,
  notifications: [] as Notification[],
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    immer((set) => ({
      notifications: initialState.notifications,
      showNotifications: initialState.showNotifications,
      setShowNotifications: (show: boolean) =>
        set((state) => {
          state.showNotifications = show;
        }),
      addNotification: (notification) =>
        set((state) => {
          state.notifications.unshift({
            id: notification.id || Math.random().toString(36).substr(2, 9),
            createdAt: notification.createdAt || new Date().toISOString(),
            read: notification.read ?? false,
            ...notification,
          });
        }),
      markAsRead: (id) =>
        set((state) => {
          const n = state.notifications.find((n) => n.id === id);
          if (n) n.read = true;
        }),
      removeNotification: (id) =>
        set((state) => {
          state.notifications = state.notifications.filter((n) => n.id !== id);
        }),
      clearNotifications: () =>
        set((state) => {
          state.notifications = [];
        }),
    })),
    {
      name: "notifications-store",
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
