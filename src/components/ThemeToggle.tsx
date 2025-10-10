"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative inline-block">
      <div className="flex min-w-fit items-center rounded-full bg-gray-200 p-1 shadow-inner dark:bg-gray-700">
        <button
          onClick={() => setTheme("light")}
          className={`text-title3 flex items-center justify-center rounded-full p-1.5 transition-all duration-200 ease-in-out ${
            theme === "light"
              ? "scale-110 bg-white text-yellow-600 shadow-md"
              : "text-gray-600 hover:scale-105 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          } `}
          title="Modo Claro"
          aria-label="Alternar para modo claro"
        >
          <span className="text-title1">☀️</span>
        </button>

        <button
          onClick={() => setTheme("system")}
          className={`text-title3 flex items-center justify-center rounded-full p-1.5 transition-all duration-200 ease-in-out ${
            theme === "system"
              ? "scale-110 bg-white text-blue-600 shadow-md dark:bg-gray-800 dark:text-blue-400"
              : "text-gray-600 hover:scale-105 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          } `}
          title="Seguir Sistema"
          aria-label="Seguir preferência do sistema"
        >
          <span className="text-title1">💻</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={`text-title3 flex items-center justify-center rounded-full p-1.5 transition-all duration-200 ease-in-out ${
            theme === "dark"
              ? "scale-110 bg-gray-800 text-blue-400 shadow-md"
              : "text-gray-600 hover:scale-105 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          } `}
          title="Modo Escuro"
          aria-label="Alternar para modo escuro"
        >
          <span className="text-title1">🌙</span>
        </button>
      </div>
    </div>
  );
}
