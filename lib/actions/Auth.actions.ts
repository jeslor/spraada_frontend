"use server";

import { SignInData } from "@/types/auth";
import { createSession, deleteSession } from "../session/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

    console.log("Response status:", response);

    if (!response.status.toString().startsWith("2")) {
      console.log("Response not ok:", response.status, await response.text());

      console.log("Response headers:", response.headers);

      throw new Error(
        response.status === 403
          ? "Invalid credentials"
          : "Authentication failed"
      );
    }

    const result = await response.json();
    console.log(result);

    await createSession({
      user: {
        id: result.id,
        email: result.email,
      },
      accessToken: result.access_token,
    });
  } catch (error) {
    console.log("Authentication error:", error);

    return { error: (error as Error).message };
  }
};

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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.status.toString().startsWith("2")) {
      console.log("Response not ok:", response.status, await response.text());

      throw new Error(
        response.status === 403
          ? "Invalid credentials"
          : "Authentication failed"
      );
    }

    const result = await response.json();
    console.log("Result on sign in action:", result);

    await createSession({
      user: {
        id: result.id,
        email: result.email,
      },
      accessToken: result.access_token,
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
