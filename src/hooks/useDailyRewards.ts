import { useState, useCallback } from "react";
import { DailyReward } from "@/types/rpg";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/Toast";
import { useActivityLog } from "@/hooks/useActivityLog";
import {
    getDailyRewards,
    claimDailyReward,
    generateDailyRewards
} from "@/lib/supabase-rpg";

export const useDailyRewards = () => {
    const { authUser } = useAuth();
    const { showToast } = useToast();
    const { logDailyRewardClaimed } = useActivityLog();
    const [loading, setLoading] = useState(false);

    // Claim a daily reward
    const claimReward = useCallback(async (rewardId: string) => {
        if (!authUser?.id) return false;

        try {
            setLoading(true);

            const success = await claimDailyReward(authUser.id, rewardId);

            if (success) {
                showToast({
                    type: "success",
                    title: "Recompensa Coletada! 🎁",
                    message: "Você coletou sua recompensa diária com sucesso!"
                });

                // Log the activity
                await logDailyRewardClaimed(rewardId);

                return true;
            } else {
                showToast({
                    type: "error",
                    title: "Erro",
                    message: "Não foi possível coletar a recompensa. Tente novamente."
                });
                return false;
            }
        } catch (error) {
            console.error("Error claiming daily reward:", error);
            showToast({
                type: "error",
                title: "Erro",
                message: "Ocorreu um erro ao coletar a recompensa."
            });
            return false;
        } finally {
            setLoading(false);
        }
    }, [authUser?.id, showToast, logDailyRewardClaimed]);

    // Generate daily rewards for the month
    const generateRewards = useCallback(async () => {
        if (!authUser?.id) return false;

        try {
            setLoading(true);

            const success = await generateDailyRewards(authUser.id);

            if (success) {
                showToast({
                    type: "success",
                    title: "Recompensas Geradas! 📅",
                    message: "As recompensas diárias do mês foram geradas com sucesso!"
                });
                return true;
            } else {
                showToast({
                    type: "error",
                    title: "Erro",
                    message: "Não foi possível gerar as recompensas. Tente novamente."
                });
                return false;
            }
        } catch (error) {
            console.error("Error generating daily rewards:", error);
            showToast({
                type: "error",
                title: "Erro",
                message: "Ocorreu um erro ao gerar as recompensas."
            });
            return false;
        } finally {
            setLoading(false);
        }
    }, [authUser?.id, showToast]);

    // Get today's reward
    const getTodaysReward = useCallback((rewards: DailyReward[]) => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        return rewards.find(reward =>
            reward.date === todayStr && !reward.claimed
        );
    }, []);

    // Get claimed rewards count for current month
    const getClaimedCount = useCallback((rewards: DailyReward[]) => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return rewards.filter(reward => {
            const rewardDate = new Date(reward.date);
            return reward.claimed &&
                rewardDate.getMonth() === currentMonth &&
                rewardDate.getFullYear() === currentYear;
        }).length;
    }, []);

    // Get consecutive days claimed
    const getConsecutiveDays = useCallback((rewards: DailyReward[]) => {
        const today = new Date();
        let consecutiveDays = 0;

        // Sort rewards by date descending
        const sortedRewards = rewards
            .filter(reward => reward.claimed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Count consecutive days from today backwards
        for (let i = 0; i < sortedRewards.length; i++) {
            const rewardDate = new Date(sortedRewards[i].date);
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);

            // Check if dates match (same day)
            if (rewardDate.toDateString() === expectedDate.toDateString()) {
                consecutiveDays++;
            } else {
                break;
            }
        }

        return consecutiveDays;
    }, []);

    // Check if user can claim today's reward
    const canClaimToday = useCallback((rewards: DailyReward[]) => {
        const todaysReward = getTodaysReward(rewards);
        return !!todaysReward;
    }, [getTodaysReward]);

    return {
        loading,
        claimReward,
        generateRewards,
        getTodaysReward,
        getClaimedCount,
        getConsecutiveDays,
        canClaimToday,
    };
};
