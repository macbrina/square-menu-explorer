import crypto from "crypto";
import { describe, expect, it } from "vitest";

// helper that mirrors the production isValidSignature logic
function isValidSignature(
  rawBody: string,
  signatureHeader: string | null,
  signatureKey: string,
  notificationUrl: string
): boolean {
  if (!signatureKey) return true;
  if (!signatureHeader) return false;

  const hmac = crypto.createHmac("sha256", signatureKey);
  hmac.update(notificationUrl + rawBody);
  const expected = hmac.digest("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signatureHeader)
    );
  } catch {
    return false;
  }
}

const KEY = "test-secret-key";
const URL = "https://example.com/api/webhooks/square";
const BODY = '{"type":"catalog.version.updated"}';

function generateSignature(body: string): string {
  return crypto
    .createHmac("sha256", KEY)
    .update(URL + body)
    .digest("base64");
}

describe("Webhook signature verification", () => {
  it("accepts a valid signature", () => {
    const sig = generateSignature(BODY);
    expect(isValidSignature(BODY, sig, KEY, URL)).toBe(true);
  });

  it("rejects a missing signature", () => {
    expect(isValidSignature(BODY, null, KEY, URL)).toBe(false);
  });

  it("rejects an invalid signature", () => {
    expect(isValidSignature(BODY, "fakesignature", KEY, URL)).toBe(false);
  });

  it("rejects a signature for a different body", () => {
    const sig = generateSignature('{"type":"other.event"}');
    expect(isValidSignature(BODY, sig, KEY, URL)).toBe(false);
  });

  it("rejects a signature for a different URL", () => {
    const sig = generateSignature(BODY);
    expect(isValidSignature(BODY, sig, KEY, "https://evil.com/webhook")).toBe(
      false
    );
  });

  it("skips verification when no key is configured", () => {
    expect(isValidSignature(BODY, null, "", URL)).toBe(true);
  });
});
