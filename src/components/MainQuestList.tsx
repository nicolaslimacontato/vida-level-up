import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MainQuest } from "@/types/rpg";
import { CheckCircle, Trophy, Coins, Target, Flag } from "lucide-react";

interface MainQuestListProps {
  mainQuests: MainQuest[];
  onCompleteStep: (questId: string, stepId: string) => void;
}

export function MainQuestList({
  mainQuests,
  onCompleteStep,
}: MainQuestListProps) {
  const activeQuests = mainQuests.filter((q) => !q.completed);
  const completedQuests = mainQuests.filter((q) => q.completed);

  return (
    <div className="space-y-6">
      {/* Quests Principais Ativas */}
      <div>
        <h2 className="text-foreground text-title2 mb-4 flex items-center gap-2 font-semibold">
          <Target className="h-5 w-5 text-purple-500" />
          Missões Principais ({activeQuests.length})
        </h2>
        <div className="grid gap-6">
          {activeQuests.map((quest) => (
            <MainQuestCard
              key={quest.id}
              quest={quest}
              onCompleteStep={onCompleteStep}
            />
          ))}
        </div>
      </div>

      {/* Quests Principais Concluídas */}
      {completedQuests.length > 0 && (
        <div>
          <h2 className="text-foreground text-title2 mb-4 flex items-center gap-2 font-semibold">
            <Flag className="h-5 w-5 text-green-500" />
            Missões Concluídas ({completedQuests.length})
          </h2>
          <div className="grid gap-6">
            {completedQuests.map((quest) => (
              <MainQuestCard
                key={quest.id}
                quest={quest}
                onCompleteStep={onCompleteStep}
                isCompleted={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MainQuestCardProps {
  quest: MainQuest;
  onCompleteStep: (questId: string, stepId: string) => void;
  isCompleted?: boolean;
}

function MainQuestCard({
  quest,
  onCompleteStep,
  isCompleted = false,
}: MainQuestCardProps) {
  const completedSteps = quest.steps.filter((s) => s.completed).length;
  const totalSteps = quest.steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <CardTitle
              className={`text-title2 ${
                isCompleted
                  ? "text-green-700 line-through dark:text-green-300"
                  : "text-title2"
              } transition-colors`}
            >
              {quest.title}
            </CardTitle>
            <p
              className={`text-title3 mt-2 ${
                isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              } transition-colors`}
            >
              {quest.description}
            </p>

            {/* Barra de Progresso */}
            <div className="mt-3">
              <div className="text-muted-foreground text-title3 mb-1 flex justify-between">
                <span>
                  Progresso: {completedSteps}/{totalSteps}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Recompensas */}
            <div className="mt-3 flex items-center gap-2">
              <div className="text-paragraph flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                <Trophy className="h-3 w-3" />
                {quest.xpReward} XP
              </div>
              <div className="text-paragraph flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                <Coins className="h-3 w-3" />
                <span className="coin-text">
                  <span className="coin-emoji">🪙</span> {quest.coinReward}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <h4 className="text-muted-foreground text-title3 font-medium">
            Etapas:
          </h4>
          {quest.steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-start justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center ${
                step.completed
                  ? "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                  : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20"
              }`}
            >
              <div className="w-full flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-title3 font-medium">
                    {index + 1}.
                  </span>
                  <span
                    className={`font-medium ${
                      step.completed
                        ? "text-green-700 line-through dark:text-green-300"
                        : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                <p
                  className={`text-title3 mt-1 ${
                    step.completed
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.description}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-paragraph rounded-full bg-yellow-100 px-2 py-1 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                    {step.xpReward} XP
                  </span>
                  <span className="text-paragraph rounded-full bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                    <span className="coin-text">
                      <span className="coin-emoji">🪙</span> {step.coinReward}
                    </span>
                  </span>
                </div>
              </div>

              {!step.completed && !isCompleted && (
                <Button
                  size="sm"
                  onClick={() => onCompleteStep(quest.id, step.id)}
                  className="w-full sm:ml-4 sm:w-auto"
                >
                  Completar
                </Button>
              )}

              {step.completed && (
                <CheckCircle className="h-5 w-5 text-green-500 sm:ml-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
