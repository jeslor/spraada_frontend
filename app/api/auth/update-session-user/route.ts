import {
  updateSessionUserData,
  updateTokensInSession,
} from "@/lib/session/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userRole, UserOnboarded } = await request.json();

  if (!userRole || !UserOnboarded) {
    console.error("❌ [UPDATE_SESSION_USER] Missing user data");
    return NextResponse.json(
      { error: "User role and onboarding status are required" },
      { status: 400 }
    );
  }

  try {
    console.log(
      "🔄 [UPDATE_SESSION_USER] Updating session with new user data..."
    );

    await updateSessionUserData({
      userRole,
      UserOnboarded,
    });

    console.log(
      "✅ [UPDATE_SESSION_USER] User data updated in session successfully"
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
