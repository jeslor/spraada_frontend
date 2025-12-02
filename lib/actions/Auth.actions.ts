"use server";

import { SignInData } from "@/types/auth";
import { createSession, deleteSession, getSession } from "../session/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
        id: result.id,
        email: result.email,
      },
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    });
  } catch (error) {
    console.log("Authentication error:", error);
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
        id: result.id,
        email: result.email,
      },
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
    });
  } catch (error) {
    console.log("Authentication error:", error);
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

    return {
      newAccessToken,
      newRefreshToken,
    };
  } catch (error) {
    console.log("Error refreshing tokens:", error);
    return error instanceof Error ? error : new Error("Unknown error occurred");
  }
};
