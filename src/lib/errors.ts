export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}

/**
 * Maps raw Square API errors into our ApiError shape.
 * Square sends errors as an array of { category, code, detail }.
 */
export function mapSquareError(
  status: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  squareErrors?: Array<{ code?: string; detail?: string; category?: string }>,
): ApiError {
  const first = squareErrors?.[0];

  const messageMap: Record<string, string> = {
    NOT_FOUND: "The requested resource was not found in Square.",
    UNAUTHORIZED: "Invalid or expired Square access token.",
    RATE_LIMITED: "Too many requests to Square. Please try again shortly.",
    INVALID_REQUEST_ERROR: "The request to Square was malformed.",
  };

  const code = first?.code ?? "SQUARE_API_ERROR";
  const message =
    messageMap[first?.category ?? ""] ??
    first?.detail ??
    "An unexpected error occurred with the Square API.";

  return new ApiError(status, code, message);
}
