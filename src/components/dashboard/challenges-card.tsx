"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swords, Users, Calendar, ChevronRight, Plus, Loader2, Check, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { type Challenge } from "@/types";
import { format } from "date-fns";

export function ChallengesCard() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);
    const [joiningId, setJoiningId] = useState<string | null>(null);

    const fetchChallenges = useCallback(async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: allChallenges } = await supabase
            .from("challenges")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (!allChallenges) {
            setLoading(false);
            return;
        }

        // Get participant info
        const enhancedChallenges: Challenge[] = await Promise.all(
            allChallenges.map(async (c: Challenge) => {
                const { count } = await supabase
                    .from("challenge_participants")
                    .select("*", { count: "exact", head: true })
                    .eq("challenge_id", c.id);

                const { data: myParticipation } = await supabase
                    .from("challenge_participants")
                    .select("progress")
                    .eq("challenge_id", c.id)
                    .eq("user_id", user.id)
                    .single();

                return {
                    ...c,
                    participant_count: count ?? 0,
                    my_progress: myParticipation?.progress ?? 0,
                    joined: !!myParticipation,
                };
            })
        );

        setChallenges(enhancedChallenges);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchChallenges();
    }, [fetchChallenges]);

    async function handleJoin(challengeId: string) {
        setJoiningId(challengeId);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setJoiningId(null);
                return;
            }

            const { error } = await supabase.from("challenge_participants").insert({
                challenge_id: challengeId,
                user_id: user.id,
                progress: 0,
            });

            if (error) {
                console.error("Failed to join challenge:", error.message);
            }

            await fetchChallenges();
        } catch (err) {
            console.error("Challenge join error:", err);
        } finally {
            setJoiningId(null);
        }
    }

    if (loading) {
        return (
            <Card className="animate-pulse">
                <CardHeader><div className="h-4 bg-muted rounded w-24" /></CardHeader>
                <CardContent><div className="space-y-2"><div className="h-16 bg-muted rounded" /><div className="h-16 bg-muted rounded" /></div></CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Swords className="w-4 h-4 text-violet-500" />
                    Active Challenges
                    {challenges.length > 0 && (
                        <span className="text-[10px] text-muted-foreground font-normal">
                            {challenges.length} active
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {challenges.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No active challenges yet</p>
                ) : (
                    <div className="space-y-2">
                        <AnimatePresence>
                            {challenges.map((challenge, i) => (
                                <motion.div
                                    key={challenge.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group flex items-center gap-3 p-3 rounded-lg border border-border hover:border-violet-500/20 hover:bg-muted/30 transition-all"
                                >
                                    {challenge.joined ? (
                                        <ProgressRing
                                            value={Math.min((challenge.my_progress ?? 0) / challenge.target_count * 100, 100)}
                                            size={36}
                                            strokeWidth={3}
                                            color={challenge.my_progress! >= challenge.target_count ? "text-emerald-500" : "text-violet-500"}
                                        />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                                            <Trophy className="w-4 h-4 text-violet-500" />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{challenge.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                {challenge.participant_count}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Ends {format(new Date(challenge.end_date), "MMM d")}
                                            </span>
                                            {challenge.joined && (
                                                <span className="text-[11px] text-violet-500 font-medium">
                                                    {challenge.my_progress}/{challenge.target_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!challenge.joined ? (
                                        <Button
                                            size="sm"
                                            variant="default"
                                            onClick={(e) => { e.stopPropagation(); handleJoin(challenge.id); }}
                                            disabled={joiningId === challenge.id}
                                            className="h-7 text-xs gap-1 shrink-0"
                                        >
                                            {joiningId === challenge.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <>
                                                    <Plus className="w-3 h-3" /> Join
                                                </>
                                            )}
                                        </Button>
                                    ) : challenge.my_progress! >= challenge.target_count ? (
                                        <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                                            <Check className="w-3.5 h-3.5" /> Done
                                        </span>
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
