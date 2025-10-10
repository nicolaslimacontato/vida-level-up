"use client";

import { useState, useEffect } from "react";
import { UserHeader } from "@/components/UserHeader";
import { QuestList } from "@/components/QuestList";
import { MainQuestList } from "@/components/MainQuestList";
import { CharacterStatus } from "@/components/CharacterStatus";
import { RewardShop } from "@/components/RewardShop";
import { LevelUpNotification } from "@/components/LevelUpNotification";
import { XPParticles } from "@/components/XPParticles";
import { useRPG } from "@/hooks/useRPG";
import { useXPParticles } from "@/hooks/useXPParticles";
import { Button } from "@/components/ui/button";
import {
  Target,
  Trophy,
  Heart,
  Gift,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const [questIndex, setQuestIndex] = useState(0);
  const [mainQuestIndex, setMainQuestIndex] = useState(0);
  const [activeSecondaryTab, setActiveSecondaryTab] = useState("character");

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
    rewards,
    showLevelUp,
    newLevel,
    completeQuest,
    completeMainQuestStep,
    purchaseReward,
    resetXPSystem,
    getXPForNextLevel,
    getLevelProgress,
    getAttributeProgress,
    setShowLevelUp,
  } = useRPG();

  // Wrapper functions com efeito de partículas
  const handleCompleteQuest = (
    questId: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    triggerParticleEffect(rect);
    completeQuest(questId);
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
  const mainQuestsPerPage = windowWidth >= 1024 ? 2 : 1;

  // Funções de navegação para quests diárias
  const nextQuests = () => {
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

  // Funções de navegação para missões principais
  const nextMainQuests = () => {
    setMainQuestIndex((prev) => {
      const maxIndex = Math.max(
        0,
        Math.ceil(mainQuests.length / mainQuestsPerPage) - 1,
      );
      return Math.min(prev + 1, maxIndex);
    });
  };

  const prevMainQuests = () => {
    setMainQuestIndex((prev) => Math.max(prev - 1, 0));
  };

  // Obter quests visíveis
  const visibleQuests = quests.slice(
    questIndex * questsPerPage,
    questIndex * questsPerPage + questsPerPage,
  );
  const visibleMainQuests = mainQuests.slice(
    mainQuestIndex * mainQuestsPerPage,
    mainQuestIndex * mainQuestsPerPage + mainQuestsPerPage,
  );

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Status do usuário */}
        <div className="mb-8">
          <UserHeader
            user={user}
            getXPForNextLevel={getXPForNextLevel}
            getLevelProgress={getLevelProgress}
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
                <span className="text-title3 text-muted-foreground bg-secondary rounded px-2 py-1">
                  {quests.filter((q) => !q.completed).length} pendentes
                </span>
              </div>

              {/* Navegação */}
              <div className="flex items-center gap-2">
                <span className="text-title3 text-muted-foreground">
                  {questIndex * questsPerPage + 1}-
                  {Math.min((questIndex + 1) * questsPerPage, quests.length)} de{" "}
                  {quests.length}
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
                    className={`group relative flex h-full min-h-[240px] w-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 bg-gradient-to-br from-blue-50 to-indigo-100 p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 sm:p-6 dark:from-blue-950 dark:to-indigo-900 ${
                      quest.completed
                        ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg shadow-green-500/20 dark:from-green-950 dark:to-emerald-900"
                        : "border-blue-300 hover:border-blue-500 dark:border-blue-700"
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
                      <h3 className="text-title2 text-foreground font-bold">
                        {quest.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-title3 font-semibold text-yellow-600">
                          +{quest.xpReward} XP
                        </span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-paragraph mb-4">
                      {quest.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex items-center justify-center gap-2 text-center">
                        <span className="text-title3 coin-text text-center font-medium text-amber-200">
                          <span className="coin-emoji">🪙</span>{" "}
                          {quest.coinReward}
                        </span>
                        <span className="text-paragraph bg-primary/10 text-primary rounded-full px-2 py-1">
                          {quest.category}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={(e) => handleCompleteQuest(quest.id, e)}
                        disabled={quest.completed}
                        className={
                          quest.completed
                            ? "bg-green-600 hover:bg-green-600"
                            : ""
                        }
                      >
                        {quest.completed ? "✓ Concluída" : "Completar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicadores de páginas */}
              {quests.length > questsPerPage && (
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
                <span className="text-muted-foreground bg-secondary text-title3 rounded px-2 py-1">
                  {mainQuests.filter((q) => !q.completed).length} ativas
                </span>
              </div>

              {/* Navegação */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-title3">
                  {mainQuestIndex * mainQuestsPerPage + 1}-
                  {Math.min(
                    (mainQuestIndex + 1) * mainQuestsPerPage,
                    mainQuests.length,
                  )}{" "}
                  de {mainQuests.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevMainQuests}
                  disabled={mainQuestIndex === 0}
                  className="h-8 w-8 p-0 hover:bg-purple-100 disabled:opacity-50 dark:hover:bg-purple-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextMainQuests}
                  disabled={
                    mainQuestIndex >=
                    Math.ceil(mainQuests.length / mainQuestsPerPage) - 1
                  }
                  className="h-8 w-8 p-0 hover:bg-purple-100 disabled:opacity-50 dark:hover:bg-purple-900"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 items-stretch gap-4 transition-all duration-500 ease-in-out lg:grid-cols-2">
                {visibleMainQuests.map((mainQuest) => (
                  <div
                    key={mainQuest.id}
                    className="group relative flex h-full min-h-[280px] w-full cursor-pointer flex-col overflow-hidden rounded-xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-100 p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25 sm:p-6 dark:border-purple-700 dark:from-purple-950 dark:to-pink-900"
                  >
                    {/* Efeito de brilho animado */}
                    <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"></div>

                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="text-foreground text-title2 font-bold">
                        {mainQuest.title}
                      </h3>
                      <div className="text-right">
                        <div className="text-title3 font-semibold text-yellow-600">
                          +{mainQuest.xpReward} XP
                        </div>
                        <div className="text-title3 text-amber-600">
                          <span className="coin-text">
                            <span className="coin-emoji">🪙</span>{" "}
                            {mainQuest.coinReward}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-title3 mb-4">
                      {mainQuest.description}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="text-paragraph mb-1 flex justify-between">
                        <span>Progresso</span>
                        <span>
                          {mainQuest.steps.filter((s) => s.completed).length}/
                          {mainQuest.steps.length}
                        </span>
                      </div>
                      <div className="bg-secondary h-2 w-full rounded-full">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                          style={{
                            width: `${(mainQuest.steps.filter((s) => s.completed).length / mainQuest.steps.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {mainQuest.steps.map((step) => (
                        <div
                          key={step.id}
                          className={`rounded-lg border p-3 ${step.completed ? "border-green-300 bg-green-100 dark:bg-green-900" : "bg-secondary border-border"}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-title3 font-medium">
                                {step.title}
                              </h4>
                              <p className="text-muted-foreground text-paragraph">
                                {step.description}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant={step.completed ? "secondary" : "default"}
                              onClick={(e) =>
                                handleCompleteMainQuestStep(
                                  mainQuest.id,
                                  step.id,
                                  e,
                                )
                              }
                              disabled={step.completed}
                              className="text-paragraph ml-2"
                            >
                              {step.completed ? "✓" : "Fazer"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Indicadores de páginas */}
              {mainQuests.length > mainQuestsPerPage && (
                <div className="mt-4 flex justify-center gap-2">
                  {Array.from({
                    length: Math.ceil(mainQuests.length / mainQuestsPerPage),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setMainQuestIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        index === mainQuestIndex
                          ? "w-6 bg-purple-500"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Seção Secundária com Tabs */}
          <div id="stats">
            <div className="mb-4 space-y-4">
              <h2 className="text-title1 font-bold">Informações Extras</h2>

              {/* Tabs de Navegação - Responsivo */}
              <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                <Button
                  variant={
                    activeSecondaryTab === "character" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setActiveSecondaryTab("character")}
                  className="flex flex-1 items-center justify-center gap-2 sm:flex-initial"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Status</span>
                  <span className="sm:hidden">Status</span>
                </Button>
                <Button
                  variant={
                    activeSecondaryTab === "shop" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setActiveSecondaryTab("shop")}
                  className="flex flex-1 items-center justify-center gap-2 sm:flex-initial"
                >
                  <Gift className="h-4 w-4" />
                  <span className="hidden sm:inline">Loja</span>
                  <span className="sm:hidden">Loja</span>
                </Button>
                <Button
                  variant={
                    activeSecondaryTab === "stats" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setActiveSecondaryTab("stats")}
                  className="flex flex-1 items-center justify-center gap-2 sm:flex-initial"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Estatísticas</span>
                  <span className="sm:hidden">Stats</span>
                </Button>
              </div>
            </div>

            {/* Conteúdo da Tab Ativa */}
            <div className="min-h-[300px] rounded-xl border-2 border-slate-300 bg-gradient-to-br from-slate-50 to-gray-100 p-3 sm:p-6 dark:border-slate-700 dark:from-slate-950 dark:to-gray-900">
              {activeSecondaryTab === "character" && (
                <div className="space-y-4">
                  <h3 className="text-title2 flex items-center gap-2 font-semibold">
                    <Heart className="h-5 w-5 text-red-500" />
                    Status do Personagem
                  </h3>
                  <CharacterStatus
                    user={user}
                    getAttributeProgress={getAttributeProgress}
                    getLevelProgress={getLevelProgress}
                  />
                </div>
              )}

              {activeSecondaryTab === "shop" && (
                <div className="space-y-4" id="shop">
                  <h3 className="text-title2 flex items-center gap-2 font-semibold">
                    <Gift className="h-5 w-5 text-pink-500" />
                    Loja de Recompensas
                  </h3>
                  <div className="max-h-80 overflow-y-auto">
                    <RewardShop
                      rewards={rewards}
                      userCoins={user.coins}
                      onPurchaseReward={purchaseReward}
                    />
                  </div>
                </div>
              )}

              {activeSecondaryTab === "stats" && (
                <div className="space-y-6">
                  <h3 className="text-title2 flex items-center gap-2 font-semibold">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Estatísticas & Debug
                  </h3>

                  {/* Estatísticas Gerais */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
                    <div className="bg-card text-title2 rounded-lg border p-2 text-center sm:p-4">
                      <div className="text-primary text-title3 font-bold">
                        {quests.length}
                      </div>
                      <div className="text-muted-foreground text-paragraph">
                        Total de Quests
                      </div>
                    </div>
                    <div className="bg-card text-title2 rounded-lg border p-2 text-center sm:p-4">
                      <div className="text-title3 font-bold text-green-600 dark:text-green-400">
                        {quests.filter((q) => q.completed).length}
                      </div>
                      <div className="text-muted-foreground text-paragraph">
                        Quests Concluídas
                      </div>
                    </div>
                    <div className="bg-card text-title2 rounded-lg border p-2 text-center sm:p-4">
                      <div className="text-title3 font-bold text-yellow-600 dark:text-yellow-400">
                        {quests.filter((q) => !q.completed).length}
                      </div>
                      <div className="text-muted-foreground text-paragraph">
                        Quests Pendentes
                      </div>
                    </div>
                    <div className="bg-card text-title2 rounded-lg border p-2 text-center sm:p-4">
                      <div className="text-title3 font-bold text-amber-600 dark:text-amber-400">
                        {user.coins}
                      </div>
                      <div className="text-muted-foreground text-paragraph">
                        Moedas 🪙
                      </div>
                    </div>
                  </div>

                  {/* Informações de Debug do Sistema XP */}
                  <div className="bg-card text-title2 rounded-lg border p-3 sm:p-4">
                    <h4 className="mb-4 flex items-center gap-2 font-semibold">
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                      Sistema XP - Info Técnica
                    </h4>

                    {/* Grid 2x2 para os dados do XP */}
                    <div className="mb-6 grid grid-cols-2 gap-2 sm:gap-4">
                      <div className="text-center">
                        <div className="text-title3 font-bold text-purple-600">
                          {user.level}
                        </div>
                        <div className="text-muted-foreground text-paragraph">
                          Nível Atual
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-title3 font-bold text-blue-600">
                          {user.currentXP}
                        </div>
                        <div className="text-muted-foreground text-paragraph">
                          XP Atual
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-title3 font-bold text-green-600">
                          {getXPForNextLevel(user.level)}
                        </div>
                        <div className="text-muted-foreground text-paragraph">
                          XP p/ Próximo Nível
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-title3 font-bold text-amber-600">
                          {user.totalXP}
                        </div>
                        <div className="text-muted-foreground text-paragraph">
                          XP Total
                        </div>
                      </div>
                    </div>

                    {/* Botão de Reset separado no final */}
                    <div className="mt-6 border-t pt-4">
                      <div className="text-center">
                        <Button
                          variant="destructive"
                          size="default"
                          onClick={resetXPSystem}
                          className="w-full max-w-xs"
                        >
                          🔄 Resetar Sistema
                        </Button>
                        <p className="text-muted-foreground text-title1 mt-2">
                          ⚠️ Isso irá resetar todo o progresso
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
