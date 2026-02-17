import { describe, it, expect } from "vitest";
import { formatCurrency, cn } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats cents to USD string", () => {
    expect(formatCurrency(1250)).toBe("$12.50");
  });

  it("formats zero cents", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats large amounts", () => {
    expect(formatCurrency(999999)).toBe("$9,999.99");
  });

  it("formats single-digit cents", () => {
    expect(formatCurrency(5)).toBe("$0.05");
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "flex")).toBe("base flex");
  });
});
