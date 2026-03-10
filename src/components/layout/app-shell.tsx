"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { CommandPalette } from "@/components/command/command-palette";

interface AppShellProps {
  userEmail: string | undefined;
  children: ReactNode;
}

export function AppShell({ userEmail, children }: AppShellProps) {
  const [commandOpen, setCommandOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogWin = useCallback(() => {
    if (pathname !== "/dashboard") {
      router.push("/dashboard");
    }
    // Focus the quick-add input after a short delay for navigation
    setTimeout(() => {
      const input = document.querySelector<HTMLInputElement>('[data-quick-add-input]');
      input?.focus();
    }, 300);
  }, [pathname, router]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userEmail={userEmail} onCommandOpen={() => setCommandOpen(true)} />
      <main id="main-content" className="flex-1 overflow-y-auto" role="main">
        <div className="pt-16 lg:pt-0 pb-20 lg:pb-0">{children}</div>
      </main>
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onLogWin={handleLogWin}
      />
    </div>
  );
}
