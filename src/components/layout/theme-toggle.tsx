"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const themes = ["system", "light", "dark"] as const;
type Theme = (typeof themes)[number];

const icons: Record<Theme, React.ReactNode> = {
  system: <Monitor className="h-4 w-4" />,
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
};

const labels: Record<Theme, string> = {
  system: "System theme",
  light: "Light mode",
  dark: "Dark mode",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const current = (theme as Theme) ?? "system";
  const next = themes[(themes.indexOf(current) + 1) % themes.length];

  // Avoid hydration mismatch — render a placeholder until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-muted-foreground"
        disabled
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(next)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          {icons[current]}
          <span className="sr-only">{labels[current]}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{labels[current]}</p>
      </TooltipContent>
    </Tooltip>
  );
}
