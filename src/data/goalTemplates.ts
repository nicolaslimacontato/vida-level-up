import { GoalTemplate } from '@/types/rpg';

export const GOAL_TEMPLATES: GoalTemplate[] = [
    // ========== METAS DIÁRIAS ==========
    {
        goalId: 'daily_quests_3',
        title: 'Aventureiro Diário',
        description: 'Complete 3 quests hoje',
        type: 'daily',
        targetValue: 3,
        xpReward: 150,
        coinReward: 75,
        condition: (user, quests) => {
            const today = new Date().toDateString();
            return quests.filter(q => q.completed).length;
        },
    },
    {
        goalId: 'daily_streak_maintain',
        title: 'Consistência Diária',
        description: 'Mantenha seu streak por mais um dia',
        type: 'daily',
        targetValue: 1,
        xpReward: 100,
        coinReward: 50,
        condition: (user) => user.currentStreak > 0 ? 1 : 0,
    },
    {
        goalId: 'daily_xp_200',
        title: 'Ganhador de XP',
        description: 'Ganhe 200 XP hoje',
        type: 'daily',
        targetValue: 200,
        xpReward: 200,
        coinReward: 100,
        condition: (user) => {
            // Esta seria calculada baseada no XP ganho hoje
            // Por simplicidade, vamos usar uma lógica baseada no nível
            return user.level * 50;
        },
    },

    // ========== METAS SEMANAIS ==========
    {
        goalId: 'weekly_quests_15',
        title: 'Semana Produtiva',
        description: 'Complete 15 quests esta semana',
        type: 'weekly',
        targetValue: 15,
        xpReward: 500,
        coinReward: 250,
        condition: (user, quests) => {
            return quests.filter(q => q.completed).length;
        },
    },
    {
        goalId: 'weekly_streak_7',
        title: 'Semana Perfeita',
        description: 'Mantenha streak por 7 dias consecutivos',
        type: 'weekly',
        targetValue: 7,
        xpReward: 700,
        coinReward: 350,
        condition: (user) => Math.min(user.currentStreak, 7),
    },
    {
        goalId: 'weekly_level_up',
        title: 'Evolução Semanal',
        description: 'Suba pelo menos 1 nível esta semana',
        type: 'weekly',
        targetValue: 1,
        xpReward: 300,
        coinReward: 150,
        condition: (user) => {
            // Esta seria calculada baseada no nível ganho esta semana
            // Por simplicidade, vamos usar uma lógica baseada no nível atual
            return user.level >= 5 ? 1 : 0;
        },
    },
    {
        goalId: 'weekly_coins_500',
        title: 'Economista Semanal',
        description: 'Acumule 500 moedas esta semana',
        type: 'weekly',
        targetValue: 500,
        xpReward: 400,
        coinReward: 200,
        condition: (user) => Math.min(user.coins, 500),
    },

    // ========== METAS MENSАIS ==========
    {
        goalId: 'monthly_quests_50',
        title: 'Mês de Conquistas',
        description: 'Complete 50 quests este mês',
        type: 'monthly',
        targetValue: 50,
        xpReward: 1500,
        coinReward: 750,
        condition: (user, quests) => {
            return quests.filter(q => q.completed).length;
        },
    },
    {
        goalId: 'monthly_level_5',
        title: 'Evolução Mensal',
        description: 'Suba pelo menos 5 níveis este mês',
        type: 'monthly',
        targetValue: 5,
        xpReward: 2000,
        coinReward: 1000,
        condition: (user) => {
            // Esta seria calculada baseada no nível ganho este mês
            // Por simplicidade, vamos usar uma lógica baseada no nível atual
            return Math.min(user.level, 5);
        },
    },
    {
        goalId: 'monthly_streak_20',
        title: 'Disciplina Mensal',
        description: 'Mantenha streak por 20 dias este mês',
        type: 'monthly',
        targetValue: 20,
        xpReward: 2500,
        coinReward: 1250,
        condition: (user) => Math.min(user.currentStreak, 20),
    },
    {
        goalId: 'monthly_coins_2000',
        title: 'Milionário Mensal',
        description: 'Acumule 2000 moedas este mês',
        type: 'monthly',
        targetValue: 2000,
        xpReward: 1800,
        coinReward: 900,
        condition: (user) => Math.min(user.coins, 2000),
    },
    {
        goalId: 'monthly_main_quests_3',
        title: 'Mestre das Missões',
        description: 'Complete 3 missões principais este mês',
        type: 'monthly',
        targetValue: 3,
        xpReward: 1200,
        coinReward: 600,
        condition: (user, quests, mainQuests) => {
            return mainQuests.filter(q => q.completed).length;
        },
    },
];
