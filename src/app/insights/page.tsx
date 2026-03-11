"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { DailyReflectionCard } from "@/components/dashboard/daily-reflection";
import { AISummaryCard } from "@/components/dashboard/ai-summary-card";

export default function InsightsPage() {
    return (
        <div className="max-w-5xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Insights</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Reflect on your day and see your productivity summary.
                </p>
            </motion.div>

            <div className="space-y-6">
                {/* Daily Reflection — "How are you feeling today?" */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                >
                    <DailyReflectionCard />
                </motion.div>

                {/* AI Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <AISummaryCard />
                </motion.div>
            </div>
        </div>
    );
}
