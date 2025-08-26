import { useState, useRef, useCallback } from "react";

export function useXPParticles() {
  const [triggerParticles, setTriggerParticles] = useState(false);
  const [particleSource, setParticleSource] = useState<"daily" | "main" | null>(
    null,
  );
  const dailyQuestButtonRef = useRef<HTMLButtonElement | null>(null);
  const mainQuestButtonRef = useRef<HTMLButtonElement | null>(null);
  const xpBarRef = useRef<HTMLDivElement | null>(null);

  const triggerParticleEffect = useCallback((source: "daily" | "main") => {
    if (xpBarRef.current) {
      setParticleSource(source);
      setTriggerParticles(true);

      // Reset após animação
      setTimeout(() => {
        setTriggerParticles(false);
        setParticleSource(null);
      }, 2000);
    }
  }, []);

  const getCurrentButtonRef = () => {
    if (particleSource === "daily") return dailyQuestButtonRef;
    if (particleSource === "main") return mainQuestButtonRef;
    return null;
  };

  return {
    triggerParticles,
    particleSource,
    dailyQuestButtonRef,
    mainQuestButtonRef,
    xpBarRef,
    triggerParticleEffect,
    getCurrentButtonRef,
    setTriggerParticles: (value: boolean) => setTriggerParticles(value),
  };
}
