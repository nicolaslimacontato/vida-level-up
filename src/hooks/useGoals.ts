import { useEffect, useCallback, useState } from 'react';
import { useRPGContext } from '@/contexts/RPGContext';
import { updateGoalProgress, completeGoal } from '@/lib/supabase-rpg';
import { useAuth } from './useAuth';
import { Goal } from '@/types/rpg';

export function useGoals() {
    const { user: authUser } = useAuth();
    const { user, quests, mainQuests, goals } = useRPGContext();
    const [newlyCompletedGoal, setNewlyCompletedGoal] = useState<Goal | null>(null);

    // Verificar e atualizar progresso de metas
    const checkGoals = useCallback(async () => {
        if (!authUser?.id || !goals) return;

        // Import templates dynamically to avoid circular dependency
        const { GOAL_TEMPLATES } = await import('@/data/goalTemplates');

        for (const template of GOAL_TEMPLATES) {
            const goal = goals.find(g => g.goalId === template.goalId);

            if (!goal || goal.completed) continue;

            // Verificar se a meta expirou
            if (goal.expiresAt && new Date(goal.expiresAt) < new Date()) {
                continue; // Meta expirada, não atualizar
            }

            // Calcular progresso atual
            const currentProgress = template.condition(user, quests, mainQuests);

            // Atualizar progresso se mudou
            if (currentProgress !== goal.currentValue) {
                await updateGoalProgress(authUser.id, template.goalId, currentProgress);

                // Completar se atingiu o objetivo
                if (currentProgress >= template.targetValue && !goal.completed) {
                    const success = await completeGoal(
                        authUser.id,
                        template.goalId,
                        template.xpReward,
                        template.coinReward
                    );

                    if (success) {
                        // Trigger notification
                        setNewlyCompletedGoal({
                            ...goal,
                            completed: true,
                            currentValue: currentProgress,
                            completedAt: new Date().toISOString(),
                        });
                    }
                }
            }
        }
    }, [authUser?.id, user, quests, mainQuests, goals]);

    // Verificar metas quando dados mudarem
    useEffect(() => {
        checkGoals();
    }, [checkGoals]);

    // Auto-hide notification after 5 seconds
    useEffect(() => {
        if (newlyCompletedGoal) {
            const timer = setTimeout(() => {
                setNewlyCompletedGoal(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [newlyCompletedGoal]);

    return {
        checkGoals,
        newlyCompletedGoal,
        dismissNotification: () => setNewlyCompletedGoal(null),
    };
}
