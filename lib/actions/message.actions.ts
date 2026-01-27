import { Message } from "@/store/messages/messages.type";
import { ProfileSummary } from "@/store/messages/messages.type";
import customFetch, { normalCustomFetch } from "@/lib/customFetch";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444";

export const saveMessageAPI = async (
  message: Partial<Message>
): Promise<Message> => {
  try {
    const response = await normalCustomFetch(`${BACKEND_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to save message"
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchMessagesApi = async (userId: number): Promise<Message[]> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_URL}/message?userId=${userId}`,
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
          response.data?.error ||
          response.error ||
          "Failed to fetch messages"
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProfilesApi = async (
  userId: number
): Promise<ProfileSummary[]> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_URL}/message/profiles?userId=${userId}`,
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
          response.data?.error ||
          response.error ||
          "Failed to fetch profiles"
      );
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchUnreadMessagesCountApi = async (
  userId: number
): Promise<{
  id: number;
  profileId: number;
  counters: { [key: number]: number };
}> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_URL}/message/unreadCount?profileId=${userId}`,
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
          response.data?.error ||
          response.error ||
          "Failed to fetch unread messages count"
      );
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUnreadMessagesCountApi = async (
  unReadMessageId: number,
  profileId: number,
  counters: { [key: number]: number }
): Promise<{
  id: number;
  profileId: number;
  counters: { [key: number]: number };
}> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_URL}/message/unreadCount/${unReadMessageId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileId, counters }),
      }
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to update unread messages count"
      );
    }
    const data = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteMessageApi = async (
  message: Message,
  profileId: number,
  userId: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await customFetch(`${BACKEND_URL}/message/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, profileId, userId }),
    });

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to delete message"
      );
    }
    return {
      success: response.data.success,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
