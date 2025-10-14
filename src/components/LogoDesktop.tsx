"use client";

import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";

export function LogoDesktop() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar hidration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Fallback durante carregamento
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
        <span className="text-paragraph flex items-center justify-center font-bold text-slate-900">
          VL
        </span>
      </div>
    );
  }

  return (
    <Image
      src={
        resolvedTheme === "dark"
          ? "/VidaLevelUpLogoBranco.png"
          : "/VidaLevelUpLogoPreto.png"
      }
      alt="Vida Level Up"
      width={40}
      height={40}
      className="h-10 w-auto"
    />
  );
}
