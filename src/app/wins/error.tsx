"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WinsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Wins error:", error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-destructive" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Failed to load wins
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          We couldn&apos;t load your wins. Please try again.
        </p>
        <Button onClick={reset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Try again
        </Button>
      </motion.div>
    </div>
  );
}
