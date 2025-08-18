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
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
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
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Flag className="w-5 h-5 text-green-500" />
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
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle
              className={`text-xl ${
                isCompleted
                  ? "text-green-700 dark:text-green-300 line-through"
                  : "text-card-foreground"
              } transition-colors`}
            >
              {quest.title}
            </CardTitle>
            <p
              className={`text-sm mt-2 ${
                isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              } transition-colors`}
            >
              {quest.description}
            </p>

            {/* Barra de Progresso */}
            <div className="mt-3">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>
                  Progresso: {completedSteps}/{totalSteps}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Recompensas */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-medium">
                <Trophy className="w-3 h-3" />
                {quest.xpReward} XP
              </div>
              <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full text-xs font-medium">
                <Coins className="w-3 h-3" />
                {quest.coinReward} 🪙
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Etapas:</h4>
          {quest.steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                step.completed
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
                  : "bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {index + 1}.
                  </span>
                  <span
                    className={`font-medium ${
                      step.completed
                        ? "text-green-700 dark:text-green-300 line-through"
                        : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    step.completed
                      ? "text-green-600 dark:text-green-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                    {step.xpReward} XP
                  </span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-2 py-1 rounded-full">
                    {step.coinReward} 🪙
                  </span>
                </div>
              </div>

              {!step.completed && !isCompleted && (
                <Button
                  size="sm"
                  onClick={() => onCompleteStep(quest.id, step.id)}
                  className="ml-4"
                >
                  Completar
                </Button>
              )}

              {step.completed && (
                <CheckCircle className="w-5 h-5 text-green-500 ml-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
