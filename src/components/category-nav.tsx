"use client";

import { useRef, useEffect, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string | null;
  onSelect: (categoryName: string) => void;
}

export function CategoryNav({ categories, activeCategory, onSelect }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [activeCategory]);

  const total = categories.reduce((sum, c) => sum + c.itemCount, 0);

  return (
    <nav
      ref={scrollRef}
      className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1"
      role="tablist"
      aria-label="Menu categories"
    >
      <CategoryTab
        ref={activeCategory === null ? activeRef : undefined}
        label="All"
        count={total}
        isActive={activeCategory === null}
        onClick={() => onSelect("")}
      />
      {categories.map((cat) => (
        <CategoryTab
          key={cat.id}
          ref={activeCategory === cat.name ? activeRef : undefined}
          label={cat.name}
          count={cat.itemCount}
          isActive={activeCategory === cat.name}
          onClick={() => onSelect(cat.name)}
        />
      ))}
    </nav>
  );
}

const CategoryTab = forwardRef<
  HTMLButtonElement,
  { label: string; count: number; isActive: boolean; onClick: () => void }
>(function CategoryTab({ label, count, isActive, onClick }, ref) {
  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        "relative flex shrink-0 flex-col items-center gap-1 rounded-2xl px-5 py-3.5 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isActive
          ? "text-primary-foreground shadow-md"
          : "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:shadow-sm",
      )}
    >
      {isActive && (
        <motion.span
          layoutId="category-pill"
          className="absolute inset-0 rounded-2xl bg-primary"
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        />
      )}
      <span className="relative z-10 text-sm font-semibold">{label}</span>
      <span
        className={cn(
          "relative z-10 text-[11px]",
          isActive ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {count} {count === 1 ? "item" : "items"}
      </span>
    </button>
  );
});
