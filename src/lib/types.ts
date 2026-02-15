// Client-facing types — these are what our API routes return,
// NOT the raw Square shapes (those are handled by Zod schemas).

export interface Location {
  id: string;
  name: string;
  address: LocationAddress | null;
  timezone: string;
  status: "ACTIVE" | "INACTIVE";
  capabilities: string[];
  currency: string;
  country: string;
  languageCode: string;
  businessName: string;
  merchantId: string;
  type: string;
  mcc: string;
  createdAt: string;
}

export interface LocationAddress {
  addressLine1?: string;
  locality?: string;
  administrativeDistrictLevel1?: string;
  postalCode?: string;
  country?: string;
}

export interface ItemVariation {
  id: string;
  name: string;
  priceCents: number;
  priceFormatted: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryId: string;
  imageUrl: string | null;
  variations: ItemVariation[];
}

export interface Category {
  id: string;
  name: string;
  itemCount: number;
}

export interface CatalogResponse {
  categories: string[];
  items: MenuItem[];
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
