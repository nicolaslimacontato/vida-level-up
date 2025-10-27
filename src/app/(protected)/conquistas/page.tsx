"use client";

import { useState } from "react";
import { useRPGContext } from "@/contexts/RPGContext";
import { AchievementCard } from "@/components/AchievementCard";
import { Trophy, Lock, Unlock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ConquistasPage() {
  const { achievements } = useRPGContext();
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "beginner" | "veteran" | "master" | "legendary"
  >("all");

  const filteredAchievements = achievements?.filter((a) => {
    if (filter === "unlocked") return a.unlocked;
    if (filter === "locked") return !a.unlocked;
    if (categoryFilter !== "all") return a.category === categoryFilter;
    return true;
  });

  const unlockedCount = achievements?.filter((a) => a.unlocked).length || 0;
  const totalCount = achievements?.length || 0;

  const getCategoryStats = (): Record<string, { unlocked: number; total: number }> => {
    if (!achievements) return {
      beginner: { unlocked: 0, total: 0 },
      veteran: { unlocked: 0, total: 0 },
      master: { unlocked: 0, total: 0 },
      legendary: { unlocked: 0, total: 0 },
    };

    const stats: Record<string, { unlocked: number; total: number }> = {
      beginner: { unlocked: 0, total: 0 },
      veteran: { unlocked: 0, total: 0 },
      master: { unlocked: 0, total: 0 },
      legendary: { unlocked: 0, total: 0 },
    };

    achievements.forEach((achievement) => {
      stats[achievement.category].total++;
      if (achievement.unlocked) {
        stats[achievement.category].unlocked++;
      }
    });

    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-title1 mb-2 flex items-center gap-3 font-bold">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Conquistas
        </h1>
        <p className="text-paragraph text-muted-foreground">
          Desbloqueie conquistas épicas ao progredir no jogo!
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {unlockedCount}
          </div>
          <div className="text-muted-foreground text-sm">Desbloqueadas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {totalCount - unlockedCount}
          </div>
          <div className="text-muted-foreground text-sm">Bloqueadas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {totalCount > 0
              ? Math.round((unlockedCount / totalCount) * 100)
              : 0}
            %
          </div>
          <div className="text-muted-foreground text-sm">Conclusão</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{totalCount}</div>
          <div className="text-muted-foreground text-sm">Total</div>
        </Card>
      </div>

      {/* Category Stats */}
      <div className="mb-6">
        <h2 className="text-title2 mb-4 font-semibold">
          Progresso por Categoria
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.entries(categoryStats).map(([category, stats]) => {
            const percentage =
              stats.total > 0
                ? Math.round((stats.unlocked / stats.total) * 100)
                : 0;
            const categoryLabels = {
              beginner: "Iniciante",
              veteran: "Veterano",
              master: "Mestre",
              legendary: "Lendário",
            };
            const categoryColors = {
              beginner: "bg-gray-500",
              veteran: "bg-blue-500",
              master: "bg-purple-500",
              legendary: "bg-yellow-500",
            };

            return (
              <Card key={category} className="p-4">
                <div className="text-center">
                  <div className="mb-1 text-lg font-semibold">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </div>
                  <div className="mb-2 text-2xl font-bold">
                    {stats.unlocked}/{stats.total}
                  </div>
                  <div className="bg-secondary mb-2 h-2 w-full rounded-full">
                    <div
                      className={`h-2 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`}
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

          {/* Status Filter */}
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todas ({totalCount})
          </Button>
          <Button
            variant={filter === "unlocked" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unlocked")}
          >
            <Unlock className="mr-1 inline h-4 w-4" />
            Desbloqueadas ({unlockedCount})
          </Button>
          <Button
            variant={filter === "locked" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("locked")}
          >
            <Lock className="mr-1 inline h-4 w-4" />
            Bloqueadas ({totalCount - unlockedCount})
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("all")}
          >
            Todas as Categorias
          </Button>
          <Button
            variant={categoryFilter === "beginner" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("beginner")}
          >
            <Badge variant="secondary" className="mr-1">
              Iniciante
            </Badge>
            {categoryStats.beginner.unlocked}/{categoryStats.beginner.total}
          </Button>
          <Button
            variant={categoryFilter === "veteran" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("veteran")}
          >
            <Badge variant="secondary" className="mr-1">
              Veterano
            </Badge>
            {categoryStats.veteran.unlocked}/{categoryStats.veteran.total}
          </Button>
          <Button
            variant={categoryFilter === "master" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("master")}
          >
            <Badge variant="secondary" className="mr-1">
              Mestre
            </Badge>
            {categoryStats.master.unlocked}/{categoryStats.master.total}
          </Button>
          <Button
            variant={categoryFilter === "legendary" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("legendary")}
          >
            <Badge variant="secondary" className="mr-1">
              Lendário
            </Badge>
            {categoryStats.legendary.unlocked}/{categoryStats.legendary.total}
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements?.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>

      {filteredAchievements?.length === 0 && (
        <div className="py-12 text-center">
          <Trophy className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">
            Nenhuma conquista encontrada
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros para ver mais conquistas.
          </p>
        </div>
      )}
    </div>
  );
}
