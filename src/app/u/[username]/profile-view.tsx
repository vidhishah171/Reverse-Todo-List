"use client";

import { motion } from "framer-motion";
import { Star, Trophy, Flame, Award, Calendar, CheckCircle2, Pin } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { ACHIEVEMENTS } from "@/components/dashboard/achievement-badges";
import { type Profile, type Win, type Achievement } from "@/types";
import Link from "next/link";

interface PublicProfileViewProps {
    profile: Profile;
    wins: Win[];
    streak: { current_streak: number; longest_streak: number } | null;
    achievements: Achievement[];
    totalWins: number;
    isLoggedIn?: boolean;
}

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
};

export function PublicProfileView({
    profile,
    wins,
    streak,
    achievements,
    totalWins,
    isLoggedIn,
}: PublicProfileViewProps) {
    const pinnedWins = wins.filter((w) => w.pinned);
    const recentWins = wins.filter((w) => !w.pinned).slice(0, 10);

    return (
        <div className="min-h-screen">
            {/* Top bar — only for public visitors (logged-in users have sidebar) */}
            {!isLoggedIn && (
                <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
                    <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                <Star className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="font-semibold text-sm">Reverse Todo</span>
                        </Link>
                        <ThemeToggle />
                    </div>
                </header>
            )}

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className={`max-w-2xl mx-auto px-4 pb-16 ${isLoggedIn ? "pt-6" : "pt-20"}`}
            >
                {/* Profile Header */}
                <motion.div variants={item} className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl font-bold text-white">
                            {(profile.display_name || profile.username || "U").charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {profile.display_name || profile.username}
                    </h1>
                    {profile.username && (
                        <p className="text-sm text-muted-foreground">@{profile.username}</p>
                    )}
                    {profile.bio && (
                        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{profile.bio}</p>
                    )}
                </motion.div>

                {/* Stats Row */}
                <motion.div variants={item} className="grid grid-cols-3 gap-3 mb-6">
                    <div className="glass-card p-4 text-center">
                        <Trophy className="w-4 h-4 text-violet-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-foreground tabular-nums">{totalWins}</p>
                        <p className="text-[11px] text-muted-foreground">Total Wins</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-foreground tabular-nums">
                            {streak?.current_streak ?? 0}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Day Streak</p>
                    </div>
                    <div className="glass-card p-4 text-center">
                        <Award className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                        <p className="text-2xl font-bold text-foreground tabular-nums">
                            {achievements.length}
                        </p>
                        <p className="text-[11px] text-muted-foreground">Achievements</p>
                    </div>
                </motion.div>

                {/* Achievements */}
                {achievements.length > 0 && (
                    <motion.div variants={item} className="glass-card p-5 mb-6">
                        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <span>🏆</span> Achievements
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {achievements.map((a) => {
                                const def = ACHIEVEMENTS.find((d) => d.key === a.key);
                                if (!def) return null;
                                return (
                                    <span
                                        key={a.key}
                                        className="inline-flex items-center gap-1 text-sm bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/20 rounded-full px-2.5 py-1"
                                    >
                                        <span>{def.icon}</span>
                                        {def.title}
                                    </span>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Pinned Wins */}
                {pinnedWins.length > 0 && (
                    <motion.div variants={item} className="glass-card p-5 mb-6">
                        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Pin className="w-4 h-4 text-violet-500" /> Pinned Wins
                        </h2>
                        <div className="space-y-2">
                            {pinnedWins.map((win) => (
                                <div key={win.id} className="flex items-start gap-2 py-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{win.title}</p>
                                        {win.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-1">{win.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recent Wins */}
                {recentWins.length > 0 && (
                    <motion.div variants={item} className="glass-card p-5">
                        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-violet-500" /> Recent Wins
                        </h2>
                        <div className="space-y-2">
                            {recentWins.map((win) => (
                                <div key={win.id} className="flex items-start gap-2 py-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{win.title}</p>
                                        <p className="text-[11px] text-muted-foreground">{win.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
