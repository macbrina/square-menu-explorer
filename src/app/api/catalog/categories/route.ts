import { NextRequest, NextResponse } from "next/server";
import { withLogging } from "@/lib/logger";
import { squareClient } from "@/lib/square-client";
import { cacheGet, cacheSet } from "@/lib/cache";
import { SquareSearchCatalogResponseSchema } from "@/lib/schemas";
import { ApiError } from "@/lib/errors";
import type { Category } from "@/lib/types";
import { z } from "zod";

const CACHE_TTL = 300;

type CatalogObject = z.infer<typeof SquareSearchCatalogResponseSchema>["objects"][number];

function isPresentAtLocation(obj: CatalogObject, locationId: string): boolean {
  if (obj.present_at_all_locations) return true;
  return obj.present_at_location_ids?.includes(locationId) ?? false;
}

export const GET = withLogging(async (req: NextRequest) => {
  try {
    const locationId = req.nextUrl.searchParams.get("location_id");
    if (!locationId) {
      throw new ApiError(400, "MISSING_PARAM", "location_id is required.");
    }

    const cacheKey = `categories:${locationId}`;
    const cached = await cacheGet<Category[]>(cacheKey);
    if (cached) return NextResponse.json(cached);

    let allObjects: CatalogObject[] = [];
    let allRelated: CatalogObject[] = [];
    let cursor: string | undefined;

    do {
      const { data } = await squareClient.post("/catalog/search", {
        object_types: ["ITEM", "CATEGORY"],
        include_related_objects: true,
        ...(cursor ? { cursor } : {}),
      });

      const parsed = SquareSearchCatalogResponseSchema.safeParse(data);
      if (!parsed.success) {
        throw new ApiError(502, "INVALID_UPSTREAM_RESPONSE", "Malformed data from Square Catalog API.");
      }

      allObjects = [...allObjects, ...parsed.data.objects];
      allRelated = [...allRelated, ...parsed.data.related_objects, ...parsed.data.objects];
      cursor = parsed.data.cursor;
    } while (cursor);

    // category id → name
    const nameMap = new Map<string, string>();
    for (const obj of allRelated) {
      if (obj.type === "CATEGORY" && obj.category_data?.name) {
        nameMap.set(obj.id, obj.category_data.name);
      }
    }

    // count items per category at this location
    const countMap = new Map<string, number>();
    for (const obj of allObjects) {
      if (obj.type !== "ITEM" || !isPresentAtLocation(obj, locationId)) continue;
      const catId = obj.item_data?.categories?.[0]?.id ?? obj.item_data?.category_id ?? "uncategorized";
      countMap.set(catId, (countMap.get(catId) ?? 0) + 1);
    }

    const categories: Category[] = Array.from(countMap.entries()).map(([catId, count]) => ({
      id: catId,
      name: nameMap.get(catId) ?? "Uncategorized",
      itemCount: count,
    }));

    categories.sort((a, b) => a.name.localeCompare(b.name));
    await cacheSet(cacheKey, categories, CACHE_TTL);

    return NextResponse.json(categories);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(err.toJSON(), { status: err.status });
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong." } },
      { status: 500 },
    );
  }
});
