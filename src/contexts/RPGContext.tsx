"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useRPG } from "@/hooks/useRPG";

// Tipo do contexto baseado no retorno do useRPG
type RPGContextType = ReturnType<typeof useRPG>;

const RPGContext = createContext<RPGContextType | undefined>(undefined);

interface RPGProviderProps {
  children: ReactNode;
}

export function RPGProvider({ children }: RPGProviderProps) {
  const rpgState = useRPG();

  return <RPGContext.Provider value={rpgState}>{children}</RPGContext.Provider>;
}

// Hook personalizado para usar o contexto
export function useRPGContext(): RPGContextType {
  const context = useContext(RPGContext);

  if (context === undefined) {
    throw new Error("useRPGContext must be used within a RPGProvider");
  }

  return context;
}
