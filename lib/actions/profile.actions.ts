"use server";

import { ProfileActionResult } from "@/types/profile.types";
import customFetch from "../customFetch";
import { Profile } from "@/store/profile/profile.types";
import { deleteResource, uploadResources } from "./resources.actions";

const RESOURCE_FOLDER = "profile-images";
const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:4444";

// =================helper functions for profile actions ===================
//Fetch user profile by user ID
export const fetchUserProfile = async (
  userId: string
): Promise<ProfileActionResult> => {
  try {
    const response = await customFetch(`${BACKEND_API_URL}/profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error:
          response.data?.message || response.error || "Failed to fetch profile",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch profile",
    };
  }
};

//  Update profile by profile ID
export const updateUserProfile = async (
  profileId: number,
  updates: Partial<Profile>
): Promise<ProfileActionResult<Profile>> => {
  try {
    const updateRes = await customFetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444"
      }/profile/${profileId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...updates,
        }),
      }
    );

    if (!updateRes.ok) {
      throw new Error(
        updateRes.data?.message ||
          updateRes.error ||
          "Failed to update profile picture"
      );
    }

    return {
      success: true,
      data: updateRes.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};

//================Main actions ==================

//Update profile avatar
export const updateProfileAvatar = async ({
  userId,
  profileId,
  formData,
  avatarUrlKey,
}: {
  avatarUrlKey: string;
  userId: number;
  profileId: number;
  formData: FormData;
}): Promise<ProfileActionResult<Profile>> => {
  try {
    // 1. Upload image to S3
    const imageUploadResult = await uploadResources(
      userId,
      formData,
      RESOURCE_FOLDER
    );
    if (!imageUploadResult.success) {
      throw new Error(
        imageUploadResult.data?.message ||
          imageUploadResult.error ||
          "Failed to upload profile image"
      );
    }
    const updatedImage = imageUploadResult.data[0];

    // 2. Update Profile with new avatar URL
    const updateProfile = await updateUserProfile(profileId, {
      avatarUrl: updatedImage.url,
      avatarUrlKey: updatedImage.key,
    });

    if (!updateProfile.success) {
      return {
        success: false,
        error: updateProfile.error || "Failed to update profile avatar",
      };
    }

    // 3. Delete old avatar from S3 if avatarKey is provided
    if (avatarUrlKey) {
      const deleteOldAvatar = await deleteResource({
        userId,
        keys: [avatarUrlKey],
        profileId,
      });
      if (!deleteOldAvatar.success) {
        throw new Error(
          deleteOldAvatar.error || "Failed to delete old avatar image"
        );
      } else {
        console.log("Old avatar deleted successfully");
      }
    }

    return {
      success: true,
      data: updateProfile.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update profile avatar",
    };
  }
};
