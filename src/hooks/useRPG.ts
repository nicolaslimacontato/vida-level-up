import { useState, useEffect } from "react";
import { User, Quest, MainQuest, Reward, Upgrade } from "@/types/rpg";
import { UPGRADE_TEMPLATES } from "@/data/upgradeTemplates";
import { useGameAudio } from "./useGameAudio";
import { checkDailyReset, resetDailyQuests as resetDailyQuestsUtil, updateUserStreak } from "./useDailyReset";

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
  currentStreak: 0,
  bestStreak: 0,
  lastAccessDate: new Date().toISOString(),
  completedQuestsToday: false,
  inventory: [],
  purchasedUpgrades: [],
  activeEffects: {
    hasStreakProtection: false,
    xpBoostActive: false,
    coinMultiplierActive: false,
  },
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
  const [upgrades, setUpgrades] = useState<Upgrade[]>(UPGRADE_TEMPLATES);
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
    const savedUpgrades = localStorage.getItem("rpg-upgrades");

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

      // Garantir que campos de streak existem (migração de dados antigos)
      if (userData.currentStreak === undefined) {
        userData.currentStreak = 0;
      }
      if (userData.bestStreak === undefined) {
        userData.bestStreak = 0;
      }
      if (!userData.lastAccessDate) {
        userData.lastAccessDate = new Date().toISOString();
      }
      if (userData.completedQuestsToday === undefined) {
        userData.completedQuestsToday = false;
      }
      if (!userData.inventory) {
        userData.inventory = [];
      }
      if (!userData.activeEffects) {
        userData.activeEffects = {
          hasStreakProtection: false,
          xpBoostActive: false,
          coinMultiplierActive: false,
        };
      }

      // Verificar reset diário APÓS carregar dados
      const resetInfo = checkDailyReset(userData.lastAccessDate);
      if (resetInfo.shouldReset) {
        const updatedUser = updateUserStreak(userData, resetInfo.daysPassed);
        setUser(updatedUser);

        // Streak atualizado
      } else {
        setUser(userData);
      }
    }

    // Carregar quests com validação
    let loadedQuests = INITIAL_QUESTS;
    if (savedQuests && savedQuests !== "undefined") {
      try {
        loadedQuests = JSON.parse(savedQuests);
      } catch (e) {
        console.error("Erro ao carregar quests, usando padrão:", e);
        loadedQuests = INITIAL_QUESTS;
      }
    }

    // Resetar quests diárias se necessário
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const resetInfo = checkDailyReset(userData.lastAccessDate);
      if (resetInfo.shouldReset) {
        loadedQuests = resetDailyQuestsUtil(loadedQuests);
        // Quests diárias resetadas
      }
    }

    setQuests(loadedQuests);

    // Carregar main quests com validação
    if (savedMainQuests && savedMainQuests !== "undefined") {
      try {
        setMainQuests(JSON.parse(savedMainQuests));
      } catch (e) {
        console.error("Erro ao carregar main quests, usando padrão:", e);
        setMainQuests(INITIAL_MAIN_QUESTS);
      }
    }

    // Carregar rewards com validação
    if (savedRewards && savedRewards !== "undefined") {
      try {
        setRewards(JSON.parse(savedRewards));
      } catch (e) {
        console.error("Erro ao carregar rewards, usando padrão:", e);
        setRewards(INITIAL_REWARDS);
      }
    }

    // Carregar upgrades com validação
    if (savedUpgrades && savedUpgrades !== "undefined") {
      try {
        const loadedUpgrades = JSON.parse(savedUpgrades);
        // Sincronizar com templates para garantir que novos upgrades apareçam
        const syncedUpgrades = UPGRADE_TEMPLATES.map(template => {
          const loaded = loadedUpgrades.find((u: Upgrade) => u.id === template.id);
          return loaded ? { ...template, ...loaded } : template;
        });
        setUpgrades(syncedUpgrades);
      } catch (e) {
        console.error("Erro ao carregar upgrades, usando padrão:", e);
        setUpgrades(UPGRADE_TEMPLATES);
      }
    }
  }, [preloadGameSounds]);

  // Salvar dados no localStorage sempre que houver mudanças
  useEffect(() => {
    if (user) {
      localStorage.setItem("rpg-user", JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (quests && quests.length > 0) {
      localStorage.setItem("rpg-quests", JSON.stringify(quests));
    }
  }, [quests]);

  useEffect(() => {
    if (mainQuests && mainQuests.length > 0) {
      localStorage.setItem("rpg-main-quests", JSON.stringify(mainQuests));
    }
  }, [mainQuests]);

  useEffect(() => {
    if (rewards && rewards.length > 0) {
      localStorage.setItem("rpg-rewards", JSON.stringify(rewards));
    }
  }, [rewards]);

  useEffect(() => {
    if (upgrades && upgrades.length > 0) {
      localStorage.setItem("rpg-upgrades", JSON.stringify(upgrades));
    }
  }, [upgrades]);

  // Calcular multiplicador de streak (10% por dia)
  const getStreakMultiplier = (streak: number): number => {
    let baseMultiplier = 1 + streak * 0.1;

    // Aplicar efeitos dos upgrades ativos
    const activeUpgrades = upgrades.filter(upgrade => upgrade.purchased && upgrade.isActive);

    // Streak Turbinado - começa em 1.5x ao invés de 1.1x
    const streakTurbinado = activeUpgrades.find(u => u.effect === "streak_start_1.5x");
    if (streakTurbinado && streak >= 1) {
      baseMultiplier = Math.max(baseMultiplier, 1.5);
    }

    // Streak Duplo - multiplicador é dobrado
    const streakDuplo = activeUpgrades.find(u => u.effect === "streak_double_multiplier");
    if (streakDuplo) {
      baseMultiplier = baseMultiplier * 2;
    }

    return Math.min(baseMultiplier, 5.0); // Máximo de 5x
  };

  // ========== EFEITOS DOS ATRIBUTOS ==========

  // Força: Reduz XP necessário para level up (máx 30%)
  const getStrengthXPReduction = (strength: number): number => {
    const reduction = Math.floor(strength * 0.5); // 0.5% por ponto
    return Math.min(reduction, 30); // Máximo 30%
  };

  // Inteligência: Bônus de XP em quests de estudo (máx 50%)
  const getIntelligenceBonus = (intelligence: number): number => {
    const bonus = Math.floor(intelligence * 2); // 2% por ponto
    return Math.min(bonus, 50); // Máximo 50%
  };

  // Carisma: Desconto na loja (máx 40%)
  const getCharismaDiscount = (charisma: number): number => {
    const discount = Math.floor(charisma * 1); // 1% por ponto
    return Math.min(discount, 40); // Máximo 40%
  };

  // Calcular XP necessário para o próximo nível (progressão exponencial)
  const getXPForNextLevel = (level: number): number => {
    // Fórmula: baseXP * (level^1.5) para progressão equilibrada
    const baseXP = 100;
    const xpNeeded = Math.floor(baseXP * Math.pow(level, 1.5));

    // Aplicar redução de Força
    const reduction = getStrengthXPReduction(user.attributes.strength);
    const reducedXP = Math.floor(xpNeeded * (1 - reduction / 100));

    return reducedXP;
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

    // Aplicar multiplicador de streak ao XP
    const streakMultiplier = getStreakMultiplier(user.currentStreak);
    let xpWithStreak = Math.floor(quest.xpReward * streakMultiplier);

    // Aplicar efeitos dos upgrades ativos
    const activeUpgrades = upgrades.filter(upgrade => upgrade.purchased && upgrade.isActive);

    // Bônus de XP permanente
    const menteAfiada = activeUpgrades.find(u => u.effect === "xp_bonus_10_percent");
    const genio = activeUpgrades.find(u => u.effect === "xp_bonus_25_percent");
    const sabedoriaAncestral = activeUpgrades.find(u => u.effect === "daily_quest_xp_1.5x");

    if (menteAfiada) {
      xpWithStreak = Math.floor(xpWithStreak * 1.1);
    }
    if (genio) {
      xpWithStreak = Math.floor(xpWithStreak * 1.25);
    }

    // Sabedoria Ancestral - XP de quests diárias vale 1.5x
    if (sabedoriaAncestral && quest.category === "daily") {
      xpWithStreak = Math.floor(xpWithStreak * 1.5);
    }

    // Aplicar bônus de Inteligência em quests de estudo
    const isStudyQuest =
      quest.title.toLowerCase().includes("ler") ||
      quest.title.toLowerCase().includes("estudar") ||
      quest.title.toLowerCase().includes("aprender");

    if (isStudyQuest) {
      const intelligenceBonus = getIntelligenceBonus(user.attributes.intelligence);
      xpWithStreak = Math.floor(xpWithStreak * (1 + intelligenceBonus / 100));
    }

    // Aplicar efeitos dos upgrades de moedas
    let coinsWithBonus = quest.coinReward;
    const magnetismo = activeUpgrades.find(u => u.effect === "coins_bonus_15_percent");

    if (magnetismo) {
      coinsWithBonus = Math.floor(coinsWithBonus * 1.15);
    }

    // Lendário - todas as recompensas +20%
    const lendario = activeUpgrades.find(u => u.effect === "all_rewards_20_percent_bonus");
    if (lendario) {
      xpWithStreak = Math.floor(xpWithStreak * 1.2);
      coinsWithBonus = Math.floor(coinsWithBonus * 1.2);
    }

    // Adicionar XP e moedas ao usuário
    const newTotalXP = user.totalXP + xpWithStreak;
    const newCoins = user.coins + coinsWithBonus;
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
      completedQuestsToday: true, // Marcar que completou quest hoje
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
      // Aplicar multiplicador de streak ao XP
      const streakMultiplier = getStreakMultiplier(user.currentStreak);
      let xpWithStreak = Math.floor(step.xpReward * streakMultiplier);

      // Aplicar efeitos dos upgrades ativos
      const activeUpgrades = upgrades.filter(upgrade => upgrade.purchased && upgrade.isActive);

      // Bônus de XP permanente
      const menteAfiada = activeUpgrades.find(u => u.effect === "xp_bonus_10_percent");
      const genio = activeUpgrades.find(u => u.effect === "xp_bonus_25_percent");

      if (menteAfiada) {
        xpWithStreak = Math.floor(xpWithStreak * 1.1);
      }
      if (genio) {
        xpWithStreak = Math.floor(xpWithStreak * 1.25);
      }

      // Aplicar efeitos dos upgrades de moedas
      let coinsWithBonus = step.coinReward;
      const magnetismo = activeUpgrades.find(u => u.effect === "coins_bonus_15_percent");

      if (magnetismo) {
        coinsWithBonus = Math.floor(coinsWithBonus * 1.15);
      }

      // Lendário - todas as recompensas +20%
      const lendario = activeUpgrades.find(u => u.effect === "all_rewards_20_percent_bonus");
      if (lendario) {
        xpWithStreak = Math.floor(xpWithStreak * 1.2);
        coinsWithBonus = Math.floor(coinsWithBonus * 1.2);
      }

      const newTotalXP = user.totalXP + xpWithStreak;
      const newCoins = user.coins + coinsWithBonus;
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
    if (!reward || reward.purchased) return;

    // Calcular preço com desconto de Carisma
    const discount = getCharismaDiscount(user.attributes.charisma);
    const finalPrice = Math.floor(reward.cost * (1 - discount / 100));

    // Verificar se tem moedas suficientes
    if (user.coins < finalPrice) return;

    const newRewards = rewards.map((r) =>
      r.id === rewardId ? { ...r, purchased: true } : r,
    );
    setRewards(newRewards);

    // Deduzir moedas (com desconto aplicado)
    setUser({
      ...user,
      coins: user.coins - finalPrice,
    });

    // Desconto de Carisma aplicado
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

  // Comprar item da loja
  const purchaseItem = (itemId: string) => {
    // Importar dinamicamente para evitar dependência circular
    import("@/data/shopItems").then(({ SHOP_ITEMS }) => {
      const item = SHOP_ITEMS.find((i) => i.id === itemId);
      if (!item) {
        console.error("Item não encontrado:", itemId);
        return;
      }

      // Calcular preço final com desconto de carisma
      const discount = getCharismaDiscount(user.attributes.charisma);
      let finalPrice = Math.floor(item.price * (1 - discount / 100));

      // Aplicar upgrade "Negociador Nato" - desconto extra de 10%
      const activeUpgrades = upgrades.filter(upgrade => upgrade.purchased && upgrade.isActive);
      const negociadorNato = activeUpgrades.find(u => u.effect === "shop_discount_extra_10_percent");

      if (negociadorNato) {
        finalPrice = Math.floor(finalPrice * 0.9); // 10% de desconto adicional
      }

      // Verificar se tem moedas suficientes
      if (user.coins < finalPrice) {
        return;
      }

      // Verificar se já tem o item no inventário (para consumíveis)
      const existingItemIndex = user.inventory.findIndex(
        (invItem) => invItem.id === itemId,
      );

      if (existingItemIndex >= 0) {
        // Se já tem o item, incrementar quantidade
        const updatedInventory = [...user.inventory];
        updatedInventory[existingItemIndex] = {
          ...updatedInventory[existingItemIndex],
          quantity: (updatedInventory[existingItemIndex].quantity || 1) + 1,
        };
        setUser({
          ...user,
          coins: user.coins - finalPrice,
          inventory: updatedInventory,
        });
      } else {
        // Adicionar novo item ao inventário
        const newItem = {
          ...item,
          quantity: 1,
          acquiredAt: new Date().toISOString(),
        };
        setUser({
          ...user,
          coins: user.coins - finalPrice,
          inventory: [...user.inventory, newItem],
        });
      }

      // Compra realizada com sucesso
    });
  };

  // Usar item do inventário
  const useItem = (itemId: string, attribute?: string) => {
    const itemIndex = user.inventory.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      return;
    }

    const item = user.inventory[itemIndex];

    // Verificar se é consumível e não foi usado
    if (item.type !== "consumable" || item.usedAt) {
      return;
    }

    // Aplicar efeito do item
    let updatedUser = { ...user };
    const updatedInventory = [...user.inventory];

    switch (item.effect) {
      case "streak_protection":
        updatedUser = {
          ...updatedUser,
          activeEffects: {
            ...updatedUser.activeEffects,
            hasStreakProtection: true,
          },
        };
        // Barreira de Streak ativada
        break;

      case "xp_boost":
        updatedUser = {
          ...updatedUser,
          activeEffects: {
            ...updatedUser.activeEffects,
            xpBoostActive: true,
            xpBoostUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
          },
        };
        // Poção de XP ativada
        break;

      case "coin_multiplier":
        updatedUser = {
          ...updatedUser,
          activeEffects: {
            ...updatedUser.activeEffects,
            coinMultiplierActive: true,
            coinMultiplierUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
          },
        };
        // Multiplicador de moedas ativado
        break;

      case "attribute_point":
        if (!attribute) {
          return;
        }
        const validAttributes = ["strength", "intelligence", "charisma", "discipline"];
        if (!validAttributes.includes(attribute)) {
          return;
        }

        updatedUser = {
          ...updatedUser,
          attributes: {
            ...updatedUser.attributes,
            [attribute]: Math.min(100, updatedUser.attributes[attribute as keyof typeof updatedUser.attributes] + 1),
          },
        };
        // Atributo aumentado
        break;

      case "rest_day":
        // Rest day - dia de descanso
        break;

      default:
      // Item usado
    }

    // Marcar item como usado e atualizar inventário
    updatedInventory[itemIndex] = {
      ...item,
      usedAt: new Date().toISOString(),
      quantity: Math.max(0, (item.quantity || 1) - 1),
    };

    // Se quantidade chegou a 0, remover do inventário
    if (updatedInventory[itemIndex].quantity === 0) {
      updatedInventory.splice(itemIndex, 1);
    }

    updatedUser = {
      ...updatedUser,
      inventory: updatedInventory,
    };

    setUser(updatedUser);
    // Item usado com sucesso
  };

  // ========== CRUD DE QUESTS ==========

  // Adicionar nova quest
  const addQuest = (questData: Omit<Quest, "id" | "completed">) => {
    // Validar dados
    if (!questData.title.trim()) {
      return false;
    }

    if (questData.xpReward <= 0 || questData.coinReward <= 0) {
      return false;
    }

    // Verificar se título já existe
    const existingQuest = quests.find(q => q.title.toLowerCase() === questData.title.toLowerCase());
    if (existingQuest) {
      return false;
    }

    // Criar nova quest
    const newQuest: Quest = {
      id: `quest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: questData.title.trim(),
      description: questData.description.trim(),
      xpReward: questData.xpReward,
      coinReward: questData.coinReward,
      category: questData.category,
      completed: false,
      progress: questData.progress || 0,
      maxProgress: questData.maxProgress || 1,
      deadline: questData.deadline,
    };

    setQuests([...quests, newQuest]);
    return true;
  };

  // Atualizar quest existente
  const updateQuest = (questId: string, updates: Partial<Quest>) => {
    const questIndex = quests.findIndex(q => q.id === questId);
    if (questIndex === -1) {
      return false;
    }

    const quest = quests[questIndex];
    const updatedQuest = { ...quest, ...updates };

    // Validar título único (se mudou)
    if (updates.title && updates.title !== quest.title) {
      const existingQuest = quests.find(q =>
        q.id !== questId && q.title.toLowerCase() === updates.title!.toLowerCase()
      );
      if (existingQuest) {
        return false;
      }
    }

    // Validar valores (se mudaram)
    if (updates.xpReward !== undefined && updates.xpReward <= 0) {
      return false;
    }
    if (updates.coinReward !== undefined && updates.coinReward <= 0) {
      return false;
    }

    const updatedQuests = [...quests];
    updatedQuests[questIndex] = updatedQuest;
    setQuests(updatedQuests);
    return true;
  };

  // Deletar quest
  const deleteQuest = (questId: string) => {
    const questIndex = quests.findIndex(q => q.id === questId);
    if (questIndex === -1) {
      return false;
    }

    const updatedQuests = quests.filter(q => q.id !== questId);
    setQuests(updatedQuests);
    return true;
  };

  // Duplicar quest
  const duplicateQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) {
      return false;
    }

    const duplicatedQuest: Quest = {
      ...quest,
      id: `quest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${quest.title} (Cópia)`,
      completed: false,
      progress: 0,
    };

    setQuests([...quests, duplicatedQuest]);
    return true;
  };

  // Adicionar quest a partir de template
  const addQuestFromTemplate = (templateData: { title: string; description: string; category: "daily" | "weekly" | "main" | "special"; xpReward: number; coinReward: number }) => {
    const questData = {
      title: templateData.title,
      description: templateData.description,
      xpReward: templateData.xpReward,
      coinReward: templateData.coinReward,
      category: templateData.category,
      progress: 0,
      maxProgress: 1,
    };
    return addQuest(questData);
  };

  // Resetar sistema XP (função para debug/reset)
  const resetXPSystem = () => {
    setUser(INITIAL_USER);
    setQuests(INITIAL_QUESTS);
    setMainQuests(INITIAL_MAIN_QUESTS);
    setRewards(INITIAL_REWARDS);
  };

  // Função para resetar tudo - APAGA TODOS OS DADOS
  const resetAll = () => {
    // Resetar todos os estados para valores iniciais
    setUser(INITIAL_USER);
    setQuests(INITIAL_QUESTS);
    setMainQuests(INITIAL_MAIN_QUESTS);
    setRewards(INITIAL_REWARDS);
    setUpgrades(UPGRADE_TEMPLATES);
    setShowLevelUp(false);
    setNewLevel(1);

    // Limpar localStorage completamente
    localStorage.removeItem("rpg-user");
    localStorage.removeItem("rpg-quests");
    localStorage.removeItem("rpg-main-quests");
    localStorage.removeItem("rpg-rewards");
    localStorage.removeItem("rpg-upgrades");

    // Recarregar a página para garantir que tudo seja resetado
    window.location.reload();
  };

  // CRUD de MainQuests
  const addMainQuest = (questData: Omit<MainQuest, "id" | "completed">) => {
    const newQuest: MainQuest = {
      ...questData,
      id: `main-${Date.now()}`,
      completed: false,
      steps: questData.steps.map(step => ({
        ...step,
        id: `step-${Date.now()}-${Math.random()}`,
        completed: false
      }))
    };
    setMainQuests([...mainQuests, newQuest]);
    return true;
  };

  const updateMainQuest = (id: string, updates: Partial<MainQuest>) => {
    setMainQuests(mainQuests.map(q => q.id === id ? { ...q, ...updates } : q));
    return true;
  };

  const deleteMainQuest = (id: string) => {
    setMainQuests(mainQuests.filter(q => q.id !== id));
    return true;
  };

  const duplicateMainQuest = (id: string) => {
    const quest = mainQuests.find(q => q.id === id);
    if (!quest) return false;
    const newQuest = {
      ...quest,
      id: `main-${Date.now()}`,
      title: `${quest.title} (cópia)`,
      completed: false,
      steps: quest.steps.map(step => ({
        ...step,
        id: `step-${Date.now()}-${Math.random()}`,
        completed: false
      }))
    };
    setMainQuests([...mainQuests, newQuest]);
    return true;
  };

  // CRUD de Rewards
  const addReward = (rewardData: Omit<Reward, "id" | "purchased">) => {
    const newReward: Reward = {
      ...rewardData,
      id: `reward-${Date.now()}`,
      purchased: false
    };
    setRewards([...rewards, newReward]);
    return true;
  };

  const updateReward = (id: string, updates: Partial<Reward>) => {
    setRewards(rewards.map(r => r.id === id ? { ...r, ...updates } : r));
    return true;
  };

  const deleteReward = (id: string) => {
    setRewards(rewards.filter(r => r.id !== id));
    return true;
  };

  // ========== SISTEMA DE UPGRADES ==========

  const purchaseUpgrade = (upgradeId: string): boolean => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased) return false;

    // Verificar se tem atributos suficientes (requisito mínimo)
    const hasAttributes =
      (!upgrade.attributeCost.strength || user.attributes.strength >= upgrade.attributeCost.strength) &&
      (!upgrade.attributeCost.intelligence || user.attributes.intelligence >= upgrade.attributeCost.intelligence) &&
      (!upgrade.attributeCost.charisma || user.attributes.charisma >= upgrade.attributeCost.charisma) &&
      (!upgrade.attributeCost.discipline || user.attributes.discipline >= upgrade.attributeCost.discipline);

    if (!hasAttributes) return false;

    // Marcar como comprado e ativo
    setUpgrades(upgrades.map(u =>
      u.id === upgradeId
        ? { ...u, purchased: true, isActive: true }
        : u
    ));

    setUser({ ...user, purchasedUpgrades: [...user.purchasedUpgrades, upgradeId] });
    return true;
  };

  const toggleUpgrade = (upgradeId: string): boolean => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    if (!upgrade || !upgrade.purchased || upgrade.isPermanent) return false;

    setUpgrades(upgrades.map(u =>
      u.id === upgradeId ? { ...u, isActive: !u.isActive } : u
    ));
    return true;
  };

  return {
    user,
    quests,
    mainQuests,
    rewards,
    upgrades,
    showLevelUp,
    newLevel,
    completeQuest,
    completeMainQuestStep,
    purchaseReward,
    purchaseItem,
    useItem,
    // CRUD de Quests
    addQuest,
    updateQuest,
    deleteQuest,
    duplicateQuest,
    addQuestFromTemplate,
    resetDailyQuests,
    resetXPSystem,
    getXPForNextLevel,
    getRemainingXP,
    getLevelProgress,
    getAttributeProgress,
    getStreakMultiplier,
    getStrengthXPReduction,
    getIntelligenceBonus,
    getCharismaDiscount,
    setShowLevelUp,
    resetAll,
    // CRUD de MainQuests
    addMainQuest,
    updateMainQuest,
    deleteMainQuest,
    duplicateMainQuest,
    // CRUD de Rewards
    addReward,
    updateReward,
    deleteReward,
    // Sistema de Upgrades
    purchaseUpgrade,
    toggleUpgrade,
  };
}
