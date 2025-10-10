import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quest } from "@/types/rpg";
import { CheckCircle, Circle, Trophy, Coins } from "lucide-react";

interface QuestListProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
}

export function QuestList({ quests, onCompleteQuest }: QuestListProps) {
  const completedQuests = quests.filter((q) => q.completed);
  const pendingQuests = quests.filter((q) => !q.completed);

  return (
    <div className="space-y-6">
      {/* Quests Pendentes */}
      <div>
        <h2 className="text-foreground text-title2 mb-4 flex items-center gap-2 font-semibold">
          <Circle className="h-5 w-5 text-blue-500" />
          Quests Pendentes ({pendingQuests.length})
        </h2>
        <div className="grid gap-4">
          {pendingQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onComplete={() => onCompleteQuest(quest.id)}
              isCompleted={false}
            />
          ))}
        </div>
      </div>

      {/* Quests Concluídas */}
      {completedQuests.length > 0 && (
        <div>
          <h2 className="text-foreground text-title2 mb-4 flex items-center gap-2 font-semibold">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Quests Concluídas ({completedQuests.length})
          </h2>
          <div className="grid gap-4">
            {completedQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onComplete={() => {}}
                isCompleted={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface QuestCardProps {
  quest: Quest;
  onComplete: () => void;
  isCompleted: boolean;
}

function QuestCard({ quest, onComplete, isCompleted }: QuestCardProps) {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isCompleted
          ? "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <CardTitle
              className={`text-title3 ${
                isCompleted
                  ? "text-green-700 line-through dark:text-green-300"
                  : "text-title2"
              } transition-colors`}
            >
              {quest.title}
            </CardTitle>
            <p
              className={`text-title3 mt-1 ${
                isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              } transition-colors`}
            >
              {quest.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
      </CardHeader>
      <CardContent>
        {!isCompleted && (
          <Button onClick={onComplete} className="w-full">
            Marcar como Concluída
          </Button>
        )}
        {isCompleted && (
          <div className="flex items-center justify-center gap-2 font-medium text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            Quest Concluída!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
