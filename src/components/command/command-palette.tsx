"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LayoutDashboard, Trophy, BarChart2, Sun, Moon, Monitor, Plus, User, Users, Swords, TrendingUp, Share2, Sparkles, Settings } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogWin?: () => void;
}

export function CommandPalette({ open, onOpenChange, onLogWin }: CommandPaletteProps) {
  const router = useRouter();
  const { setTheme } = useTheme();

  function run(fn: () => void) {
    onOpenChange(false);
    fn();
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Command Palette</DialogTitle>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run(() => router.push("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/wins"))}>
            <Trophy className="mr-2 h-4 w-4" />
            My Wins
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/analytics"))}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Analytics
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/community"))}>
            <Users className="mr-2 h-4 w-4" />
            Community
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              onOpenChange(false);
              onLogWin?.();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Log a win
          </CommandItem>
          <CommandItem onSelect={() => run(() => {
            const el = document.querySelector('[data-ai-summary]');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              // Navigate to dashboard first, then scroll
              router.push('/dashboard');
              setTimeout(() => {
                document.querySelector('[data-ai-summary]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 500);
            }
          })}>
            <Sparkles className="mr-2 h-4 w-4" />
            View AI Summary
          </CommandItem>
          <CommandItem onSelect={() => run(() => {
            const shareText = "I'm tracking my wins with Reverse Todo! 🏆";
            const encoded = encodeURIComponent(shareText);
            window.open(`https://twitter.com/intent/tweet?text=${encoded}`, "_blank", "noopener,noreferrer");
          })}>
            <Share2 className="mr-2 h-4 w-4" />
            Share on Twitter
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => run(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            Light mode
          </CommandItem>
          <CommandItem onSelect={() => run(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            Dark mode
          </CommandItem>
          <CommandItem onSelect={() => run(() => setTheme("system"))}>
            <Monitor className="mr-2 h-4 w-4" />
            System theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
