"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
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
          Failed to load dashboard
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          We couldn&apos;t load your dashboard data. This might be a temporary issue.
        </p>
        <div className="flex items-center gap-3 justify-center">
          <Button variant="outline" onClick={reset} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Retry
          </Button>
          <Button asChild className="gap-2">
            <Link href="/dashboard">
              <Home className="w-4 h-4" />
              Reload
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
