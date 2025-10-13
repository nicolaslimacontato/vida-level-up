import { Item } from "@/types/rpg";

/**
 * Catálogo completo de itens disponíveis na loja
 */
export const SHOP_ITEMS: Omit<Item, "quantity" | "acquiredAt" | "usedAt">[] = [
    // ========== PROTEÇÃO ==========
    {
        id: "barrier_1",
        name: "Barreira de Streak",
        description:
            "Protege seu streak contra quebra por 1 dia. Use antes de faltar para garantir que não perca seu progresso!",
        icon: "🛡️",
        type: "consumable",
        category: "protection",
        effect: "streak_protection",
        price: 500,
    },

    // ========== BUFFS/POÇÕES ==========
    {
        id: "xp_potion_1",
        name: "Poção de XP Duplo",
        description:
            "Dobra o XP ganho na próxima quest que você completar. Perfeito para missões difíceis!",
        icon: "🧪",
        type: "consumable",
        category: "boost",
        effect: "xp_boost",
        price: 300,
    },
    {
        id: "coin_multiplier_1",
        name: "Multiplicador de Moedas",
        description:
            "Dobra todas as moedas ganhas por 24 horas. Ative e complete várias quests para lucrar!",
        icon: "💰",
        type: "consumable",
        category: "boost",
        effect: "coin_multiplier",
        price: 400,
    },

    // ========== PONTOS DE ATRIBUTO ==========
    {
        id: "attr_strength",
        name: "Elixir de Força",
        description:
            "Adiciona +1 ponto permanente em Força. Reduz XP necessário para level up!",
        icon: "💪",
        type: "consumable",
        category: "attribute",
        effect: "attribute_point",
        price: 800,
    },
    {
        id: "attr_intelligence",
        name: "Tomo do Conhecimento",
        description:
            "Adiciona +1 ponto permanente em Inteligência. Aumenta XP ganho em quests de estudo!",
        icon: "🧠",
        type: "consumable",
        category: "attribute",
        effect: "attribute_point",
        price: 800,
    },
    {
        id: "attr_charisma",
        name: "Amuleto do Carisma",
        description:
            "Adiciona +1 ponto permanente em Carisma. Aumenta desconto na loja!",
        icon: "😎",
        type: "consumable",
        category: "attribute",
        effect: "attribute_point",
        price: 800,
    },
    {
        id: "attr_discipline",
        name: "Medalha da Disciplina",
        description:
            "Adiciona +1 ponto permanente em Disciplina. Essencial para manter o foco!",
        icon: "⚡",
        type: "consumable",
        category: "attribute",
        effect: "attribute_point",
        price: 800,
    },

    // ========== RECOMPENSAS ESPECIAIS ==========
    {
        id: "rest_day",
        name: "Dia de Descanso",
        description:
            "Garante 1 dia de pausa total. Não perde streak, mas também não ganha XP. Use para férias ou quando precisar de um break!",
        icon: "🏖️",
        type: "permanent",
        category: "special",
        effect: "rest_day",
        price: 1000,
    },

    // ========== RECOMPENSAS PERSONALIZADAS ==========
    {
        id: "reward_snack",
        name: "Lanchinho Especial",
        description:
            "Permissão para comer algo que você gosta sem culpa. Você merece! 🍕",
        icon: "🍕",
        type: "permanent",
        category: "reward",
        effect: "rest_day", // Reusa o efeito, mas é só uma recompensa
        price: 150,
    },
    {
        id: "reward_movie",
        name: "Sessão de Cinema",
        description:
            "Assista aquele filme que você queria ver há tempo. Relaxe e aproveite! 🎬",
        icon: "🎬",
        type: "permanent",
        category: "reward",
        effect: "rest_day",
        price: 250,
    },
    {
        id: "reward_dinner",
        name: "Jantar Especial",
        description:
            "Permissão para jantar em um restaurante que você gosta. Bon appétit! 🍽️",
        icon: "🍽️",
        type: "permanent",
        category: "reward",
        effect: "rest_day",
        price: 350,
    },
    {
        id: "reward_game",
        name: "Sessão de Jogo",
        description:
            "Jogue aquele game que você estava esperando por 3 horas sem culpa! 🎮",
        icon: "🎮",
        type: "permanent",
        category: "reward",
        effect: "rest_day",
        price: 200,
    },
    {
        id: "reward_weekend",
        name: "Fim de Semana Livre",
        description:
            "Um fim de semana inteiro sem obrigações. Faça o que quiser! 🌴",
        icon: "🌴",
        type: "permanent",
        category: "reward",
        effect: "rest_day",
        price: 1500,
    },
];

/**
 * Retorna itens filtrados por categoria
 */
export function getItemsByCategory(category: string): typeof SHOP_ITEMS {
    if (category === "all") return SHOP_ITEMS;
    return SHOP_ITEMS.filter((item) => item.category === category);
}

/**
 * Retorna itens filtrados por busca (nome ou descrição)
 */
export function searchItems(query: string): typeof SHOP_ITEMS {
    const lowerQuery = query.toLowerCase();
    return SHOP_ITEMS.filter(
        (item) =>
            item.name.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery),
    );
}

