import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Notification, NotificationStore } from "./notification.type";
import { getSocket } from "@/lib/socket/socket";

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

      /* ------------------ SOCKET CHATS INIT ------------------ */
      initNotificationSocketListeners: (profileId: number) => {
        const socket = getSocket(profileId);
        socket.off("notifications"); // prevent duplicate listeners

        socket.on("notifications", (incomingNotification: Notification) => {
          set((state) => {
            state.notifications.unshift(incomingNotification);
          });
        });
      },
    })),
    {
      name: "notifications-store",
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
