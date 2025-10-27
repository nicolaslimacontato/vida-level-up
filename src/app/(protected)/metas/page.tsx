"use client";

import { useState } from "react";
import { useRPGContext } from "@/contexts/RPGContext";
import { GoalCard } from "@/components/GoalCard";
import { Target, Filter, Calendar, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MetasPage() {
  const { goals } = useRPGContext();
  const [filter, setFilter] = useState<"all" | "daily" | "weekly" | "monthly">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed" | "expired"
  >("all");

  const filteredGoals = goals?.filter((goal) => {
    if (filter !== "all" && goal.type !== filter) return false;

    const isExpired = goal.expiresAt && new Date(goal.expiresAt) < new Date();

    if (statusFilter === "active") return !goal.completed && !isExpired;
    if (statusFilter === "completed") return goal.completed;
    if (statusFilter === "expired") return !goal.completed && isExpired;

    return true;
  });

  const activeGoals =
    goals?.filter(
      (g) =>
        !g.completed && (!g.expiresAt || new Date(g.expiresAt) >= new Date()),
    ).length || 0;
  const completedGoals = goals?.filter((g) => g.completed).length || 0;
  const expiredGoals =
    goals?.filter(
      (g) => !g.completed && g.expiresAt && new Date(g.expiresAt) < new Date(),
    ).length || 0;
  const totalGoals = goals?.length || 0;

  const getTypeStats = (): Record<string, { active: number; completed: number; total: number }> => {
    if (!goals) return {
      daily: { active: 0, completed: 0, total: 0 },
      weekly: { active: 0, completed: 0, total: 0 },
      monthly: { active: 0, completed: 0, total: 0 },
    };

    const stats: Record<string, { active: number; completed: number; total: number }> = {
      daily: { active: 0, completed: 0, total: 0 },
      weekly: { active: 0, completed: 0, total: 0 },
      monthly: { active: 0, completed: 0, total: 0 },
    };

    goals.forEach((goal) => {
      stats[goal.type].total++;
      if (goal.completed) {
        stats[goal.type].completed++;
      } else if (!goal.expiresAt || new Date(goal.expiresAt) >= new Date()) {
        stats[goal.type].active++;
      }
    });

    return stats;
  };

  const typeStats = getTypeStats();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-title1 mb-2 flex items-center gap-3 font-bold">
          <Target className="h-8 w-8 text-blue-500" />
          Metas
        </h1>
        <p className="text-paragraph text-muted-foreground">
          Complete suas metas diárias, semanais e mensais para ganhar
          recompensas especiais!
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{activeGoals}</div>
          <div className="text-muted-foreground text-sm">Ativas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {completedGoals}
          </div>
          <div className="text-muted-foreground text-sm">Concluídas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {expiredGoals}
          </div>
          <div className="text-muted-foreground text-sm">Expiradas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{totalGoals}</div>
          <div className="text-muted-foreground text-sm">Total</div>
        </Card>
      </div>

      {/* Type Stats */}
      <div className="mb-6">
        <h2 className="text-title2 mb-4 font-semibold">Progresso por Tipo</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Object.entries(typeStats).map(([type, stats]) => {
            const percentage =
              stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0;
            const typeLabels = {
              daily: "Diárias",
              weekly: "Semanais",
              monthly: "Mensais",
            };
            const typeColors = {
              daily: "bg-green-500",
              weekly: "bg-blue-500",
              monthly: "bg-purple-500",
            };
            const typeIcons = {
              daily: "📅",
              weekly: "📊",
              monthly: "🗓️",
            };

            return (
              <Card key={type} className="p-4">
                <div className="text-center">
                  <div className="mb-2 text-3xl">
                    {typeIcons[type as keyof typeof typeIcons]}
                  </div>
                  <div className="mb-1 text-lg font-semibold">
                    {typeLabels[type as keyof typeof typeLabels]}
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    {stats.completed}/{stats.total}
                  </div>
                  <div className="bg-secondary mb-2 h-2 w-full rounded-full">
                    <div
                      className={`h-2 rounded-full ${typeColors[type as keyof typeof typeColors]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {percentage}%
                  </div>
                </div>
              </Card>
            );
          })}
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
            Todas ({totalGoals})
          </Button>
          <Button
            variant={filter === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("daily")}
          >
            <Badge variant="secondary" className="mr-1">
              📅
            </Badge>
            Diárias ({typeStats.daily.total})
          </Button>
          <Button
            variant={filter === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("weekly")}
          >
            <Badge variant="secondary" className="mr-1">
              📊
            </Badge>
            Semanais ({typeStats.weekly.total})
          </Button>
          <Button
            variant={filter === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("monthly")}
          >
            <Badge variant="secondary" className="mr-1">
              🗓️
            </Badge>
            Mensais ({typeStats.monthly.total})
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            Todos os Status
          </Button>
          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("active")}
          >
            <Clock className="mr-1 inline h-4 w-4" />
            Ativas ({activeGoals})
          </Button>
          <Button
            variant={statusFilter === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("completed")}
          >
            <CheckCircle className="mr-1 inline h-4 w-4" />
            Concluídas ({completedGoals})
          </Button>
          <Button
            variant={statusFilter === "expired" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("expired")}
          >
            <Calendar className="mr-1 inline h-4 w-4" />
            Expiradas ({expiredGoals})
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGoals?.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {filteredGoals?.length === 0 && (
        <div className="py-12 text-center">
          <Target className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">
            Nenhuma meta encontrada
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros para ver mais metas.
          </p>
        </div>
      )}
    </div>
  );
}
