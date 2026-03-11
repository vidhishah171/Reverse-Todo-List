"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Trophy, Flame, Search, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface PublicProfile {
    id: string;
    username: string | null;
    display_name: string | null;
    bio: string | null;
    is_public: boolean;
    total_wins: number;
    current_streak: number;
}

export default function CommunityPage() {
    const [profiles, setProfiles] = useState<PublicProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchProfiles = useCallback(async () => {
        const supabase = createClient();
        const { data } = await supabase.rpc("get_leaderboard", { p_limit: 50 });

        if (data) {
            setProfiles(
                data.map((entry: { user_id: string; display_name: string; username: string | null; total_wins: number; current_streak: number }) => ({
                    id: entry.user_id,
                    username: entry.username,
                    display_name: entry.display_name,
                    bio: null,
                    is_public: true,
                    total_wins: Number(entry.total_wins),
                    current_streak: entry.current_streak,
                }))
            );
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const filteredProfiles = profiles.filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            (p.display_name?.toLowerCase().includes(q)) ||
            (p.username?.toLowerCase().includes(q))
        );
    });

    return (
        <div className="max-w-5xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-violet-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Community</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Discover public profiles and see how others are celebrating their wins.
                </p>
            </motion.div>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="mb-6"
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search profiles..."
                        className="pl-10 h-10"
                    />
                </div>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-36 rounded-xl bg-muted animate-pulse" />
                    ))}
                </div>
            ) : filteredProfiles.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {search ? "No profiles match your search." : "No public profiles yet. Be the first!"}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProfiles.map((profile, i) => (
                        <motion.div
                            key={profile.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04, duration: 0.3 }}
                        >
                            <Link href={profile.username ? `/u/${profile.username}` : "#"}>
                                <Card className="h-full hover:border-violet-500/30 hover:shadow-md transition-all cursor-pointer group">
                                    <CardContent className="p-5">
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                {(profile.display_name || "U").charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-foreground truncate">
                                                        {profile.display_name || "Anonymous"}
                                                    </p>
                                                    <ExternalLink className="w-3 h-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                {profile.username && (
                                                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <Trophy className="w-3.5 h-3.5 text-violet-400" />
                                                <span className="text-sm font-semibold text-foreground tabular-nums">{profile.total_wins}</span>
                                                <span className="text-sm text-muted-foreground">wins</span>
                                            </div>
                                            {profile.current_streak > 0 && (
                                                <div className="flex items-center gap-1.5">
                                                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                                                    <span className="text-sm font-semibold text-foreground tabular-nums">{profile.current_streak}</span>
                                                    <span className="text-sm text-muted-foreground">day streak</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
