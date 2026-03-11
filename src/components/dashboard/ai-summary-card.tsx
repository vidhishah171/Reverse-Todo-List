"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Share2, Twitter, Linkedin, Copy, Check, RefreshCw, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Win, type Streak } from "@/types";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";

interface AISummaryCardProps {
    wins?: Win[];
    streak?: Streak | null;
}

function generateSummary(wins: Win[], streak: Streak | null, type: "daily" | "weekly"): string {
    const totalWins = wins.length;

    if (totalWins === 0) {
        return type === "daily"
            ? "No wins logged today yet. Every journey starts with a single step — log your first win!"
            : "No wins this week yet. The week is young — start building momentum!";
    }

    const difficulties = { easy: 0, medium: 0, hard: 0, epic: 0 };
    const moods = { great: 0, good: 0, okay: 0, tough: 0 };
    const categoryNames: Record<string, number> = {};

    wins.forEach((w) => {
        if (w.difficulty) difficulties[w.difficulty]++;
        if (w.mood) moods[w.mood]++;
        const catName = w.category?.name;
        if (catName) categoryNames[catName] = (categoryNames[catName] ?? 0) + 1;
    });

    const topCategory = Object.entries(categoryNames).sort((a, b) => b[1] - a[1])[0];
    const points = difficulties.easy + difficulties.medium * 2 + difficulties.hard * 3 + difficulties.epic * 5;
    const currentStreak = streak?.current_streak ?? 0;

    const parts: string[] = [];

    if (type === "daily") {
        parts.push(`You logged ${totalWins} win${totalWins !== 1 ? "s" : ""} today.`);
        if (difficulties.epic > 0) parts.push(`${difficulties.epic} epic achievement${difficulties.epic !== 1 ? "s" : ""} — outstanding!`);
        if (difficulties.hard > 0) parts.push(`${difficulties.hard} hard win${difficulties.hard !== 1 ? "s" : ""} tackled.`);
    } else {
        parts.push(`This week: ${totalWins} win${totalWins !== 1 ? "s" : ""} logged with ${points} productivity points.`);
        if (topCategory) parts.push(`Top focus area: ${topCategory[0]} (${topCategory[1]} wins).`);
    }

    if (currentStreak > 1) parts.push(`${currentStreak}-day streak and counting! 🔥`);

    const dominantMood = Object.entries(moods).sort((a, b) => b[1] - a[1])[0];
    if (dominantMood && dominantMood[1] > 0) {
        const moodMessages: Record<string, string> = {
            great: "You're feeling great — ride this wave!",
            good: "Solid vibes — keep this energy.",
            okay: "Steady progress. Consistency is key.",
            tough: "Pushing through tough days builds resilience.",
        };
        parts.push(moodMessages[dominantMood[0]] ?? "");
    }

    if (type === "weekly" && points >= 20) {
        parts.push("Exceptional productivity this week. You're outperforming yourself! 🚀");
    }

    return parts.filter(Boolean).join(" ");
}

function getShareText(summary: string, type: "daily" | "weekly"): string {
    return `${type === "daily" ? "📊 My daily" : "📈 My weekly"} productivity summary:\n\n${summary}\n\nTracked with Reverse Todo — celebrate your wins! 🏆`;
}

export function AISummaryCard({ wins = [], streak }: AISummaryCardProps) {
    const [summaryType, setSummaryType] = useState<"daily" | "weekly">("daily");
    const [summary, setSummary] = useState("");
    const [generating, setGenerating] = useState(false);
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [dailyWins, setDailyWins] = useState<Win[]>(wins);
    const [weeklyWins, setWeeklyWins] = useState<Win[]>([]);

    const fetchWins = useCallback(async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = format(new Date(), "yyyy-MM-dd");
        const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
        const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");

        const [dailyRes, weeklyRes] = await Promise.all([
            supabase.from("wins").select("*, category:categories(*)").eq("user_id", user.id).eq("date", today),
            supabase.from("wins").select("*, category:categories(*)").eq("user_id", user.id).gte("date", weekStart).lte("date", weekEnd),
        ]);

        setDailyWins(dailyRes.data ?? []);
        setWeeklyWins(weeklyRes.data ?? []);
    }, []);

    useEffect(() => {
        fetchWins();
    }, [fetchWins]);

    useEffect(() => {
        const winsToUse = summaryType === "daily" ? dailyWins : weeklyWins;
        setSummary(generateSummary(winsToUse, streak ?? null, summaryType));
    }, [summaryType, dailyWins, weeklyWins, streak]);

    function handleRegenerate() {
        setGenerating(true);
        setTimeout(() => {
            const winsToUse = summaryType === "daily" ? dailyWins : weeklyWins;
            setSummary(generateSummary(winsToUse, streak ?? null, summaryType));
            setGenerating(false);
        }, 600);
    }

    function handleCopy() {
        navigator.clipboard.writeText(getShareText(summary, summaryType));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleShareTwitter() {
        const text = encodeURIComponent(getShareText(summary, summaryType));
        window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
    }

    function handleShareLinkedIn() {
        const text = encodeURIComponent(getShareText(summary, summaryType));
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://reversetodo.app")}&summary=${text}`, "_blank", "noopener,noreferrer");
    }

    return (
        <Card className="overflow-hidden" data-ai-summary>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-500" />
                        AI Summary
                    </CardTitle>
                    <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </CardHeader>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <CardContent className="pt-2">
                            {/* Type Toggle */}
                            <div className="flex gap-1 mb-3 bg-muted rounded-lg p-0.5">
                                {(["daily", "weekly"] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setSummaryType(t)}
                                        className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${summaryType === t
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {t === "daily" ? "Today" : "This Week"}
                                    </button>
                                ))}
                            </div>

                            {/* Summary */}
                            <motion.p
                                key={summary}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-foreground/80 leading-relaxed mb-4"
                            >
                                {generating ? (
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Generating insights...
                                    </span>
                                ) : (
                                    summary
                                )}
                            </motion.p>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <Button variant="ghost" size="sm" onClick={handleRegenerate} disabled={generating} className="text-sm h-7 gap-1">
                                    <RefreshCw className="w-3 h-3" />
                                    Refresh
                                </Button>
                                <div className="flex-1" />
                                <Button variant="ghost" size="sm" onClick={handleCopy} className="text-sm h-7 gap-1">
                                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleShareTwitter} className="text-sm h-7 gap-1 hover:text-sky-500">
                                    <Twitter className="w-3 h-3" />
                                    Tweet
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleShareLinkedIn} className="text-sm h-7 gap-1 hover:text-blue-600">
                                    <Linkedin className="w-3 h-3" />
                                    Share
                                </Button>
                            </div>
                        </CardContent>
                    </motion.div>
                )}
            </AnimatePresence>
        </Card>
    );
}
