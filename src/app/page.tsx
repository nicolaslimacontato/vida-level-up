"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Só redireciona se o usuário estiver na página raiz (/)
    // Isso evita interferir com a navegação do usuário em outras páginas
    if (!loading && user) {
      router.push("/dashboard");
    } else if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-foreground text-title1 mb-4 font-bold">
          🎮 Vida Level Up
        </h1>
        <p className="text-muted-foreground text-title3 mb-6">
          Carregando sua aventura... (Fonte Press Start 2P ativada!)
        </p>
        <div className="border-primary mx-auto h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    </div>
  );
}
