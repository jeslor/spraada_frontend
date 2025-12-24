"use server";

import customFetch from "../customFetch";
import { Profile } from "@/store/profile/profile.types";

const API_URL = process.env.BACKEND_API_URL || "http://localhost:4444";

export interface ProfileActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetch user profile by user ID
 */
export const fetchUserProfile = async (
  userId: string
): Promise<ProfileActionResult> => {
  try {
    const response = await customFetch(`${API_URL}/auth/${userId}`, {
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

/**
 * Update profile by profile ID
 */
export const updateUserProfile = async (
  profileId: number,
  updates: Partial<Profile>
): Promise<ProfileActionResult<Profile>> => {
  try {
    const response = await customFetch(`${API_URL}/profile/${profileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      return {
        success: false,
        error:
          response.data?.message ||
          response.error ||
          "Failed to update profile",
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};

/**
 * Update profile avatar
 */
export const updateProfileAvatar = async (
  profileId: number,
  avatarUrl: string,
  avatarUrlKey?: string
): Promise<ProfileActionResult<Profile>> => {
  return updateUserProfile(profileId, { avatarUrl, avatarUrlKey });
};

/**
 * Update profile cover
 */
export const updateProfileCover = async (
  profileId: number,
  coverUrl: string,
  coverUrlKey?: string
): Promise<ProfileActionResult<Profile>> => {
  return updateUserProfile(profileId, { coverUrl, coverUrlKey });
};
