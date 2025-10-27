import { useEffect, useCallback } from 'react';
import { useRPGContext } from '@/contexts/RPGContext';
import { logActivity } from '@/lib/supabase-rpg';
import { useAuth } from './useAuth';
import { ActivityLogEntry } from '@/types/rpg';

export function useActivityLog() {
    const { user: authUser } = useAuth();
    const { user, activityLog } = useRPGContext();

    // Log activity helper
    const logUserActivity = useCallback(async (
        actionType: string,
        actionData: Record<string, any> = {},
        xpGained: number = 0,
        coinsGained: number = 0,
        levelBefore: number = user.level,
        levelAfter: number = user.level
    ) => {
        if (!authUser?.id) return;

        await logActivity(
            authUser.id,
            actionType,
            actionData,
            xpGained,
            coinsGained,
            levelBefore,
            levelAfter
        );
    }, [authUser?.id, user.level]);

    // Specific logging functions
    const logQuestCompleted = useCallback(async (questTitle: string, xpGained: number, coinsGained: number) => {
        await logUserActivity('quest_completed', {
            questTitle,
        }, xpGained, coinsGained);
    }, [logUserActivity]);

    const logMainQuestStepCompleted = useCallback(async (questTitle: string, stepTitle: string, xpGained: number, coinsGained: number) => {
        await logUserActivity('main_quest_step_completed', {
            questTitle,
            stepTitle,
        }, xpGained, coinsGained);
    }, [logUserActivity]);

    const logMainQuestCompleted = useCallback(async (questTitle: string, xpGained: number, coinsGained: number) => {
        await logUserActivity('main_quest_completed', {
            questTitle,
        }, xpGained, coinsGained);
    }, [logUserActivity]);

    const logLevelUp = useCallback(async (levelBefore: number, levelAfter: number) => {
        await logUserActivity('level_up', {
            levelBefore,
            levelAfter,
        }, 0, 0, levelBefore, levelAfter);
    }, [logUserActivity]);

    const logAchievementUnlocked = useCallback(async (achievementTitle: string, xpReward: number, coinReward: number) => {
        await logUserActivity('achievement_unlocked', {
            achievementTitle,
        }, xpReward, coinReward);
    }, [logUserActivity]);

    const logGoalCompleted = useCallback(async (goalTitle: string, xpReward: number, coinReward: number) => {
        await logUserActivity('goal_completed', {
            goalTitle,
        }, xpReward, coinReward);
    }, [logUserActivity]);

    const logItemPurchased = useCallback(async (itemName: string, coinsSpent: number) => {
        await logUserActivity('item_purchased', {
            itemName,
            coinsSpent,
        }, 0, -coinsSpent);
    }, [logUserActivity]);

    const logItemUsed = useCallback(async (itemName: string, effect: string) => {
        await logUserActivity('item_used', {
            itemName,
            effect,
        });
    }, [logUserActivity]);

    const logUpgradePurchased = useCallback(async (upgradeName: string) => {
        await logUserActivity('upgrade_purchased', {
            upgradeName,
        });
    }, [logUserActivity]);

    const logStreakUpdated = useCallback(async (currentStreak: number) => {
        await logUserActivity('streak_updated', {
            currentStreak,
        });
    }, [logUserActivity]);

    const logDailyReset = useCallback(async () => {
        await logUserActivity('daily_reset', {
            resetDate: new Date().toISOString(),
        });
    }, [logUserActivity]);

    const logLogin = useCallback(async () => {
        await logUserActivity('login', {
            loginDate: new Date().toISOString(),
        });
    }, [logUserActivity]);

    return {
        logUserActivity,
        logQuestCompleted,
        logMainQuestStepCompleted,
        logMainQuestCompleted,
        logLevelUp,
        logAchievementUnlocked,
        logGoalCompleted,
        logItemPurchased,
        logItemUsed,
        logUpgradePurchased,
        logStreakUpdated,
        logDailyReset,
        logLogin,
    };
}
