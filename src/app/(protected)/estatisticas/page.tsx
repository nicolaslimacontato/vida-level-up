"use client";

import React from "react";
import { StatGrid } from "@/components/ui/stat-card";
import { FadeIn } from "@/components/ui/animations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  Target,
  Trophy,
  Coins,
  Zap,
  Brain,
  Award,
  Activity,
} from "lucide-react";
import { useRPGContext } from "@/contexts/RPGContext";

export default function EstatisticasPage() {
  const {
    user,
    quests,
    mainQuests,
    rewards,
    getXPForNextLevel,
    getLevelProgress,
    getStreakMultiplier,
    getStrengthXPReduction,
    getIntelligenceBonus,
    getCharismaDiscount,
  } = useRPGContext();

  // Calcular estatísticas
  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => q.completed).length;
  const pendingQuests = totalQuests - completedQuests;

  const totalMainQuests = mainQuests.length;
  const completedMainQuests = mainQuests.filter((q) => q.completed).length;
  const activeMainQuests = totalMainQuests - completedMainQuests;

  const totalSteps = mainQuests.reduce(
    (acc, quest) => acc + quest.steps.length,
    0,
  );
  const completedSteps = mainQuests.reduce(
    (acc, quest) => acc + quest.steps.filter((step) => step.completed).length,
    0,
  );

  const totalXP = user.totalXP;
  const currentLevel = user.level;
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const levelProgress = getLevelProgress(user.currentXP, currentLevel);
  const remainingXP = xpForNextLevel - user.currentXP;

  const totalCoins = user.coins;
  const currentStreak = user.currentStreak;
  const bestStreak = user.bestStreak;
  const streakMultiplier = getStreakMultiplier();

  const lastAccess = user.lastAccessDate ? new Date(user.lastAccessDate) : null;
  const daysSinceLastAccess = lastAccess
    ? Math.floor((Date.now() - lastAccess.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Estatísticas de atributos
  const strength = user.attributes.strength;
  const intelligence = user.attributes.intelligence;
  const charisma = user.attributes.charisma;
  const discipline = user.attributes.discipline;

  const strengthReduction = getStrengthXPReduction(strength);
  const intelligenceBonus = getIntelligenceBonus(intelligence);
  const charismaDiscount = getCharismaDiscount(charisma);

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-title1 mb-2 flex items-center gap-3 font-bold">
            <BarChart3 className="text-primary h-8 w-8" />
            Estatísticas
          </h1>
          <p className="text-paragraph text-muted-foreground">
            Acompanhe seu progresso e performance no Vida Level Up
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <FadeIn delay={0.1}>
          <div className="mb-12">
            <StatGrid
              stats={[
                {
                  title: "Nível Atual",
                  value: currentLevel,
                  icon: <span className="text-2xl">🎯</span>,
                  changeLabel: `${user.currentXP} / ${xpForNextLevel} XP`,
                  trend: "up",
                },
                {
                  title: "XP Total",
                  value: totalXP.toLocaleString(),
                  icon: <span className="text-2xl">🏆</span>,
                  changeLabel: `${remainingXP.toLocaleString()} XP restante`,
                  trend: "up",
                },
                {
                  title: "Moedas",
                  value: `🪙 ${totalCoins.toLocaleString()}`,
                  icon: <Coins className="h-6 w-6" />,
                  changeLabel: "Acumuladas",
                  trend: "up",
                },
                {
                  title: "Streak Atual",
                  value: `🔥 ${currentStreak} dias`,
                  icon: <Zap className="h-6 w-6" />,
                  changeLabel: `Melhor: ${bestStreak} dias (x${streakMultiplier.toFixed(1)})`,
                  trend: currentStreak > 0 ? "up" : "neutral",
                },
              ]}
            />
          </div>
        </FadeIn>

        {/* Progresso das Quests */}
        <FadeIn delay={0.2}>
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Quests Diárias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {completedQuests}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Completadas
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {pendingQuests}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Pendentes
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Taxa de conclusão</span>
                    <span>
                      {totalQuests > 0
                        ? Math.round((completedQuests / totalQuests) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="bg-secondary h-2 w-full rounded-full">
                    <div
                      className="h-2 rounded-full bg-green-500 transition-all duration-300"
                      style={{
                        width: `${totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-500" />
                  Missões Principais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {completedMainQuests}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      Completadas
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {activeMainQuests}
                    </div>
                    <div className="text-muted-foreground text-sm">Ativas</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Steps completados</span>
                    <span>
                      {completedSteps}/{totalSteps}
                    </span>
                  </div>
                  <div className="bg-secondary h-2 w-full rounded-full">
                    <div
                      className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                      style={{
                        width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Atributos e Efeitos */}
        <FadeIn delay={0.3}>
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="text-primary h-5 w-5" />
                  Atributos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
                    <div className="mb-1 text-2xl">💪</div>
                    <div className="text-xl font-bold text-red-600">
                      {strength}
                    </div>
                    <div className="text-muted-foreground text-xs">Força</div>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-900/20">
                    <div className="mb-1 text-2xl">🧠</div>
                    <div className="text-xl font-bold text-blue-600">
                      {intelligence}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Inteligência
                    </div>
                  </div>
                  <div className="rounded-lg bg-pink-50 p-3 text-center dark:bg-pink-900/20">
                    <div className="mb-1 text-2xl">😎</div>
                    <div className="text-xl font-bold text-pink-600">
                      {charisma}
                    </div>
                    <div className="text-muted-foreground text-xs">Carisma</div>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-3 text-center dark:bg-yellow-900/20">
                    <div className="mb-1 text-2xl">⚡</div>
                    <div className="text-xl font-bold text-yellow-600">
                      {discipline}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Disciplina
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="text-primary h-5 w-5" />
                  Efeitos dos Atributos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                  <div className="flex items-center gap-2">
                    <span>💪</span>
                    <span className="text-sm font-medium">Redução de XP</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">
                    {strengthReduction}%
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2">
                    <span>🧠</span>
                    <span className="text-sm font-medium">Bônus de XP</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    +{intelligenceBonus}%
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-pink-50 p-2 dark:bg-pink-900/20">
                  <div className="flex items-center gap-2">
                    <span>😎</span>
                    <span className="text-sm font-medium">
                      Desconto na Loja
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-pink-600">
                    {charismaDiscount}%
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-2 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-2">
                    <span>⚡</span>
                    <span className="text-sm font-medium">
                      Multiplicador de Streak
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600">
                    x{streakMultiplier.toFixed(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </FadeIn>

        {/* Informações Técnicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-primary h-5 w-5" />
              Informações Técnicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <div className="text-muted-foreground text-sm font-medium">
                  Último Acesso
                </div>
                <div className="text-sm">
                  {lastAccess
                    ? lastAccess.toLocaleDateString("pt-BR")
                    : "Nunca"}
                </div>
                {daysSinceLastAccess > 0 && (
                  <div className="text-muted-foreground text-xs">
                    {daysSinceLastAccess} dia
                    {daysSinceLastAccess > 1 ? "s" : ""} atrás
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-sm font-medium">
                  Progresso do Nível
                </div>
                <div className="text-sm">{levelProgress.toFixed(1)}%</div>
                <div className="text-muted-foreground text-xs">
                  {user.currentXP} / {xpForNextLevel} XP
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-sm font-medium">
                  Multiplicador Ativo
                </div>
                <div className="text-sm font-semibold text-orange-600">
                  x{streakMultiplier.toFixed(1)} Streak
                </div>
                <div className="text-muted-foreground text-xs">
                  {currentStreak} dias consecutivos
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-sm font-medium">
                  Total de Quests
                </div>
                <div className="text-sm">{totalQuests + totalMainQuests}</div>
                <div className="text-muted-foreground text-xs">
                  {completedQuests + completedMainQuests} completadas
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-sm font-medium">
                  Inventário
                </div>
                <div className="text-sm">{user.inventory.length} itens</div>
                <div className="text-muted-foreground text-xs">
                  {Object.values(user.activeEffects).filter(Boolean).length}{" "}
                  efeitos ativos
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-sm font-medium">
                  Recompensas
                </div>
                <div className="text-sm">
                  {rewards.filter((r) => r.purchased).length} compradas
                </div>
                <div className="text-muted-foreground text-xs">
                  de {rewards.length} disponíveis
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
