"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para o dashboard após um breve delay
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

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
