"use server";

import { SignInData } from "@/types/auth";
import { createSession, deleteSession } from "../session/session";
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

//move this logic to the api route
export const signOut = async (): Promise<void> => {
  // Clear the session cookie
  await deleteSession();

  revalidatePath("/");

  return redirect("/signin");
};

//get new refresh and access tokens from the backend
export const getNewRefreshAndAccessToken = async (
  oldRefreshToken: string,
  userEmail: string,
  id: number
): Promise<
  | {
      access_token: string;
      refresh_token: string;
    }
  | string
> => {
  try {
    if (!oldRefreshToken) {
      throw new Error("No refresh token provided");
    }
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/refresh-tokens`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: oldRefreshToken,
          email: userEmail,
          id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh tokens");
    }
    const { access_token, refresh_token } = await response.json();
    return {
      access_token,
      refresh_token,
    };
  } catch (error: any) {
    return error.message as string;
  }
};
