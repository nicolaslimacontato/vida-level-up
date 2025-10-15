"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MainQuest } from "@/types/rpg";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";

interface CollapsibleMainQuestCardProps {
  quest: MainQuest;
  onCompleteStep: (questId: string, stepId: string) => void;
}

export function CollapsibleMainQuestCard({
  quest,
  onCompleteStep,
}: CollapsibleMainQuestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const completedSteps = quest.steps.filter((s) => s.completed).length;
  const totalSteps = quest.steps.length;
  const progress = (completedSteps / totalSteps) * 100;
  const isCompleted = quest.completed;

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleStepClick = (e: React.MouseEvent, stepId: string) => {
    e.stopPropagation(); // Evitar que o card seja expandido/colapsado
    onCompleteStep(quest.id, stepId);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex min-h-[200px] w-full cursor-pointer flex-col overflow-hidden rounded-lg border-2 p-4 transition-all duration-300 hover:shadow-lg sm:p-6 ${
        isCompleted
          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      {/* Header do card */}
      <div className="relative mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="text-title2 text-foreground font-bold">
              {quest.title}
            </h3>
            <div className="flex items-center">
              {isExpanded ? (
                <ChevronUp className="text-primary h-4 w-4" />
              ) : (
                <ChevronDown className="text-primary h-4 w-4" />
              )}
            </div>
          </div>

          {isExpanded && (
            <p className="text-paragraph text-muted-foreground mb-3">
              {quest.description}
            </p>
          )}
        </div>

        {/* Recompensas */}
        <div className="text-right">
          <div className="text-title3 font-semibold text-yellow-600">
            +{quest.xpReward} XP
          </div>
          <div className="text-title3 text-amber-600">
            <span className="coin-text">
              <span className="coin-emoji">🪙</span> {quest.coinReward}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="relative mb-4">
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-foreground">Progresso</span>
          <span className="text-muted-foreground">
            {completedSteps}/{totalSteps}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Conteúdo expandido - Steps */}
      {isExpanded && (
        <div className="relative max-h-64 space-y-2 overflow-y-auto">
          {quest.steps.map((step) => (
            <div
              key={step.id}
              className={`rounded-lg border p-3 ${
                step.completed
                  ? "border-green-200 bg-green-100 dark:bg-green-900"
                  : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="border-muted-foreground h-4 w-4 rounded-full border-2" />
                    )}
                    <span className="text-foreground text-sm font-medium">
                      {step.title}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-2 text-xs">
                    {step.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                      +{step.xpReward} XP
                    </span>
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                      <span className="coin-text">
                        <span className="coin-emoji">🪙</span> {step.coinReward}
                      </span>
                    </span>
                  </div>
                </div>

                {!step.completed && (
                  <Button
                    size="sm"
                    onClick={(e) => handleStepClick(e, step.id)}
                    className="ml-2"
                  >
                    Completar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
