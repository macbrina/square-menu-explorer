"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/lib/types";

export type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export interface Filters {
  priceRange: [number, number];
  sort: SortOption;
  sizes: string[];
}

export const DEFAULT_FILTERS: Filters = {
  priceRange: [0, 0],
  sort: "name-asc",
  sizes: [],
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

interface FilterSheetProps {
  items: MenuItem[];
  filters: Filters;
  onApply: (filters: Filters) => void;
}

export function getActiveFilterCount(filters: Filters): number {
  let count = 0;
  const [lo, hi] = filters.priceRange;
  if (lo > 0 || hi > 0) count++;
  if (filters.sort !== "name-asc") count++;
  if (filters.sizes.length > 0) count++;
  return count;
}

export function FilterSheet({ items, filters, onApply }: FilterSheetProps) {
  const [open, setOpen] = useState(false);

  // derive price bounds and available sizes from current items
  const { minPrice, maxPrice, allSizes } = useMemo(() => {
    let min = Infinity;
    let max = 0;
    const sizeSet = new Set<string>();

    for (const item of items) {
      for (const v of item.variations) {
        if (v.priceCents < min) min = v.priceCents;
        if (v.priceCents > max) max = v.priceCents;
        sizeSet.add(v.name);
      }
    }

    return {
      minPrice: min === Infinity ? 0 : min,
      maxPrice: max,
      allSizes: Array.from(sizeSet).sort(),
    };
  }, [items]);

  // local draft state (only committed on Apply)
  const [draft, setDraft] = useState<Filters>(filters);

  // sync draft when sheet opens
  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setDraft(filters);
    setOpen(isOpen);
  };

  const handleReset = () => {
    setDraft(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  const toggleSize = (size: string) => {
    setDraft((d) => ({
      ...d,
      sizes: d.sizes.includes(size)
        ? d.sizes.filter((s) => s !== size)
        : [...d.sizes, size],
    }));
  };

  const activeCount = getActiveFilterCount(filters);

  const isDefaultRange =
    draft.priceRange[0] === 0 && draft.priceRange[1] === 0;
  const displayLo = isDefaultRange ? minPrice : draft.priceRange[0];
  const displayHi = isDefaultRange ? maxPrice : draft.priceRange[1];

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;

  return (
    <>
      {/* trigger button */}
      <button
        onClick={() => handleOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Filters${activeCount > 0 ? `, ${activeCount} active` : ""}`}
      >
        <SlidersHorizontal className="h-4 w-4" />
        {activeCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </button>

      <Sheet open={open} onOpenChange={handleOpen}>
        <SheetContent side="right" className="flex w-80 flex-col p-0">
          <SheetTitle className="border-b px-5 py-4 text-base font-semibold">
            Filters
          </SheetTitle>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-8">
            {/* price range */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Price Range</h3>
              <Slider
                min={minPrice}
                max={maxPrice}
                step={25}
                value={[displayLo, displayHi]}
                onValueChange={([lo, hi]) =>
                  setDraft((d) => ({ ...d, priceRange: [lo, hi] }))
                }
              />
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatPrice(displayLo)}</span>
                <span>{formatPrice(displayHi)}</span>
              </div>
            </div>

            {/* sort */}
            <div>
              <h3 className="mb-3 text-sm font-medium">Sort By</h3>
              <div className="grid grid-cols-2 gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setDraft((d) => ({ ...d, sort: opt.value }))
                    }
                    className={cn(
                      "rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
                      draft.sort === opt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* variation / size */}
            {allSizes.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium">Size / Variation</h3>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                        draft.sizes.includes(size)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* footer */}
          <div className="flex items-center gap-3 border-t px-5 py-4">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 rounded-full"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="flex-1 rounded-full"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
