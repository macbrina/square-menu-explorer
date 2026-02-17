// Populates the Square sandbox with sample menu data + images.
// Run: npm run seed

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import axios from "axios";
import crypto from "crypto";
import FormData from "form-data";

const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const BASE =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com/v2"
    : "https://connect.squareupsandbox.com/v2";

if (!TOKEN) {
  console.error("Missing SQUARE_ACCESS_TOKEN in .env.local");
  process.exit(1);
}

const api = axios.create({
  baseURL: BASE,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

const uid = () => `#${crypto.randomUUID().slice(0, 8)}`;

// Map item names to curated Unsplash photo URLs
const ITEM_PHOTOS: Record<string, string> = {
  Espresso:
    "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop&q=80",
  Cappuccino:
    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&q=80",
  "Cold Brew":
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&q=80",
  "Oat Milk Latte":
    "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop&q=80",
  "Butter Croissant":
    "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=400&h=300&fit=crop&q=80",
  "Blueberry Muffin":
    "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=300&fit=crop&q=80",
  "Chocolate Babka":
    "https://images.unsplash.com/photo-1509365390695-33aee754301f?w=400&h=300&fit=crop&q=80",
  "Turkey Avocado Club":
    "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=400&h=300&fit=crop&q=80",
  "Caprese Panini":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&q=80",
  "Tropical Mango":
    "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop&q=80",
  "Berry Blast":
    "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop&q=80",
  "Green Detox":
    "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=300&fit=crop&q=80",
};

/** Delete all existing catalog objects so we start fresh. */
async function cleanCatalog() {
  console.log("Cleaning existing catalog...");

  // collect all object IDs across both types
  const ids: string[] = [];

  for (const type of ["ITEM", "CATEGORY", "IMAGE"]) {
    let cursor: string | undefined;
    do {
      const { data } = await api.post("/catalog/search", {
        object_types: [type],
        ...(cursor ? { cursor } : {}),
      });
      for (const obj of data.objects ?? []) {
        ids.push(obj.id);
      }
      cursor = data.cursor;
    } while (cursor);
  }

  if (ids.length === 0) {
    console.log("Nothing to clean.\n");
    return;
  }

  await api.post("/catalog/batch-delete", { object_ids: ids });
  console.log(`Deleted ${ids.length} objects.\n`);
}

async function seed() {
  console.log(`Seeding catalog at ${BASE}...\n`);

  await cleanCatalog();

  const catCoffee = uid();
  const catPastries = uid();
  const catSandwiches = uid();
  const catSmoothies = uid();

  const batches = [
    { type: "CATEGORY", id: catCoffee, category_data: { name: "Coffee" } },
    { type: "CATEGORY", id: catPastries, category_data: { name: "Pastries" } },
    { type: "CATEGORY", id: catSandwiches, category_data: { name: "Sandwiches" } },
    { type: "CATEGORY", id: catSmoothies, category_data: { name: "Smoothies" } },

    // coffee
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Espresso",
        description: "A bold, concentrated shot of rich Italian-style coffee.",
        categories: [{ id: catCoffee }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Single", pricing_type: "FIXED_PRICING", price_money: { amount: 350, currency: "USD" } } },
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Double", pricing_type: "FIXED_PRICING", price_money: { amount: 450, currency: "USD" } } },
        ],
      },
    },
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Cappuccino",
        description: "Espresso topped with velvety steamed milk foam. A classic morning pick-me-up.",
        categories: [{ id: catCoffee }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Small", pricing_type: "FIXED_PRICING", price_money: { amount: 450, currency: "USD" } } },
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Large", pricing_type: "FIXED_PRICING", price_money: { amount: 550, currency: "USD" } } },
        ],
      },
    },
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Cold Brew",
        description: "Slow-steeped for 18 hours, smooth and naturally sweet with low acidity.",
        categories: [{ id: catCoffee }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Regular", pricing_type: "FIXED_PRICING", price_money: { amount: 500, currency: "USD" } } },
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Large", pricing_type: "FIXED_PRICING", price_money: { amount: 600, currency: "USD" } } },
        ],
      },
    },
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Oat Milk Latte",
        description: "Creamy oat milk and espresso, lightly sweetened with vanilla.",
        categories: [{ id: catCoffee }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Regular", pricing_type: "FIXED_PRICING", price_money: { amount: 575, currency: "USD" } } },
        ],
      },
    },

    // pastries
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Butter Croissant",
        description: "Flaky, golden layers of French-style pastry made with real butter.",
        categories: [{ id: catPastries }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Regular", pricing_type: "FIXED_PRICING", price_money: { amount: 395, currency: "USD" } } },
        ],
      },
    },
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Blueberry Muffin",
        description: "Moist, fluffy muffin packed with fresh blueberries and a crumble topping.",
        categories: [{ id: catPastries }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Regular", pricing_type: "FIXED_PRICING", price_money: { amount: 375, currency: "USD" } } },
        ],
      },
    },
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Chocolate Babka",
        description: "Swirled chocolate brioche, baked to perfection. Rich and decadent.",
        categories: [{ id: catPastries }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Slice", pricing_type: "FIXED_PRICING", price_money: { amount: 495, currency: "USD" } } },
        ],
      },
    },

    // sandwiches
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Turkey Avocado Club",
        description: "Smoked turkey, avocado, bacon, lettuce, and tomato on sourdough.",
        categories: [{ id: catSandwiches }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Half", pricing_type: "FIXED_PRICING", price_money: { amount: 850, currency: "USD" } } },
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Whole", pricing_type: "FIXED_PRICING", price_money: { amount: 1250, currency: "USD" } } },
        ],
      },
    },
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Caprese Panini",
        description: "Fresh mozzarella, tomato, basil, and balsamic glaze on ciabatta.",
        categories: [{ id: catSandwiches }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Regular", pricing_type: "FIXED_PRICING", price_money: { amount: 1095, currency: "USD" } } },
        ],
      },
    },

    // smoothies
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Tropical Mango",
        description: "Mango, pineapple, banana, and coconut milk blended until smooth.",
        categories: [{ id: catSmoothies }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Small", pricing_type: "FIXED_PRICING", price_money: { amount: 650, currency: "USD" } } },
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Large", pricing_type: "FIXED_PRICING", price_money: { amount: 850, currency: "USD" } } },
        ],
      },
    },
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Berry Blast",
        description: "Strawberries, blueberries, raspberries, Greek yogurt, and honey.",
        categories: [{ id: catSmoothies }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Small", pricing_type: "FIXED_PRICING", price_money: { amount: 700, currency: "USD" } } },
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Large", pricing_type: "FIXED_PRICING", price_money: { amount: 900, currency: "USD" } } },
        ],
      },
    },
    {
      type: "ITEM",
      id: uid(),
      present_at_all_locations: true,
      item_data: {
        name: "Green Detox",
        description: "Spinach, kale, apple, ginger, and lemon. Fresh and energizing.",
        categories: [{ id: catSmoothies }],
        variations: [
          { type: "ITEM_VARIATION", id: uid(), item_variation_data: { name: "Regular", pricing_type: "FIXED_PRICING", price_money: { amount: 750, currency: "USD" } } },
        ],
      },
    },
  ];

  try {
    const { data } = await api.post("/catalog/batch-upsert", {
      idempotency_key: crypto.randomUUID(),
      batches: [{ objects: batches }],
    });

    const created = data.objects?.length ?? 0;
    console.log(`Created ${created} catalog objects.`);
    console.log(
      "\nCategories:",
      data.objects
        ?.filter((o: { type: string }) => o.type === "CATEGORY")
        .map((o: { category_data?: { name?: string } }) => o.category_data?.name)
        .join(", "),
    );

    const items = data.objects?.filter(
      (o: { type: string }) => o.type === "ITEM",
    ) as { id: string; item_data?: { name?: string } }[];

    console.log(
      "Items:",
      items.map((o) => o.item_data?.name).join(", "),
    );

    // upload images for each item
    console.log("\nUploading product images...");
    let uploaded = 0;

    for (const item of items) {
      const name = item.item_data?.name ?? "";
      const photoUrl = ITEM_PHOTOS[name];
      if (!photoUrl) continue;

      try {
        // download the photo
        const imgRes = await axios.get(photoUrl, {
          responseType: "arraybuffer",
          timeout: 15_000,
        });
        const buffer = Buffer.from(imgRes.data);

        // build multipart form
        const form = new FormData();
        form.append(
          "request",
          JSON.stringify({
            idempotency_key: crypto.randomUUID(),
            object_id: item.id,
            image: {
              type: "IMAGE",
              id: `#img-${crypto.randomUUID().slice(0, 8)}`,
              image_data: { caption: name },
            },
          }),
        );
        form.append("file", buffer, {
          filename: `${name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
          contentType: "image/jpeg",
        });

        await axios.post(`${BASE}/catalog/images`, form, {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${TOKEN}`,
          },
          timeout: 30_000,
        });

        uploaded++;
        console.log(`  ✓ ${name}`);
      } catch (imgErr) {
        const msg =
          axios.isAxiosError(imgErr)
            ? imgErr.response?.data?.toString().slice(0, 200) ?? imgErr.message
            : String(imgErr);
        console.warn(`  ✗ ${name}: ${msg}`);
      }
    }

    console.log(`\nUploaded ${uploaded}/${items.length} images.`);
    console.log("Done! Sandbox catalog is ready.");
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Square API error:", JSON.stringify(err.response?.data, null, 2));
    } else {
      console.error("Error:", err);
    }
    process.exit(1);
  }
}

seed();
