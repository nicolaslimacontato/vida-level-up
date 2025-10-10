import { useState, useRef, useCallback } from "react";

export function useXPParticles() {
  const [triggerParticles, setTriggerParticles] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const xpBarRef = useRef<HTMLDivElement | null>(null);

  const triggerParticleEffect = useCallback((rect: DOMRect) => {
    setButtonRect(rect);
    setTriggerParticles(true);

    // Reset após animação
    setTimeout(() => {
      setTriggerParticles(false);
      setButtonRect(null);
    }, 2000);
  }, []);

  return {
    triggerParticles,
    buttonRect,
    xpBarRef,
    triggerParticleEffect,
    setTriggerParticles: (value: boolean) => setTriggerParticles(value),
  };
}
