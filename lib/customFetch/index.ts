import { getSession, updateTokensInSession } from "../session/session";
import { getNewRefreshAndAccessToken } from "../actions/Auth.actions";
import { cookies } from "next/headers";

export interface CustomFetchOptions extends RequestInit {
  // You can add custom options here if needed
  headers?: Record<string, string>;
}

export default async function customFetch(
  url: string | URL,
  options: CustomFetchOptions = {}
): Promise<Response | any> {
  try {
    const session = await getSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    options = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: session ? `Bearer ${session.accessToken}` : "",
      },
    };

    let response = await fetch(url, options);

    if (response.status === 401) {
      if (!session.refreshToken) {
        throw new Error("No refresh token available");
      }

      //get new access and refresh tokens
      const updateAccessTokens = await getNewRefreshAndAccessToken(
        session.refreshToken,
        session.user.email,
        Number(session.user.id)
      );

      if (!updateAccessTokens || updateAccessTokens instanceof Error) {
        throw new Error("Failed to refresh tokens");
      }

      // update the session with new tokens using the API route
      await updateSessionWithNewTokens(
        updateAccessTokens.newAccessToken,
        updateAccessTokens.newRefreshToken
      );

      // Retry the original request with the new access token
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${updateAccessTokens.newAccessToken}`,
      };
      response = await fetch(url, options);
    }

    return response;
  } catch (error: Error | any) {
    console.log("error from the custom fetch", error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Update refresh and access tokens via API route
const updateSessionWithNewTokens = async (
  newAccessToken: string,
  newRefreshToken: string
) => {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    // Call the API route handler to update the session (handles cookies properly)
    const updateResponse = await fetch(
      `${process.env.FRONTEND_URL}/api/auth/update-session-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
        body: JSON.stringify({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        }),
      }
    );

    // Check response status BEFORE trying to parse JSON
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("Session update failed:", errorText);
      throw new Error(
        `Failed to update session tokens: ${updateResponse.status}`
      );
    }

    const updateResult = await updateResponse.json();
    // Now safely parse the JSON response
    console.log("Session update response:", updateResult.message);
  } catch (error: any) {
    console.error("❌ [UPDATE_SESSION] Error updating session tokens:", error);
    throw new Error("Failed to update session tokens: " + error.message);
  }
};
