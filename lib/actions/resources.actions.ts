"use server";

import { ProfileActionResult } from "@/types/profile.types";
import customFetch from "../customFetch";

export const uploadResources = async (
  userId: number,
  formData: FormData,
  resourceFolder: string
): Promise<ProfileActionResult<any>> => {
  try {
    const imageUploadResult = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/upload/resources/${userId}?folder=${resourceFolder}`,
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
