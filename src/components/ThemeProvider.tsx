"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useGameAudio } from "@/hooks/useGameAudio";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const { playFlashbangSound } = useGameAudio();
  const prevResolvedThemeRef = useRef<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);

    // Recuperar tema salvo no localStorage apenas no cliente
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("vida-level-up-theme") as Theme;
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const root = window.document.documentElement;

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setResolvedTheme(systemTheme);
      if (systemTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } else {
      setResolvedTheme(theme);
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    // Detectar mudança específica de dark para light
    if (prevResolvedThemeRef.current === "dark" && resolvedTheme === "light") {
      playFlashbangSound();
    }
    prevResolvedThemeRef.current = resolvedTheme;

    // Salvar no localStorage
    localStorage.setItem("vida-level-up-theme", theme);
  }, [theme, mounted, resolvedTheme, playFlashbangSound]);

  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    // Escutar mudanças no sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        setResolvedTheme(systemTheme);
        const root = window.document.documentElement;
        if (systemTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
