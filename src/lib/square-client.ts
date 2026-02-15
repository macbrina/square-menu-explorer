import axios from "axios";
import { mapSquareError } from "./errors";

function getBaseUrl(): string {
  const env = process.env.SQUARE_ENVIRONMENT ?? "sandbox";
  return env === "production"
    ? "https://connect.squareup.com/v2"
    : "https://connect.squareupsandbox.com/v2";
}

export const squareClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15_000,
});

// inject auth token
squareClient.interceptors.request.use((config) => {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) throw new Error("SQUARE_ACCESS_TOKEN is not configured.");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// map Square errors to our ApiError so we never leak raw Square stuff to the client
squareClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      throw mapSquareError(status, error.response?.data?.errors);
    }
    throw mapSquareError(503, [
      { code: "NETWORK_ERROR", detail: error.message ?? "Unable to reach Square." },
    ]);
  },
);
