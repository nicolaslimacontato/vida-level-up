import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/types/rpg";
import { Coins } from "lucide-react";

interface UserHeaderProps {
  user: User;
  getXPForNextLevel: (level: number) => number;
  getLevelProgress: () => number;
}

export function UserHeader({ user, getXPForNextLevel, getLevelProgress }: UserHeaderProps) {
  const xpForNextLevel = getXPForNextLevel(user.level);
  const progress = getLevelProgress();

  return (
    <Card className="w-full border-2 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-lg border-2 border-amber-700 shadow-inner">
              {user.level}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-amber-800">
              <span className="text-xs font-bold text-white">XP</span>
            </div>
          </div>
          <div>
            <div className="text-amber-700 dark:text-amber-300 font-bold text-lg">Nível {user.level}</div>
            <div className="text-amber-600 dark:text-amber-400 text-sm font-medium">Aventureiro da Vida Real</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-amber-700 dark:text-amber-300 font-medium">Progresso para o próximo nível</span>
            <span className="text-green-600 dark:text-green-400 font-bold">{user.currentXP} / {xpForNextLevel} XP</span>
          </div>

          {/* Barra de XP estilo Minecraft */}
          <div className="relative h-6 w-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-sm overflow-hidden border-2 border-gray-900 shadow-inner">
            {/* Brilho animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent animate-pulse"></div>

            {/* Barra de progresso */}
            <div
              className="h-full relative overflow-hidden rounded-sm"
              style={{ width: `${progress}%` }}
            >
              {/* Gradiente animado fluindo */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-700 to-green-400 animate-gradient-x"></div>
            </div>

            {/* Divisórias estilo Minecraft */}
            <div className="absolute inset-0 flex justify-between pointer-events-none">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="h-full w-px bg-gray-700/50"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards de XP e moedas */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gradient-to-b bg-muted dark:bg-muted  rounded-lg p-3 border border-ring dark:border-ring shadow-sm">
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">{user.totalXP}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">XP Total</div>
          </div>
          <div className="bg-gradient-to-b bg-muted dark:bg-muted  rounded-lg p-3 border border-ring dark:border-ring shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{xpForNextLevel - user.currentXP}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">XP Restante</div>
          </div>
          <div className="bg-gradient-to-b bg-muted dark:bg-muted  rounded-lg p-3 border border-ring dark:border-ring shadow-sm">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <Coins className="w-5 h-5" />
              {user.coins}
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Moedas 🪙</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
