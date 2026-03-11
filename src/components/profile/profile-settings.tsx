"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { User, Globe, Lock, Save, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Profile } from "@/types";

interface ProfileSettingsProps {
    onProfileSaved?: () => void;
}

export function ProfileSettings({ onProfileSaved }: ProfileSettingsProps) {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (data) {
            setProfile(data);
            setUsername(data.username ?? "");
            setDisplayName(data.display_name ?? "");
            setBio(data.bio ?? "");
            setIsPublic(data.is_public);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    async function handleSave() {
        setSaving(true);
        setError(null);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const sanitizedUsername = username.toLowerCase().replace(/[^a-z0-9_-]/g, "");

        const profileData = {
            id: user.id,
            username: sanitizedUsername || null,
            display_name: displayName || null,
            bio: bio || null,
            is_public: isPublic,
            updated_at: new Date().toISOString(),
        };

        const { error: upsertError } = await supabase
            .from("profiles")
            .upsert(profileData, { onConflict: "id" });

        if (upsertError) {
            if (upsertError.message.includes("duplicate") || upsertError.message.includes("unique")) {
                setError("Username is already taken");
            } else {
                setError("Failed to save profile");
            }
            setSaving(false);
            return;
        }

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        onProfileSaved?.();
    }

    if (loading) {
        return (
            <div className="glass-card p-5 animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-4" />
                <div className="space-y-3">
                    <div className="h-9 bg-muted rounded" />
                    <div className="h-9 bg-muted rounded" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
        >
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-violet-500" />
                Public Profile
            </h3>

            <div className="space-y-3">
                <div>
                    <Label htmlFor="username" className="text-sm">Username</Label>
                    <Input
                        id="username"
                        placeholder="your-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1"
                    />
                    {username && (
                        <p className="text-[11px] text-muted-foreground mt-1">
                            reversetodo.app/{username.toLowerCase().replace(/[^a-z0-9_-]/g, "")}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor="displayName" className="text-sm">Display Name</Label>
                    <Input
                        id="displayName"
                        placeholder="Your name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="bio" className="text-sm">Bio</Label>
                    <textarea
                        id="bio"
                        placeholder="Tell the world what you're working on..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="mt-1 w-full text-sm bg-transparent border border-input rounded-md px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        maxLength={160}
                    />
                </div>

                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        {isPublic ? (
                            <Globe className="w-4 h-4 text-emerald-500" />
                        ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-sm text-foreground">
                            {isPublic ? "Public profile" : "Private profile"}
                        </span>
                    </div>
                    <button
                        onClick={() => setIsPublic(!isPublic)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isPublic ? "bg-violet-500" : "bg-muted"
                            }`}
                    >
                        <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isPublic ? "translate-x-4" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-2 py-1.5">
                        {error}
                    </p>
                )}

                <Button
                    onClick={handleSave}
                    disabled={saving}
                    size="sm"
                    className="w-full"
                >
                    {saving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : saved ? (
                        <>
                            <Check className="w-3.5 h-3.5 mr-1" />
                            Saved
                        </>
                    ) : (
                        <>
                            <Save className="w-3.5 h-3.5 mr-1" />
                            Save Profile
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}
