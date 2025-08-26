import { useState, useEffect } from "react";
import { User, Quest, MainQuest, Reward } from "@/types/rpg";
import { useGameAudio } from "./useGameAudio";

const INITIAL_QUESTS: Quest[] = [
  {
    id: "1",
    title: "Exercitar-se por 30 minutos",
    description:
      "Faça qualquer tipo de exercício físico por pelo menos 30 minutos",
    xpReward: 50,
    coinReward: 10,
    completed: false,
    category: "daily",
  },
  {
    id: "2",
    title: "Ler por 20 minutos",
    description: "Leia um livro, artigo ou qualquer material educativo",
    xpReward: 30,
    coinReward: 8,
    completed: false,
    category: "daily",
  },
  {
    id: "3",
    title: "Beber 2L de água",
    description: "Mantenha-se hidratado durante o dia",
    xpReward: 25,
    coinReward: 5,
    completed: false,
    category: "daily",
  },
  {
    id: "4",
    title: "Meditar por 10 minutos",
    description: "Pratique mindfulness ou meditação",
    xpReward: 40,
    coinReward: 12,
    completed: false,
    category: "daily",
  },
  {
    id: "5",
    title: "Organizar o ambiente",
    description: "Mantenha seu espaço de trabalho ou casa organizado",
    xpReward: 35,
    coinReward: 7,
    completed: false,
    category: "daily",
  },
  {
    id: "6",
    title: "Estudar por 2 horas",
    description: "Dedique tempo para aprender algo novo",
    xpReward: 80,
    coinReward: 20,
    completed: false,
    category: "daily",
  },
  {
    id: "7",
    title: "Socializar com amigos",
    description: "Conecte-se com pessoas importantes para você",
    xpReward: 45,
    coinReward: 15,
    completed: false,
    category: "daily",
  },
];

const INITIAL_MAIN_QUESTS: MainQuest[] = [
  {
    id: "main1",
    title: "Completar um Curso Online",
    description: "Termine um curso completo de sua área de interesse",
    steps: [
      {
        id: "step1",
        title: "Escolher o curso",
        description: "Defina qual curso você quer fazer",
        completed: false,
        xpReward: 100,
        coinReward: 50,
      },
      {
        id: "step2",
        title: "Completar 25% do curso",
        description: "Assista e complete um quarto do curso",
        completed: false,
        xpReward: 150,
        coinReward: 75,
      },
      {
        id: "step3",
        title: "Completar 50% do curso",
        description: "Chegue na metade do curso",
        completed: false,
        xpReward: 200,
        coinReward: 100,
      },
      {
        id: "step4",
        title: "Completar 75% do curso",
        description: "Quase lá! Complete três quartos",
        completed: false,
        xpReward: 250,
        coinReward: 125,
      },
      {
        id: "step5",
        title: "Finalizar o curso",
        description: "Complete 100% do curso e receba o certificado",
        completed: false,
        xpReward: 500,
        coinReward: 300,
      },
    ],
    completed: false,
    xpReward: 1200,
    coinReward: 650,
  },
  {
    id: "main2",
    title: "Economizar R$ 1000",
    description: "Acumule uma reserva financeira de mil reais",
    steps: [
      {
        id: "step1",
        title: "Economizar R$ 100",
        description: "Primeira meta: R$ 100",
        completed: false,
        xpReward: 80,
        coinReward: 40,
      },
      {
        id: "step2",
        title: "Economizar R$ 300",
        description: "Segunda meta: R$ 300",
        completed: false,
        xpReward: 120,
        coinReward: 60,
      },
      {
        id: "step3",
        title: "Economizar R$ 600",
        description: "Terceira meta: R$ 600",
        completed: false,
        xpReward: 200,
        coinReward: 100,
      },
      {
        id: "step4",
        title: "Economizar R$ 1000",
        description: "Meta final: R$ 1000",
        completed: false,
        xpReward: 400,
        coinReward: 200,
      },
    ],
    completed: false,
    xpReward: 800,
    coinReward: 400,
  },
];

const INITIAL_REWARDS: Reward[] = [
  {
    id: "reward1",
    name: "Lanchinho Especial",
    description: "Permissão para comer algo que você gosta sem culpa",
    cost: 100,
    category: "treat",
    purchased: false,
  },
  {
    id: "reward2",
    name: "Dia de Descanso",
    description: "Um dia inteiro para relaxar sem se sentir culpado",
    cost: 500,
    category: "break",
    purchased: false,
  },
  {
    id: "reward3",
    name: "Sessão de Cinema",
    description: "Assista um filme que você queria ver há tempo",
    cost: 200,
    category: "experience",
    purchased: false,
  },
  {
    id: "reward4",
    name: "Jantar Especial",
    description: "Permissão para jantar em um restaurante que você gosta",
    cost: 300,
    category: "treat",
    purchased: false,
  },
  {
    id: "reward5",
    name: "Fim de Semana Livre",
    description: "Um fim de semana inteiro sem obrigações",
    cost: 1000,
    category: "break",
    purchased: false,
  },
];

const INITIAL_USER: User = {
  level: 1,
  currentXP: 0,
  totalXP: 0,
  coins: 50,
  health: 100,
  maxHealth: 100,
  mana: 100,
  maxMana: 100,
  attributes: {
    strength: 1,
    intelligence: 1,
    charisma: 1,
    discipline: 1,
  },
};

export function useRPG() {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [mainQuests, setMainQuests] =
    useState<MainQuest[]>(INITIAL_MAIN_QUESTS);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  // Sistema de áudio do jogo
  const { playLevelUpSound, playOrbSoundWithVariation, preloadGameSounds } =
    useGameAudio();

  // Carregar dados do localStorage ao inicializar e preload dos sons
  useEffect(() => {
    // Preload dos sons do jogo
    preloadGameSounds();

    const savedUser = localStorage.getItem("rpg-user");
    const savedQuests = localStorage.getItem("rpg-quests");
    const savedMainQuests = localStorage.getItem("rpg-main-quests");
    const savedRewards = localStorage.getItem("rpg-rewards");

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Validar e corrigir dados se necessário
      if (userData.currentXP < 0 || isNaN(userData.currentXP)) {
        // Recalcular baseado no totalXP
        let tempLevel = 1;
        let tempCurrentXP = userData.totalXP;

        // Calcular nível correto
        while (true) {
          let totalXPForNextLevel = 0;
          for (let i = 1; i <= tempLevel; i++) {
            totalXPForNextLevel += Math.floor(100 * Math.pow(i, 1.5));
          }
          if (userData.totalXP >= totalXPForNextLevel) {
            tempLevel++;
          } else {
            break;
          }
        }

        // Calcular currentXP
        let totalXPForCurrentLevel = 0;
        for (let i = 1; i < tempLevel; i++) {
          totalXPForCurrentLevel += Math.floor(100 * Math.pow(i, 1.5));
        }
        tempCurrentXP = userData.totalXP - totalXPForCurrentLevel;

        userData.level = tempLevel;
        userData.currentXP = Math.max(0, tempCurrentXP);
      }
      setUser(userData);
    }
    if (savedQuests) {
      setQuests(JSON.parse(savedQuests));
    }
    if (savedMainQuests) {
      setMainQuests(JSON.parse(savedMainQuests));
    }
    if (savedRewards) {
      setRewards(JSON.parse(savedRewards));
    }
  }, []);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem("rpg-user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("rpg-quests", JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem("rpg-main-quests", JSON.stringify(mainQuests));
  }, [mainQuests]);

  useEffect(() => {
    localStorage.setItem("rpg-rewards", JSON.stringify(rewards));
  }, [rewards]);

  // Calcular XP necessário para o próximo nível (progressão exponencial)
  const getXPForNextLevel = (level: number): number => {
    // Fórmula: baseXP * (level^1.5) para progressão equilibrada
    const baseXP = 100;
    return Math.floor(baseXP * Math.pow(level, 1.5));
  };

  // Calcular XP total necessário para alcançar um nível específico
  const getTotalXPForLevel = (level: number): number => {
    let totalXP = 0;
    for (let i = 1; i < level; i++) {
      totalXP += getXPForNextLevel(i);
    }
    return totalXP;
  };

  // Verificar se o usuário subiu de nível e calcular novo currentXP
  const processLevelUp = (
    newTotalXP: number,
    currentLevel: number,
  ): { level: number; currentXP: number } => {
    let level = currentLevel;
    let currentXP = user.currentXP;

    // Calcular o nível baseado no XP total
    while (true) {
      const totalXPNeeded = getTotalXPForLevel(level + 1);
      if (newTotalXP >= totalXPNeeded) {
        level++;
      } else {
        break;
      }
    }

    // Calcular currentXP baseado no excesso para o nível atual
    if (level > currentLevel) {
      const totalXPForCurrentLevel = getTotalXPForLevel(level);
      currentXP = newTotalXP - totalXPForCurrentLevel;
    } else {
      // Se não subiu de nível, apenas adiciona o XP ganho
      const xpGained = newTotalXP - user.totalXP;
      currentXP = user.currentXP + xpGained;
    }

    return { level, currentXP };
  };

  // Completar uma quest
  const completeQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    const newQuests = quests.map((q) =>
      q.id === questId ? { ...q, completed: true } : q,
    );
    setQuests(newQuests);

    // Adicionar XP e moedas ao usuário
    const newTotalXP = user.totalXP + quest.xpReward;
    const newCoins = user.coins + quest.coinReward;
    const { level: newLevel, currentXP: newCurrentXP } = processLevelUp(
      newTotalXP,
      user.level,
    );

    // Atualizar atributos baseado na categoria da quest
    const newAttributes = { ...user.attributes };
    if (quest.category === "daily") {
      if (
        quest.title.toLowerCase().includes("exercitar") ||
        quest.title.toLowerCase().includes("treino")
      ) {
        newAttributes.strength += 1;
      } else if (
        quest.title.toLowerCase().includes("ler") ||
        quest.title.toLowerCase().includes("estudar")
      ) {
        newAttributes.intelligence += 1;
      } else if (quest.title.toLowerCase().includes("socializar")) {
        newAttributes.charisma += 1;
      } else {
        newAttributes.discipline += 1;
      }
    }

    // Tocar som de ganhar XP (orb)
    playOrbSoundWithVariation();

    // Verificar se subiu de nível
    if (newLevel > user.level) {
      setNewLevel(newLevel);
      setShowLevelUp(true);
      // Tocar som de level up
      playLevelUpSound();
    }

    setUser({
      ...user,
      level: newLevel,
      currentXP: newCurrentXP,
      totalXP: newTotalXP,
      coins: newCoins,
      attributes: newAttributes,
    });
  };

  // Completar um passo de quest principal
  const completeMainQuestStep = (questId: string, stepId: string) => {
    const quest = mainQuests.find((q) => q.id === questId);
    if (!quest) return;

    const newMainQuests = mainQuests.map((q) => {
      if (q.id === questId) {
        const newSteps = q.steps.map((step) => {
          if (step.id === stepId) {
            return { ...step, completed: true };
          }
          return step;
        });

        // Verificar se todos os passos foram completados
        const allCompleted = newSteps.every((step) => step.completed);

        return {
          ...q,
          steps: newSteps,
          completed: allCompleted,
        };
      }
      return q;
    });

    setMainQuests(newMainQuests);

    // Adicionar recompensas do passo
    const step = quest.steps.find((s) => s.id === stepId);
    if (step) {
      const newTotalXP = user.totalXP + step.xpReward;
      const newCoins = user.coins + step.coinReward;
      const { level: newLevel, currentXP: newCurrentXP } = processLevelUp(
        newTotalXP,
        user.level,
      );

      // Tocar som de ganhar XP (orb)
      playOrbSoundWithVariation();

      // Verificar se subiu de nível
      if (newLevel > user.level) {
        setNewLevel(newLevel);
        setShowLevelUp(true);
        // Tocar som de level up
        playLevelUpSound();
      }

      setUser({
        ...user,
        level: newLevel,
        currentXP: newCurrentXP,
        totalXP: newTotalXP,
        coins: newCoins,
      });
    }
  };

  // Comprar uma recompensa
  const purchaseReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward || reward.purchased || user.coins < reward.cost) return;

    const newRewards = rewards.map((r) =>
      r.id === rewardId ? { ...r, purchased: true } : r,
    );
    setRewards(newRewards);

    // Deduzir moedas
    setUser({
      ...user,
      coins: user.coins - reward.cost,
    });
  };

  // Resetar quests diárias (para usar no futuro)
  const resetDailyQuests = () => {
    const resetQuests = quests.map((q) => ({
      ...q,
      completed: false,
    }));
    setQuests(resetQuests);
  };

  // Calcular XP restante para o próximo nível
  const getRemainingXP = (): number => {
    const xpNeeded = getXPForNextLevel(user.level);
    return Math.max(0, xpNeeded - user.currentXP);
  };

  // Calcular progresso para o próximo nível (0-100)
  const getLevelProgress = (): number => {
    const xpNeeded = getXPForNextLevel(user.level);
    if (xpNeeded === 0) return 100;
    const progress = (user.currentXP / xpNeeded) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Calcular progresso dos atributos (0-100)
  const getAttributeProgress = (
    attribute: keyof User["attributes"],
  ): number => {
    const current = user.attributes[attribute];
    const max = 100; // Máximo de 100 para cada atributo
    return Math.min(100, (current / max) * 100);
  };

  // Resetar sistema XP (função para debug/reset)
  const resetXPSystem = () => {
    setUser(INITIAL_USER);
    setQuests(INITIAL_QUESTS);
    setMainQuests(INITIAL_MAIN_QUESTS);
    setRewards(INITIAL_REWARDS);
  };

  return {
    user,
    quests,
    mainQuests,
    rewards,
    showLevelUp,
    newLevel,
    completeQuest,
    completeMainQuestStep,
    purchaseReward,
    resetDailyQuests,
    resetXPSystem,
    getXPForNextLevel,
    getRemainingXP,
    getLevelProgress,
    getAttributeProgress,
    setShowLevelUp,
  };
}
