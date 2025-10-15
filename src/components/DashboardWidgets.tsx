"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Coins, Zap, Star } from "lucide-react";
import { useRPGContext } from "@/contexts/RPGContext";
import {
  StaggerContainer,
  StaggerItem,
  HoverScale,
} from "@/components/ui/animations";
import { StatCard } from "@/components/ui/stat-card";
import { CircularProgress } from "@/components/ui/progress-card";

interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function DashboardWidget({ title, children, className }: DashboardWidgetProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { user } = useRPGContext();

  return (
    <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StaggerItem>
        <HoverScale>
          <StatCard
            title="Nível Atual"
            value={user.level}
            icon={<Trophy className="h-6 w-6 text-yellow-500" />}
            changeLabel={`${user.currentXP} / ${user.level * 100} XP`}
            trend="up"
          />
        </HoverScale>
      </StaggerItem>

      <StaggerItem>
        <HoverScale>
          <StatCard
            title="XP Total"
            value={user.totalXP.toLocaleString()}
            icon={<Star className="h-6 w-6 text-blue-500" />}
            changeLabel="Acumulado"
            trend="up"
          />
        </HoverScale>
      </StaggerItem>

      <StaggerItem>
        <HoverScale>
          <StatCard
            title="Moedas"
            value={`🪙 ${user.coins.toLocaleString()}`}
            icon={<Coins className="h-6 w-6 text-amber-500" />}
            changeLabel="Disponíveis"
            trend="up"
          />
        </HoverScale>
      </StaggerItem>

      <StaggerItem>
        <HoverScale>
          <StatCard
            title="Streak"
            value={`🔥 ${user.currentStreak}`}
            icon={<Zap className="h-6 w-6 text-orange-500" />}
            changeLabel={`Melhor: ${user.bestStreak} dias`}
            trend={user.currentStreak > 0 ? "up" : "neutral"}
          />
        </HoverScale>
      </StaggerItem>
    </StaggerContainer>
  );
}

export function QuestProgress() {
  const { quests } = useRPGContext();

  const completedQuests = quests.filter((q) => q.completed).length;
  const totalQuests = quests.length;
  const completionRate =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  return (
    <DashboardWidget title="Progresso das Quests">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Taxa de Conclusão</span>
          <Badge variant="secondary">{completionRate}%</Badge>
        </div>

        <Progress value={completionRate} className="h-2" />

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {completedQuests}
            </div>
            <div className="text-muted-foreground text-sm">Completadas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {totalQuests - completedQuests}
            </div>
            <div className="text-muted-foreground text-sm">Pendentes</div>
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
}

export function DailyProgress() {
  const { quests } = useRPGContext();

  const todayQuests = quests.filter((q) => q.category === "daily");
  const todayCompleted = todayQuests.filter((q) => q.completed).length;
  const dailyProgress =
    todayQuests.length > 0
      ? Math.round((todayCompleted / todayQuests.length) * 100)
      : 0;

  return (
    <DashboardWidget title="Progresso Diário">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Hoje</span>
          <Badge variant="secondary">{dailyProgress}%</Badge>
        </div>

        <CircularProgress
          value={dailyProgress}
          size="lg"
          color="success"
          showText={true}
        />

        <div className="text-center">
          <div className="text-muted-foreground text-sm">
            {todayCompleted} de {todayQuests.length} quests concluídas
          </div>
        </div>
      </div>
    </DashboardWidget>
  );
}

export function AttributeOverview() {
  const { user } = useRPGContext();

  const attributes = [
    {
      name: "Força",
      value: user.attributes.strength,
      icon: "💪",
      color: "text-red-500",
    },
    {
      name: "Inteligência",
      value: user.attributes.intelligence,
      icon: "🧠",
      color: "text-blue-500",
    },
    {
      name: "Carisma",
      value: user.attributes.charisma,
      icon: "✨",
      color: "text-purple-500",
    },
    {
      name: "Disciplina",
      value: user.attributes.discipline,
      icon: "🎯",
      color: "text-green-500",
    },
  ];

  return (
    <DashboardWidget title="Atributos">
      <div className="space-y-3">
        {attributes.map((attr) => (
          <div key={attr.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{attr.icon}</span>
              <span className="text-sm font-medium">{attr.name}</span>
            </div>
            <Badge variant="outline" className={attr.color}>
              {attr.value}
            </Badge>
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}
