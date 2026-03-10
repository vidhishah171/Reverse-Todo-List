"use client";

import { useState } from "react";
import { X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ReminderBanner() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3 bg-violet-500/10 border border-violet-500/20 rounded-lg px-4 py-3 mb-6"
        >
          <div className="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-violet-400" />
          </div>
          <p className="flex-1 text-sm text-violet-300">
            <span className="font-medium">No wins logged yet today.</span>{" "}
            What&apos;s one thing you&apos;ve accomplished so far?
          </p>
          <button
            onClick={() => setDismissed(true)}
            className="shrink-0 text-violet-400/60 hover:text-violet-300 transition-colors p-1"
            aria-label="Dismiss reminder"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
