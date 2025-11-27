import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session/session";

export const proxy = async (req: NextRequest, targetUrl: string) => {
  const session = await getSession();
  console.log(session);

  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  NextResponse.next();
};

export const config = {
  matcher: ["/profile/:path*", "/api/:path*"],
};
