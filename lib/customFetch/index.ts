import { getSession, updateTokensInSession } from "../session/session";
const { getNewRefreshAndAccessToken } = await import("../actions/Auth.actions");

export interface CustomFetchOptions extends RequestInit {
  // You can add custom options here if needed
  headers?: Record<string, string>;
}

export default async function (
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

      const updateAccessTokens = await getNewRefreshAndAccessToken(
        session.refreshToken,
        session.user.email,
        Number(session.user.id)
      );

      if (updateAccessTokens instanceof Error) {
        throw new Error(
          "Failed to refresh tokens: " + updateAccessTokens.message
        );
      }

      // Call the API route handler to update the session (handles cookies properly)
      // this technic seems not to be updating the session cookie properly, so we do it directly in the session.ts file
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/update-session-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: updateAccessTokens.newAccessToken,
            refreshToken: updateAccessTokens.newRefreshToken,
          }),
        }
      );

      // Check response status BEFORE trying to parse JSON
      if (!updateResponse.ok) {
        // const errorText = await updateResponse.text();
        console.error("Session update failed:");
        throw new Error(
          `Failed to update session tokens: ${updateResponse.status}`
        );
      } else {
        console.log("Session updated successfully with new tokens");
      }

      // Retry the original request with the new access token
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${updateAccessTokens.newAccessToken}`,
      };
      response = await fetch(url, options);

      return response;
    }
  } catch (error: Error | any) {
    console.log("error from the custom fetch", error);

    return JSON.stringify({ error: error.message });
  }
}
