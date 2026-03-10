"use client";

import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface UseConfettiOptions {
  trigger: boolean;
  type?: "confetti" | "fireworks" | "stars";
}

export function useConfetti({
  trigger,
  type = "confetti",
}: UseConfettiOptions) {
  const hasFired = useRef(false);

  const fire = useCallback(() => {
    if (type === "fireworks") {
      const duration = 2000;
      const end = Date.now() + duration;
      const colors = ["#8b5cf6", "#a855f7", "#7c3aed", "#f59e0b", "#10b981"];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
          zIndex: 9999,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
          zIndex: 9999,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    } else if (type === "stars") {
      const defaults = {
        spread: 360,
        ticks: 80,
        gravity: 0,
        decay: 0.94,
        startVelocity: 20,
        colors: ["#8b5cf6", "#a855f7", "#c084fc", "#f59e0b", "#fbbf24"],
        shapes: ["star" as const],
        zIndex: 9999,
      };
      confetti({ ...defaults, particleCount: 30, scalar: 1.2 });
      setTimeout(
        () => confetti({ ...defaults, particleCount: 20, scalar: 0.8 }),
        150,
      );
    } else {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8b5cf6", "#a855f7", "#7c3aed", "#c084fc", "#ddd6fe"],
        zIndex: 9999,
      });
    }
  }, [type]);

  useEffect(() => {
    if (trigger && !hasFired.current) {
      hasFired.current = true;
      fire();
    }
    if (!trigger) {
      hasFired.current = false;
    }
  }, [trigger, fire]);

  return { fire };
}

export function fireConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#8b5cf6", "#a855f7", "#7c3aed", "#c084fc", "#ddd6fe"],
    zIndex: 9999,
  });
}

export function fireStreakConfetti(streakCount: number) {
  if (
    streakCount === 3 ||
    streakCount === 7 ||
    streakCount === 14 ||
    streakCount === 30
  ) {
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = [
      "#8b5cf6",
      "#a855f7",
      "#7c3aed",
      "#f59e0b",
      "#10b981",
      "#ec4899",
    ];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors,
        zIndex: 9999,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors,
        zIndex: 9999,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
}
