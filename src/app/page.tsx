"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  startTransition,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocations } from "@/hooks/use-locations";
import { useCatalog } from "@/hooks/use-catalog";
import { useCategories } from "@/hooks/use-categories";
import { DesktopSidebar, MobileHeader } from "@/components/sidebar-nav";
import { LocationSelector } from "@/components/location-selector";
import { CategoryNav } from "@/components/category-nav";
import { MenuItemCard } from "@/components/menu-item-card";
import { SearchBar } from "@/components/search-bar";
import {
  MenuSkeleton,
  CategoryNavSkeleton,
  HeaderSkeleton,
  SearchBarSkeleton,
} from "@/components/menu-skeleton";
import { ErrorState } from "@/components/error-state";
import { EmptyState } from "@/components/empty-state";
import {
  FilterSheet,
  DEFAULT_FILTERS,
  type Filters,
} from "@/components/filter-sheet";

const STORAGE_KEY = "square-menu-explorer:location";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

export default function HomePage() {
  const [locationId, setLocationId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) startTransition(() => setLocationId(stored));
  }, []);

  const handleLocationChange = useCallback((id: string) => {
    setLocationId(id);
    localStorage.setItem(STORAGE_KEY, id);
    setActiveCategory(null);
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleCategorySelect = useCallback((name: string) => {
    setActiveCategory(name || null);
  }, []);

  const locations = useLocations();
  const catalog = useCatalog(locationId);
  const categories = useCategories(locationId);

  const catalogItems = catalog.data?.items;

  const filteredItems = useMemo(() => {
    if (!catalogItems) return [];
    let items = catalogItems;

    if (activeCategory) {
      items = items.filter((i) => i.category === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }

    // price range filter
    const [lo, hi] = filters.priceRange;
    if (lo > 0 || hi > 0) {
      items = items.filter((i) => {
        const cheapest = Math.min(...i.variations.map((v) => v.priceCents));
        return cheapest >= lo && cheapest <= hi;
      });
    }

    // variation/size filter
    if (filters.sizes.length > 0) {
      items = items.filter((i) =>
        i.variations.some((v) => filters.sizes.includes(v.name))
      );
    }

    // sort
    const sorted = [...items];
    switch (filters.sort) {
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sorted.sort(
          (a, b) =>
            (a.variations[0]?.priceCents ?? 0) -
            (b.variations[0]?.priceCents ?? 0)
        );
        break;
      case "price-desc":
        sorted.sort(
          (a, b) =>
            (b.variations[0]?.priceCents ?? 0) -
            (a.variations[0]?.priceCents ?? 0)
        );
        break;
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [catalogItems, activeCategory, search, filters]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof filteredItems> = {};
    for (const item of filteredItems) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return groups;
  }, [filteredItems]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
      >
        Skip to content
      </a>

      <div className="flex h-dvh bg-background">
        {/* desktop sidebar */}
        <DesktopSidebar />

        {/* main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* mobile header */}
          <MobileHeader />

          {/* scrollable content */}
          <main
            id="main-content"
            className="flex flex-1 flex-col overflow-y-auto px-4 py-5 sm:px-6 md:px-8"
            tabIndex={-1}
          >
            {/* welcome row */}
            {locations.isError ? (
              <div className="flex flex-1 items-center justify-center">
                <ErrorState
                  message={
                    locations.error?.message || "Could not load locations."
                  }
                  onRetry={() => locations.refetch()}
                />
              </div>
            ) : (
              <section aria-label="Location selection" className="mb-6">
                <h2 className="sr-only">Choose a location</h2>
                {locations.isLoading ? (
                  <>
                    <HeaderSkeleton />
                    <SearchBarSkeleton />
                  </>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">
                        Welcome to Menu Explorer
                      </h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {locationId
                          ? "Choose a category to get started"
                          : "Pick a location to browse the menu"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <LocationSelector
                        locations={locations.data ?? []}
                        selectedId={locationId}
                        onSelect={handleLocationChange}
                      />
                      <div className="hidden items-center gap-2 sm:flex">
                        <SearchBar
                          value={search}
                          onChange={setSearch}
                          resultCount={
                            locationId ? filteredItems.length : undefined
                          }
                          compact
                        />
                        {locationId && catalogItems && (
                          <FilterSheet
                            items={catalogItems}
                            filters={filters}
                            onApply={setFilters}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {locationId && !locations.isError && (
              <>
                {/* mobile search (below header) */}
                <section aria-label="Search" className="mb-5 sm:hidden">
                  {catalog.isLoading ? (
                    <SearchBarSkeleton />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <SearchBar
                          value={search}
                          onChange={setSearch}
                          resultCount={filteredItems.length}
                        />
                      </div>
                      {catalogItems && (
                        <FilterSheet
                          items={catalogItems}
                          filters={filters}
                          onApply={setFilters}
                        />
                      )}
                    </div>
                  )}
                </section>

                {/* categories */}
                <section aria-label="Category navigation" className="mb-6">
                  {categories.isLoading ? (
                    <CategoryNavSkeleton />
                  ) : categories.isError ? (
                    <ErrorState
                      message={
                        categories.error?.message ||
                        "Could not load categories."
                      }
                      onRetry={() => categories.refetch()}
                    />
                  ) : (
                    <CategoryNav
                      categories={categories.data ?? []}
                      activeCategory={activeCategory}
                      onSelect={handleCategorySelect}
                    />
                  )}
                </section>

                {/* menu items */}
                <section
                  aria-label="Menu items"
                  className="flex flex-1 flex-col"
                >
                  {catalog.isLoading ? (
                    <MenuSkeleton />
                  ) : catalog.isError ? (
                    <div className="flex flex-1 items-center justify-center">
                      <ErrorState
                        message={
                          catalog.error?.message || "Could not load menu items."
                        }
                        onRetry={() => catalog.refetch()}
                      />
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center">
                      <EmptyState
                        message={
                          search
                            ? `No items match "${search}".`
                            : "No items found for this location."
                        }
                      />
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${locationId}-${activeCategory}-${search}-${
                          filters.sort
                        }-${filters.priceRange.join("-")}-${filters.sizes.join(
                          ","
                        )}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="flex flex-col gap-8"
                      >
                        {Object.entries(groupedItems).map(
                          ([category, items]) => (
                            <div key={category}>
                              <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-lg font-bold tracking-tight">
                                  {category}
                                </h2>
                                <span className="text-xs text-muted-foreground">
                                  {items.length}{" "}
                                  {items.length === 1 ? "item" : "items"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                                {items.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                  >
                                    <MenuItemCard item={item} />
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </section>
              </>
            )}

            {!locationId && !locations.isLoading && !locations.isError && (
              <div className="flex flex-1 items-center justify-center">
                <EmptyState message="Select a location above to browse the menu." />
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
