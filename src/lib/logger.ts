import { NextRequest, NextResponse } from "next/server";

type RouteHandler = (req: NextRequest) => Promise<NextResponse> | NextResponse;

/** Wraps a route handler with basic request logging (method, path, status, duration). */
export function withLogging(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest) => {
    const start = performance.now();
    const { method } = req;
    const path = new URL(req.url).pathname;

    try {
      const res = await handler(req);
      console.log(`[api] ${method} ${path} → ${res.status} (${(performance.now() - start).toFixed(1)}ms)`);
      return res;
    } catch (err) {
      console.error(`[api] ${method} ${path} → 500 (${(performance.now() - start).toFixed(1)}ms)`, err);
      throw err;
    }
  };
}
