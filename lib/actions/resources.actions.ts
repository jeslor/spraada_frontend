"use server";

import { ProfileActionResult } from "@/store";
import customFetch from "../customFetch";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444";

export const uploadResources = async (
  userId: number,
  formData: FormData,
  resourceFolder: string
): Promise<ProfileActionResult<any>> => {
  try {
    const imageUploadResult = await customFetch(
      `${BACKEND_API_URL}/resources/upload/${userId}?resourceFolder=${resourceFolder}`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!imageUploadResult.ok) {
      throw new Error(
        imageUploadResult.data?.message ||
          imageUploadResult.error ||
          "Failed to upload images"
      );
    }

    return {
      success: true,
      data: imageUploadResult.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload profile images",
    };
  }
};

export const deleteResource = async ({
  userId,
  keys,
  profileId,
}: {
  userId: number;
  keys: string[];
  profileId: number;
}): Promise<ProfileActionResult> => {
  try {
    const deleteOldResource = await customFetch(
      `${BACKEND_API_URL}/resources/delete/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keys,
          profileId,
        }),
      }
    );

    if (!deleteOldResource.ok) {
      throw new Error(
        deleteOldResource.data?.message ||
          deleteOldResource.error ||
          "Failed to delete old profile images"
      );
    }

    return { success: true, data: keys };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete old profile images",
    };
  }
};
