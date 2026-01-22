import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  Notification,
  NotificationStore,
  NotificationCounter,
} from "./notification.type";
import { getSocket } from "@/lib/socket/socket";
import {
  createNotification,
  fetchNotificationCounterByProfile,
  fetchNotificationsByProfile,
  updateNotificationAndCounter,
} from "@/lib/actions/notification.actions";

const initialState = {
  showNotifications: false,
  notificationCounter: {} as NotificationCounter,
  notifications: [] as Notification[],
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      //toggle notification window visibility
      setShowNotifications: (show: boolean) =>
        set((state) => {
          state.showNotifications = show;
        }),

      //fetch notifications from backend
      getNotifications: async (profileId: number) => {
        try {
          const notifications = await fetchNotificationsByProfile(profileId);
          set((state) => {
            state.notifications = notifications;
          });
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      },

      //add new notification to the store
      addNewNotification: (notification: Notification) =>
        set((state) => {
          state.notifications.unshift(notification);
        }),

      // fetch notification counter from backend
      getNotificationCounter: async (profileId: number) => {
        try {
          const counter = await fetchNotificationCounterByProfile(profileId);
          set((state) => {
            state.notificationCounter = counter;
          });
        } catch (error) {
          console.error("Failed to fetch notification counter:", error);
        }
      },

      //update notification counter
      updateNotificationCounter: (counter: NotificationCounter) =>
        set((state) => {
          state.notificationCounter = counter;
        }),

      /* ------------------ SOCKET NOTIFICATION INIT ------------------ */
      initNotificationSocketListeners: async (profileId: number) => {
        const socket = getSocket(profileId);
        socket.off("notifications"); // prevent duplicate listeners

        socket.on(
          "notifications",
          async (incomingNotification: Notification) => {
            const notificationWindowOpen = get().showNotifications;
            const notificationCounter = get().notificationCounter;
            // Update state with the new notification
            const updatedNotification = { ...incomingNotification };
            const updatedNotificationCounter = {
              ...notificationCounter,
              count: (notificationCounter.count ?? 0) + 1,
              profileId:
                notificationCounter.profileId ?? incomingNotification.profileId,
            };
            if (notificationWindowOpen) {
              updatedNotification.read = true;
              updatedNotificationCounter.count = Math.max(
                0,
                updatedNotificationCounter.count - 1
              );
            }

            //update Notification as read in the backend can be done here
            const updateNotificationResult = await updateNotificationAndCounter(
              updatedNotification,
              updatedNotificationCounter
            );

            if (!updateNotificationResult.success) {
              console.error(
                "Failed to update notification as read:",
                updateNotificationResult.data
              );
            }

            set((state) => {
              state.notifications.unshift(updatedNotification);
              state.notificationCounter = updatedNotificationCounter;
            });
          }
        );
      },

      /* ------------------ SEND A NOTIFICATION ------------------ */
      sendNotification: async (
        notification: Notification,
        profileId: number
      ) => {
        const { id, ...notificationWithoutId } = notification;

        //save the notification to database
        const savedNotification = await createNotification(
          notificationWithoutId
        );

        if (savedNotification.success) {
          //emit the notification to the socket server
          const socket = getSocket(profileId);
          socket.emit("notifications", savedNotification.data);
        }
      },

      //clear all notifications from the store
      clearNotifications: () =>
        set((state) => {
          state.notifications = [];
          state.showNotifications = false;
          state.notificationCounter = {
            id: 0,
            profileId: 0,
            count: 0,
          };
        }),
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
