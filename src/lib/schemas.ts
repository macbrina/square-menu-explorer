import { z } from "zod";

// -- Locations --

export const SquareAddressSchema = z.object({
  address_line_1: z.string().optional(),
  locality: z.string().optional(),
  administrative_district_level_1: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});

export const SquareLocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: SquareAddressSchema.optional(),
  timezone: z.string().optional(),
  capabilities: z.array(z.string()).default([]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  created_at: z.string().optional(),
  merchant_id: z.string().optional(),
  country: z.string().optional(),
  language_code: z.string().optional(),
  currency: z.string().optional(),
  business_name: z.string().optional(),
  type: z.string().optional(),
  business_hours: z.record(z.string(), z.unknown()).optional(),
  mcc: z.string().optional(),
});

export const SquareListLocationsResponseSchema = z.object({
  locations: z.array(SquareLocationSchema).default([]),
});

// -- Catalog --

export const SquareMoneySchema = z.object({
  amount: z.number(),
  currency: z.string().default("USD"),
});

export const SquareItemVariationDataSchema = z.object({
  name: z.string().default("Regular"),
  price_money: SquareMoneySchema.optional(),
});

export const SquareCatalogObjectSchema = z.object({
  type: z.string(),
  id: z.string(),
  present_at_all_locations: z.boolean().optional(),
  present_at_location_ids: z.array(z.string()).optional(),
  item_data: z
    .object({
      name: z.string().optional(),
      description: z.string().optional(),
      description_plaintext: z.string().optional(),
      category_id: z.string().optional(),
      categories: z.array(z.object({ id: z.string() })).optional(),
      image_ids: z.array(z.string()).optional(),
      variations: z
        .array(
          z.object({
            type: z.string(),
            id: z.string(),
            item_variation_data: SquareItemVariationDataSchema.optional(),
          }),
        )
        .optional(),
    })
    .optional(),
  category_data: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  image_data: z
    .object({
      url: z.string().optional(),
    })
    .optional(),
});

export const SquareSearchCatalogResponseSchema = z.object({
  objects: z.array(SquareCatalogObjectSchema).default([]),
  related_objects: z.array(SquareCatalogObjectSchema).default([]),
  cursor: z.string().optional(),
});
