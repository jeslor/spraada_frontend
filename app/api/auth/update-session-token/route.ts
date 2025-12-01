import { updateTokensInSession } from "@/lib/session/session";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { access_token, refresh_token } = await request.json();

  if (!access_token || !refresh_token) {
    return new Response(
      JSON.stringify({ error: "Access token and refresh token are required" }),
      { status: 400 }
    );
  }

  try {
    await updateTokensInSession({
      accessToken: access_token,
      refreshToken: refresh_token,
    });
    return new Response(
      JSON.stringify({ message: "Session tokens updated successfully" }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating session tokens:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to update session tokens: " + error.message,
      }),
      { status: 500 }
    );
  }
}
