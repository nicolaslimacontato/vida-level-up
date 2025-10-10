import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reward } from "@/types/rpg";
import { Coins, ShoppingCart, CheckCircle } from "lucide-react";

interface RewardShopProps {
  rewards: Reward[];
  userCoins: number;
  onPurchaseReward: (rewardId: string) => void;
}

export function RewardShop({
  rewards,
  userCoins,
  onPurchaseReward,
}: RewardShopProps) {
  const availableRewards = rewards.filter((r) => !r.purchased);
  const purchasedRewards = rewards.filter((r) => r.purchased);

  return (
    <div className="space-y-6">
      {/* Saldo de Moedas */}
      <div className="text-center">
        <div className="text-title3 mx-auto flex w-fit items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-950/30">
          <Coins className="h-5 w-5 text-amber-500" />
          <span className="coin-text font-semibold text-amber-600 dark:text-amber-400">
            <span className="coin-emoji">🪙</span> {userCoins}
          </span>
          <span className="text-muted-foreground">disponíveis</span>
        </div>
      </div>

      {/* Recompensas Disponíveis */}
      <div>
        <h3 className="text-foreground text-title2 mb-4 flex items-center gap-2 font-semibold">
          <ShoppingCart className="h-5 w-5 text-blue-500" />
          Recompensas Disponíveis ({availableRewards.length})
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {availableRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userCoins={userCoins}
              onPurchase={onPurchaseReward}
              isAvailable={true}
            />
          ))}
        </div>
      </div>

      {/* Recompensas Compradas */}
      {purchasedRewards.length > 0 && (
        <div>
          <h3 className="text-foreground text-title2 mb-4 flex items-center gap-2 font-semibold">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Recompensas Compradas ({purchasedRewards.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {purchasedRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                userCoins={userCoins}
                onPurchase={onPurchaseReward}
                isAvailable={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface RewardCardProps {
  reward: Reward;
  userCoins: number;
  onPurchase: (rewardId: string) => void;
  isAvailable: boolean;
}

function RewardCard({
  reward,
  userCoins,
  onPurchase,
  isAvailable,
}: RewardCardProps) {
  const canAfford = userCoins >= reward.cost;

  const getCategoryIcon = (category: Reward["category"]) => {
    switch (category) {
      case "treat":
        return "🍕";
      case "break":
        return "🏖️";
      case "experience":
        return "🎬";
      case "custom":
        return "🎁";
      default:
        return "🎁";
    }
  };

  const getCategoryColor = (category: Reward["category"]) => {
    switch (category) {
      case "treat":
        return "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200";
      case "break":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
      case "experience":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200";
      case "custom":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200";
    }
  };

  const categoryIcon = getCategoryIcon(reward.category);
  const categoryColor = getCategoryColor(reward.category);

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isAvailable
          ? "bg-card border-border hover:border-primary/50"
          : "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="text-title3">{categoryIcon}</span>
              <span
                className={`text-paragraph rounded-full px-2 py-1 font-medium ${categoryColor}`}
              >
                {reward.category}
              </span>
            </div>
            <CardTitle
              className={`text-title3 ${
                isAvailable
                  ? "text-foreground"
                  : "text-green-700 line-through dark:text-green-300"
              } transition-colors`}
            >
              {reward.name}
            </CardTitle>
            <p
              className={`text-paragraph mt-1 ${
                isAvailable
                  ? "text-muted-foreground"
                  : "text-green-600 dark:text-green-400"
              } transition-colors`}
            >
              {reward.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-2">
          {/* Preço */}
          <div className="mx-auto flex w-fit items-center justify-center gap-1 rounded-full bg-amber-100 px-2 py-1 font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            <span className="coin-text font-bold">
              <span className="coin-emoji">🪙</span> {reward.cost}
            </span>
          </div>

          {/* Status/Ação */}
          {isAvailable && (
            <div className="space-y-2">
              <Button
                onClick={() => onPurchase(reward.id)}
                disabled={!canAfford}
                className={`w-full ${
                  canAfford
                    ? "bg-primary hover:bg-primary/90"
                    : "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                }`}
              >
                {canAfford ? "🛒 Comprar" : "💸 Sem Moedas"}
              </Button>

              {!canAfford && (
                <div className="text-center">
                  <div className="text-paragraph inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-red-500 dark:bg-red-950/50 dark:text-red-400">
                    <span>Faltam</span>
                    <span className="coin-text">
                      <span>{reward.cost - userCoins}</span>
                      <span className="coin-emoji">🪙</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isAvailable && (
            <div className="flex items-center justify-center gap-2 rounded-full bg-green-50 px-2 py-1 font-medium text-green-600 dark:bg-green-950/50 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              <span className="text-paragraph">Comprado!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
