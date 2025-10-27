import { Quest } from '@/types/rpg';

export const TUTORIAL_QUEST: Quest = {
    id: 'tutorial-welcome',
    title: 'Bem-vindo ao Vida Level Up! 🎮',
    description: 'Complete esta quest para aprender como funciona o sistema de XP e moedas.',
    xpReward: 100,
    coinReward: 50,
    completed: false,
    category: 'daily',
    icon: '🎯',
    attributeBonus: 'intelligence',
};

export const TUTORIAL_MAIN_QUEST: Quest = {
    id: 'tutorial-main-quest',
    title: 'Primeira Missão Principal 🏆',
    description: 'Esta é uma missão principal com múltiplas etapas. Complete todas para ganhar uma recompensa especial!',
    xpReward: 200,
    coinReward: 100,
    completed: false,
    category: 'main',
    icon: '🎖️',
    attributeBonus: 'discipline',
};
