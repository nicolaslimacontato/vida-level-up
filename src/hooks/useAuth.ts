"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        // Verificar sessão inicial
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getInitialSession();

        // Escutar mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event: string, session: Session | null) => {
                setUser(session?.user ?? null);
                setLoading(false);

                if (event === "SIGNED_OUT") {
                    router.push("/login");
                } else if (event === "SIGNED_IN" && session) {
                    router.push("/dashboard");
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase.auth, router]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return {
        user,
        loading,
        signOut,
    };
}
