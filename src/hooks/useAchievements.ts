import { useEffect, useCallback, useState } from 'react';
import { useRPGContext } from '@/contexts/RPGContext';
import { updateAchievementProgress, unlockAchievement } from '@/lib/supabase-rpg';
import { useAuth } from './useAuth';
import { Achievement } from '@/types/rpg';

export function useAchievements() {
    const { user: authUser } = useAuth();
    const { user, quests, mainQuests, achievements } = useRPGContext();
    const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);

    // Verificar e atualizar progresso de conquistas
    const checkAchievements = useCallback(async () => {
        if (!authUser?.id || !achievements) return;

        // Import templates dynamically to avoid circular dependency
        const { ACHIEVEMENT_TEMPLATES } = await import('@/data/achievementTemplates');

        for (const template of ACHIEVEMENT_TEMPLATES) {
            const achievement = achievements.find(a => a.achievementId === template.achievementId);

            if (!achievement || achievement.unlocked) continue;

            // Calcular progresso atual
            const currentProgress = template.condition(user, quests, mainQuests);

            // Atualizar progresso se mudou
            if (currentProgress !== achievement.progress) {
                await updateAchievementProgress(authUser.id, template.achievementId, currentProgress);

                // Desbloquear se completou
                if (currentProgress >= template.maxProgress && !achievement.unlocked) {
                    const success = await unlockAchievement(
                        authUser.id,
                        template.achievementId,
                        template.xpReward,
                        template.coinReward
                    );

                    if (success) {
                        // Trigger notification
                        setNewlyUnlockedAchievement({
                            ...achievement,
                            unlocked: true,
                            progress: currentProgress,
                            unlockedAt: new Date().toISOString(),
                        });
                    }
                }
            }
        }
    }, [authUser?.id, user, quests, mainQuests, achievements]);

    // Verificar conquistas quando dados mudarem
    useEffect(() => {
        checkAchievements();
    }, [checkAchievements]);

    // Auto-hide notification after 5 seconds
    useEffect(() => {
        if (newlyUnlockedAchievement) {
            const timer = setTimeout(() => {
                setNewlyUnlockedAchievement(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [newlyUnlockedAchievement]);

    return {
        checkAchievements,
        newlyUnlockedAchievement,
        dismissNotification: () => setNewlyUnlockedAchievement(null),
    };
}
