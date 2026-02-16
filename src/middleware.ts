import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.API_KEY;

export function middleware(req: NextRequest) {
  // skip webhook — it has its own signature verification
  if (req.nextUrl.pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  // if no API_KEY is configured, skip auth (local dev)
  if (!API_KEY) return NextResponse.next();

  const key = req.headers.get("x-api-key");

  if (key !== API_KEY) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Invalid or missing API key." } },
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
