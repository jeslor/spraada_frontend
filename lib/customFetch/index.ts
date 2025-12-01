import { getSession } from "../session/session";
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

      const access_token = await getNewRefreshAndAccessToken(
        session.refreshToken,
        session.user.email,
        Number(session.user.id)
      );

      if (access_token instanceof Error) {
        throw new Error("Failed to refresh tokens: " + access_token);
      }

      // Retry the original request with the new access token
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${access_token.access_token}`,
      };
      response = await fetch(url, options);

      return response;
    }
  } catch (error: Error | any) {
    console.log("error from the custom fetch", error);

    return JSON.stringify({ error: error.message });
  }
}
