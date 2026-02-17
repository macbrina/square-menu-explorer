"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import emptyAnimation from "@/../public/lottie/empty.json";

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({
  message = "No items found for this location.",
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 py-12 text-center lg:mx-auto lg:max-w-2xl"
    >
      <div className="w-40" aria-hidden="true">
        <Lottie animationData={emptyAnimation} loop />
      </div>
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}
