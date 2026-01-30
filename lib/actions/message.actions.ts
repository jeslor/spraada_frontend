"use server";
import { Message } from "@/store/messages/messages.type";
import { ProfileSummary } from "@/store/messages/messages.type";
import customFetch, { normalCustomFetch } from "@/lib/customFetch";
import { cursorTo } from "readline";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444";

//save message to backend and attach it to the conversation or create a new conversation and attach the message to it
export const saveMessageAPI = async (
  message: Partial<Message>,
  otherProfileId: number,
): Promise<
  { data: Message; success: boolean } | { error: Error; success: false }
> => {
  try {
    const response = await normalCustomFetch(`${BACKEND_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, otherProfileId }),
    });

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to save message",
      );
    }

    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
      success: false,
    };
  }
};

//fetch more messages for a conversation
export const fetchMoreMessagesAPI = async (
  conversationId: number,
  cursorTo: string | undefined,
): Promise<
  { data: Message[]; success: boolean } | { error: Error; success: false }
> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_URL}/message/more/${conversationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cursorTo }),
      },
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to fetch more messages",
      );
    }

    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
      success: false,
    };
  }
};

export const fetchAllNewMessagesAPI = async (
  conversationId: number,
  cursorTo: string | undefined,
): Promise<
  { data: Message[]; success: boolean } | { error: Error; success: false }
> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_URL}/message/new/${conversationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cursorTo }),
      },
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to fetch new messages",
      );
    }

    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error("Unknown error"),
      success: false,
    };
  }
};

export const fetchUnreadMessagesCountApi = async (
  userId: number,
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
      },
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to fetch unread messages count",
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
  counters: { [key: number]: number },
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
      },
    );

    if (!response.ok) {
      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to update unread messages count",
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
  userId: number,
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
      console.log(response.data);

      throw new Error(
        response.data?.message ||
          response.data?.error ||
          response.error ||
          "Failed to delete message",
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
