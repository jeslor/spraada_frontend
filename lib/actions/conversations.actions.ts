"use server";

import { Conversation } from "@/store/conversations/conversartions.types";
import { normalCustomFetch } from "../customFetch";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444";

export const fetchConversationsAPI = async (
  profileId: number,
  page: number,
): Promise<
  | {
      data: Conversation[];
      success: boolean;
    }
  | {
      data: Error;
      success: false;
    }
> => {
  try {
    const response = await normalCustomFetch(
      `${BACKEND_URL}/conversation/${profileId}?page=${page}`,
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
          "Failed to fetch conversations",
      );
    }

    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    return {
      data: error instanceof Error ? error : new Error("Unknown error"),
      success: false,
    };
  }
};
