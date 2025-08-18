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
      <Card className="relative max-w-md w-full mx-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0 shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div className="flex justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
              <Star className="w-6 h-6 text-yellow-200 animate-pulse" style={{animationDelay: '0.5s'}} />
              <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" style={{animationDelay: '1s'}} />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-2">
            🎉 Parabéns! 🎉
          </h2>
          <p className="text-xl mb-4">Você subiu para o nível</p>
          <div className="text-6xl font-bold text-white mb-4">
            {level}
          </div>
          <p className="text-yellow-100 text-sm">
            Continue completando quests para subir ainda mais!
          </p>
          
          {/* Elementos decorativos */}
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-yellow-200 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-200 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="w-3 h-3 bg-yellow-200 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
            <div className="w-3 h-3 bg-yellow-200 rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
