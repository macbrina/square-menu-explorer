"use client";

import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/lib/types";
import { apiFetch } from "@/lib/api-fetch";

async function fetchCategories(locationId: string): Promise<Category[]> {
  const res = await apiFetch(
    `/api/catalog/categories?location_id=${encodeURIComponent(locationId)}`,
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? "Failed to fetch categories.");
  }
  return res.json();
}

export function useCategories(locationId: string | null) {
  return useQuery({
    queryKey: ["categories", locationId],
    queryFn: () => fetchCategories(locationId!),
    enabled: !!locationId,
  });
}
