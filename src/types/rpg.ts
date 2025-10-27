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
  attributeBonus?: "strength" | "intelligence" | "charisma" | "discipline";
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

// ========== SISTEMA DE CONQUISTAS ==========

export type AchievementCategory = 'beginner' | 'veteran' | 'master' | 'legendary';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  coinReward: number;
}

export interface AchievementTemplate {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  maxProgress: number;
  xpReward: number;
  coinReward: number;
  condition: (user: User, quests: Quest[], mainQuests: MainQuest[]) => number;
}

// ========== SISTEMA DE METAS ==========

export type GoalType = 'daily' | 'weekly' | 'monthly';

export interface Goal {
  id: string;
  goalId: string;
  title: string;
  description: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  completedAt?: string;
  expiresAt?: string;
}

export interface GoalTemplate {
  goalId: string;
  title: string;
  description: string;
  type: GoalType;
  targetValue: number;
  xpReward: number;
  coinReward: number;
  condition: (user: User, quests: Quest[], mainQuests: MainQuest[]) => number;
}

// ========== SISTEMA DE LOG DE ATIVIDADES ==========

export type ActivityType =
  | 'quest_completed'
  | 'main_quest_step_completed'
  | 'main_quest_completed'
  | 'level_up'
  | 'achievement_unlocked'
  | 'goal_completed'
  | 'item_purchased'
  | 'item_used'
  | 'upgrade_purchased'
  | 'streak_updated'
  | 'daily_reset'
  | 'login';

export interface ActivityLog {
  id: string;
  actionType: ActivityType;
  actionData: Record<string, unknown>;
  xpGained: number;
  coinsGained: number;
  levelBefore: number;
  levelAfter: number;
  createdAt: string;
}

export interface ActivityLogEntry {
  id: string;
  actionType: ActivityType;
  actionData: Record<string, unknown>;
  xpGained: number;
  coinsGained: number;
  levelBefore: number;
  levelAfter: number;
  createdAt: string;
  // Computed fields for display
  title: string;
  description: string;
  icon: string;
  color: string;
}

// ========== SISTEMA DE RECOMPENSAS DIÁRIAS ==========

export type DailyRewardType = 'xp' | 'coins' | 'item' | 'upgrade';

export interface DailyReward {
  id: string;
  rewardDate: string;
  rewardType: DailyRewardType;
  rewardValue: number;
  rewardData: Record<string, unknown>;
  claimed: boolean;
  claimedAt?: string;
}

export interface DailyRewardTemplate {
  day: number;
  rewardType: DailyRewardType;
  rewardValue: number;
  rewardData: Record<string, unknown>;
  title: string;
  description: string;
  icon: string;
  isSpecial: boolean;
}
