"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Win } from "@/types";

interface WinsExportProps {
  wins: Win[];
}

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function exportCSV(wins: Win[]) {
  const header = ["Date", "Title", "Description", "Difficulty", "Mood", "Tags", "Category", "Pinned"];
  const rows = wins.map((w) => [
    w.date,
    `"${capitalize(w.title).replace(/"/g, '""')}"`,
    `"${capitalize(w.description ?? "").replace(/"/g, '""')}"`,
    w.difficulty ? capitalize(w.difficulty) : "",
    w.mood ? capitalize(w.mood) : "",
    (w.tags ?? []).map((t) => capitalize(t)).join(";"),
    w.category?.name ? capitalize(w.category.name) : "",
    w.pinned ? "Yes" : "No",
  ]);
  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadBlob(csv, "wins.csv", "text/csv");
}

function exportMarkdown(wins: Win[]) {
  const grouped: Record<string, Win[]> = {};
  wins.forEach((w) => {
    if (!grouped[w.date]) grouped[w.date] = [];
    grouped[w.date]!.push(w);
  });

  const sortedDates = Object.keys(grouped).sort((a, b) => (a > b ? -1 : 1));
  const lines: string[] = ["# My Wins\n"];

  for (const date of sortedDates) {
    lines.push(`## ${date}\n`);
    for (const win of grouped[date]!) {
      lines.push(`- **${win.title}**${win.description ? ` — ${win.description}` : ""}`);
      const meta: string[] = [];
      if (win.difficulty) meta.push(`difficulty: ${win.difficulty}`);
      if (win.mood) meta.push(`mood: ${win.mood}`);
      if (win.tags?.length) meta.push(`tags: ${win.tags.map((t) => `#${t}`).join(" ")}`);
      if (meta.length) lines.push(`  _${meta.join(" · ")}_`);
    }
    lines.push("");
  }

  downloadBlob(lines.join("\n"), "wins.md", "text/markdown");
}

export function WinsExport({ wins }: WinsExportProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5">
          <Download className="w-3.5 h-3.5" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportCSV(wins)}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportMarkdown(wins)}>
          Export as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
