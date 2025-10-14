export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  category: "daily" | "weekly" | "main" | "special";
  icon?: string;
  progress?: number;
  maxProgress?: number;
  deadline?: Date;
}

export interface User {
  level: number;
  currentXP: number;
  totalXP: number;
  coins: number;
  currentStreak: number; // Dias consecutivos
  bestStreak: number; // Melhor streak já alcançado
  lastAccessDate: string; // ISO string da última vez que acessou
  completedQuestsToday: boolean; // Se completou pelo menos 1 quest hoje
  inventory: Item[]; // Inventário de itens
  purchasedUpgrades: string[]; // IDs dos upgrades comprados
  activeEffects: {
    // Efeitos ativos no momento
    hasStreakProtection: boolean; // Tem barreira de streak ativa
    xpBoostActive: boolean; // Poção de XP ativa
    xpBoostUntil?: string; // Até quando o boost está ativo
    coinMultiplierActive: boolean; // Multiplicador de moedas ativo
    coinMultiplierUntil?: string; // Até quando o multiplicador está ativo
  };
  attributes: {
    strength: number; // Força - exercícios
    intelligence: number; // Inteligência - estudos
    charisma: number; // Carisma - socialização
    discipline: number; // Disciplina - consistência (aumenta com streak)
  };
}

export interface QuestCategory {
  name: string;
  quests: Quest[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: "treat" | "break" | "experience" | "custom";
  purchased: boolean;
}

export interface MainQuest {
  id: string;
  title: string;
  description: string;
  steps: QuestStep[];
  completed: boolean;
  xpReward: number;
  coinReward: number;
}

export interface QuestStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  xpReward: number;
  coinReward: number;
}

// ========== SISTEMA DE UPGRADES ==========

export type UpgradeCategory =
  | "streak" // Modificadores de streak
  | "xp" // Modificadores de XP
  | "coins" // Modificadores de moedas
  | "protection" // Proteções e mecânicas
  | "multiplier"; // Multiplicadores gerais

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: UpgradeCategory;
  attributeCost: {
    strength?: number;
    intelligence?: number;
    charisma?: number;
    discipline?: number;
  };
  isPermanent: boolean; // true = permanente, false = pode desativar
  isActive: boolean; // Se está ativo no momento
  purchased: boolean; // Se já foi comprado
  effect: string; // Descrição do efeito (ex: "streak_start_1.5x")
  icon: string; // Emoji
}

// ========== SISTEMA DE ITENS ==========

export type ItemType = "consumable" | "permanent";

export type ItemCategory =
  | "protection" // Proteção (Barreira de Streak)
  | "boost" // Buffs temporários (Poções)
  | "attribute" // Pontos de atributo
  | "reward" // Recompensas personalizadas
  | "special"; // Itens especiais

export type ItemEffect =
  | "streak_protection" // Protege contra perda de streak (1 uso)
  | "xp_boost" // Dobra XP da próxima quest
  | "coin_multiplier" // 2x moedas por 24h
  | "attribute_point" // +1 em atributo escolhido
  | "rest_day"; // Dia de descanso (não perde/ganha nada)

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
  type: ItemType;
  category: ItemCategory;
  effect: ItemEffect;
  price: number; // Preço em moedas
  quantity?: number; // Quantidade (para itens no inventário)
  acquiredAt?: string; // Data de aquisição (ISO string)
  usedAt?: string; // Data de uso (ISO string) - para histórico
}
