"use server";

import { SignInData } from "@/types/auth";
import {
  createSession,
  updateTokensInSession,
  updateSessionUserData,
} from "../session/session";
import customFetch from "../customFetch";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:4444";

//sign up a new user with email, password and confirm password, then return the access and refresh tokens
export const signUp = async (
  data: SignInData | undefined
): Promise<void | { error: string }> => {
  try {
    if (!data) {
      throw new Error("No data provided");
    }
    const response = await fetch(`${BACKEND_API_URL}/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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
    const response = await fetch(`${BACKEND_API_URL}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

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
    const response = await fetch(`${BACKEND_API_URL}/auth/refresh-tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh_token: oldRefreshToken,
        email: userEmail,
        id,
      }),
    });

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

//update user data in session such that it reflects changes like role updates or onboarding status
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
//fetch the user from the API by ID
export const getUser = async (id: string) => {
  try {
    const response = await customFetch(`${BACKEND_API_URL}/auth/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

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

//Check if user exists no token
export const checkIfUserExists = async (email: string) => {
  try {
    const response = await fetch(`${BACKEND_API_URL}/auth/check-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.status.toString().startsWith("2")) {
      return false;
    }

    const result = await response.json();
    return result ? true : false;
  } catch (error) {
    console.log("Error checking if user exists:", error);
    return false;
  }
};

//send password reset request
export const resetPasswordRequest = async (
  email: string
): Promise<{ success: boolean; data: string }> => {
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/auth/reset-password-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send password reset request");
    }
    return {
      success: true,
      data: "Password reset email sent successfully",
    };
  } catch (error) {
    console.log("Error sending password reset request:", error);
    return {
      success: false,
      data: (error as Error).message,
    };
  }
};

//check if user with reset token exists
export const userWithTokenExists = async (token: string, email: string) => {
  const response = await fetch(
    `${BACKEND_API_URL}/auth/check-reset-token-exists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, email }),
    }
  );

  if (!response.ok) {
    return {
      exists: false,
    };
  }

  const result = await response.json();
  return {
    exists: result.exists,
  };
};

//check if Token is still valid
export const tokenExpiryCheck = async (
  token: string,
  email: string
): Promise<{ valid: boolean }> => {
  try {
    const response = await fetch(
      `${BACKEND_API_URL}/auth/check-reset-token-expired`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, email }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify reset token");
    }
    const result = await response.json();

    return {
      valid: result.valid,
    };
  } catch (error) {
    console.log("Error verifying reset token:", error);
    return { valid: false };
  }
};

//save new password for user
export const saveNewPassword = async (
  token: string,
  email: string,
  newPassword: string
): Promise<{ success: boolean; data: string }> => {
  try {
    if (!token || !email || !newPassword) {
      throw new Error("Missing required fields");
    }
    const response = await fetch(`${BACKEND_API_URL}/auth/save-new-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, email, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to save new password");
    }

    return {
      success: true,
      data: "Password updated successfully",
    };
  } catch (error) {
    console.log("Error saving new password:", error);
    return {
      success: false,
      data: (error as Error).message,
    };
  }
};
