"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "@/lib/types";

const DESC_LIMIT = 60;

export function MenuItemCard({ item }: { item: MenuItem }) {
  const [expanded, setExpanded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const needsTruncation = item.description.length > DESC_LIMIT;
  const desc =
    expanded || !needsTruncation
      ? item.description
      : `${item.description.slice(0, DESC_LIMIT)}...`;

  const price = item.variations[0]?.priceFormatted ?? "";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* image */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        {item.imageUrl ? (
          <>
            {!imgLoaded && (
              <Skeleton className="absolute inset-0 rounded-none" />
            )}
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 33vw"
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImgLoaded(true)}
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-muted to-muted/60">
            <UtensilsCrossed
              className="h-10 w-10 text-muted-foreground/30"
              aria-hidden="true"
            />
          </div>
        )}

        {/* price badge over image */}
        {price && (
          <span className="absolute right-2 top-2 rounded-lg bg-background/90 px-2 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur-sm">
            {price}
          </span>
        )}
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-semibold text-sm leading-snug sm:text-base">{item.name}</h3>

        {item.description && (
          <AnimatePresence mode="wait">
            <motion.p
              key={expanded ? "full" : "short"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mt-1 text-xs text-muted-foreground sm:text-sm"
            >
              {desc}
              {needsTruncation && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="ml-1 font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-expanded={expanded}
                >
                  {expanded ? "less" : "more"}
                </button>
              )}
            </motion.p>
          </AnimatePresence>
        )}

        {/* variation badges */}
        {item.variations.length > 1 && (
          <div className="mt-auto flex flex-wrap gap-1 pt-2">
            {item.variations.map((v) => (
              <Badge
                key={v.id}
                variant="secondary"
                className="rounded-md px-1.5 py-0.5 text-[10px] font-medium sm:text-xs"
              >
                {v.name} {v.priceFormatted}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
