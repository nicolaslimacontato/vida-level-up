export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    name: string | null
                    avatar_url: string | null
                    level: number
                    current_xp: number
                    total_xp: number
                    coins: number
                    current_streak: number
                    best_streak: number
                    last_access_date: string | null
                    strength: number
                    intelligence: number
                    charisma: number
                    discipline: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    name?: string | null
                    avatar_url?: string | null
                    level?: number
                    current_xp?: number
                    total_xp?: number
                    coins?: number
                    current_streak?: number
                    best_streak?: number
                    last_access_date?: string | null
                    strength?: number
                    intelligence?: number
                    charisma?: number
                    discipline?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    name?: string | null
                    avatar_url?: string | null
                    level?: number
                    current_xp?: number
                    total_xp?: number
                    coins?: number
                    current_streak?: number
                    best_streak?: number
                    last_access_date?: string | null
                    strength?: number
                    intelligence?: number
                    charisma?: number
                    discipline?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            quests: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    category: string
                    frequency: string
                    xp: number
                    coins: number
                    icon: string | null
                    attribute_bonus: string | null
                    completed: boolean
                    completed_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    category: string
                    frequency: string
                    xp: number
                    coins: number
                    icon?: string | null
                    attribute_bonus?: string | null
                    completed?: boolean
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    category?: string
                    frequency?: string
                    xp?: number
                    coins?: number
                    icon?: string | null
                    attribute_bonus?: string | null
                    completed?: boolean
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            main_quests: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    xp: number
                    coins: number
                    steps: Json
                    completed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    xp: number
                    coins: number
                    steps?: Json
                    completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    xp?: number
                    coins?: number
                    steps?: Json
                    completed?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            inventory: {
                Row: {
                    id: string
                    user_id: string
                    item_id: string
                    name: string
                    description: string | null
                    quantity: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    item_id: string
                    name: string
                    description?: string | null
                    quantity?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    item_id?: string
                    name?: string
                    description?: string | null
                    quantity?: number
                    created_at?: string
                }
            }
            rewards: {
                Row: {
                    id: string
                    user_id: string
                    reward_id: string
                    title: string
                    description: string | null
                    cost: number
                    purchased: boolean
                    purchased_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    reward_id: string
                    title: string
                    description?: string | null
                    cost: number
                    purchased?: boolean
                    purchased_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    reward_id?: string
                    title?: string
                    description?: string | null
                    cost?: number
                    purchased?: boolean
                    purchased_at?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}