"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
  user: {
    id: string;
    email: string;
  };
  // accessToken: string;
  // refreshToken: string;
};

const sessionSecret = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(sessionSecret!);

export async function createSession(sessionData: Session) {
  const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

  const session = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expireAt)
    .sign(encodedKey);

  // cookies() is a function that returns the cookies store; call it and set the cookie synchronously
  const cookieStore = await cookies();
  cookieStore.set("spraada_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expireAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("spraada_session");

  if (!sessionCookie) {
    return null;
  }

  const sessionToken = sessionCookie.value;

  try {
    const { payload } = await jwtVerify(sessionToken, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as Session;
  } catch (error) {
    console.error("Invalid session token:", error);
    return redirect("/signin");
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    sameSite: "lax",
    path: "/",
  });
}
