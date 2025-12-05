"use server";

import { getSession } from "../session/session";
import { redirect } from "next/navigation";

export const fetchUserProfile = async (userId: string) => {
  const userProfile = await fetch(
    `${process.env.BACKEND_API_URL}/profile/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!userProfile.ok) {
    redirect("/signin");
  }
  const userProfileData = await userProfile.json();

  return userProfileData;
};
