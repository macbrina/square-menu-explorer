"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import errorAnimation from "@/../public/lottie/error.json";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-card/50 py-12 text-center lg:mx-auto lg:max-w-2xl"
      role="alert"
    >
      <div className="w-28" aria-hidden="true">
        <Lottie animationData={errorAnimation} loop={false} />
      </div>
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          Try again
        </Button>
      )}
    </motion.div>
  );
}
