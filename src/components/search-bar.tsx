"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  compact?: boolean;
}

export function SearchBar({ value, onChange, resultCount, compact }: SearchBarProps) {
  return (
    <div className="relative">
      <Search
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
          compact ? "left-3" : "left-4",
        )}
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder="Search menu items..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-full border bg-card text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary",
          compact ? "h-10 pl-9 pr-9 w-[220px]" : "h-11 pl-10 pr-10",
        )}
        aria-label="Search menu items"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className={cn(
            "absolute top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            compact ? "right-2.5" : "right-3",
          )}
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {value && resultCount !== undefined && (
        <div className="sr-only" aria-live="polite" role="status">
          {resultCount} {resultCount === 1 ? "item" : "items"} found
        </div>
      )}
    </div>
  );
}
