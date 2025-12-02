import { updateTokensInSession } from "@/lib/session/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken } = await request.json();

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: "Access token and refresh token are required" },
      { status: 400 }
    );
  }

  try {
    console.log("Route handler received tokens:", {
      accessToken: accessToken.substring(0, 20) + "...",
      refreshToken: refreshToken.substring(0, 20) + "...",
    });

    await updateTokensInSession({
      accessToken,
      refreshToken,
    });

    console.log("Tokens updated in session successfully");

    return NextResponse.json(
      {
        message: "Session tokens updated successfully",
        data: {
          accessToken,
          refreshToken,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating session tokens:", error);
    return NextResponse.json(
      {
        error: "Failed to update session tokens: " + error.message,
      },
      { status: 500 }
    );
  }
}
