import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

describe("API key middleware", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  async function loadMiddleware(apiKey?: string) {
    if (apiKey) {
      vi.stubEnv("API_KEY", apiKey);
    } else {
      vi.stubEnv("API_KEY", "");
    }
    const mod = await import("@/middleware");
    return mod.middleware;
  }

  function makeRequest(path: string, apiKey?: string): NextRequest {
    const headers = new Headers();
    if (apiKey) headers.set("x-api-key", apiKey);
    return new NextRequest(new URL(path, "http://localhost:3000"), { headers });
  }

  it("returns 401 when API key is missing", async () => {
    const middleware = await loadMiddleware("secret123");
    const res = middleware(makeRequest("/api/locations"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("returns 401 when API key is wrong", async () => {
    const middleware = await loadMiddleware("secret123");
    const res = middleware(makeRequest("/api/locations", "wrongkey"));
    expect(res.status).toBe(401);
  });

  it("passes through with correct API key", async () => {
    const middleware = await loadMiddleware("secret123");
    const res = middleware(makeRequest("/api/locations", "secret123"));
    expect(res.status).toBe(200);
  });

  it("skips auth when no API_KEY is configured", async () => {
    const middleware = await loadMiddleware();
    const res = middleware(makeRequest("/api/locations"));
    expect(res.status).toBe(200);
  });

  it("skips auth for webhook routes", async () => {
    const middleware = await loadMiddleware("secret123");
    const res = middleware(makeRequest("/api/webhooks/square"));
    expect(res.status).toBe(200);
  });
});
