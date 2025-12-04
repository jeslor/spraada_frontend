import customFetch from "@/lib/customFetch";
import { deleteSession, getSession } from "@/lib/session/session";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: Response) {
  try {
    const session = await getSession();

    if (!session) {
      return new Response(JSON.stringify({ error: "No active session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const response = await customFetch(
      `${process.env.BACKEND_API_URL}/auth/sign-out`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to sign out from backend:", await response.text());
      return new Response(
        JSON.stringify({ error: "Failed to sign out from the backend" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await deleteSession();

    revalidatePath("/");
    return NextResponse.redirect(new URL("/", req.url));
  } catch (error: any) {
    console.error("Error during sign out:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
