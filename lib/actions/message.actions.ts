import { Message } from "@/store/messages/messages.type";
import { ProfileSummary } from "@/store/messages/messages.type";
import customFetch from "@/lib/customFetch";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444";

export const fetchMessagesApi = async (userId: number): Promise<Message[]> => {
  try {
    const response = await customFetch(
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
    const response = await customFetch(
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
