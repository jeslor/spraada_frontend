"use server";
import { getSession, updateTokensInSession } from "../session/session";
import { getNewRefreshAndAccessToken } from "../actions/Auth.actions";
import { url } from "inspector";

export interface CustomFetchOptions extends RequestInit {
  // You can add custom options here if needed
  headers?: Record<string, string>;
}

export interface FetchResult {
  ok: boolean;
  status: number;
  data: any;
  error?: string;
}

export default async function customFetch(
  url: string | URL,
  options: CustomFetchOptions = {}
): Promise<FetchResult> {
  try {
    const session = await getSession();
    if (!session) {
      return { ok: false, status: 401, data: null, error: "unauthorized" };
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
        return {
          ok: false,
          status: 401,
          data: null,
          error: "No refresh token available",
        };
      }

      //get new access and refresh tokens
      const updateAccessTokens = await getNewRefreshAndAccessToken(
        session.refreshToken,
        session.user.email,
        Number(session.user.id)
      );

      if (!updateAccessTokens || updateAccessTokens instanceof Error) {
        return {
          ok: false,
          status: 401,
          data: null,
          error: "Failed to refresh tokens",
        };
      }
      // Retry the original request with the new access token
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${updateAccessTokens.newAccessToken}`,
      };

      response = await fetch(url, options);
    }

    // Parse response body
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (e) {
        data = null;
      }
    } else {
      data = await response.text();
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error: Error | any) {
    console.log("error from the custom fetch", error);

    return {
      ok: false,
      status: 500,
      data: null,
      error: error.message || "Internal Server Error",
    };
  }
}

export const normalCustomFetch = async (
  URL: string,
  options: CustomFetchOptions = {}
) => {
  try {
    let response = await fetch(URL, options);
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch (e) {
        data = null;
      }
    } else {
      data = await response.text();
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.log("error from the normal custom fetch", error);

    return {
      ok: false,
      status: 500,
      data: null,
      error: (error as Error).message || "Internal Server Error",
    };
  }
};

// Update refresh and access tokens via API route
