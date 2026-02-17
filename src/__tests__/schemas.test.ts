import { describe, it, expect } from "vitest";
import {
  SquareListLocationsResponseSchema,
  SquareSearchCatalogResponseSchema,
  SquareLocationSchema,
} from "@/lib/schemas";

describe("SquareLocationSchema", () => {
  it("parses a valid location", () => {
    const result = SquareLocationSchema.safeParse({
      id: "LOC123",
      name: "Main Street Cafe",
      address: {
        address_line_1: "123 Main St",
        locality: "Brooklyn",
        administrative_district_level_1: "NY",
        postal_code: "11201",
        country: "US",
      },
      timezone: "America/New_York",
      status: "ACTIVE",
    });
    expect(result.success).toBe(true);
  });

  it("defaults status to ACTIVE when missing", () => {
    const result = SquareLocationSchema.parse({ id: "LOC123", name: "Test" });
    expect(result.status).toBe("ACTIVE");
  });

  it("fails on missing required fields", () => {
    const result = SquareLocationSchema.safeParse({ name: "Test" });
    expect(result.success).toBe(false);
  });
});

describe("SquareListLocationsResponseSchema", () => {
  it("parses a response with locations", () => {
    const result = SquareListLocationsResponseSchema.safeParse({
      locations: [
        { id: "LOC1", name: "Cafe A", status: "ACTIVE" },
        { id: "LOC2", name: "Cafe B", status: "INACTIVE" },
      ],
    });
    expect(result.success).toBe(true);
    expect(result.data?.locations).toHaveLength(2);
  });

  it("defaults to empty array when locations missing", () => {
    const result = SquareListLocationsResponseSchema.parse({});
    expect(result.locations).toEqual([]);
  });
});

describe("SquareSearchCatalogResponseSchema", () => {
  it("parses a catalog search response with related objects", () => {
    const result = SquareSearchCatalogResponseSchema.safeParse({
      objects: [
        {
          type: "ITEM",
          id: "ITEM1",
          present_at_all_locations: true,
          item_data: {
            name: "Espresso",
            description: "Strong coffee",
            category_id: "CAT1",
            variations: [
              {
                type: "ITEM_VARIATION",
                id: "VAR1",
                item_variation_data: {
                  name: "Regular",
                  price_money: { amount: 350, currency: "USD" },
                },
              },
            ],
          },
        },
      ],
      related_objects: [
        { type: "CATEGORY", id: "CAT1", category_data: { name: "Coffee" } },
      ],
    });
    expect(result.success).toBe(true);
    expect(result.data?.objects).toHaveLength(1);
    expect(result.data?.related_objects).toHaveLength(1);
  });

  it("defaults to empty arrays when fields missing", () => {
    const result = SquareSearchCatalogResponseSchema.parse({});
    expect(result.objects).toEqual([]);
    expect(result.related_objects).toEqual([]);
    expect(result.cursor).toBeUndefined();
  });

  it("captures cursor for pagination", () => {
    const result = SquareSearchCatalogResponseSchema.parse({
      objects: [],
      cursor: "abc123",
    });
    expect(result.cursor).toBe("abc123");
  });
});
