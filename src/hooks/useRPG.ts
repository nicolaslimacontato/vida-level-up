import { useState, useEffect, useCallback } from "react";
import { User, Quest, MainQuest, Reward, Upgrade, Item } from "@/types/rpg";
import { UPGRADE_TEMPLATES } from "@/data/upgradeTemplates";
import { useGameAudio } from "./useGameAudio";
import { useToast } from "@/components/Toast";
import { useAuth } from "@/hooks/useAuth";
import { checkDailyReset, resetDailyQuests as resetDailyQuestsUtil, updateUserStreak } from "./useDailyReset";
import {
  getUserProfile,
  updateUserProfile,
  getQuests,
  createQuest,
  updateQuest,
  deleteQuest,
  getMainQuests,
  createMainQuest,
  updateMainQuest,
  deleteMainQuest,
  getRewards,
  createReward,
  updateReward,
  deleteReward,
  getUpgrades,
  updateUpgrade,
  getInventory,
  addToInventory,
  removeFromInventory,
  seedUserData,
  subscribeToProfile,
  subscribeToQuests,
  subscribeToMainQuests,
  subscribeToInventory,
  testSupabaseConnection,
  checkSupabaseConfig,
} from "@/lib/supabase-rpg";

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
  const { success } = useToast();
  const { user: authUser } = useAuth();

  // State
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [mainQuests, setMainQuests] = useState<MainQuest[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(UPGRADE_TEMPLATES);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Sistema de áudio do jogo
  const { playLevelUpSound, playOrbSoundWithVariation, preloadGameSounds } = useGameAudio();

  // Load user data from Supabase
  const loadUserData = useCallback(async (userId: string) => {
    try {
      setLoading(true);

      // Check Supabase configuration first
      console.log("Checking Supabase configuration...");
      if (!checkSupabaseConfig()) {
        console.error("Supabase not configured, falling back to local state");
        setLoading(false);
        return;
      }

      // Test Supabase connection
      console.log("Testing Supabase connection...");
      const connectionOk = await testSupabaseConnection();
      if (!connectionOk) {
        console.error("Supabase connection failed, falling back to local state");
        setLoading(false);
        return;
      }

      // Load profile
      const profile = await getUserProfile(userId);
      if (profile) {
        setUser(profile);
      }

      // Load quests
      const userQuests = await getQuests(userId);
      console.log("Loaded quests from Supabase:", userQuests);
      setQuests(userQuests);

      // Load main quests
      const userMainQuests = await getMainQuests(userId);
      console.log("Loaded main quests from Supabase:", userMainQuests);
      setMainQuests(userMainQuests);

      // Load rewards
      const userRewards = await getRewards(userId);
      setRewards(userRewards);

      // Load upgrades
      const userUpgrades = await getUpgrades(userId);
      setUpgrades(userUpgrades);

      // Load inventory
      const userInventory = await getInventory(userId);
      setUser(prev => ({ ...prev, inventory: userInventory }));

      // Seed initial data if user has no quests
      if (userQuests.length === 0) {
        await seedUserData(userId);
        // Reload quests and rewards after seeding
        const seededQuests = await getQuests(userId);
        const seededMainQuests = await getMainQuests(userId);
        const seededRewards = await getRewards(userId);
        setQuests(seededQuests);
        setMainQuests(seededMainQuests);
        setRewards(seededRewards);
      }

    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup real-time subscriptions
  const setupSubscriptions = useCallback((userId: string) => {
    const subscriptions: Array<{ unsubscribe: () => void } | null> = [];

    // Subscribe to profile changes
    const profileSub = subscribeToProfile(userId, (updatedProfile) => {
      setUser(updatedProfile);
    });
    subscriptions.push(profileSub);

    // Subscribe to quests changes
    const questsSub = subscribeToQuests(userId, (updatedQuests) => {
      setQuests(updatedQuests);
    });
    subscriptions.push(questsSub);

    // Subscribe to main quests changes
    const mainQuestsSub = subscribeToMainQuests(userId, (updatedMainQuests) => {
      setMainQuests(updatedMainQuests);
    });
    subscriptions.push(mainQuestsSub);

    // Subscribe to inventory changes
    const inventorySub = subscribeToInventory(userId, (updatedInventory) => {
      setUser(prev => ({ ...prev, inventory: updatedInventory }));
    });
    subscriptions.push(inventorySub);

    return subscriptions;
  }, []);

  // Initialize data and subscriptions
  useEffect(() => {
    if (!authUser?.id) return;

    // Preload sounds
    preloadGameSounds();

    // Load user data
    loadUserData(authUser.id);

    // Setup real-time subscriptions
    const subscriptions = setupSubscriptions(authUser.id);

    // Cleanup subscriptions on unmount
    return () => {
      subscriptions.forEach(sub => {
        if (sub && sub.unsubscribe) {
          sub.unsubscribe();
        }
      });
    };
  }, [authUser?.id, loadUserData, setupSubscriptions, preloadGameSounds]);

  const handleDailyReset = useCallback(async () => {
    if (!authUser?.id) return;

    try {
      setSyncing(true);

      // Reset daily quests
      await resetDailyQuestsUtil(authUser.id, quests);

      // Update user streak
      const today = new Date();
      const lastAccess = new Date(user.lastAccessDate);
      const updatedUser = updateUserStreak(user, lastAccess, today);

      // Update user profile
      await updateUserProfile(authUser.id, {
        currentStreak: updatedUser.currentStreak,
        bestStreak: updatedUser.bestStreak,
        lastAccessDate: today.toISOString(),
        completedQuestsToday: false,
      });

      // Reload quests to get reset state
      const resetQuests = await getQuests(authUser.id);
      setQuests(resetQuests);

    } catch (error) {
      console.error("Error during daily reset:", error);
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id, quests, user]);

  // Daily reset check
  useEffect(() => {
    if (!authUser?.id || loading || syncing) return;

    const resetInfo = checkDailyReset(user.lastAccessDate);

    if (resetInfo.shouldReset && resetInfo.daysPassed >= 1) {
      console.log("Daily reset needed:", resetInfo);
      handleDailyReset();
    }
  }, [authUser?.id, user.lastAccessDate, loading, syncing, handleDailyReset]);

  // ========== QUEST FUNCTIONS ==========

  // Função para obter multiplicador de streak
  const getStreakMultiplier = useCallback(() => {
    if (user.currentStreak === 0) return 1;
    return Math.min(1 + user.currentStreak * 0.1, 3); // Max 3x multiplier
  }, [user.currentStreak]);

  const completeQuest = useCallback(async (questId: string) => {
    if (!authUser?.id) return null;

    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.completed) return null;

    try {
      setSyncing(true);

      // Update quest as completed
      console.log("Marking quest as completed:", questId);
      const questUpdated = await updateQuest(questId, { completed: true });
      console.log("Quest updated successfully:", questUpdated);

      // Calculate XP and coins with streak multiplier
      const streakMultiplier = getStreakMultiplier();
      const xpWithStreak = Math.floor(quest.xpReward * streakMultiplier);
      const coinsWithBonus = Math.floor(quest.coinReward * streakMultiplier);

      // Update user profile
      const newTotalXP = user.totalXP + xpWithStreak;
      const newCoins = user.coins + coinsWithBonus;
      const newCurrentXP = user.currentXP + xpWithStreak;

      // Calculate new level
      let newLevel = user.level;
      let remainingXP = newCurrentXP;
      let xpForNextLevel = 0;

      // Check for level up
      while (true) {
        xpForNextLevel = Math.floor(100 * Math.pow(newLevel, 1.5));
        if (remainingXP >= xpForNextLevel) {
          remainingXP -= xpForNextLevel;
          newLevel++;
        } else {
          break;
        }
      }

      // Update attributes if quest has attribute bonus
      const newAttributes = { ...user.attributes };
      if (quest.category === "daily" && quest.attributeBonus) {
        newAttributes[quest.attributeBonus] += 1;
      }

      // Update user in database
      console.log("Updating user profile:", {
        level: newLevel,
        currentXP: remainingXP,
        totalXP: newTotalXP,
        coins: newCoins,
        attributes: newAttributes,
      });
      const profileUpdated = await updateUserProfile(authUser.id, {
        level: newLevel,
        currentXP: remainingXP,
        totalXP: newTotalXP,
        coins: newCoins,
        attributes: newAttributes,
        completedQuestsToday: true,
      });
      console.log("Profile updated successfully:", profileUpdated);

      // Update local state immediately
      setUser(prev => ({
        ...prev,
        level: newLevel,
        currentXP: remainingXP,
        totalXP: newTotalXP,
        coins: newCoins,
        attributes: newAttributes,
        completedQuestsToday: true,
      }));

      // Update quests state to mark quest as completed
      setQuests(prev => prev.map(q =>
        q.id === questId ? { ...q, completed: true } : q
      ));

      // Show level up notification if leveled up
      if (newLevel > user.level) {
        setNewLevel(newLevel);
        setShowLevelUp(true);
        playLevelUpSound();
      } else {
        playOrbSoundWithVariation();
      }

      const result = {
        xpWithStreak,
        coinsWithBonus,
        attributeBonus: quest.attributeBonus,
        leveledUp: newLevel > user.level,
        newLevel,
      };
      console.log("Quest completion result:", result);
      return result;
    } catch (error) {
      console.error("Error completing quest:", error);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id, quests, user, getStreakMultiplier, playLevelUpSound, playOrbSoundWithVariation]);

  const completeQuestWithNotification = useCallback(async (questId: string) => {
    const result = await completeQuest(questId);
    if (result) {
      success(
        `Quest Concluída!`,
        `+${result.xpWithStreak} XP • +${result.coinsWithBonus} moedas • +1 ${result.attributeBonus || 'atributo'}`
      );
    }
  }, [completeQuest, success]);

  const addQuest = useCallback(async (questData: Omit<Quest, "id">) => {
    if (!authUser?.id) return null;

    try {
      setSyncing(true);
      const newQuest = await createQuest(authUser.id, questData);
      if (newQuest) {
        // Update local state immediately
        setQuests(prev => [...prev, newQuest]);
        console.log("Quest added to local state:", newQuest);
      }
      return newQuest;
    } catch (error) {
      console.error("Error adding quest:", error);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id]);

  const editQuest = useCallback(async (questId: string, questData: Partial<Quest>) => {
    try {
      setSyncing(true);
      const success = await updateQuest(questId, questData);
      if (success) {
        // Update local state immediately
        setQuests(prev => prev.map(q =>
          q.id === questId ? { ...q, ...questData } : q
        ));
        console.log("Quest updated in local state:", questId);
      }
      return success;
    } catch (error) {
      console.error("Error editing quest:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  const removeQuest = useCallback(async (questId: string) => {
    try {
      setSyncing(true);
      const success = await deleteQuest(questId);
      if (success) {
        // Update local state immediately
        setQuests(prev => prev.filter(q => q.id !== questId));
        console.log("Quest removed from local state:", questId);
      }
      return success;
    } catch (error) {
      console.error("Error removing quest:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  const duplicateQuest = useCallback(async (questId: string) => {
    if (!authUser?.id) return null;

    const questToDuplicate = quests.find(q => q.id === questId);
    if (!questToDuplicate) return null;

    try {
      setSyncing(true);
      const duplicatedQuest = {
        ...questToDuplicate,
        title: `${questToDuplicate.title} (Cópia)`,
        completed: false,
      };
      delete (duplicatedQuest as Partial<Quest>).id; // Remove ID to create new quest

      const newQuest = await createQuest(authUser.id, duplicatedQuest);
      if (newQuest) {
        // Update local state immediately
        setQuests(prev => [...prev, newQuest]);
        console.log("Quest duplicated:", newQuest);
      }
      return newQuest;
    } catch (error) {
      console.error("Error duplicating quest:", error);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id, quests]);

  const getCharismaDiscount = useCallback((charisma: number) => {
    // Desconto baseado no nível de carisma
    // Cada ponto de carisma = 1% de desconto, máximo 20%
    return Math.min(charisma, 20);
  }, []);

  const getStrengthXPReduction = useCallback((strength: number) => {
    // Redução de XP necessário para level up baseado na força
    // Cada ponto de força = 1% de redução, máximo 25%
    return Math.min(strength, 25);
  }, []);

  const getIntelligenceBonus = useCallback((intelligence: number) => {
    // Bônus de XP em quests de estudo baseado na inteligência
    // Cada ponto de inteligência = 2% de bônus, máximo 50%
    return Math.min(intelligence * 2, 50);
  }, []);

  // ========== MAIN QUEST FUNCTIONS ==========

  const completeMainQuestStep = useCallback(async (questId: string, stepId: string) => {
    if (!authUser?.id) return null;

    const mainQuest = mainQuests.find((q) => q.id === questId);
    if (!mainQuest) return null;

    const stepIndex = mainQuest.steps.findIndex((s) => s.id === stepId);
    if (stepIndex === -1 || mainQuest.steps[stepIndex].completed) return null;

    try {
      setSyncing(true);

      // Update step
      const updatedSteps = [...mainQuest.steps];
      updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], completed: true };

      // Check if all steps are completed
      const allStepsCompleted = updatedSteps.every((s) => s.completed);
      const completedQuest = allStepsCompleted;

      // Update main quest
      await updateMainQuest(questId, {
        steps: updatedSteps,
        completed: completedQuest,
      });

      // Calculate rewards
      const step = updatedSteps[stepIndex];
      const streakMultiplier = getStreakMultiplier();
      const xpWithStreak = Math.floor(step.xpReward * streakMultiplier);
      const coinsWithBonus = Math.floor(step.coinReward * streakMultiplier);

      // Update user profile
      const newTotalXP = user.totalXP + xpWithStreak;
      const newCoins = user.coins + coinsWithBonus;
      const newCurrentXP = user.currentXP + xpWithStreak;

      // Calculate new level
      let newLevel = user.level;
      let remainingXP = newCurrentXP;
      let xpForNextLevel = 0;

      // Check for level up
      while (true) {
        xpForNextLevel = Math.floor(100 * Math.pow(newLevel, 1.5));
        if (remainingXP >= xpForNextLevel) {
          remainingXP -= xpForNextLevel;
          newLevel++;
        } else {
          break;
        }
      }

      // Update user in database
      await updateUserProfile(authUser.id, {
        level: newLevel,
        currentXP: remainingXP,
        totalXP: newTotalXP,
        coins: newCoins,
      });

      // Show level up notification if leveled up
      if (newLevel > user.level) {
        setNewLevel(newLevel);
        setShowLevelUp(true);
        playLevelUpSound();
      } else {
        playOrbSoundWithVariation();
      }

      return {
        xpWithStreak,
        coinsWithBonus,
        leveledUp: newLevel > user.level,
        newLevel,
        questCompleted: completedQuest,
      };
    } catch (error) {
      console.error("Error completing main quest step:", error);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id, mainQuests, user, getStreakMultiplier, playLevelUpSound, playOrbSoundWithVariation]);

  const addMainQuest = useCallback(async (questData: Omit<MainQuest, "id">) => {
    if (!authUser?.id) return null;

    try {
      setSyncing(true);
      const newQuest = await createMainQuest(authUser.id, questData);
      return newQuest;
    } catch (error) {
      console.error("Error adding main quest:", error);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id]);

  const editMainQuest = useCallback(async (questId: string, questData: Partial<MainQuest>) => {
    try {
      setSyncing(true);
      const success = await updateMainQuest(questId, questData);
      return success;
    } catch (error) {
      console.error("Error editing main quest:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  const removeMainQuest = useCallback(async (questId: string) => {
    try {
      setSyncing(true);
      const success = await deleteMainQuest(questId);
      return success;
    } catch (error) {
      console.error("Error removing main quest:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  // ========== REWARD FUNCTIONS ==========

  const purchaseReward = useCallback(async (rewardId: string) => {
    if (!authUser?.id) return false;

    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward || reward.purchased || user.coins < reward.cost) return false;

    try {
      setSyncing(true);

      // Update reward as purchased
      await updateReward(rewardId, { purchased: true });

      // Update user coins
      const newCoins = user.coins - reward.cost;
      await updateUserProfile(authUser.id, { coins: newCoins });

      return true;
    } catch (error) {
      console.error("Error purchasing reward:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id, rewards, user.coins]);

  const addReward = useCallback(async (rewardData: Omit<Reward, "id">) => {
    if (!authUser?.id) return null;

    try {
      setSyncing(true);
      const newReward = await createReward(authUser.id, rewardData);
      return newReward;
    } catch (error) {
      console.error("Error adding reward:", error);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id]);

  const editReward = useCallback(async (rewardId: string, rewardData: Partial<Reward>) => {
    try {
      setSyncing(true);
      const success = await updateReward(rewardId, rewardData);
      return success;
    } catch (error) {
      console.error("Error editing reward:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  const removeReward = useCallback(async (rewardId: string) => {
    try {
      setSyncing(true);
      const success = await deleteReward(rewardId);
      return success;
    } catch (error) {
      console.error("Error removing reward:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  // ========== UPGRADE FUNCTIONS ==========

  const purchaseUpgrade = useCallback(async (upgradeId: string) => {
    if (!authUser?.id) return false;

    const upgrade = upgrades.find((u) => u.id === upgradeId);
    if (!upgrade || upgrade.purchased) return false;

    // Check if user has enough attributes
    const hasEnoughAttributes = Object.entries(upgrade.attributeCost).every(
      ([attribute, cost]) => user.attributes[attribute as keyof typeof user.attributes] >= cost
    );

    if (!hasEnoughAttributes) return false;

    try {
      setSyncing(true);

      // Update upgrade as purchased
      await updateUpgrade(upgradeId, { purchased: true, isActive: true });

      // Deduct attribute costs
      const newAttributes = { ...user.attributes };
      Object.entries(upgrade.attributeCost).forEach(([attribute, cost]) => {
        newAttributes[attribute as keyof typeof newAttributes] -= cost;
      });

      // Update purchased upgrades list
      const newPurchasedUpgrades = [...user.purchasedUpgrades, upgradeId];

      // Update user profile
      await updateUserProfile(authUser.id, {
        attributes: newAttributes,
        purchasedUpgrades: newPurchasedUpgrades,
      });

      return true;
    } catch (error) {
      console.error("Error purchasing upgrade:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id, upgrades, user]);

  const toggleUpgrade = useCallback(async (upgradeId: string, isActive: boolean) => {
    try {
      setSyncing(true);
      const success = await updateUpgrade(upgradeId, { isActive });
      return success;
    } catch (error) {
      console.error("Error toggling upgrade:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, []);

  // ========== INVENTORY FUNCTIONS ==========

  const buyItem = useCallback(async (itemData: Omit<Item, "id" | "acquiredAt">) => {
    if (!authUser?.id) return null;

    if (user.coins < itemData.price) return null;

    try {
      setSyncing(true);

      // Add to inventory
      const newItem = await addToInventory(authUser.id, itemData);
      if (!newItem) return null;

      // Update user coins
      const newCoins = user.coins - itemData.price;
      await updateUserProfile(authUser.id, { coins: newCoins });

      return newItem;
    } catch (error) {
      console.error("Error buying item:", error);
      return null;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id, user.coins]);

  const useItem = useCallback(async (itemId: string) => {
    if (!authUser?.id) return false;

    try {
      setSyncing(true);

      // Remove from inventory
      const success = await removeFromInventory(itemId);
      return success;
    } catch (error) {
      console.error("Error using item:", error);
      return false;
    } finally {
      setSyncing(false);
    }
  }, [authUser?.id]);

  // ========== UTILITY FUNCTIONS ==========

  const getXPForNextLevel = useCallback((level: number) => {
    return Math.floor(100 * Math.pow(level, 1.5));
  }, []);

  const getLevelProgress = useCallback((currentXP: number, level: number) => {
    const xpForNextLevel = getXPForNextLevel(level);
    return (currentXP / xpForNextLevel) * 100;
  }, [getXPForNextLevel]);

  return {
    // State
    user,
    quests,
    mainQuests,
    rewards,
    upgrades,
    showLevelUp,
    newLevel,
    loading,
    syncing,

    // Quest functions
    completeQuest,
    completeQuestWithNotification,
    addQuest,
    editQuest,
    removeQuest,
    duplicateQuest,

    // Main quest functions
    completeMainQuestStep,
    addMainQuest,
    editMainQuest,
    removeMainQuest,

    // Reward functions
    purchaseReward,
    addReward,
    editReward,
    removeReward,

    // Upgrade functions
    purchaseUpgrade,
    toggleUpgrade,

    // Inventory functions
    buyItem,
    useItem,

    // Utility functions
    getXPForNextLevel,
    getLevelProgress,
    getStreakMultiplier,
    getCharismaDiscount,
    getStrengthXPReduction,
    getIntelligenceBonus,

    // UI functions
    setShowLevelUp,
  };
}