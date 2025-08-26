import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/rpg";
import { Coins } from "lucide-react";
import { useState, useEffect } from "react";

interface UserHeaderProps {
  user: User;
  getXPForNextLevel: (level: number) => number;
  getLevelProgress: () => number;
  xpBarRef?: React.RefObject<HTMLDivElement | null>;
}

export function UserHeader({
  user,
  getXPForNextLevel,
  getLevelProgress,
  xpBarRef,
}: UserHeaderProps) {
  const xpForNextLevel = getXPForNextLevel(user.level);
  const progress = getLevelProgress();

  // Estado para animação quando ganha XP
  const [xpGained, setXpGained] = useState(false);
  const [prevTotalXP, setPrevTotalXP] = useState(user.totalXP);

  // Detectar quando ganha XP para animar
  useEffect(() => {
    if (user.totalXP > prevTotalXP) {
      setXpGained(true);
      const timer = setTimeout(() => setXpGained(false), 1000);
      return () => clearTimeout(timer);
    }
    setPrevTotalXP(user.totalXP);
  }, [user.totalXP, prevTotalXP]);

  return (
    <Card className="w-full border-2 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-700 bg-gradient-to-br from-yellow-400 to-orange-500 text-lg font-bold text-slate-900 shadow-inner">
              {user.level}
            </div>
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-amber-800 bg-green-500">
              <span className="text-xs font-bold text-white">XP</span>
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
              Nível {user.level}
            </div>
            <div className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Aventureiro da Vida Real
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-amber-700 dark:text-amber-300">
              Progresso para o próximo nível
            </span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {user.currentXP} / {xpForNextLevel} XP
            </span>
          </div>

          {/* Barra de XP estilo Minecraft */}
          <div className="relative w-full">
            {/* Container da barra com bordas pixel art */}
            <div
              ref={xpBarRef}
              className="relative h-8 w-full border-2 border-[#000] bg-[#2a2a2a] shadow-lg"
              style={{
                imageRendering: "pixelated",
                boxShadow: "inset 2px 2px 0 #1a1a1a, inset -2px -2px 0 #3a3a3a",
              }}
            >
              {/* Fundo da barra com textura escura */}
              <div className="absolute inset-1 bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-[#2a2a2a]">
                {/* Padrão de pixels para textura */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `
                         radial-gradient(circle at 25% 25%, #333 1px, transparent 1px),
                         radial-gradient(circle at 75% 75%, #111 1px, transparent 1px)
                       `,
                    backgroundSize: "4px 4px",
                    imageRendering: "pixelated",
                  }}
                ></div>
              </div>

              {/* Barra de progresso XP verde */}
              <div
                className="animate-xp-glow absolute top-1 bottom-1 left-1 transition-all duration-500 ease-out"
                style={{
                  width: `calc(${progress}% - 2px)`,
                  background: `linear-gradient(to bottom, 
                    #7CFC00 0%, 
                    #32CD32 25%, 
                    #228B22 50%, 
                    #006400 75%, 
                    #004400 100%
                  )`,
                  imageRendering: "pixelated",
                }}
              >
                {/* Brilho superior da barra verde */}
                <div className="animate-pixel-flicker absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#9AFF9A] to-[#7CFC00] opacity-80"></div>

                {/* Textura pixel da barra verde */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `
                         repeating-linear-gradient(0deg, 
                           transparent, 
                           transparent 1px, 
                           rgba(255,255,255,0.1) 1px, 
                           rgba(255,255,255,0.1) 2px
                         ),
                         repeating-linear-gradient(90deg, 
                           transparent, 
                           transparent 2px, 
                           rgba(0,0,0,0.1) 2px, 
                           rgba(0,0,0,0.1) 4px
                         )
                       `,
                    imageRendering: "pixelated",
                  }}
                ></div>

                {/* Efeito de shimmer animado */}
                {progress > 0 && (
                  <div className="animate-xp-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                )}

                {/* Orbe de XP flutuante quando quase no level up */}
                {progress > 90 && (
                  <div className="absolute -top-3 right-0 h-2 w-2 animate-bounce rounded-full bg-yellow-300 opacity-80 shadow-lg shadow-yellow-400/50"></div>
                )}
              </div>

              {/* Divisórias dos segmentos XP */}
              <div className="absolute inset-0 flex">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="relative flex-1">
                    {i < 9 && (
                      <div className="absolute top-1 right-0 bottom-1 z-10 w-[1px] bg-black"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Borda interna para efeito 3D */}
              <div className="pointer-events-none absolute inset-0 border border-[#444] opacity-50"></div>
            </div>

            {/* Efeito de partículas quando próximo do level up */}
            {progress > 80 && (
              <div className="absolute -top-2 right-0 left-0 flex justify-center">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1 w-1 animate-bounce rounded-full bg-yellow-400"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: "1s",
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Efeito visual quando ganha XP */}
            {xpGained && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                <div className="flex animate-bounce items-center gap-1 text-sm font-bold text-green-400">
                  <span className="text-yellow-300">+XP</span>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cards de XP e moedas */}
        <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
          <div className="bg-muted dark:bg-muted border-ring dark:border-ring rounded-lg border bg-gradient-to-b p-3 shadow-sm">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {user.totalXP}
            </div>
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
              XP Total
            </div>
          </div>
          <div className="bg-muted dark:bg-muted border-ring dark:border-ring rounded-lg border bg-gradient-to-b p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {xpForNextLevel - user.currentXP}
            </div>
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
              XP Restante
            </div>
          </div>
          <div className="bg-muted dark:bg-muted border-ring dark:border-ring rounded-lg border bg-gradient-to-b p-3 shadow-sm">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              <Coins className="h-5 w-5" />
              <span className="coin-text">
                <span className="coin-emoji">🪙</span> {user.coins}
              </span>
            </div>
            <div className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Moedas 🪙
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
