import { ActivityLogEntry } from "@/types/rpg";
import { Card, CardContent } from "./ui/card";
import { Clock, TrendingUp, Coins } from "lucide-react";

interface ActivityTimelineProps {
  activities: ActivityLogEntry[];
  limit?: number;
}

export function ActivityTimeline({
  activities,
  limit = 20,
}: ActivityTimelineProps) {
  const displayActivities = activities.slice(0, limit);

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - activityDate.getTime()) / 1000,
    );

    if (diffInSeconds < 60) {
      return "Agora mesmo";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m atrás`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d atrás`;
    }
  };

  const getActivityIcon = (activity: ActivityLogEntry): string => {
    return activity.icon;
  };

  const getActivityColor = (activity: ActivityLogEntry): string => {
    return activity.color;
  };

  const getRewardsDisplay = (
    activity: ActivityLogEntry,
  ): React.ReactElement | null => {
    if (activity.xpGained === 0 && activity.coinsGained === 0) return null;

    return (
      <div className="text-muted-foreground flex items-center gap-2 text-xs">
        {activity.xpGained > 0 && (
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-green-600">+{activity.xpGained} XP</span>
          </div>
        )}
        {activity.coinsGained > 0 && (
          <div className="flex items-center gap-1">
            <Coins className="h-3 w-3 text-amber-600" />
            <span className="text-amber-600">+{activity.coinsGained} 🪙</span>
          </div>
        )}
        {activity.coinsGained < 0 && (
          <div className="flex items-center gap-1">
            <Coins className="h-3 w-3 text-red-600" />
            <span className="text-red-600">{activity.coinsGained} 🪙</span>
          </div>
        )}
      </div>
    );
  };

  if (displayActivities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">
            Nenhuma atividade recente
          </h3>
          <p className="text-muted-foreground">
            Suas atividades aparecerão aqui conforme você progride no jogo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {displayActivities.map((activity, index) => (
        <div key={activity.id} className="relative">
          {/* Timeline line */}
          {index < displayActivities.length - 1 && (
            <div className="bg-border absolute top-12 left-6 h-8 w-0.5" />
          )}

          {/* Activity card */}
          <Card className="ml-8">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-lg ${getActivityColor(activity)}`}
                >
                  {getActivityIcon(activity)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">
                        {activity.title}
                      </h4>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {activity.description}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <span className="text-muted-foreground text-xs">
                        {formatTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Rewards */}
                  {getRewardsDisplay(activity)}

                  {/* Level change */}
                  {activity.levelBefore !== activity.levelAfter && (
                    <div className="text-muted-foreground mt-2 text-xs">
                      <span className="font-medium">Nível:</span>{" "}
                      {activity.levelBefore} → {activity.levelAfter}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
