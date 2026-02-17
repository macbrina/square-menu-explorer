"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnimation from "@/../public/lottie/loading.json";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading menu...",
}: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center gap-3 py-20"
    >
      <div className="w-16" aria-hidden="true">
        <Lottie animationData={loadingAnimation} loop />
      </div>
      <p className="text-sm text-muted-foreground">{message}</p>
    </motion.div>
  );
}
