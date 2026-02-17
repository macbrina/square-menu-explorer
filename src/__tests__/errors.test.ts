import { describe, it, expect } from "vitest";
import { ApiError, mapSquareError } from "@/lib/errors";

describe("ApiError", () => {
  it("serializes to JSON correctly", () => {
    const err = new ApiError(404, "NOT_FOUND", "Item not found");
    expect(err.toJSON()).toEqual({
      error: { code: "NOT_FOUND", message: "Item not found" },
    });
  });

  it("has correct status and code properties", () => {
    const err = new ApiError(500, "INTERNAL", "Server error");
    expect(err.status).toBe(500);
    expect(err.code).toBe("INTERNAL");
    expect(err.message).toBe("Server error");
    expect(err.name).toBe("ApiError");
  });
});

describe("mapSquareError", () => {
  it("maps a Square error with detail", () => {
    const err = mapSquareError(400, [
      { code: "INVALID_VALUE", detail: "Bad field value" },
    ]);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(400);
    expect(err.code).toBe("INVALID_VALUE");
    expect(err.message).toBe("Bad field value");
  });

  it("maps UNAUTHORIZED category to friendly message", () => {
    const err = mapSquareError(401, [
      { category: "UNAUTHORIZED", code: "ACCESS_TOKEN_EXPIRED" },
    ]);
    expect(err.message).toBe("Invalid or expired Square access token.");
  });

  it("maps RATE_LIMITED category", () => {
    const err = mapSquareError(429, [
      { category: "RATE_LIMITED", code: "RATE_LIMITED" },
    ]);
    expect(err.message).toBe("Too many requests to Square. Please try again shortly.");
  });

  it("falls back to default message when no errors given", () => {
    const err = mapSquareError(500);
    expect(err.code).toBe("SQUARE_API_ERROR");
    expect(err.message).toBe("An unexpected error occurred with the Square API.");
  });
});
