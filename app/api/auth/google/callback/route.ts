import { createSession } from "@/lib/session/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("🔥 [GOOGLE_CALLBACK_GET] Route handler called");

  try {
    const { searchParams } = new URL(request.url);

    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");
    const userId = searchParams.get("id");
    const userEmail = searchParams.get("email");

    console.log("🔍 [GOOGLE_CALLBACK_GET] Data received:", {
      has_access_token: !!access_token,
      has_refresh_token: !!refresh_token,
      userId,
      userEmail,
    });

    // Validate required fields
    if (!access_token || !refresh_token || !userId || !userEmail) {
      console.error("❌ [GOOGLE_CALLBACK_GET] Missing required parameters:", {
        has_access_token: !!access_token,
        has_refresh_token: !!refresh_token,
        userId,
        userEmail,
      });
      return NextResponse.redirect(
        new URL(
          "/signin?error=missing_oauth_tokens&message=Backend did not return all required fields",
          request.url
        )
      );
    }

    // Validate token formats (basic check)
    if (typeof access_token !== "string" || typeof refresh_token !== "string") {
      console.error("❌ [GOOGLE_CALLBACK_GET] Invalid token types:", {
        access_type: typeof access_token,
        refresh_type: typeof refresh_token,
      });
      return NextResponse.redirect(
        new URL(
          "/signin?error=invalid_token_format&message=Tokens are not valid strings",
          request.url
        )
      );
    }

    console.log(
      "📝 [GOOGLE_CALLBACK_GET] Creating session for user:",
      userEmail
    );

    // Create session with OAuth tokens
    await createSession({
      user: {
        id: String(userId),
        email: String(userEmail),
      },
      accessToken: String(access_token),
      refreshToken: String(refresh_token),
    });

    console.log(
      "✅ [GOOGLE_CALLBACK_GET] Session created successfully for:",
      userEmail
    );
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("❌ [GOOGLE_CALLBACK_GET] Failed to create session:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.redirect(
      new URL(
        `/signin?error=session_creation_failed&message=${encodeURIComponent(
          errorMessage
        )}`,
        request.url
      )
    );
  }
}

// POST handler for backward compatibility (won't be used)
export async function POST(request: NextRequest) {
  console.warn(
    "⚠️ [GOOGLE_CALLBACK_POST] POST request received - backend should redirect with GET"
  );
  return NextResponse.redirect(
    new URL(
      "/signin?error=invalid_callback_method&message=Expected GET request from backend",
      request.url
    )
  );
}
