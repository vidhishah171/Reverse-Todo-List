import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/layout/app-shell";

export default async function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Logged-in users get the full sidebar/shell
    if (user) {
        return <AppShell userEmail={user.email}>{children}</AppShell>;
    }

    // Public visitors get just the page content
    return <>{children}</>;
}
