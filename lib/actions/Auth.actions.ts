"use server";

import { SignInData } from "@/types/auth";
import {
  createSession,
  updateTokensInSession,
  updateSessionUserData,
} from "../session/session";
import { cookies } from "next/headers";
import customFetch from "../customFetch";

//sign up a new user with email, password and confirm password, then return the access and refresh tokens
export const signUp = async (
  data: SignInData | undefined
): Promise<void | { error: string }> => {
  try {
    if (!data) {
      throw new Error("No data provided");
    }
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/sign-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.status.toString().startsWith("2")) {
      throw new Error(
        response.status === 403
          ? "Invalid credentials"
          : "Authentication failed"
      );
    }

    const result = await response.json();

    await createSession({
      user: {
        id: String(result.id),
        email: result.email,
        isOnboarded: result.isOnboarded,
        role: result.role,
      },
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    });
  } catch (error) {
    return { error: (error as Error).message };
  }
};

//Sign in new users with email and password and then return an access and refresh token
export const signIn = async (
  data: SignInData | undefined
): Promise<void | { error: string }> => {
  try {
    if (!data) {
      throw new Error("No data provided");
    }
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/sign-in`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.status.toString().startsWith("2")) {
      throw new Error(
        response.status === 403
          ? "Invalid credentials"
          : "Authentication failed"
      );
    }

    const result = await response.json();

    await createSession({
      user: {
        id: String(result.id),
        email: result.email,
        isOnboarded: result.isOnboarded,
        role: result.role,
      },
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    });
  } catch (error) {
    return { error: (error as Error).message };
  }
};

//get new refresh and access tokens from the backend
export const getNewRefreshAndAccessToken = async (
  oldRefreshToken: string,
  userEmail: string,
  id: number
): Promise<{ newAccessToken: string; newRefreshToken: string } | Error> => {
  if (!oldRefreshToken) throw new Error("No refresh token provided");

  try {
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/refresh-tokens`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: oldRefreshToken,
          email: userEmail,
          id,
        }),
      }
    );

    if (!response.ok) {
      console.error("Backend refresh failed:", await response.text());
      throw new Error("Failed to refresh tokens");
    }

    const { access_token: newAccessToken, refresh_token: newRefreshToken } =
      await response.json();

    await updateSessionWithNewTokens(newAccessToken, newRefreshToken);

    return {
      newAccessToken,
      newRefreshToken,
    };
  } catch (error) {
    return error instanceof Error ? error : new Error("Unknown error occurred");
  }
};

// Update session with new tokens directly (no HTTP request needed in server actions)
const updateSessionWithNewTokens = async (
  newAccessToken: string,
  newRefreshToken: string
) => {
  try {
    await updateTokensInSession({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    return { success: true };
  } catch (error: any) {
    console.error("❌ [UPDATE_SESSION] Error updating session tokens:", error);
    throw new Error("Failed to update session tokens: " + error.message);
  }
};

export const updateUserDataInSession = async ({
  userRole,
  UserOnboarded,
}: {
  userRole: string;
  UserOnboarded: boolean;
}) => {
  try {
    await updateSessionUserData({
      userRole,
      UserOnboarded,
    });
    console.log("Updated user data successfully");
  } catch (error) {
    console.log("Error updating user data in session:", error);
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await customFetch(
      `${process.env.BACKEND_API_URL || "http://localhost:4444"}/auth/${id}`,
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
          "Failed to fetch user data"
      );
    }

    return response.data;
  } catch (error) {
    console.log("Error fetching user data:", error);
    return null;
  }
};
