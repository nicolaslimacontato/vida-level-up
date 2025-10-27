"use client";

import React, { useState, useEffect } from "react";
import { useRPGContext } from "@/contexts/RPGContext";
import { useDailyRewards } from "@/hooks/useDailyRewards";
import { DailyRewardCard } from "@/components/DailyRewardCard";
import { DailyRewardNotification } from "@/components/DailyRewardNotification";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Gift,
  Trophy,
  Flame,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DailyRewardsPage() {
  const { dailyRewards, user } = useRPGContext();
  const {
    loading,
    claimReward,
    generateRewards,
    getTodaysReward,
    getClaimedCount,
    getConsecutiveDays,
    canClaimToday,
  } = useDailyRewards();

  const [showNotification, setShowNotification] = useState(false);
  const [claimedReward, setClaimedReward] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "claimed" | "available">("all");

  const todaysReward = getTodaysReward(dailyRewards);
  const claimedCount = getClaimedCount(dailyRewards);
  const consecutiveDays = getConsecutiveDays(dailyRewards);
  const canClaim = canClaimToday(dailyRewards);

  // Filter rewards based on current filter
  const filteredRewards = dailyRewards.filter((reward) => {
    switch (filter) {
      case "claimed":
        return reward.claimed;
      case "available":
        return !reward.claimed;
      default:
        return true;
    }
  });

  const handleClaimReward = async (rewardId: string) => {
    const success = await claimReward(rewardId);
    if (success) {
      const reward = dailyRewards.find((r) => r.id === rewardId);
      if (reward) {
        setClaimedReward({ ...reward, consecutiveDays });
        setShowNotification(true);
      }
    }
  };

  const handleGenerateRewards = async () => {
    await generateRewards();
  };

  const getMonthName = () => {
    const today = new Date();
    return today.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  const getRewardStats = () => {
    const totalRewards = dailyRewards.length;
    const claimedRewards = dailyRewards.filter((r) => r.claimed).length;
    const availableRewards = totalRewards - claimedRewards;

    return { totalRewards, claimedRewards, availableRewards };
  };

  const stats = getRewardStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-white shadow-lg">
              <Calendar className="h-8 w-8" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Recompensas Diárias
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Colete suas recompensas diárias e mantenha sua streak! 🔥
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="p-4 text-center">
            <div className="mb-2 flex items-center justify-center">
              <Gift className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.claimedRewards}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Recompensas Coletadas
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="mb-2 flex items-center justify-center">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {consecutiveDays}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Dias Consecutivos
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="mb-2 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.availableRewards}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Disponíveis
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="mb-2 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {getMonthName()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mês Atual
            </div>
          </Card>
        </div>

        {/* Today's Reward Highlight */}
        {todaysReward && (
          <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 p-6 dark:border-blue-800 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Recompensa de Hoje! 🎁
              </h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Sua recompensa diária está disponível para coleta
              </p>
              <div className="mx-auto max-w-xs">
                <DailyRewardCard
                  reward={todaysReward}
                  onClaim={handleClaimReward}
                  loading={loading}
                  isToday={true}
                  consecutiveDays={consecutiveDays}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todas
            </Button>
            <Button
              variant={filter === "available" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("available")}
            >
              Disponíveis
            </Button>
            <Button
              variant={filter === "claimed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("claimed")}
            >
              Coletadas
            </Button>
          </div>

          {/* Generate Rewards Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateRewards}
            disabled={loading}
            className="ml-auto"
          >
            <RefreshCw
              className={cn("mr-2 h-4 w-4", loading && "animate-spin")}
            />
            Gerar Recompensas
          </Button>
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRewards.map((reward) => {
              const dayNumber = parseInt(reward.date.split("-")[2]);
              const isToday =
                reward.date === new Date().toISOString().split("T")[0];

              return (
                <DailyRewardCard
                  key={reward.id}
                  reward={reward}
                  onClaim={handleClaimReward}
                  loading={loading}
                  isToday={isToday}
                  consecutiveDays={consecutiveDays}
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <h3 className="mb-2 text-lg font-medium">
                Nenhuma recompensa encontrada
              </h3>
              <p className="text-sm">
                {filter === "all"
                  ? "Gere as recompensas do mês para começar!"
                  : `Nenhuma recompensa ${filter === "claimed" ? "coletada" : "disponível"} encontrada.`}
              </p>
            </div>
          </Card>
        )}

        {/* Streak Info */}
        {consecutiveDays > 0 && (
          <Card className="mt-8 border-orange-200 bg-gradient-to-r from-orange-100 to-red-100 p-6 dark:border-orange-800 dark:from-orange-900/20 dark:to-red-900/20">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center">
                <Flame className="mr-2 h-6 w-6 text-orange-500" />
                <span className="text-lg font-bold text-orange-700 dark:text-orange-300">
                  Streak Ativa!
                </span>
              </div>
              <p className="text-orange-600 dark:text-orange-400">
                Você está há{" "}
                <span className="font-bold">{consecutiveDays}</span> dias
                consecutivos coletando recompensas!
                {consecutiveDays >= 7 && " 🎉"}
              </p>
              {consecutiveDays >= 7 && (
                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className="text-orange-600 dark:text-orange-400"
                  >
                    +50% de bônus em todas as recompensas!
                  </Badge>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Notification */}
      {showNotification && claimedReward && (
        <DailyRewardNotification
          reward={claimedReward}
          onClose={() => {
            setShowNotification(false);
            setClaimedReward(null);
          }}
          consecutiveDays={consecutiveDays}
        />
      )}
    </div>
  );
}
