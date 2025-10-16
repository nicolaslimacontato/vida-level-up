"use client";

import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
    // Return cached client if already created
    if (supabaseClient) {
        return supabaseClient;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return a mock client during build/prerender
        return {
            auth: {
                getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                getUser: () => Promise.resolve({ data: { user: null }, error: null }),
                signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
                signOut: () => Promise.resolve({ error: null }),
                onAuthStateChange: () => ({
                    data: { subscription: { unsubscribe: () => { } } }
                }),
            },
            from: () => ({
                select: () => ({ data: [], error: null }),
                insert: () => ({ data: [], error: null }),
                update: () => ({ data: [], error: null }),
                delete: () => ({ data: [], error: null }),
            }),
        } as ReturnType<typeof createBrowserClient>;
    }

    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
}