"use client";

import { useState } from "react";
import { useRPGContext } from "@/contexts/RPGContext";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { History, Filter, Calendar, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AtividadesPage() {
  const { activityLog, user } = useRPGContext();
  const [filter, setFilter] = useState<
    "all" | "quest" | "level" | "achievement" | "goal"
  >("all");
  const [timeFilter, setTimeFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  const filteredActivities = activityLog?.filter((activity) => {
    // Type filter
    if (filter !== "all") {
      if (filter === "quest" && !activity.actionType.includes("quest"))
        return false;
      if (filter === "level" && activity.actionType !== "level_up")
        return false;
      if (
        filter === "achievement" &&
        activity.actionType !== "achievement_unlocked"
      )
        return false;
      if (filter === "goal" && activity.actionType !== "goal_completed")
        return false;
    }

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const activityDate = new Date(activity.createdAt);

      if (timeFilter === "today") {
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        if (activityDate < today) return false;
      } else if (timeFilter === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (activityDate < weekAgo) return false;
      } else if (timeFilter === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (activityDate < monthAgo) return false;
      }
    }

    return true;
  });

  const getActivityStats = () => {
    if (!activityLog)
      return { total: 0, quests: 0, levels: 0, achievements: 0, goals: 0 };

    return {
      total: activityLog.length,
      quests: activityLog.filter((a) => a.actionType.includes("quest")).length,
      levels: activityLog.filter((a) => a.actionType === "level_up").length,
      achievements: activityLog.filter(
        (a) => a.actionType === "achievement_unlocked",
      ).length,
      goals: activityLog.filter((a) => a.actionType === "goal_completed")
        .length,
    };
  };

  const getTimeStats = () => {
    if (!activityLog) return { today: 0, week: 0, month: 0 };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      today: activityLog.filter((a) => new Date(a.createdAt) >= today).length,
      week: activityLog.filter((a) => new Date(a.createdAt) >= weekAgo).length,
      month: activityLog.filter((a) => new Date(a.createdAt) >= monthAgo)
        .length,
    };
  };

  const activityStats = getActivityStats();
  const timeStats = getTimeStats();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-title1 mb-2 flex items-center gap-3 font-bold">
          <History className="h-8 w-8 text-blue-500" />
          Atividades
        </h1>
        <p className="text-paragraph text-muted-foreground">
          Acompanhe todo o seu progresso e conquistas no Vida Level Up!
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {activityStats.total}
          </div>
          <div className="text-muted-foreground text-sm">Total</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {activityStats.quests}
          </div>
          <div className="text-muted-foreground text-sm">Quests</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {activityStats.levels}
          </div>
          <div className="text-muted-foreground text-sm">Levels</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {activityStats.achievements}
          </div>
          <div className="text-muted-foreground text-sm">Conquistas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-cyan-600">
            {activityStats.goals}
          </div>
          <div className="text-muted-foreground text-sm">Metas</div>
        </Card>
      </div>

      {/* Time Stats */}
      <div className="mb-6">
        <h2 className="text-title2 mb-4 font-semibold">
          Atividades por Período
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="text-center">
              <div className="mb-2 text-3xl">📅</div>
              <div className="mb-1 text-lg font-semibold">Hoje</div>
              <div className="text-2xl font-bold text-green-600">
                {timeStats.today}
              </div>
              <div className="text-muted-foreground text-sm">atividades</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="mb-2 text-3xl">📊</div>
              <div className="mb-1 text-lg font-semibold">Esta Semana</div>
              <div className="text-2xl font-bold text-blue-600">
                {timeStats.week}
              </div>
              <div className="text-muted-foreground text-sm">atividades</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <div className="mb-2 text-3xl">🗓️</div>
              <div className="mb-1 text-lg font-semibold">Este Mês</div>
              <div className="text-2xl font-bold text-purple-600">
                {timeStats.month}
              </div>
              <div className="text-muted-foreground text-sm">atividades</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filtros:
          </span>

          {/* Type Filter */}
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todas ({activityStats.total})
          </Button>
          <Button
            variant={filter === "quest" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("quest")}
          >
            <Badge variant="secondary" className="mr-1">
              🎯
            </Badge>
            Quests ({activityStats.quests})
          </Button>
          <Button
            variant={filter === "level" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("level")}
          >
            <Badge variant="secondary" className="mr-1">
              ⬆️
            </Badge>
            Levels ({activityStats.levels})
          </Button>
          <Button
            variant={filter === "achievement" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("achievement")}
          >
            <Badge variant="secondary" className="mr-1">
              🏅
            </Badge>
            Conquistas ({activityStats.achievements})
          </Button>
          <Button
            variant={filter === "goal" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("goal")}
          >
            <Badge variant="secondary" className="mr-1">
              🎯
            </Badge>
            Metas ({activityStats.goals})
          </Button>
        </div>

        {/* Time Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={timeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("all")}
          >
            Todo o Tempo
          </Button>
          <Button
            variant={timeFilter === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("today")}
          >
            <Clock className="mr-1 inline h-4 w-4" />
            Hoje ({timeStats.today})
          </Button>
          <Button
            variant={timeFilter === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("week")}
          >
            <Calendar className="mr-1 inline h-4 w-4" />
            Esta Semana ({timeStats.week})
          </Button>
          <Button
            variant={timeFilter === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeFilter("month")}
          >
            <TrendingUp className="mr-1 inline h-4 w-4" />
            Este Mês ({timeStats.month})
          </Button>
        </div>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Timeline de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityTimeline activities={filteredActivities || []} limit={50} />
        </CardContent>
      </Card>
    </div>
  );
}
