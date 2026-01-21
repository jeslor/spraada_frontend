import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Notification, NotificationStore } from "./notification.type";

const initialState = {
  showNotifications: true,
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
      clearNotifications: () =>
        set((state) => {
          state.notifications = [];
          state.showNotifications = false;
        }),
    })),
    {
      name: "notifications-store",
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
