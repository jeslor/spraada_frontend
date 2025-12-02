import { updateTokensInSession } from "@/lib/session/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { accessToken, refreshToken } = await request.json();

  if (!accessToken || !refreshToken) {
    console.error("❌ [UPDATE_SESSION_TOKEN] Missing tokens");
    return NextResponse.json(
      { error: "Access token and refresh token are required" },
      { status: 400 }
    );
  }

  try {
    console.log(
      "🔄 [UPDATE_SESSION_TOKEN] Updating session with new tokens..."
    );

    await updateTokensInSession({
      accessToken,
      refreshToken,
    });

    console.log(
      "✅ [UPDATE_SESSION_TOKEN] Tokens updated in session successfully"
    );

    return NextResponse.json(
      {
        message: "Session tokens updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "❌ [UPDATE_SESSION_TOKEN] Error updating session tokens:",
      error
    );
    return NextResponse.json(
      {
        error: "Failed to update session tokens: " + error.message,
      },
      { status: 500 }
    );
  }
}
