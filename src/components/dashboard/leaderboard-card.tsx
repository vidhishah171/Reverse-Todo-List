"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Crown, Medal, Trophy, Flame, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LeaderboardEntry } from "@/types";

const RANK_STYLES = [
    { icon: Crown, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { icon: Medal, color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20" },
    { icon: Medal, color: "text-amber-600", bg: "bg-amber-600/10 border-amber-600/20" },
];

export function LeaderboardCard() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = useCallback(async () => {
        const supabase = createClient();
        const { data } = await supabase.rpc("get_leaderboard", { p_limit: 10 });
        setEntries(data ?? []);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    if (loading) {
        return (
            <Card className="animate-pulse">
                <CardHeader><div className="h-4 bg-muted rounded w-24" /></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-muted rounded-full" />
                                <div className="flex-1"><div className="h-3 bg-muted rounded w-24" /></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-500" />
                    Community Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {entries.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                        No public profiles yet. Be the first!
                    </p>
                ) : (
                    <div className="space-y-1">
                        {entries.map((entry, i) => {
                            const rankStyle = RANK_STYLES[i] ?? null;
                            return (
                                <motion.div
                                    key={entry.user_id}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.06, duration: 0.3 }}
                                    className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${i < 3
                                        ? `border ${rankStyle?.bg ?? ""}`
                                        : "hover:bg-muted/50"
                                        }`}
                                >
                                    {/* Rank */}
                                    <div className="w-6 text-center shrink-0">
                                        {rankStyle ? (
                                            <rankStyle.icon className={`w-4 h-4 mx-auto ${rankStyle.color}`} />
                                        ) : (
                                            <span className="text-sm text-muted-foreground font-medium tabular-nums">
                                                {i + 1}
                                            </span>
                                        )}
                                    </div>

                                    {/* Avatar */}
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i === 0
                                        ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                                        : "bg-muted text-muted-foreground"
                                        }`}>
                                        {(entry.display_name || "U").charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">
                                            {entry.display_name}
                                        </p>
                                        {entry.username && (
                                            <p className="text-[11px] text-muted-foreground">@{entry.username}</p>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Trophy className="w-3 h-3 text-violet-400" />
                                            <span className="tabular-nums font-medium text-foreground">{entry.total_wins}</span>
                                        </span>
                                        {entry.current_streak > 0 && (
                                            <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Flame className="w-3 h-3 text-orange-400" />
                                                <span className="tabular-nums font-medium text-foreground">{entry.current_streak}</span>
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
