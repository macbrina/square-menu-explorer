"use client";

import { useQuery } from "@tanstack/react-query";
import type { CatalogResponse } from "@/lib/types";
import { apiFetch } from "@/lib/api-fetch";

async function fetchCatalog(locationId: string): Promise<CatalogResponse> {
  const res = await apiFetch(
    `/api/catalog?location_id=${encodeURIComponent(locationId)}`,
  );
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? "Failed to fetch catalog.");
  }
  return res.json();
}

export function useCatalog(locationId: string | null) {
  return useQuery({
    queryKey: ["catalog", locationId],
    queryFn: () => fetchCatalog(locationId!),
    enabled: !!locationId,
  });
}
