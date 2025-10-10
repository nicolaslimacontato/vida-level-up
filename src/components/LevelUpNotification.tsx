"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Sparkles, Star } from "lucide-react";

interface LevelUpNotificationProps {
  level: number;
  show: boolean;
  onClose: () => void;
}

export function LevelUpNotification({
  level,
  show,
  onClose,
}: LevelUpNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Aguarda a animação terminar
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative mx-4 w-full max-w-md border-0 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <div className="mb-4 flex justify-center gap-2">
              <Sparkles className="h-6 w-6 animate-pulse text-yellow-200" />
              <Star
                className="h-6 w-6 animate-pulse text-yellow-200"
                style={{ animationDelay: "0.5s" }}
              />
              <Sparkles
                className="h-6 w-6 animate-pulse text-yellow-200"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>

          <h2 className="text-title1 mb-2 font-bold">🎉 Parabéns! 🎉</h2>
          <p className="text-title2 mb-4">Você subiu para o nível</p>
          <div className="mb-4 text-6xl font-bold text-white">{level}</div>
          <p className="text-title3 text-yellow-100">
            Continue completando quests para subir ainda mais!
          </p>

          {/* Elementos decorativos */}
          <div className="mt-6 flex justify-center space-x-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-200"></div>
            <div
              className="h-3 w-3 animate-pulse rounded-full bg-yellow-200"
              style={{ animationDelay: "0.3s" }}
            ></div>
            <div
              className="h-3 w-3 animate-pulse rounded-full bg-yellow-200"
              style={{ animationDelay: "0.6s" }}
            ></div>
            <div
              className="h-3 w-3 animate-pulse rounded-full bg-yellow-200"
              style={{ animationDelay: "0.9s" }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
