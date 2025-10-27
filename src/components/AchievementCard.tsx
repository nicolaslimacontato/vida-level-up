import { Achievement } from "@/types/rpg";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Lock, Unlock, Trophy } from "lucide-react";

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const getRarityColor = () => {
    switch (achievement.rarity) {
      case "common":
        return "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600";
      case "rare":
        return "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600";
      case "epic":
        return "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-600";
      case "legendary":
        return "bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-600";
    }
  };

  const getRarityGlow = () => {
    switch (achievement.rarity) {
      case "common":
        return "";
      case "rare":
        return "shadow-lg shadow-blue-500/20";
      case "epic":
        return "shadow-lg shadow-purple-500/20";
      case "legendary":
        return "shadow-lg shadow-yellow-500/20";
    }
  };

  return (
    <Card
      className={`${getRarityColor()} ${getRarityGlow()} ${achievement.unlocked ? "border-green-500" : "opacity-60"} transition-all duration-300 hover:scale-105`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{achievement.icon}</span>
            <div>
              <CardTitle className="text-lg">{achievement.title}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {achievement.description}
              </p>
            </div>
          </div>
          {achievement.unlocked ? (
            <Trophy className="h-5 w-5 text-green-500" />
          ) : (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        {achievement.maxProgress > 1 && (
          <div className="mb-3">
            <div className="mb-1 flex justify-between text-xs">
              <span>Progresso</span>
              <span>
                {achievement.progress}/{achievement.maxProgress}
              </span>
            </div>
            <div className="bg-secondary h-2 overflow-hidden rounded-full">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Rewards */}
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold text-yellow-600">
            +{achievement.xpReward} XP
          </span>
          <span className="font-semibold text-amber-600">
            🪙 {achievement.coinReward}
          </span>
        </div>

        {/* Unlocked date */}
        {achievement.unlocked && achievement.unlockedAt && (
          <div className="text-muted-foreground mt-2 text-xs">
            Desbloqueado em:{" "}
            {new Date(achievement.unlockedAt).toLocaleDateString("pt-BR")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
