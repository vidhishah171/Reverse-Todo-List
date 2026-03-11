import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicProfileView } from "./profile-view";

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;
    const supabase = await createClient();

    // Check if current user is logged in
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Fetch profile (public RLS policy allows this)
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("is_public", true)
        .single();

    if (!profile) notFound();

    // Use SECURITY DEFINER RPC to fetch stats (bypasses RLS for public profiles)
    const { data: profileData } = await supabase.rpc("get_public_profile_data", {
        p_username: username,
    });

    const wins = profileData?.wins ?? [];
    const streak = profileData
        ? { current_streak: profileData.current_streak, longest_streak: profileData.longest_streak }
        : null;
    const achievements = profileData?.achievements ?? [];
    const totalWins = profileData?.total_wins ?? 0;

    return (
        <PublicProfileView
            profile={profile}
            wins={wins}
            streak={streak}
            achievements={achievements}
            totalWins={totalWins}
            isLoggedIn={!!user}
        />
    );
}
