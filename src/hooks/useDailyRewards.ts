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
    const { user: authUser } = useAuth();
    const { success: showSuccess, error: showError } = useToast();
    const { logUserActivity } = useActivityLog();
    const [loading, setLoading] = useState(false);

    // Claim a daily reward
    const claimReward = useCallback(async (rewardId: string) => {
        if (!authUser?.id) return false;

        try {
            setLoading(true);

            const success = await claimDailyReward(authUser.id, rewardId);

            if (success) {
                showSuccess("Recompensa Coletada! 🎁", "Você coletou sua recompensa diária com sucesso!");

                // Log the activity
                await logUserActivity("daily_reward_claimed", { rewardId });

                return true;
            } else {
                showError("Erro", "Não foi possível coletar a recompensa. Tente novamente.");
                return false;
            }
        } catch (error) {
            console.error("Error claiming daily reward:", error);
            showError("Erro", "Ocorreu um erro ao coletar a recompensa.");
            return false;
        } finally {
            setLoading(false);
        }
    }, [authUser?.id, showSuccess, showError, logUserActivity]);

    // Generate daily rewards for the month
    const generateRewards = useCallback(async () => {
        if (!authUser?.id) return false;

        try {
            setLoading(true);

            const success = await generateDailyRewards(authUser.id);

            if (success) {
                showSuccess("Recompensas Geradas! 📅", "As recompensas diárias do mês foram geradas com sucesso!");
                return true;
            } else {
                showError("Erro", "Não foi possível gerar as recompensas. Tente novamente.");
                return false;
            }
        } catch (error) {
            console.error("Error generating daily rewards:", error);
            showError("Erro", "Ocorreu um erro ao gerar as recompensas.");
            return false;
        } finally {
            setLoading(false);
        }
    }, [authUser?.id, showSuccess, showError]);

    // Get today's reward
    const getTodaysReward = useCallback((rewards: DailyReward[]) => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        return rewards.find(reward =>
            reward.rewardDate === todayStr && !reward.claimed
        );
    }, []);

    // Get claimed rewards count for current month
    const getClaimedCount = useCallback((rewards: DailyReward[]) => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return rewards.filter(reward => {
            const rewardDate = new Date(reward.rewardDate);
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
            .sort((a, b) => new Date(b.rewardDate).getTime() - new Date(a.rewardDate).getTime());

        // Count consecutive days from today backwards
        for (let i = 0; i < sortedRewards.length; i++) {
            const rewardDate = new Date(sortedRewards[i].rewardDate);
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
