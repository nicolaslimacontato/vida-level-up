export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  category: "daily" | "weekly" | "main" | "special";
  progress?: number;
  maxProgress?: number;
  deadline?: Date;
}

export interface User {
  level: number;
  currentXP: number;
  totalXP: number;
  coins: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attributes: {
    strength: number; // Força - exercícios
    intelligence: number; // Inteligência - estudos
    charisma: number; // Carisma - socialização
    discipline: number; // Disciplina - consistência
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
