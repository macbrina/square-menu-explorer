import { http, HttpResponse } from "msw";
import type { Location, CatalogResponse, Category } from "@/lib/types";

const mockLocations: Location[] = [
  {
    id: "LOC1",
    name: "Downtown Cafe",
    address: {
      addressLine1: "123 Main St",
      locality: "Brooklyn",
      administrativeDistrictLevel1: "NY",
      postalCode: "11201",
      country: "US",
    },
    timezone: "America/New_York",
    status: "ACTIVE",
    capabilities: ["CREDIT_CARD_PROCESSING"],
    currency: "USD",
    country: "US",
    languageCode: "en-US",
    businessName: "Downtown Cafe",
    merchantId: "M123",
    type: "PHYSICAL",
    mcc: "7299",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "LOC2",
    name: "Uptown Bistro",
    address: {
      addressLine1: "456 Broadway",
      locality: "Manhattan",
      administrativeDistrictLevel1: "NY",
      postalCode: "10001",
      country: "US",
    },
    timezone: "America/New_York",
    status: "ACTIVE",
    capabilities: ["CREDIT_CARD_PROCESSING", "AUTOMATIC_TRANSFERS"],
    currency: "USD",
    country: "US",
    languageCode: "en-US",
    businessName: "Uptown Bistro",
    merchantId: "M456",
    type: "PHYSICAL",
    mcc: "7299",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

const mockCategories: Category[] = [
  { id: "CAT1", name: "Coffee", itemCount: 2 },
  { id: "CAT2", name: "Pastries", itemCount: 1 },
];

const mockCatalog: CatalogResponse = {
  categories: ["Coffee", "Pastries"],
  items: [
    {
      id: "ITEM1",
      name: "Espresso",
      description: "A strong, concentrated coffee shot.",
      category: "Coffee",
      categoryId: "CAT1",
      imageUrl: null,
      variations: [
        { id: "VAR1", name: "Single", priceCents: 350, priceFormatted: "$3.50" },
        { id: "VAR2", name: "Double", priceCents: 450, priceFormatted: "$4.50" },
      ],
    },
    {
      id: "ITEM2",
      name: "Cappuccino",
      description: "Espresso with steamed milk foam.",
      category: "Coffee",
      categoryId: "CAT1",
      imageUrl: null,
      variations: [
        { id: "VAR3", name: "Regular", priceCents: 500, priceFormatted: "$5.00" },
      ],
    },
    {
      id: "ITEM3",
      name: "Croissant",
      description: "Buttery, flaky French pastry.",
      category: "Pastries",
      categoryId: "CAT2",
      imageUrl: null,
      variations: [
        { id: "VAR4", name: "Regular", priceCents: 400, priceFormatted: "$4.00" },
      ],
    },
  ],
};

export const handlers = [
  http.get("/api/locations", () => HttpResponse.json(mockLocations)),
  http.get("/api/catalog/categories", () => HttpResponse.json(mockCategories)),
  http.get("/api/catalog", () => HttpResponse.json(mockCatalog)),
];
