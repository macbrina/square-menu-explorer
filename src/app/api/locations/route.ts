import { NextResponse } from "next/server";
import { withLogging } from "@/lib/logger";
import { squareClient } from "@/lib/square-client";
import { cacheGet, cacheSet } from "@/lib/cache";
import { SquareListLocationsResponseSchema } from "@/lib/schemas";
import { ApiError } from "@/lib/errors";
import type { Location } from "@/lib/types";

const CACHE_KEY = "locations";
const CACHE_TTL = 300;

export const GET = withLogging(async () => {
  try {
    const cached = await cacheGet<Location[]>(CACHE_KEY);
    if (cached) return NextResponse.json(cached);

    const { data } = await squareClient.get("/locations");

    const parsed = SquareListLocationsResponseSchema.safeParse(data);
    if (!parsed.success) {
      throw new ApiError(502, "INVALID_UPSTREAM_RESPONSE", "Malformed data from Square Locations API.");
    }

    const locations: Location[] = parsed.data.locations
      .filter((loc) => loc.status === "ACTIVE")
      .map((loc) => ({
        id: loc.id,
        name: loc.name,
        address: loc.address
          ? {
              addressLine1: loc.address.address_line_1,
              locality: loc.address.locality,
              administrativeDistrictLevel1: loc.address.administrative_district_level_1,
              postalCode: loc.address.postal_code,
              country: loc.address.country,
            }
          : null,
        timezone: loc.timezone ?? "",
        status: loc.status,
        capabilities: loc.capabilities,
        currency: loc.currency ?? "USD",
        country: loc.country ?? "",
        languageCode: loc.language_code ?? "",
        businessName: loc.business_name ?? loc.name,
        merchantId: loc.merchant_id ?? "",
        type: loc.type ?? "",
        mcc: loc.mcc ?? "",
        createdAt: loc.created_at ?? "",
      }));

    await cacheSet(CACHE_KEY, locations, CACHE_TTL);
    return NextResponse.json(locations);
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
