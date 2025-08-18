"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 shadow-inner">
        <button
          onClick={() => setTheme("light")}
          className={`p-2 rounded-full transition-all duration-200 ${
            theme === "light"
              ? "bg-white text-yellow-600 shadow-md scale-105"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105"
          }`}
          title="Modo Claro"
          aria-label="Alternar para modo claro"
        >
          <span className="text-lg">☀️</span>
        </button>

        <button
          onClick={() => setTheme("system")}
          className={`p-2 rounded-full transition-all duration-200 ${
            theme === "system"
              ? "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md scale-105"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105"
          }`}
          title="Seguir Sistema"
          aria-label="Seguir preferência do sistema"
        >
          <span className="text-lg">💻</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`p-2 rounded-full transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-800 text-blue-400 shadow-md scale-105"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-105"
          }`}
          title="Modo Escuro"
          aria-label="Alternar para modo escuro"
        >
          <span className="text-lg">🌙</span>
        </button>
      </div>
    </div>
  );
}
