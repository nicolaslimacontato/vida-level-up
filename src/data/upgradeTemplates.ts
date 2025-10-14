import { Upgrade } from "@/types/rpg";

export const UPGRADE_TEMPLATES: Upgrade[] = [
    // ========== STREAK UPGRADES ==========
    {
        id: "streak_turbinado",
        name: "Streak Turbinado",
        description: "Seu streak agora começa com multiplicador 1.5x ao invés de 1.1x",
        category: "streak",
        attributeCost: {
            discipline: 50,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "streak_start_1.5x",
        icon: "⚡",
    },
    {
        id: "protecao_streak",
        name: "Proteção de Streak",
        description: "Não perde streak ao ficar 1 dia sem acessar o sistema",
        category: "streak",
        attributeCost: {
            discipline: 30,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "streak_protection_1_day",
        icon: "🛡️",
    },
    {
        id: "streak_imortal",
        name: "Streak Imortal",
        description: "Pode ativar/desativar o streak manualmente quando quiser",
        category: "streak",
        attributeCost: {
            discipline: 75,
            charisma: 25,
        },
        isPermanent: false,
        isActive: false,
        purchased: false,
        effect: "streak_manual_toggle",
        icon: "♾️",
    },
    {
        id: "streak_duplo",
        name: "Streak Duplo",
        description: "Multiplicador de streak é dobrado (máximo 3.0x)",
        category: "streak",
        attributeCost: {
            discipline: 100,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "streak_double_multiplier",
        icon: "🔥",
    },

    // ========== XP UPGRADES ==========
    {
        id: "mente_afiada",
        name: "Mente Afiada",
        description: "Ganha +10% XP em todas as atividades permanentemente",
        category: "xp",
        attributeCost: {
            intelligence: 40,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "xp_bonus_10_percent",
        icon: "🧠",
    },
    {
        id: "genio",
        name: "Gênio",
        description: "Ganha +25% XP em todas as atividades permanentemente",
        category: "xp",
        attributeCost: {
            intelligence: 80,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "xp_bonus_25_percent",
        icon: "🌟",
    },
    {
        id: "sabedoria_ancestral",
        name: "Sabedoria Ancestral",
        description: "XP de quests diárias vale 1.5x mais",
        category: "xp",
        attributeCost: {
            intelligence: 60,
            discipline: 20,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "daily_quest_xp_1.5x",
        icon: "📚",
    },
    {
        id: "aprendizado_acelerado",
        name: "Aprendizado Acelerado",
        description: "Pode ativar/desativar +50% XP por 24h",
        category: "xp",
        attributeCost: {
            intelligence: 120,
            discipline: 30,
        },
        isPermanent: false,
        isActive: false,
        purchased: false,
        effect: "xp_boost_50_percent_toggle",
        icon: "⚡",
    },

    // ========== COINS UPGRADES ==========
    {
        id: "magnetismo",
        name: "Magnetismo",
        description: "Ganha +15% moedas em todas as quests permanentemente",
        category: "coins",
        attributeCost: {
            charisma: 35,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "coins_bonus_15_percent",
        icon: "🧲",
    },
    {
        id: "negociador_nato",
        name: "Negociador Nato",
        description: "Desconto extra de 10% na loja permanentemente",
        category: "coins",
        attributeCost: {
            charisma: 50,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "shop_discount_extra_10_percent",
        icon: "💬",
    },
    {
        id: "fortuna",
        name: "Fortuna",
        description: "Pode ativar/desativar +100% moedas por 12h",
        category: "coins",
        attributeCost: {
            charisma: 80,
            intelligence: 20,
        },
        isPermanent: false,
        isActive: false,
        purchased: false,
        effect: "coins_double_toggle",
        icon: "💰",
    },

    // ========== PROTECTION UPGRADES ==========
    {
        id: "resiliencia",
        name: "Resiliência",
        description: "Atributos não decaem ao ficar sem acessar o sistema",
        category: "protection",
        attributeCost: {
            strength: 40,
            discipline: 40,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "attributes_no_decay",
        icon: "💪",
    },
    {
        id: "inabalavel",
        name: "Inabalável",
        description: "Penalidades por não completar quests são reduzidas em 50%",
        category: "protection",
        attributeCost: {
            strength: 60,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "penalties_reduced_50_percent",
        icon: "🏔️",
    },
    {
        id: "imunidade",
        name: "Imunidade",
        description: "Pode ativar/desativar proteção total contra perda de streak por 3 dias",
        category: "protection",
        attributeCost: {
            strength: 80,
            discipline: 60,
        },
        isPermanent: false,
        isActive: false,
        purchased: false,
        effect: "streak_immunity_3_days_toggle",
        icon: "🛡️",
    },
    {
        id: "regeneracao",
        name: "Regeneração",
        description: "Atributos regeneram automaticamente 1 ponto por dia",
        category: "protection",
        attributeCost: {
            strength: 100,
            discipline: 80,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "attributes_auto_regenerate",
        icon: "🔄",
    },

    // ========== MULTIPLIER UPGRADES ==========
    {
        id: "lendario",
        name: "Lendário",
        description: "Todas as recompensas (XP e moedas) são aumentadas em 20%",
        category: "multiplier",
        attributeCost: {
            strength: 100,
            intelligence: 100,
            charisma: 100,
            discipline: 100,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "all_rewards_20_percent_bonus",
        icon: "👑",
    },
    {
        id: "perfeicao",
        name: "Perfeição",
        description: "Pode ativar/desativar +100% em tudo por 6h",
        category: "multiplier",
        attributeCost: {
            strength: 150,
            intelligence: 150,
            charisma: 150,
            discipline: 150,
        },
        isPermanent: false,
        isActive: false,
        purchased: false,
        effect: "everything_double_toggle",
        icon: "✨",
    },
    {
        id: "equilibrio",
        name: "Equilíbrio",
        description: "Todos os atributos recebem +5 pontos automaticamente",
        category: "multiplier",
        attributeCost: {
            strength: 200,
            intelligence: 200,
            charisma: 200,
            discipline: 200,
        },
        isPermanent: true,
        isActive: false,
        purchased: false,
        effect: "all_attributes_plus_5",
        icon: "⚖️",
    },
];

// Funções utilitárias para trabalhar com upgrades
export const getUpgradesByCategory = (category: string): Upgrade[] => {
    return UPGRADE_TEMPLATES.filter(upgrade => upgrade.category === category);
};

export const getUpgradeById = (id: string): Upgrade | undefined => {
    return UPGRADE_TEMPLATES.find(upgrade => upgrade.id === id);
};

export const getAvailableUpgrades = (userAttributes: {
    strength: number;
    intelligence: number;
    charisma: number;
    discipline: number;
}, purchasedUpgrades: string[]): Upgrade[] => {
    return UPGRADE_TEMPLATES.filter(upgrade => {
        // Não mostrar upgrades já comprados
        if (upgrade.purchased || purchasedUpgrades.includes(upgrade.id)) {
            return false;
        }

        // Verificar se tem atributos suficientes
        const hasAttributes =
            (!upgrade.attributeCost.strength || userAttributes.strength >= upgrade.attributeCost.strength) &&
            (!upgrade.attributeCost.intelligence || userAttributes.intelligence >= upgrade.attributeCost.intelligence) &&
            (!upgrade.attributeCost.charisma || userAttributes.charisma >= upgrade.attributeCost.charisma) &&
            (!upgrade.attributeCost.discipline || userAttributes.discipline >= upgrade.attributeCost.discipline);

        return hasAttributes;
    });
};

export const getBlockedUpgrades = (userAttributes: {
    strength: number;
    intelligence: number;
    charisma: number;
    discipline: number;
}, purchasedUpgrades: string[]): Upgrade[] => {
    return UPGRADE_TEMPLATES.filter(upgrade => {
        // Não mostrar upgrades já comprados
        if (upgrade.purchased || purchasedUpgrades.includes(upgrade.id)) {
            return false;
        }

        // Verificar se NÃO tem atributos suficientes
        const hasAttributes =
            (!upgrade.attributeCost.strength || userAttributes.strength >= upgrade.attributeCost.strength) &&
            (!upgrade.attributeCost.intelligence || userAttributes.intelligence >= upgrade.attributeCost.intelligence) &&
            (!upgrade.attributeCost.charisma || userAttributes.charisma >= upgrade.attributeCost.charisma) &&
            (!upgrade.attributeCost.discipline || userAttributes.discipline >= upgrade.attributeCost.discipline);

        return !hasAttributes;
    });
};
