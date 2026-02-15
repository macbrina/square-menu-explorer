import { NextRequest, NextResponse } from "next/server";
import { withLogging } from "@/lib/logger";
import { squareClient } from "@/lib/square-client";
import { cacheGet, cacheSet } from "@/lib/cache";
import { SquareSearchCatalogResponseSchema } from "@/lib/schemas";
import { ApiError } from "@/lib/errors";
import { formatCurrency } from "@/lib/utils";
import type { CatalogResponse, MenuItem } from "@/lib/types";
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

    const cacheKey = `catalog:${locationId}`;
    const cached = await cacheGet<CatalogResponse>(cacheKey);
    if (cached) return NextResponse.json(cached);

    // paginate through all catalog pages
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

    // build lookup maps from related objects
    const categoryMap = new Map<string, string>();
    const imageMap = new Map<string, string>();

    for (const obj of allRelated) {
      if (obj.type === "CATEGORY" && obj.category_data?.name) {
        categoryMap.set(obj.id, obj.category_data.name);
      }
      if (obj.type === "IMAGE" && obj.image_data?.url) {
        imageMap.set(obj.id, obj.image_data.url);
      }
    }

    // filter by location, then transform into our clean shape
    const items: MenuItem[] = allObjects
      .filter((obj) => obj.type === "ITEM" && isPresentAtLocation(obj, locationId))
      .map((obj) => {
        const item = obj.item_data!;
        const catId = item.categories?.[0]?.id ?? item.category_id;
        const categoryName = catId
          ? categoryMap.get(catId) ?? "Uncategorized"
          : "Uncategorized";

        const imageUrl =
          item.image_ids?.map((id) => imageMap.get(id)).find((url) => !!url) ?? null;

        const variations = (item.variations ?? []).map((v) => {
          const vData = v.item_variation_data;
          const priceCents = vData?.price_money?.amount ?? 0;
          return {
            id: v.id,
            name: vData?.name ?? "Regular",
            priceCents,
            priceFormatted: formatCurrency(priceCents, vData?.price_money?.currency),
          };
        });

        return {
          id: obj.id,
          name: item.name ?? "Untitled",
          description: item.description_plaintext ?? item.description ?? "",
          category: categoryName,
          categoryId: catId ?? "",
          imageUrl,
          variations,
        };
      });

    items.sort((a, b) => a.category.localeCompare(b.category));
    const categories = [...new Set(items.map((i) => i.category))];
    const result: CatalogResponse = { categories, items };

    await cacheSet(cacheKey, result, CACHE_TTL);
    return NextResponse.json(result);
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
