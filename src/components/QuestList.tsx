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
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Circle className="w-5 h-5 text-blue-500" />
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
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
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
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
          : "bg-card border-border hover:border-primary/50"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <CardTitle
              className={`text-lg ${
                isCompleted
                  ? "text-green-700 dark:text-green-300 line-through"
                  : "text-card-foreground"
              } transition-colors`}
            >
              {quest.title}
            </CardTitle>
            <p
              className={`text-sm mt-1 ${
                isCompleted
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              } transition-colors`}
            >
              {quest.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
      </CardHeader>
      <CardContent>
        {!isCompleted && (
          <Button onClick={onComplete} className="w-full">
            Marcar como Concluída
          </Button>
        )}
        {isCompleted && (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
            <CheckCircle className="w-5 h-5" />
            Quest Concluída!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
