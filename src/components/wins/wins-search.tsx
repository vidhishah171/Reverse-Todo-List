"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WinsSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function WinsSearch({ value, onChange }: WinsSearchProps) {
  const [local, setLocal] = useState(value);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => onChange(local), 250);
    return () => clearTimeout(t);
  }, [local, onChange]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search wins…"
        className="pl-9 pr-8 h-9 text-sm"
      />
      {local && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => { setLocal(""); onChange(""); }}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      )}
    </div>
  );
}
