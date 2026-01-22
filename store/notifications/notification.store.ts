import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  Notification,
  NotificationStore,
  NotificationCounter,
} from "./notification.type";
import { getSocket } from "@/lib/socket/socket";

const initialState = {
  showNotifications: true,
  notificationCounter: {} as NotificationCounter,
  notifications: [] as Notification[],
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    immer((set, get) => ({
      notifications: initialState.notifications,
      notificationCounter: initialState.notificationCounter,
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

      //add new notification to the store
      addNewNotification: (notification: Notification) =>
        set((state) => {
          state.notifications.unshift(notification);
        }),

      //update notification counter
      updateNotificationCounter: (counter: NotificationCounter) =>
        set((state) => {
          state.notificationCounter = counter;
        }),

      /* ------------------ SOCKET NOTIFICATION INIT ------------------ */
      initNotificationSocketListeners: (profileId: number) => {
        const socket = getSocket(profileId);
        socket.off("notifications"); // prevent duplicate listeners

        socket.on("notifications", (incomingNotification: Notification) => {
          const notificationWindowOpen = get().showNotifications;
          // If notification window is open, we can consider the notification as read

          // Update state with the new notification

          // update the new notification in the data base as read if the notification window is open
          set((state) => {
            state.notifications.unshift(incomingNotification);
            state.notificationCounter.count += 1;
          });
        });
      },

      /* ------------------ SEND A NOTIFICATION ------------------ */
      sendNotification: (notification: Notification) => {
        //save the notification to database
        //emit the notification to the socket server
      },
    })),
    {
      name: "notifications-store",
      partialize: (state) => ({
        notifications: state.notifications,
        notificationCounter: state.notificationCounter,
      }),
    }
  )
);
