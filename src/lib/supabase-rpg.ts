"use client";

import { createClient } from "@/lib/supabase";
import { User, Quest, MainQuest, Reward, Upgrade, Item } from "@/types/rpg";
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
