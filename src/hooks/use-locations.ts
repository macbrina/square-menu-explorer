"use client";

import { useQuery } from "@tanstack/react-query";
import type { Location } from "@/lib/types";
import { apiFetch } from "@/lib/api-fetch";

async function fetchLocations(): Promise<Location[]> {
  const res = await apiFetch("/api/locations");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? "Failed to fetch locations.");
  }
  return res.json();
}

export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
}
