"use server";

import customFetch from "@/lib/customFetch";
import { Notification, NotificationCounter } from "@/store";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444";

export const createNotification = async (
  notification: Notification
): Promise<{
  success: boolean;
  data: Notification | Error;
}> => {
  try {
    const response = await customFetch(`${BACKEND_URL}/notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    });
    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data.error ||
          response.error ||
          "failed to create the notification"
      );
    }
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      data:
        error instanceof Error
          ? error
          : new Error("failed to create notification"),
    };
  }
};

export const fetchNotificationsByProfile = async (
  profileId: number
): Promise<Notification[]> => {
  try {
    const response = await customFetch(
      `${BACKEND_URL}/notification/profile/${profileId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data.error ||
          response.error ||
          "Failed to fetch notifications"
      );
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchNotificationCounterByProfile = async (
  profileId: number
): Promise<NotificationCounter> => {
  try {
    const response = await customFetch(
      `${BACKEND_URL}/notification/profile/${profileId}/counter`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data.error ||
          response.error ||
          "Failed to fetch notification counter"
      );
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateNotificationAndCounter = async (
  notification: Notification,
  notificationCounter?: NotificationCounter
): Promise<{
  success: boolean;
  data: Notification | Error;
}> => {
  console.log(notification, notificationCounter, "backend action");

  return customFetch(`${BACKEND_URL}/notification/updateNotifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notification, notificationCounter }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          response.data?.message ||
            response.data.error ||
            response.error ||
            "failed to update the notification"
        );
      }
      return {
        success: true,
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        success: false,
        data:
          error instanceof Error
            ? error
            : new Error("failed to update notification"),
      };
    });
};
