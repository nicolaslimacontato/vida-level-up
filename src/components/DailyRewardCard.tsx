import React from "react";
import { DailyReward } from "@/types/rpg";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Gift,
  Coins,
  Zap,
  Star,
  CheckCircle,
  Clock,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyRewardCardProps {
  reward: DailyReward;
  onClaim: (rewardId: string) => void;
  loading?: boolean;
  isToday?: boolean;
  consecutiveDays?: number;
}

const getRewardIcon = (type: string) => {
  switch (type) {
    case "coins":
      return <Coins className="h-5 w-5 text-yellow-500" />;
    case "xp":
      return <Zap className="h-5 w-5 text-blue-500" />;
    case "item":
      return <Gift className="h-5 w-5 text-purple-500" />;
    case "special":
      return <Crown className="h-5 w-5 text-orange-500" />;
    default:
      return <Star className="h-5 w-5 text-gray-500" />;
  }
};

const getRewardColor = (type: string) => {
  switch (type) {
    case "coins":
      return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    case "xp":
      return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    case "item":
      return "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
    case "special":
      return "bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
    default:
      return "bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
  }
};

const getRewardRarity = (day: number) => {
  if (day === 7 || day === 14 || day === 21 || day === 28) return "epic";
  if (day === 30) return "legendary";
  if (day % 5 === 0) return "rare";
  return "common";
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "text-orange-600 dark:text-orange-400";
    case "epic":
      return "text-purple-600 dark:text-purple-400";
    case "rare":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

export const DailyRewardCard: React.FC<DailyRewardCardProps> = ({
  reward,
  onClaim,
  loading = false,
  isToday = false,
  consecutiveDays = 0,
}) => {
  const dayNumber = parseInt(reward.date.split("-")[2]);
  const rarity = getRewardRarity(dayNumber);
  const rewardColor = getRewardColor(reward.type);
  const rarityColor = getRarityColor(rarity);

  const formatRewardValue = () => {
    if (reward.type === "coins") {
      return `${reward.value} moedas`;
    } else if (reward.type === "xp") {
      return `${reward.value} XP`;
    } else if (reward.type === "item") {
      return reward.itemName || "Item especial";
    } else {
      return reward.description;
    }
  };

  const getStreakBonus = () => {
    if (consecutiveDays >= 7) return "🔥 +50%";
    if (consecutiveDays >= 3) return "⚡ +25%";
    return "";
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200 hover:shadow-lg",
        rewardColor,
        isToday && "ring-2 ring-blue-500 dark:ring-blue-400",
        reward.claimed && "opacity-60",
      )}
    >
      {/* Day Badge */}
      <div className="absolute top-2 right-2">
        <Badge
          variant={isToday ? "default" : "secondary"}
          className={cn(
            "text-xs font-bold",
            isToday && "bg-blue-500 hover:bg-blue-600",
          )}
        >
          Dia {dayNumber}
        </Badge>
      </div>

      {/* Rarity Indicator */}
      <div className="absolute top-2 left-2">
        <Badge variant="outline" className={cn("text-xs", rarityColor)}>
          {rarity === "legendary" && "👑"}
          {rarity === "epic" && "💎"}
          {rarity === "rare" && "⭐"}
          {rarity === "common" && "🔸"}
        </Badge>
      </div>

      <div className="p-4 pt-12">
        {/* Reward Icon */}
        <div className="mb-3 flex items-center justify-center">
          <div className="rounded-full bg-white p-3 shadow-md dark:bg-gray-800">
            {getRewardIcon(reward.type)}
          </div>
        </div>

        {/* Reward Info */}
        <div className="mb-4 text-center">
          <h3 className="mb-1 text-lg font-semibold">{formatRewardValue()}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {reward.description}
          </p>

          {/* Streak Bonus */}
          {getStreakBonus() && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {getStreakBonus()}
              </Badge>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mb-4 flex items-center justify-center">
          {reward.claimed ? (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="mr-1 h-4 w-4" />
              <span className="text-sm font-medium">Coletado</span>
            </div>
          ) : isToday ? (
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <Clock className="mr-1 h-4 w-4" />
              <span className="text-sm font-medium">Disponível hoje</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              <span className="text-sm">
                {new Date(reward.date).toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}
        </div>

        {/* Claim Button */}
        {!reward.claimed && isToday && (
          <Button
            onClick={() => onClaim(reward.id)}
            disabled={loading}
            className="w-full"
            size="sm"
          >
            {loading ? "Coletando..." : "Coletar Recompensa"}
          </Button>
        )}
      </div>

      {/* Special Effects */}
      {isToday && !reward.claimed && (
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-blue-200/20 to-transparent" />
        </div>
      )}
    </Card>
  );
};
