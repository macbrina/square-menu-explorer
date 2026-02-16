import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { cacheInvalidate } from "@/lib/cache";

const SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ?? "";
const NOTIFICATION_URL =
  (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000") +
  "/api/webhooks/square";

function isValidSignature(
  rawBody: string,
  signatureHeader: string | null,
): boolean {
  if (!SIGNATURE_KEY) return true; // skip verification if no key configured
  if (!signatureHeader) return false;

  const hmac = crypto.createHmac("sha256", SIGNATURE_KEY);
  hmac.update(NOTIFICATION_URL + rawBody);
  const expected = hmac.digest("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signatureHeader),
    );
  } catch {
    return false; // length mismatch
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature");

    if (!isValidSignature(rawBody, signature)) {
      console.warn("[webhook] Invalid signature — rejecting request");
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Invalid webhook signature." } },
        { status: 403 },
      );
    }

    const body = JSON.parse(rawBody);
    const eventType: string = body?.type ?? "";

    console.log(`[webhook] Square event: ${eventType}`);

    if (eventType === "catalog.version.updated") {
      const catalog = await cacheInvalidate("catalog:*");
      const categories = await cacheInvalidate("categories:*");
      console.log(`[webhook] busted ${catalog} catalog + ${categories} category keys`);

      return NextResponse.json({ ok: true, invalidated: { catalog, categories } });
    }

    return NextResponse.json({ ok: true, message: "Event ignored." });
  } catch (err) {
    console.error("[webhook] Error:", err);
    return NextResponse.json(
      { error: { code: "WEBHOOK_ERROR", message: "Failed to process event." } },
      { status: 500 },
    );
  }
}
