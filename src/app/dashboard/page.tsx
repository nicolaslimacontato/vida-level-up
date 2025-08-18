"use client";

import { useState } from "react";
import { UserHeader } from "@/components/UserHeader";
import { QuestList } from "@/components/QuestList";
import { MainQuestList } from "@/components/MainQuestList";
import { CharacterStatus } from "@/components/CharacterStatus";
import { RewardShop } from "@/components/RewardShop";
import { LevelUpNotification } from "@/components/LevelUpNotification";
import { useRPG } from "@/hooks/useRPG";
import { Button } from "@/components/ui/button";
import { Target, Trophy, Heart, Gift, BarChart3 } from "lucide-react";
import ASCIIText from '@/blocks/TextAnimations/ASCIIText/ASCIIText';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("quests");

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
    getXPForNextLevel,
    getLevelProgress,
    getAttributeProgress,
    setShowLevelUp,
  } = useRPG();

  const tabs = [
    {
      id: "quests",
      label: "Quests Diárias",
      icon: Target,
      description: "Tarefas simples do dia a dia",
    },
    {
      id: "main",
      label: "Missões Principais",
      icon: Trophy,
      description: "Objetivos maiores com etapas",
    },
    {
      id: "character",
      label: "Status do Personagem",
      icon: Heart,
      description: "Seus atributos e progresso",
    },
    {
      id: "shop",
      label: "Loja de Recompensas",
      icon: Gift,
      description: "Gaste suas moedas em prêmios",
    },
    {
      id: "stats",
      label: "Estatísticas",
      icon: BarChart3,
      description: "Resumo geral da sua jornada",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "quests":
        return (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
            <QuestList quests={quests} onCompleteQuest={completeQuest} />
          </div>
        );
      case "main":
        return (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
            <MainQuestList
              mainQuests={mainQuests}
              onCompleteStep={completeMainQuestStep}
            />
          </div>
        );
      case "character":
        return (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
            <CharacterStatus
              user={user}
              getAttributeProgress={getAttributeProgress}
              getLevelProgress={getLevelProgress}
            />
          </div>
        );
      case "shop":
        return (
          <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
            <RewardShop
              rewards={rewards}
              userCoins={user.coins}
              onPurchaseReward={purchaseReward}
            />
          </div>
        );
      case "stats":
        return (
          <div className="space-y-6">
            {/* Estatísticas Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card text-card-foreground rounded-lg p-4 text-center border">
                <div className="text-2xl font-bold text-primary">
                  {quests.length}
                </div>
                <div className="text-muted-foreground text-sm">
                  Total de Quests
                </div>
              </div>
              <div className="bg-card text-card-foreground rounded-lg p-4 text-center border">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {quests.filter((q) => q.completed).length}
                </div>
                <div className="text-muted-foreground text-sm">
                  Quests Concluídas
                </div>
              </div>
              <div className="bg-card text-card-foreground rounded-lg p-4 text-center border">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {quests.filter((q) => !q.completed).length}
                </div>
                <div className="text-muted-foreground text-sm">
                  Quests Pendentes
                </div>
              </div>
              <div className="bg-card text-card-foreground rounded-lg p-4 text-center border">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {user.coins}
                </div>
                <div className="text-muted-foreground text-sm">Moedas 🪙</div>
              </div>
            </div>

            {/* Estatísticas das Missões Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card text-card-foreground rounded-lg p-4 border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-purple-500" />
                  Missões Principais
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">{mainQuests.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Concluídas:</span>
                    <span className="font-medium text-green-600">
                      {mainQuests.filter((q) => q.completed).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ativas:</span>
                    <span className="font-medium text-blue-600">
                      {mainQuests.filter((q) => !q.completed).length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card text-card-foreground rounded-lg p-4 border">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-500" />
                  Recompensas
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span className="font-medium">{rewards.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compradas:</span>
                    <span className="font-medium text-green-600">
                      {rewards.filter((r) => r.purchased).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Disponíveis:</span>
                    <span className="font-medium text-blue-600">
                      {rewards.filter((r) => !r.purchased).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Atributos */}
            <div className="bg-card text-card-foreground rounded-lg p-4 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Resumo dos Atributos
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {user.attributes.strength}
                  </div>
                  <div className="text-xs text-muted-foreground">Força</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {user.attributes.intelligence}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Inteligência
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {user.attributes.charisma}
                  </div>
                  <div className="text-xs text-muted-foreground">Carisma</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {user.attributes.discipline}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Disciplina
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Título da página */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex justify-center h-[200px] w-full">
            <ASCIIText
              text="Vida Level Up"
              enableWaves={false}
              planeBaseHeight={40}
              textFontSize={20}
              asciiFontSize={1}
            />
          </h1>
          <p className="text-muted-foreground text-lg">
            Transforme suas tarefas diárias em uma aventura épica!
          </p>
        </div>

        {/* Status do usuário */}
        <div className="mb-8">
          <UserHeader
            user={user}
            getXPForNextLevel={getXPForNextLevel}
            getLevelProgress={getLevelProgress}
          />
        </div>

        {/* Abas de Navegação */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>

          {/* Descrição da aba ativa */}
          <div className="text-center mt-4">
            <p className="text-muted-foreground">
              {tabs.find((tab) => tab.id === activeTab)?.description}
            </p>
          </div>
        </div>

        {/* Conteúdo da aba ativa */}
        {renderTabContent()}
      </div>

      {/* Notificação de Level Up */}
      <LevelUpNotification
        level={newLevel}
        show={showLevelUp}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
}
