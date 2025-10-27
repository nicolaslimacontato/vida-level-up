"use client";

import { createClient } from "@/lib/supabase";
import { User, Quest, MainQuest, Reward, Upgrade, Item, Achievement, Goal, ActivityLog, ActivityLogEntry, DailyReward } from "@/types/rpg";
import { INITIAL_QUESTS, INITIAL_MAIN_QUESTS, INITIAL_REWARDS } from "@/data/initialData";

const supabase = createClient();

// Função para verificar configuração do Supabase
export function checkSupabaseConfig() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log("Supabase URL:", url ? "✓ Set" : "✗ Missing");
    console.log("Supabase Key:", key ? "✓ Set" : "✗ Missing");

    if (!url || !key) {
        console.error("Supabase environment variables not configured!");
        return false;
    }

    return true;
}

// Função para testar a conexão com Supabase
export async function testSupabaseConnection() {
    try {
        // Check config first
        if (!checkSupabaseConfig()) {
            return false;
        }

        const { error } = await supabase.from("profiles").select("count").limit(1);
        if (error) {
            console.error("Supabase connection test failed:", error);
            return false;
        }
        console.log("Supabase connection test successful");
        return true;
    } catch (err) {
        console.error("Supabase connection test error:", err);
        return false;
    }
}

// ========== USER PROFILE FUNCTIONS ==========

// Create default profile for new user
async function createDefaultProfile(userId: string): Promise<User | null> {
    try {
        const defaultProfile = {
            id: userId,
            level: 1,
            currentXP: 0,
            totalXP: 0,
            coins: 100,
            currentStreak: 0,
            bestStreak: 0,
            lastAccessDate: new Date().toISOString(),
            completedQuestsToday: false,
            inventory: [],
            purchasedUpgrades: [],
            activeEffects: {
                hasStreakProtection: false,
                xpBoostActive: false,
                xpBoostUntil: undefined,
                coinMultiplierActive: false,
                coinMultiplierUntil: undefined,
            },
            attributes: {
                strength: 0,
                intelligence: 0,
                charisma: 0,
                discipline: 0,
            },
        };

        const { error } = await supabase
            .from("profiles")
            .insert({
                id: userId,
                level: defaultProfile.level,
                current_xp: defaultProfile.currentXP,
                total_xp: defaultProfile.totalXP,
                coins: defaultProfile.coins,
                current_streak: defaultProfile.currentStreak,
                best_streak: defaultProfile.bestStreak,
                last_access_date: defaultProfile.lastAccessDate,
                completed_quests_today: defaultProfile.completedQuestsToday,
                purchased_upgrades: defaultProfile.purchasedUpgrades,
                active_effects: defaultProfile.activeEffects,
                strength: defaultProfile.attributes.strength,
                intelligence: defaultProfile.attributes.intelligence,
                charisma: defaultProfile.attributes.charisma,
                discipline: defaultProfile.attributes.discipline,
            });

        if (error) {
            console.error("Error creating default profile:", error);
            return null;
        }

        console.log("Default profile created successfully");
        return defaultProfile;
    } catch (err) {
        console.error("Error in createDefaultProfile:", err);
        return null;
    }
}

export async function getUserProfile(userId: string): Promise<User | null> {
    try {
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            console.error("Error fetching user profile:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));

            // If user doesn't exist, create a default profile
            if (error.code === "PGRST116") {
                console.log("User profile not found, creating default profile...");
                return await createDefaultProfile(userId);
            }

            return null;
        }

        if (!data) return null;

        // Convert Supabase profile to User type
        return {
            level: data.level || 1,
            currentXP: data.current_xp || 0,
            totalXP: data.total_xp || 0,
            coins: data.coins || 0,
            currentStreak: data.current_streak || 0,
            bestStreak: data.best_streak || 0,
            lastAccessDate: data.last_access_date || new Date().toISOString(),
            completedQuestsToday: data.completed_quests_today || false,
            inventory: [], // Will be loaded separately
            purchasedUpgrades: data.purchased_upgrades || [],
            activeEffects: data.active_effects || {
                hasStreakProtection: false,
                xpBoostActive: false,
                xpBoostUntil: undefined,
                coinMultiplierActive: false,
                coinMultiplierUntil: undefined,
            },
            attributes: {
                strength: data.strength || 0,
                intelligence: data.intelligence || 0,
                charisma: data.charisma || 0,
                discipline: data.discipline || 0,
            },
        };
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        return null;
    }
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
        const updateData: Record<string, unknown> = {};

        // Map User fields to database fields
        if (updates.level !== undefined) updateData.level = updates.level;
        if (updates.currentXP !== undefined) updateData.current_xp = updates.currentXP;
        if (updates.totalXP !== undefined) updateData.total_xp = updates.totalXP;
        if (updates.coins !== undefined) updateData.coins = updates.coins;
        if (updates.currentStreak !== undefined) updateData.current_streak = updates.currentStreak;
        if (updates.bestStreak !== undefined) updateData.best_streak = updates.bestStreak;
        if (updates.lastAccessDate !== undefined) updateData.last_access_date = updates.lastAccessDate;
        if (updates.completedQuestsToday !== undefined) updateData.completed_quests_today = updates.completedQuestsToday;
        if (updates.purchasedUpgrades !== undefined) updateData.purchased_upgrades = updates.purchasedUpgrades;
        if (updates.activeEffects !== undefined) updateData.active_effects = updates.activeEffects;
        if (updates.attributes !== undefined) {
            updateData.strength = updates.attributes.strength;
            updateData.intelligence = updates.attributes.intelligence;
            updateData.charisma = updates.attributes.charisma;
            updateData.discipline = updates.attributes.discipline;
        }

        const { error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", userId);

        if (error) {
            console.error("Error updating user profile:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        return false;
    }
}

// ========== QUESTS FUNCTIONS ==========

export async function getQuests(userId: string): Promise<Quest[]> {
    try {
        const { data, error } = await supabase
            .from("quests")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching quests:", error);
            return [];
        }

        return (data || []).map((quest: Record<string, unknown>) => ({
            id: quest.id as string,
            title: quest.title as string,
            description: quest.description as string || "",
            xpReward: quest.xp as number,
            coinReward: quest.coins as number,
            completed: quest.completed as boolean,
            category: quest.category as "daily" | "weekly" | "main" | "special",
            icon: quest.icon as string,
            attributeBonus: quest.attribute_bonus as "strength" | "intelligence" | "charisma" | "discipline" | undefined,
        }));
    } catch (error) {
        console.error("Error in getQuests:", error);
        return [];
    }
}

export async function createQuest(userId: string, questData: Omit<Quest, "id">): Promise<Quest | null> {
    try {
        const { data, error } = await supabase
            .from("quests")
            .insert({
                user_id: userId,
                title: questData.title,
                description: questData.description,
                category: questData.category,
                frequency: questData.category === "daily" ? "daily" : "weekly",
                xp: questData.xpReward,
                coins: questData.coinReward,
                icon: questData.icon,
                attribute_bonus: questData.attributeBonus,
                completed: questData.completed,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating quest:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            return null;
        }

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            xpReward: data.xp,
            coinReward: data.coins,
            completed: data.completed,
            category: data.category,
            icon: data.icon,
            attributeBonus: data.attribute_bonus,
        };
    } catch (error) {
        console.error("Error in createQuest:", error);
        return null;
    }
}

export async function updateQuest(questId: string, updates: Partial<Quest>): Promise<boolean> {
    try {
        const updateData: Record<string, unknown> = {};

        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.xpReward !== undefined) updateData.xp = updates.xpReward;
        if (updates.coinReward !== undefined) updateData.coins = updates.coinReward;
        if (updates.completed !== undefined) {
            updateData.completed = updates.completed;
            if (updates.completed) {
                updateData.completed_at = new Date().toISOString();
            }
        }
        if (updates.category !== undefined) updateData.category = updates.category;
        if (updates.icon !== undefined) updateData.icon = updates.icon;
        if (updates.attributeBonus !== undefined) updateData.attribute_bonus = updates.attributeBonus;

        const { error } = await supabase
            .from("quests")
            .update(updateData)
            .eq("id", questId);

        if (error) {
            console.error("Error updating quest:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in updateQuest:", error);
        return false;
    }
}

export async function deleteQuest(questId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from("quests")
            .delete()
            .eq("id", questId);

        if (error) {
            console.error("Error deleting quest:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in deleteQuest:", error);
        return false;
    }
}

// ========== MAIN QUESTS FUNCTIONS ==========

export async function getMainQuests(userId: string): Promise<MainQuest[]> {
    try {
        const { data, error } = await supabase
            .from("main_quests")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching main quests:", error);
            return [];
        }

        return (data || []).map((quest: Record<string, unknown>) => ({
            id: quest.id as string,
            title: quest.title as string,
            description: quest.description as string || "",
            xpReward: quest.xp as number,
            coinReward: quest.coins as number,
            completed: quest.completed as boolean,
            steps: quest.steps as Array<{
                id: string;
                title: string;
                description: string;
                xpReward: number;
                coinReward: number;
                completed: boolean;
            }> || [],
        }));
    } catch (error) {
        console.error("Error in getMainQuests:", error);
        return [];
    }
}

export async function createMainQuest(userId: string, questData: Omit<MainQuest, "id">): Promise<MainQuest | null> {
    try {
        const { data, error } = await supabase
            .from("main_quests")
            .insert({
                user_id: userId,
                title: questData.title,
                description: questData.description,
                xp: questData.xpReward,
                coins: questData.coinReward,
                steps: questData.steps,
                completed: questData.completed,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating main quest:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            return null;
        }

        return {
            id: data.id,
            title: data.title,
            description: data.description,
            xpReward: data.xp,
            coinReward: data.coins,
            completed: data.completed,
            steps: data.steps,
        };
    } catch (error) {
        console.error("Error in createMainQuest:", error);
        return null;
    }
}

export async function updateMainQuest(questId: string, updates: Partial<MainQuest>): Promise<boolean> {
    try {
        const updateData: Record<string, unknown> = {};

        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.xpReward !== undefined) updateData.xp = updates.xpReward;
        if (updates.coinReward !== undefined) updateData.coins = updates.coinReward;
        if (updates.completed !== undefined) updateData.completed = updates.completed;
        if (updates.steps !== undefined) updateData.steps = updates.steps;

        const { error } = await supabase
            .from("main_quests")
            .update(updateData)
            .eq("id", questId);

        if (error) {
            console.error("Error updating main quest:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in updateMainQuest:", error);
        return false;
    }
}

export async function deleteMainQuest(questId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from("main_quests")
            .delete()
            .eq("id", questId);

        if (error) {
            console.error("Error deleting main quest:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in deleteMainQuest:", error);
        return false;
    }
}

// ========== REWARDS FUNCTIONS ==========

export async function getRewards(userId: string): Promise<Reward[]> {
    try {
        const { data, error } = await supabase
            .from("rewards")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching rewards:", error);
            return [];
        }

        return (data || []).map((reward: Record<string, unknown>) => ({
            id: reward.id as string,
            name: reward.title as string,
            description: reward.description as string || "",
            cost: reward.cost as number,
            category: reward.category as "treat" | "break" | "experience" | "custom",
            purchased: reward.purchased as boolean,
        }));
    } catch (error) {
        console.error("Error in getRewards:", error);
        return [];
    }
}

export async function createReward(userId: string, rewardData: Omit<Reward, "id">): Promise<Reward | null> {
    try {
        const { data, error } = await supabase
            .from("rewards")
            .insert({
                user_id: userId,
                reward_id: `reward_${Date.now()}`,
                title: rewardData.name,
                description: rewardData.description,
                cost: rewardData.cost,
                category: rewardData.category,
                purchased: rewardData.purchased,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating reward:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            return null;
        }

        return {
            id: data.id,
            name: data.title,
            description: data.description,
            cost: data.cost,
            category: data.category,
            purchased: data.purchased,
        };
    } catch (error) {
        console.error("Error in createReward:", error);
        return null;
    }
}

export async function updateReward(rewardId: string, updates: Partial<Reward>): Promise<boolean> {
    try {
        const updateData: Record<string, unknown> = {};

        if (updates.name !== undefined) updateData.title = updates.name;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.cost !== undefined) updateData.cost = updates.cost;
        if (updates.category !== undefined) updateData.category = updates.category;
        if (updates.purchased !== undefined) {
            updateData.purchased = updates.purchased;
            if (updates.purchased) {
                updateData.purchased_at = new Date().toISOString();
            }
        }

        const { error } = await supabase
            .from("rewards")
            .update(updateData)
            .eq("id", rewardId);

        if (error) {
            console.error("Error updating reward:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in updateReward:", error);
        return false;
    }
}

export async function deleteReward(rewardId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from("rewards")
            .delete()
            .eq("id", rewardId);

        if (error) {
            console.error("Error deleting reward:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in deleteReward:", error);
        return false;
    }
}

// ========== UPGRADES FUNCTIONS ==========

export async function getUpgrades(userId: string): Promise<Upgrade[]> {
    try {
        const { data, error } = await supabase
            .from("upgrades")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching upgrades:", error);
            return [];
        }

        return (data || []).map((upgrade: Record<string, unknown>) => ({
            id: upgrade.id as string,
            name: upgrade.name as string,
            description: upgrade.description as string || "",
            category: upgrade.category as "streak" | "xp" | "coins" | "protection" | "multiplier",
            attributeCost: upgrade.attribute_cost as Record<string, number> || {},
            isPermanent: upgrade.is_permanent as boolean,
            isActive: upgrade.is_active as boolean,
            purchased: upgrade.purchased as boolean,
            effect: upgrade.effect as string,
            icon: upgrade.icon as string,
        }));
    } catch (error) {
        console.error("Error in getUpgrades:", error);
        return [];
    }
}

export async function createUpgrade(userId: string, upgradeData: Omit<Upgrade, "id">): Promise<Upgrade | null> {
    try {
        const { data, error } = await supabase
            .from("upgrades")
            .insert({
                user_id: userId,
                upgrade_id: `upgrade_${Date.now()}`,
                name: upgradeData.name,
                description: upgradeData.description,
                category: upgradeData.category,
                attribute_cost: upgradeData.attributeCost,
                is_permanent: upgradeData.isPermanent,
                is_active: upgradeData.isActive,
                purchased: upgradeData.purchased,
                effect: upgradeData.effect,
                icon: upgradeData.icon,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating upgrade:", error);
            return null;
        }

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            category: data.category,
            attributeCost: data.attribute_cost,
            isPermanent: data.is_permanent,
            isActive: data.is_active,
            purchased: data.purchased,
            effect: data.effect,
            icon: data.icon,
        };
    } catch (error) {
        console.error("Error in createUpgrade:", error);
        return null;
    }
}

export async function updateUpgrade(upgradeId: string, updates: Partial<Upgrade>): Promise<boolean> {
    try {
        const updateData: Record<string, unknown> = {};

        if (updates.name !== undefined) updateData.name = updates.name;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.category !== undefined) updateData.category = updates.category;
        if (updates.attributeCost !== undefined) updateData.attribute_cost = updates.attributeCost;
        if (updates.isPermanent !== undefined) updateData.is_permanent = updates.isPermanent;
        if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
        if (updates.purchased !== undefined) {
            updateData.purchased = updates.purchased;
            if (updates.purchased) {
                updateData.purchased_at = new Date().toISOString();
            }
        }
        if (updates.effect !== undefined) updateData.effect = updates.effect;
        if (updates.icon !== undefined) updateData.icon = updates.icon;

        const { error } = await supabase
            .from("upgrades")
            .update(updateData)
            .eq("id", upgradeId);

        if (error) {
            console.error("Error updating upgrade:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in updateUpgrade:", error);
        return false;
    }
}

// ========== INVENTORY FUNCTIONS ==========

export async function getInventory(userId: string): Promise<Item[]> {
    try {
        const { data, error } = await supabase
            .from("inventory")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching inventory:", error);
            return [];
        }

        return (data || []).map((item: Record<string, unknown>) => ({
            id: item.id as string,
            name: item.name as string,
            description: item.description as string || "",
            icon: item.icon as string || "🎁",
            type: item.type as "consumable" | "permanent" || "consumable",
            category: item.category as "protection" | "boost" | "attribute" | "reward" | "special" || "special",
            effect: item.effect as "streak_protection" | "xp_boost" | "coin_multiplier" | "attribute_point" | "rest_day" || "attribute_point",
            price: item.price as number || 0,
            quantity: item.quantity as number || 1,
            acquiredAt: item.acquired_at as string,
            usedAt: item.used_at as string | undefined,
        }));
    } catch (error) {
        console.error("Error in getInventory:", error);
        return [];
    }
}

export async function addToInventory(userId: string, itemData: Omit<Item, "id" | "acquiredAt">): Promise<Item | null> {
    try {
        const { data, error } = await supabase
            .from("inventory")
            .insert({
                user_id: userId,
                item_id: `item_${Date.now()}`,
                name: itemData.name,
                description: itemData.description,
                quantity: itemData.quantity || 1,
                icon: itemData.icon,
                type: itemData.type,
                category: itemData.category,
                effect: itemData.effect,
                price: itemData.price,
                acquired_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error("Error adding to inventory:", error);
            return null;
        }

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            icon: data.icon,
            type: data.type,
            category: data.category,
            effect: data.effect,
            price: data.price,
            quantity: data.quantity,
            acquiredAt: data.acquired_at,
        };
    } catch (error) {
        console.error("Error in addToInventory:", error);
        return null;
    }
}

export async function removeFromInventory(itemId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from("inventory")
            .delete()
            .eq("id", itemId);

        if (error) {
            console.error("Error removing from inventory:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in removeFromInventory:", error);
        return false;
    }
}

// ========== SEEDING FUNCTIONS ==========

export async function seedUserData(userId: string): Promise<boolean> {
    try {
        // First, ensure user profile exists
        const profile = await getUserProfile(userId);
        if (!profile) {
            console.error("Cannot seed data: user profile does not exist");
            return false;
        }

        // Check if user already has quests
        const existingQuests = await getQuests(userId);
        if (existingQuests.length > 0) {
            console.log("User already has quests, skipping seed");
            return true;
        }

        // Insert initial quests
        for (const quest of INITIAL_QUESTS) {
            await createQuest(userId, quest);
        }

        // Insert initial main quests
        for (const mainQuest of INITIAL_MAIN_QUESTS) {
            await createMainQuest(userId, mainQuest);
        }

        // Insert initial rewards
        for (const reward of INITIAL_REWARDS) {
            await createReward(userId, reward);
        }

        console.log("Successfully seeded initial data for user:", userId);
        return true;
    } catch (error) {
        console.error("Error seeding user data:", error);
        return false;
    }
}

// ========== REAL-TIME SUBSCRIPTIONS ==========

export function subscribeToProfile(userId: string, callback: (profile: User) => void) {
    return supabase
        .channel(`profile:${userId}`)
        .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "profiles",
                filter: `id=eq.${userId}`,
            },
            async () => {
                const profile = await getUserProfile(userId);
                if (profile) callback(profile);
            }
        )
        .subscribe();
}

export function subscribeToQuests(userId: string, callback: (quests: Quest[]) => void) {
    return supabase
        .channel(`quests:${userId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "quests",
                filter: `user_id=eq.${userId}`,
            },
            async () => {
                const quests = await getQuests(userId);
                callback(quests);
            }
        )
        .subscribe();
}

export function subscribeToMainQuests(userId: string, callback: (quests: MainQuest[]) => void) {
    return supabase
        .channel(`main_quests:${userId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "main_quests",
                filter: `user_id=eq.${userId}`,
            },
            async () => {
                const quests = await getMainQuests(userId);
                callback(quests);
            }
        )
        .subscribe();
}

export function subscribeToInventory(userId: string, callback: (inventory: Item[]) => void) {
    return supabase
        .channel(`inventory:${userId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "inventory",
                filter: `user_id=eq.${userId}`,
            },
            async () => {
                const inventory = await getInventory(userId);
                callback(inventory);
            }
        )
        .subscribe();
}

// ========== ACHIEVEMENTS FUNCTIONS ==========

export async function getAchievements(userId: string): Promise<Achievement[]> {
    try {
        const { data, error } = await supabase
            .from("achievements")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching achievements:", error);
            return [];
        }

        return (data || []).map((achievement: any) => ({
            id: achievement.id,
            achievementId: achievement.achievement_id,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            category: achievement.category,
            rarity: achievement.rarity,
            unlocked: achievement.unlocked,
            unlockedAt: achievement.unlocked_at,
            progress: achievement.progress,
            maxProgress: achievement.max_progress,
            xpReward: achievement.xp_reward,
            coinReward: achievement.coin_reward,
        }));
    } catch (error) {
        console.error("Error in getAchievements:", error);
        return [];
    }
}

export async function createAchievement(userId: string, achievementData: Omit<Achievement, "id">): Promise<Achievement | null> {
    try {
        const { data, error } = await supabase
            .from("achievements")
            .insert({
                user_id: userId,
                achievement_id: achievementData.achievementId,
                title: achievementData.title,
                description: achievementData.description,
                icon: achievementData.icon,
                category: achievementData.category,
                rarity: achievementData.rarity,
                unlocked: achievementData.unlocked,
                unlocked_at: achievementData.unlockedAt,
                progress: achievementData.progress,
                max_progress: achievementData.maxProgress,
                xp_reward: achievementData.xpReward,
                coin_reward: achievementData.coinReward,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating achievement:", error);
            return null;
        }

        return {
            id: data.id,
            achievementId: data.achievement_id,
            title: data.title,
            description: data.description,
            icon: data.icon,
            category: data.category,
            rarity: data.rarity,
            unlocked: data.unlocked,
            unlockedAt: data.unlocked_at,
            progress: data.progress,
            maxProgress: data.max_progress,
            xpReward: data.xp_reward,
            coinReward: data.coin_reward,
        };
    } catch (error) {
        console.error("Error in createAchievement:", error);
        return null;
    }
}

export async function updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from("achievements")
            .update({ progress })
            .eq("user_id", userId)
            .eq("achievement_id", achievementId);

        if (error) {
            console.error("Error updating achievement progress:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in updateAchievementProgress:", error);
        return false;
    }
}

export async function unlockAchievement(
    userId: string,
    achievementId: string,
    xpReward: number,
    coinReward: number
): Promise<boolean> {
    try {
        // Update achievement
        const { error: achievementError } = await supabase
            .from("achievements")
            .update({
                unlocked: true,
                unlocked_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("achievement_id", achievementId);

        if (achievementError) {
            console.error("Error unlocking achievement:", achievementError);
            return false;
        }

        // Update user profile with rewards
        const profile = await getUserProfile(userId);
        if (profile) {
            const newTotalXP = profile.totalXP + xpReward;
            const newCurrentXP = profile.currentXP + xpReward;
            const newCoins = profile.coins + coinReward;

            // Calculate new level
            let newLevel = profile.level;
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

            await updateUserProfile(userId, {
                level: newLevel,
                currentXP: remainingXP,
                totalXP: newTotalXP,
                coins: newCoins,
            });
        }

        return true;
    } catch (error) {
        console.error("Error unlocking achievement:", error);
        return false;
    }
}

export async function seedAchievements(userId: string): Promise<boolean> {
    try {
        // Check if user already has achievements
        const existingAchievements = await getAchievements(userId);
        if (existingAchievements.length > 0) {
            console.log("User already has achievements, skipping seed");
            return true;
        }

        // Import templates dynamically to avoid circular dependency
        const { ACHIEVEMENT_TEMPLATES } = await import('@/data/achievementTemplates');

        // Create achievements for user
        for (const template of ACHIEVEMENT_TEMPLATES) {
            await createAchievement(userId, {
                achievementId: template.achievementId,
                title: template.title,
                description: template.description,
                icon: template.icon,
                category: template.category,
                rarity: template.rarity,
                unlocked: false,
                progress: 0,
                maxProgress: template.maxProgress,
                xpReward: template.xpReward,
                coinReward: template.coinReward,
            });
        }

        console.log("Successfully seeded achievements for user:", userId);
        return true;
    } catch (error) {
        console.error("Error seeding achievements:", error);
        return false;
    }
}

export function subscribeToAchievements(userId: string, callback: (achievements: Achievement[]) => void) {
    return supabase
        .channel(`achievements:${userId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "achievements",
                filter: `user_id=eq.${userId}`,
            },
            async () => {
                const achievements = await getAchievements(userId);
                callback(achievements);
            }
        )
        .subscribe();
}

// ========== GOALS FUNCTIONS ==========

export async function getGoals(userId: string): Promise<Goal[]> {
    try {
        const { data, error } = await supabase
            .from("goals")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching goals:", JSON.stringify(error, null, 2));
            return [];
        }

        return (data || []).map((goal: any) => ({
            id: goal.id,
            goalId: goal.goal_id,
            title: goal.title,
            description: goal.description,
            type: goal.type,
            targetValue: goal.target_value,
            currentValue: goal.current_value,
            xpReward: goal.xp_reward,
            coinReward: goal.coin_reward,
            completed: goal.completed,
            completedAt: goal.completed_at,
            expiresAt: goal.expires_at,
        }));
    } catch (error) {
        console.error("Error in getGoals:", error);
        return [];
    }
}

export async function createGoal(userId: string, goalData: Omit<Goal, "id">): Promise<Goal | null> {
    try {
        const { data, error } = await supabase
            .from("goals")
            .insert({
                user_id: userId,
                goal_id: goalData.goalId,
                title: goalData.title,
                description: goalData.description,
                type: goalData.type,
                target_value: goalData.targetValue,
                current_value: goalData.currentValue,
                xp_reward: goalData.xpReward,
                coin_reward: goalData.coinReward,
                completed: goalData.completed,
                completed_at: goalData.completedAt,
                expires_at: goalData.expiresAt,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating goal:", error);
            return null;
        }

        return {
            id: data.id,
            goalId: data.goal_id,
            title: data.title,
            description: data.description,
            type: data.type,
            targetValue: data.target_value,
            currentValue: data.current_value,
            xpReward: data.xp_reward,
            coinReward: data.coin_reward,
            completed: data.completed,
            completedAt: data.completed_at,
            expiresAt: data.expires_at,
        };
    } catch (error) {
        console.error("Error in createGoal:", error);
        return null;
    }
}

export async function updateGoalProgress(
    userId: string,
    goalId: string,
    currentValue: number
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from("goals")
            .update({ current_value: currentValue })
            .eq("user_id", userId)
            .eq("goal_id", goalId);

        if (error) {
            console.error("Error updating goal progress:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in updateGoalProgress:", error);
        return false;
    }
}

export async function completeGoal(
    userId: string,
    goalId: string,
    xpReward: number,
    coinReward: number
): Promise<boolean> {
    try {
        // Update goal
        const { error: goalError } = await supabase
            .from("goals")
            .update({
                completed: true,
                completed_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("goal_id", goalId);

        if (goalError) {
            console.error("Error completing goal:", goalError);
            return false;
        }

        // Update user profile with rewards
        const profile = await getUserProfile(userId);
        if (profile) {
            const newTotalXP = profile.totalXP + xpReward;
            const newCurrentXP = profile.currentXP + xpReward;
            const newCoins = profile.coins + coinReward;

            // Calculate new level
            let newLevel = profile.level;
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

            await updateUserProfile(userId, {
                level: newLevel,
                currentXP: remainingXP,
                totalXP: newTotalXP,
                coins: newCoins,
            });
        }

        return true;
    } catch (error) {
        console.error("Error completing goal:", error);
        return false;
    }
}

export async function seedGoals(userId: string): Promise<boolean> {
    try {
        // Check if user already has goals
        const existingGoals = await getGoals(userId);
        if (existingGoals.length > 0) {
            console.log("User already has goals, skipping seed");
            return true;
        }

        // Import templates dynamically to avoid circular dependency
        const { GOAL_TEMPLATES } = await import('@/data/goalTemplates');

        // Create goals for user
        for (const template of GOAL_TEMPLATES) {
            const expiresAt = getGoalExpirationDate(template.type);

            await createGoal(userId, {
                goalId: template.goalId,
                title: template.title,
                description: template.description,
                type: template.type,
                targetValue: template.targetValue,
                currentValue: 0,
                xpReward: template.xpReward,
                coinReward: template.coinReward,
                completed: false,
                expiresAt: expiresAt,
            });
        }

        console.log("Successfully seeded goals for user:", userId);
        return true;
    } catch (error) {
        console.error("Error seeding goals:", error);
        return false;
    }
}

function getGoalExpirationDate(type: 'daily' | 'weekly' | 'monthly'): string {
    const now = new Date();

    switch (type) {
        case 'daily':
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            return tomorrow.toISOString();

        case 'weekly':
            const nextWeek = new Date(now);
            nextWeek.setDate(nextWeek.getDate() + 7);
            nextWeek.setHours(0, 0, 0, 0);
            return nextWeek.toISOString();

        case 'monthly':
            const nextMonth = new Date(now);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            nextMonth.setDate(1);
            nextMonth.setHours(0, 0, 0, 0);
            return nextMonth.toISOString();

        default:
            return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    }
}

export function subscribeToGoals(userId: string, callback: (goals: Goal[]) => void) {
    return supabase
        .channel(`goals:${userId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "goals",
                filter: `user_id=eq.${userId}`,
            },
            async () => {
                const goals = await getGoals(userId);
                callback(goals);
            }
        )
        .subscribe();
}

// ========== ACTIVITY LOG FUNCTIONS ==========

export async function getActivityLog(userId: string, limit: number = 50): Promise<ActivityLogEntry[]> {
    try {
        const { data, error } = await supabase
            .from("activity_log")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching activity log:", error);
            return [];
        }

        return (data || []).map((activity: any) => {
            const entry = {
                id: activity.id,
                actionType: activity.action_type,
                actionData: activity.action_data || {},
                xpGained: activity.xp_gained || 0,
                coinsGained: activity.coins_gained || 0,
                levelBefore: activity.level_before || 0,
                levelAfter: activity.level_after || 0,
                createdAt: activity.created_at,
            };

            // Add computed display fields
            return {
                ...entry,
                ...getActivityDisplayInfo(entry),
            };
        });
    } catch (error) {
        console.error("Error in getActivityLog:", error);
        return [];
    }
}

export async function logActivity(
    userId: string,
    actionType: string,
    actionData: Record<string, any> = {},
    xpGained: number = 0,
    coinsGained: number = 0,
    levelBefore: number = 0,
    levelAfter: number = 0
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from("activity_log")
            .insert({
                user_id: userId,
                action_type: actionType,
                action_data: actionData,
                xp_gained: xpGained,
                coins_gained: coinsGained,
                level_before: levelBefore,
                level_after: levelAfter,
            });

        if (error) {
            console.error("Error logging activity:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error in logActivity:", error);
        return false;
    }
}

function getActivityDisplayInfo(activity: ActivityLog): { title: string; description: string; icon: string; color: string } {
    const { actionType, actionData, xpGained, coinsGained, levelBefore, levelAfter } = activity;

    switch (actionType) {
        case 'quest_completed':
            return {
                title: 'Quest Concluída',
                description: `"${actionData.questTitle}" completada`,
                icon: '🎯',
                color: 'text-green-600',
            };

        case 'main_quest_step_completed':
            return {
                title: 'Etapa Concluída',
                description: `Etapa "${actionData.stepTitle}" de "${actionData.questTitle}"`,
                icon: '📋',
                color: 'text-blue-600',
            };

        case 'main_quest_completed':
            return {
                title: 'Missão Principal Concluída',
                description: `"${actionData.questTitle}" finalizada`,
                icon: '🏆',
                color: 'text-purple-600',
            };

        case 'level_up':
            return {
                title: 'Level Up!',
                description: `Subiu do nível ${levelBefore} para ${levelAfter}`,
                icon: '⬆️',
                color: 'text-yellow-600',
            };

        case 'achievement_unlocked':
            return {
                title: 'Conquista Desbloqueada',
                description: `"${actionData.achievementTitle}" conquistada`,
                icon: '🏅',
                color: 'text-orange-600',
            };

        case 'goal_completed':
            return {
                title: 'Meta Concluída',
                description: `"${actionData.goalTitle}" finalizada`,
                icon: '🎯',
                color: 'text-cyan-600',
            };

        case 'item_purchased':
            return {
                title: 'Item Comprado',
                description: `"${actionData.itemName}" adquirido`,
                icon: '🛒',
                color: 'text-pink-600',
            };

        case 'item_used':
            return {
                title: 'Item Usado',
                description: `"${actionData.itemName}" utilizado`,
                icon: '✨',
                color: 'text-indigo-600',
            };

        case 'upgrade_purchased':
            return {
                title: 'Upgrade Comprado',
                description: `"${actionData.upgradeName}" desbloqueado`,
                icon: '🔧',
                color: 'text-red-600',
            };

        case 'streak_updated':
            return {
                title: 'Streak Atualizado',
                description: `Streak atual: ${actionData.currentStreak} dias`,
                icon: '🔥',
                color: 'text-red-500',
            };

        case 'daily_reset':
            return {
                title: 'Reset Diário',
                description: 'Quests diárias foram resetadas',
                icon: '🔄',
                color: 'text-gray-600',
            };

        case 'login':
            return {
                title: 'Login Realizado',
                description: 'Usuário fez login no sistema',
                icon: '👋',
                color: 'text-gray-500',
            };

        default:
            return {
                title: 'Atividade',
                description: 'Ação realizada no sistema',
                icon: '📝',
                color: 'text-gray-600',
            };
    }
}

export function subscribeToActivityLog(userId: string, callback: (activities: ActivityLogEntry[]) => void) {
    return supabase
        .channel(`activity_log:${userId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "activity_log",
                filter: `user_id=eq.${userId}`,
            },
            async () => {
                const activities = await getActivityLog(userId);
                callback(activities);
            }
        )
        .subscribe();
}

// ========== DAILY REWARDS FUNCTIONS ==========

export async function getDailyRewards(userId: string): Promise<DailyReward[]> {
    try {
        const { data, error } = await supabase
            .from("daily_rewards")
            .select("*")
            .eq("user_id", userId)
            .order("reward_date", { ascending: true });

        if (error) {
            console.error("Error fetching daily rewards:", JSON.stringify(error, null, 2));
            return [];
        }

        return (data || []).map((reward: any) => ({
            id: reward.id,
            rewardDate: reward.reward_date,
            rewardType: reward.reward_type,
            rewardValue: reward.reward_value,
            rewardData: reward.reward_data || {},
            claimed: reward.claimed,
            claimedAt: reward.claimed_at,
        }));
    } catch (error) {
        console.error("Error in getDailyRewards:", error);
        return [];
    }
}

export async function claimDailyReward(userId: string, rewardDate: string): Promise<boolean> {
    try {
        // Get the reward
        const { data: rewardData, error: fetchError } = await supabase
            .from("daily_rewards")
            .select("*")
            .eq("user_id", userId)
            .eq("reward_date", rewardDate)
            .single();

        if (fetchError || !rewardData) {
            console.error("Error fetching reward:", fetchError);
            return false;
        }

        if (rewardData.claimed) {
            console.error("Reward already claimed");
            return false;
        }

        // Update reward as claimed
        const { error: updateError } = await supabase
            .from("daily_rewards")
            .update({
                claimed: true,
                claimed_at: new Date().toISOString(),
            })
            .eq("user_id", userId)
            .eq("reward_date", rewardDate);

        if (updateError) {
            console.error("Error claiming reward:", updateError);
            return false;
        }

        // Apply reward to user profile
        const profile = await getUserProfile(userId);
        if (!profile) {
            console.error("User profile not found");
            return false;
        }

        let updates: Partial<User> = {};

        switch (rewardData.reward_type) {
            case 'xp':
                const newTotalXP = profile.totalXP + rewardData.reward_value;
                const newCurrentXP = profile.currentXP + rewardData.reward_value;

                // Calculate new level
                let newLevel = profile.level;
                let remainingXP = newCurrentXP;
                let xpForNextLevel = 0;

                while (true) {
                    xpForNextLevel = Math.floor(100 * Math.pow(newLevel, 1.5));
                    if (remainingXP >= xpForNextLevel) {
                        remainingXP -= xpForNextLevel;
                        newLevel++;
                    } else {
                        break;
                    }
                }

                updates = {
                    level: newLevel,
                    currentXP: remainingXP,
                    totalXP: newTotalXP,
                };
                break;

            case 'coins':
                updates = {
                    coins: profile.coins + rewardData.reward_value,
                };
                break;

            case 'item':
                // Add item to inventory
                const itemData = rewardData.reward_data;
                await addToInventory(userId, {
                    id: itemData.itemId,
                    name: itemData.itemName,
                    description: itemData.itemDescription,
                    type: 'consumable',
                    effect: 'xp_boost',
                    duration: 3600000, // 1 hour in milliseconds
                    value: 1,
                    icon: '✨',
                });
                break;

            case 'upgrade':
                // This would unlock an upgrade
                // For now, just add coins as a placeholder
                updates = {
                    coins: profile.coins + rewardData.reward_value,
                };
                break;
        }

        if (Object.keys(updates).length > 0) {
            await updateUserProfile(userId, updates);
        }

        return true;
    } catch (error) {
        console.error("Error claiming daily reward:", error);
        return false;
    }
}

export async function generateDailyRewards(userId: string): Promise<boolean> {
    try {
        // Import templates dynamically to avoid circular dependency
        const { DAILY_REWARD_TEMPLATES } = await import('@/data/dailyRewardTemplates');

        // Get current date
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];

        // Check if user already has rewards for today
        const existingRewards = await getDailyRewards(userId);
        const hasTodayReward = existingRewards.some(reward => reward.rewardDate === todayString);

        if (hasTodayReward) {
            console.log("User already has reward for today");
            return true;
        }

        // Calculate streak (consecutive days with rewards)
        const streakDays = calculateStreakDays(existingRewards);
        const rewardDay = Math.min(streakDays + 1, DAILY_REWARD_TEMPLATES.length);
        const template = DAILY_REWARD_TEMPLATES[rewardDay - 1];

        if (!template) {
            console.error("No template found for day:", rewardDay);
            return false;
        }

        // Create daily reward
        const { error } = await supabase
            .from("daily_rewards")
            .insert({
                user_id: userId,
                reward_date: todayString,
                reward_type: template.rewardType,
                reward_value: template.rewardValue,
                reward_data: template.rewardData,
                claimed: false,
            });

        if (error) {
            console.error("Error creating daily reward:", error);
            return false;
        }

        console.log("Successfully generated daily reward for user:", userId);
        return true;
    } catch (error) {
        console.error("Error generating daily rewards:", error);
        return false;
    }
}

function calculateStreakDays(rewards: DailyReward[]): number {
    if (rewards.length === 0) return 0;

    // Sort rewards by date (most recent first)
    const sortedRewards = rewards.sort((a, b) =>
        new Date(b.rewardDate).getTime() - new Date(a.rewardDate).getTime()
    );

    let streakDays = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedRewards.length; i++) {
        const rewardDate = new Date(sortedRewards[i].rewardDate);
        rewardDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (rewardDate.getTime() === expectedDate.getTime()) {
            streakDays++;
        } else {
            break;
        }
    }

    return streakDays;
}

export function subscribeToDailyRewards(userId: string, callback: (rewards: DailyReward[]) => void) {
    return supabase
        .channel(`daily_rewards:${userId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "daily_rewards",
                filter: `user_id=eq.${userId}`,
            },
            async () => {
                const rewards = await getDailyRewards(userId);
                callback(rewards);
            }
        )
        .subscribe();
}