"use client";

import { useAnimatedCounter } from "@/hooks/use-animated-counter";

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ value, duration = 600, className = "" }: AnimatedNumberProps) {
  const animated = useAnimatedCounter(value, duration);
  return <span className={className}>{animated}</span>;
}
