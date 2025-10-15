"use client";

import { useEffect, useState } from "react";

interface LevelUpNotificationProps {
  level: number;
  show: boolean;
  onClose: () => void;
}

export function LevelUpNotification({
  level,
  show,
  onClose,
}: LevelUpNotificationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const fullText = `*Você sente o poder do progresso enchendo seu coração de DISCIPLINA.\n\n*LVL ${level} alcançado.`;

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setDisplayedText("");

      // Efeito de texto digitando
      let index = 0;
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          // Cursor piscante após terminar de digitar
          const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
          }, 500);

          // Fechar após 5 segundos
          setTimeout(() => {
            clearInterval(cursorInterval);
            setIsVisible(false);
            setTimeout(onClose, 300);
          }, 5000);
        }
      }, 50); // 50ms por caractere

      return () => clearInterval(interval);
    }
  }, [show, onClose, fullText]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className="max-w-2xl px-8 py-12 text-lg leading-relaxed whitespace-pre-wrap text-white"
        style={{ fontFamily: "var(--font-retro)" }}
      >
        {displayedText}
        {showCursor && displayedText.length === fullText.length && (
          <span className="animate-pulse">_</span>
        )}
      </div>
    </div>
  );
}
