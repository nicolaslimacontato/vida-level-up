import { Goal } from "@/types/rpg";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CheckCircle, Clock, Target } from "lucide-react";

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const getTypeColor = () => {
    switch (goal.type) {
      case "daily":
        return "bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-600";
      case "weekly":
        return "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600";
      case "monthly":
        return "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-600";
    }
  };

  const getTypeIcon = () => {
    switch (goal.type) {
      case "daily":
        return "📅";
      case "weekly":
        return "📊";
      case "monthly":
        return "🗓️";
    }
  };

  const getTypeLabel = () => {
    switch (goal.type) {
      case "daily":
        return "Diária";
      case "weekly":
        return "Semanal";
      case "monthly":
        return "Mensal";
    }
  };

  const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  const isExpired = goal.expiresAt && new Date(goal.expiresAt) < new Date();
  const timeRemaining = goal.expiresAt
    ? getTimeRemaining(goal.expiresAt)
    : null;

  return (
    <Card
      className={`${getTypeColor()} ${goal.completed ? "border-green-500" : isExpired ? "opacity-60" : ""} transition-all duration-300 hover:scale-105`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTypeIcon()}</span>
            <div>
              <CardTitle className="text-lg">{goal.title}</CardTitle>
              <p className="text-muted-foreground text-sm">
                {goal.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {goal.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : isExpired ? (
              <Clock className="h-5 w-5 text-gray-400" />
            ) : (
              <Target className="h-5 w-5 text-blue-500" />
            )}
            <span className="rounded bg-white/50 px-2 py-1 text-xs font-medium dark:bg-black/50">
              {getTypeLabel()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="mb-1 flex justify-between text-xs">
            <span>Progresso</span>
            <span>
              {goal.currentValue}/{goal.targetValue}
            </span>
          </div>
          <div className="bg-secondary h-2 overflow-hidden rounded-full">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Rewards */}
        <div className="mb-2 flex items-center gap-4 text-sm">
          <span className="font-semibold text-yellow-600">
            +{goal.xpReward} XP
          </span>
          <span className="font-semibold text-amber-600">
            🪙 {goal.coinReward}
          </span>
        </div>

        {/* Time remaining or completion date */}
        {goal.completed && goal.completedAt && (
          <div className="text-muted-foreground text-xs">
            ✅ Concluída em:{" "}
            {new Date(goal.completedAt).toLocaleDateString("pt-BR")}
          </div>
        )}

        {!goal.completed && timeRemaining && (
          <div className="text-muted-foreground text-xs">
            ⏰ {timeRemaining}
          </div>
        )}

        {isExpired && !goal.completed && (
          <div className="text-xs text-red-500">⏰ Meta expirada</div>
        )}
      </CardContent>
    </Card>
  );
}

function getTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return "Expirada";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h restantes`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m restantes`;
  } else {
    return `${minutes}m restantes`;
  }
}
