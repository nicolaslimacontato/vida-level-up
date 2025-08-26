"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  delay: number;
  color: string;
}

interface XPParticlesProps {
  trigger: boolean;
  buttonRect: DOMRect | null;
  xpBarRect: DOMRect | null;
  particleCount?: number;
  onComplete?: () => void;
}

export function XPParticles({
  trigger,
  buttonRect,
  xpBarRect,
  particleCount = 8,
  onComplete,
}: XPParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!trigger || !buttonRect || !xpBarRect) {
      setParticles([]);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);

    // Calcular centro do botão
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    // Calcular centro da barra de XP
    const xpCenterX = xpBarRect.left + xpBarRect.width / 2;
    const xpCenterY = xpBarRect.top + xpBarRect.height / 2;

    // Criar partículas
    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: buttonCenterX,
        y: buttonCenterY,
        targetX: xpCenterX + (Math.random() - 0.5) * 120, // Variação aleatória aumentada
        targetY: xpCenterY + (Math.random() - 0.5) * 40, // Variação vertical aumentada
        delay: i * 100, // Delay escalonado
        color: `hsl(${120 + Math.random() * 40}, 70%, ${50 + Math.random() * 20}%)`, // Verde variado
      });
    }

    setParticles(newParticles);

    // Limpar após animação
    const timer = setTimeout(() => {
      setParticles([]);
      setIsAnimating(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [trigger, buttonRect, xpBarRect, particleCount, onComplete]);

  if (!isAnimating || particles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {particles.map((particle) => {
        const deltaX = particle.targetX - particle.x;
        const deltaY = particle.targetY - particle.y;

        return (
          <div
            key={particle.id}
            className="animate-xp-particle absolute h-3 w-3 rounded-full"
            style={
              {
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                boxShadow: `0 0 8px ${particle.color}`,
                animationDelay: `${particle.delay}ms`,
                animationDuration: "1.5s",
                "--target-x": `${deltaX}px`,
                "--target-y": `${deltaY}px`,
              } as React.CSSProperties & {
                "--target-x": string;
                "--target-y": string;
              }
            }
          />
        );
      })}
    </div>
  );
}
