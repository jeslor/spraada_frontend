"use server";

import { SignInData } from "@/types/auth";

const AuthenticateUser = async (data: SignInData | undefined, type: string) => {
  try {
    if (!data) {
      throw new Error("No data provided");
    }
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/auth/${type}`,
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

    return response.json();
  } catch (error) {
    console.log("Authentication error:", error);

    return { error: (error as Error).message };
  }
};

export default AuthenticateUser;
