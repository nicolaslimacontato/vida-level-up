import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "@/types/rpg";
import { Coins } from "lucide-react";

interface UserHeaderProps {
  user: User;
  getXPForNextLevel: (level: number) => number;
  getLevelProgress: () => number;
}

export function UserHeader({
  user,
  getXPForNextLevel,
  getLevelProgress,
}: UserHeaderProps) {
  const xpForNextLevel = getXPForNextLevel(user.level);
  const progress = getLevelProgress();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-lg">
            {user.level}
          </div>
          <div>
            <div className="text-yellow-600 dark:text-yellow-400 font-semibold">
              Nível {user.level}
            </div>
            <div className="text-muted-foreground text-sm font-normal">
              Aventureiro da Vida Real
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Progresso para o próximo nível
            </span>
            <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
              {user.currentXP} / {xpForNextLevel} XP
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {user.totalXP}
            </div>
            <div className="text-xs text-muted-foreground">XP Total</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {xpForNextLevel - user.currentXP}
            </div>
            <div className="text-xs text-muted-foreground">XP Restante</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
              <Coins className="w-5 h-5" />
              {user.coins}
            </div>
            <div className="text-xs text-muted-foreground">Moedas 🪙</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
