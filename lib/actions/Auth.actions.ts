"use server";

import { SignInData } from "@/types/auth";

const AuthenticateUser = async (data: SignInData | undefined, type: string) => {
  try {
    if (!data) {
      throw new Error("No data provided");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/${type}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`Authentication failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    return { error: (error as Error).message };
  }
};

export default AuthenticateUser;
