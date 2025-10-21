"use client";

import React, { useState, useEffect } from "react";
import { UserHeader } from "@/components/UserHeader";
import { LevelUpNotification } from "@/components/LevelUpNotification";
import { XPParticles } from "@/components/XPParticles";
import { CollapsibleMainQuestCard } from "@/components/CollapsibleMainQuestCard";
import { useRPGContext } from "@/contexts/RPGContext";
import { useXPParticles } from "@/hooks/useXPParticles";
import { Button } from "@/components/ui/button";
import { Target, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const [questIndex, setQuestIndex] = useState(0);

  // Sistema de partículas XP
  const {
    triggerParticles,
    buttonRect,
    xpBarRef,
    triggerParticleEffect,
    setTriggerParticles,
  } = useXPParticles();

  const {
    user,
    quests,
    mainQuests,
    showLevelUp,
    newLevel,
    completeQuestWithNotification,
    completeMainQuestStep,
    getXPForNextLevel,
    getLevelProgress,
    getStreakMultiplier,
    setShowLevelUp,
  } = useRPGContext();

  // Wrapper functions com efeito de partículas
  const handleCompleteQuest = (
    questId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    triggerParticleEffect(rect);
    completeQuestWithNotification(questId);
  };

  const handleCompleteMainQuestStep = (
    questId: string,
    stepId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    triggerParticleEffect(rect);
    completeMainQuestStep(questId, stepId);
  };

  // Configurações do carousel (responsivo)
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Quantas cartas mostrar por vez baseado no tamanho da tela
  const questsPerPage = windowWidth >= 1024 ? 3 : windowWidth >= 768 ? 2 : 1;

  // Funções de navegação para quests diárias
  const nextQuests = () => {
    if (!quests) return;
    setQuestIndex((prev) => {
      const maxIndex = Math.max(
        0,
        Math.ceil(quests.length / questsPerPage) - 1,
      );
      return Math.min(prev + 1, maxIndex);
    });
  };

  const prevQuests = () => {
    setQuestIndex((prev) => Math.max(prev - 1, 0));
  };

  // Obter quests visíveis (com verificação de segurança)
  const visibleQuests = quests
    ? quests.slice(
        questIndex * questsPerPage,
        questIndex * questsPerPage + questsPerPage,
      )
    : [];

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Status do usuário */}
        <div className="mb-8">
          <UserHeader
            user={user}
            getXPForNextLevel={getXPForNextLevel}
            getLevelProgress={getLevelProgress}
            getStreakMultiplier={getStreakMultiplier}
            xpBarRef={xpBarRef}
          />
        </div>

        {/* Layout de Cards Horizontal */}
        <div className="space-y-8">
          {/* Seção de Quests Diárias */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="text-primary h-6 w-6" />
                <h2 className="text-title1 font-bold">Quests Diárias</h2>
                <span className="text-title3 text-foreground bg-accent dark:bg-secondary hidden rounded px-2 py-1 md:block">
                  {quests ? quests.filter((q) => !q.completed).length : 0}{" "}
                  pendentes
                </span>
              </div>

              {/* Navegação */}
              <div className="flex items-center gap-2">
                <span className="text-title3 text-muted-foreground">
                  {questIndex * questsPerPage + 1}-
                  {Math.min(
                    (questIndex + 1) * questsPerPage,
                    quests?.length || 0,
                  )}{" "}
                  de {quests?.length || 0}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevQuests}
                  disabled={questIndex === 0}
                  className="h-8 w-8 p-0 hover:bg-blue-100 disabled:opacity-50 dark:hover:bg-blue-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextQuests}
                  disabled={
                    !quests ||
                    questIndex >= Math.ceil(quests.length / questsPerPage) - 1
                  }
                  className="h-8 w-8 p-0 hover:bg-blue-100 disabled:opacity-50 dark:hover:bg-blue-900"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 items-stretch gap-4 transition-all duration-500 ease-in-out md:grid-cols-2 lg:grid-cols-3">
                {visibleQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`group relative flex h-full min-h-[240px] w-full cursor-pointer flex-col overflow-hidden rounded-lg border-2 p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl sm:p-6 ${
                      quest.completed
                        ? "border-green-400 bg-gradient-to-br from-green-800 via-green-700 to-emerald-800 shadow-lg shadow-green-400/20"
                        : "border-border bg-card hover:border-primary/50 dark:border-[#373962] dark:bg-[#2d2f52] dark:hover:border-[#4a4c7a]"
                    }`}
                  >
                    {/* Efeito de brilho animado */}
                    <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"></div>

                    {/* Efeito especial para cartas completadas */}
                    {quest.completed && (
                      <div className="text-title1 absolute top-2 right-2 animate-pulse text-green-500">
                        ✨
                      </div>
                    )}

                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl">{quest.icon || "🎯"}</div>
                        <h3 className="text-title2 text-foreground font-bold">
                          {quest.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-title3 font-semibold text-yellow-600 dark:text-yellow-300">
                          +{quest.xpReward} XP
                        </span>
                      </div>
                    </div>
                    <p className="text-paragraph text-muted-foreground mb-4">
                      {quest.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex items-center justify-center gap-2 text-center">
                        <span className="text-title3 coin-text text-center font-medium text-amber-600 dark:text-amber-200">
                          <span className="coin-emoji">🪙</span>{" "}
                          {quest.coinReward}
                        </span>
                        <span className="text-paragraph rounded-full bg-cyan-100 px-2 py-1 text-cyan-800 dark:bg-cyan-400/20 dark:text-cyan-200">
                          {quest.category}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => handleCompleteQuest(quest.id, e)}
                        disabled={quest.completed}
                        className={
                          quest.completed
                            ? "bg-gradient-to-r from-green-500 to-green-600 font-bold text-white"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-black hover:from-cyan-400 hover:to-blue-400"
                        }
                      >
                        {quest.completed ? "✓ Concluída" : "Completar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicadores de páginas */}
              {quests && quests.length > questsPerPage && (
                <div className="mt-4 flex justify-center gap-2">
                  {Array.from({
                    length: Math.ceil(quests.length / questsPerPage),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setQuestIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        index === questIndex
                          ? "w-6 bg-blue-500"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seção de Missões Principais */}
          <div id="main-quests">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-purple-500" />
                <h2 className="text-title1 font-bold">Missões Principais</h2>
                <span className="text-foreground bg-accent dark:bg-secondary text-title3 rounded px-2 py-1">
                  {mainQuests
                    ? mainQuests.filter((q) => !q.completed).length
                    : 0}{" "}
                  ativas
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
                {mainQuests?.map((quest) => (
                  <CollapsibleMainQuestCard
                    key={quest.id}
                    quest={quest}
                    onCompleteStep={(questId, stepId) => {
                      // Criar um evento fake para o handleCompleteMainQuestStep
                      const fakeEvent = {
                        currentTarget: {
                          getBoundingClientRect: () => ({
                            top: 0,
                            left: 0,
                            width: 0,
                            height: 0,
                          }),
                        },
                      } as React.MouseEvent<HTMLButtonElement>;
                      handleCompleteMainQuestStep(questId, stepId, fakeEvent);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notificação de Level Up */}
      <LevelUpNotification
        level={newLevel}
        show={showLevelUp}
        onClose={() => setShowLevelUp(false)}
      />

      {/* Sistema de Partículas XP */}
      <XPParticles
        trigger={triggerParticles}
        buttonRect={buttonRect}
        xpBarRect={xpBarRef.current?.getBoundingClientRect() || null}
        particleCount={8}
        onComplete={() => setTriggerParticles(false)}
      />
    </div>
  );
}
