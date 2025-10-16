import { useEffect } from "react";
import { User, Quest } from "@/types/rpg";
import { updateQuest } from "@/lib/supabase-rpg";

interface DailyResetResult {
    shouldReset: boolean;
    daysPassed: number;
    streakBroken: boolean;
}

/**
 * Verifica se passou de 1 dia desde o último acesso
 * @param lastAccessDate - Data do último acesso (ISO string)
 * @param today - Data de hoje (opcional, para testes)
 * @returns Objeto com informações sobre o reset
 */
export function checkDailyReset(lastAccessDate: string, today?: Date): DailyResetResult {
    const now = today || new Date();
    const lastAccess = new Date(lastAccessDate);

    // Zerar horas para comparar apenas datas
    const todayMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );
    const lastAccessMidnight = new Date(
        lastAccess.getFullYear(),
        lastAccess.getMonth(),
        lastAccess.getDate(),
    );

    // Calcular diferença em dias
    const diffTime = todayMidnight.getTime() - lastAccessMidnight.getTime();
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return {
        shouldReset: daysPassed >= 1,
        daysPassed,
        streakBroken: daysPassed > 1, // Se passou mais de 1 dia, quebrou o streak
    };
}

/**
 * Reseta quests diárias (marca todas como não completadas) no Supabase
 * @param userId - ID do usuário
 * @param quests - Array de quests para resetar
 * @returns Promise<boolean> - Se o reset foi bem-sucedido
 */
export async function resetDailyQuests(userId: string, quests: Quest[]): Promise<boolean> {
    try {
        const dailyQuests = quests.filter(quest => quest.category === "daily");

        // Reset each daily quest in the database
        const resetPromises = dailyQuests.map(quest =>
            updateQuest(quest.id, { completed: false })
        );

        await Promise.all(resetPromises);
        return true;
    } catch (error) {
        console.error("Error resetting daily quests:", error);
        return false;
    }
}

/**
 * Atualiza streak do usuário baseado nos dias passados
 * @param user - Objeto do usuário
 * @param lastAccess - Data do último acesso
 * @param today - Data de hoje
 * @returns Usuário atualizado com novo streak
 */
export function updateUserStreak(user: User, lastAccess: Date, today: Date): User {
    const now = today.toISOString();

    // Calcular diferença em dias
    const todayMidnight = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
    );
    const lastAccessMidnight = new Date(
        lastAccess.getFullYear(),
        lastAccess.getMonth(),
        lastAccess.getDate(),
    );

    const diffTime = todayMidnight.getTime() - lastAccessMidnight.getTime();
    const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Se passou exatamente 1 dia
    if (daysPassed === 1) {
        // Verificar se completou pelo menos 1 quest ontem
        if (user.completedQuestsToday) {
            // ✅ Completou quests ontem → Incrementa streak
            const newStreak = user.currentStreak + 1;
            const newBestStreak = Math.max(newStreak, user.bestStreak);

            // A cada 7 dias de streak, ganha +1 Disciplina
            const disciplineGain = newStreak % 7 === 0 ? 1 : 0;

            return {
                ...user,
                currentStreak: newStreak,
                bestStreak: newBestStreak,
                lastAccessDate: now,
                completedQuestsToday: false, // Resetar para o novo dia
                attributes: {
                    ...user.attributes,
                    discipline: user.attributes.discipline + disciplineGain,
                },
            };
        } else {
            // ❌ NÃO completou quests ontem → Quebra streak
            return {
                ...user,
                currentStreak: 0,
                lastAccessDate: now,
                completedQuestsToday: false,
            };
        }
    }

    // Se passou mais de 1 dia: quebra streak
    if (daysPassed > 1) {
        return {
            ...user,
            currentStreak: 0,
            lastAccessDate: now,
            completedQuestsToday: false,
        };
    }

    // Se é o mesmo dia: apenas atualiza lastAccessDate
    return {
        ...user,
        lastAccessDate: now,
    };
}

/**
 * Hook para gerenciar reset diário automático (legacy - mantido para compatibilidade)
 * @param user - Usuário atual
 * @param quests - Quests atuais
 * @param onReset - Callback quando ocorrer reset
 */
export function useDailyReset(
    user: User,
    quests: Quest[],
    onReset: (updatedUser: User, updatedQuests: Quest[], info: DailyResetResult) => void,
) {
    useEffect(() => {
        const resetInfo = checkDailyReset(user.lastAccessDate);

        if (resetInfo.shouldReset) {
            const today = new Date();
            const lastAccess = new Date(user.lastAccessDate);
            const updatedUser = updateUserStreak(user, lastAccess, today);

            // Note: resetDailyQuests agora é assíncrono, então não podemos usar aqui
            // Este hook é mantido apenas para compatibilidade
            // O reset real agora é feito no useRPG hook
            onReset(updatedUser, quests, resetInfo);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Executa apenas uma vez ao montar o componente
}

