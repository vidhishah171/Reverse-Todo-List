import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PublicProfileView } from "./profile-view";

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;
    const supabase = await createClient();

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("is_public", true)
        .single();

    if (!profile) notFound();

    const { data: wins } = await supabase
        .from("wins")
        .select("*, category:categories(*)")
        .eq("user_id", profile.id)
        .order("pinned", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(20);

    const { data: streak } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", profile.id)
        .single();

    const { data: achievements } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", profile.id);

    const { count: totalWins } = await supabase
        .from("wins")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id);

    return (
        <PublicProfileView
            profile={profile}
            wins={wins ?? []}
            streak={streak}
            achievements={achievements ?? []}
            totalWins={totalWins ?? 0}
        />
    );
}
