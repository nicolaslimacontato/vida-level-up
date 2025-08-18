import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reward } from "@/types/rpg";
import { Gift, Coins, ShoppingCart, CheckCircle } from "lucide-react";

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
      {/* Cabeçalho da Loja */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Gift className="w-6 h-6 text-purple-500" />
          Loja de Recompensas
        </h2>
        <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
          <Coins className="w-5 h-5 text-amber-500" />
          <span className="font-semibold text-amber-600 dark:text-amber-400">
            {userCoins} 🪙
          </span>
          <span>disponíveis</span>
        </div>
      </div>

      {/* Recompensas Disponíveis */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-500" />
          Recompensas Disponíveis ({availableRewards.length})
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Recompensas Compradas ({purchasedRewards.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{categoryIcon}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}
              >
                {reward.category}
              </span>
            </div>
            <CardTitle
              className={`text-lg ${
                isAvailable
                  ? "text-card-foreground"
                  : "text-green-700 dark:text-green-300 line-through"
              } transition-colors`}
            >
              {reward.name}
            </CardTitle>
            <p
              className={`text-sm mt-1 ${
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

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-2 rounded-full font-medium">
            <Coins className="w-4 h-4" />
            {reward.cost} 🪙
          </div>

          {isAvailable && (
            <Button
              onClick={() => onPurchase(reward.id)}
              disabled={!canAfford}
              className={canAfford ? "" : "opacity-50 cursor-not-allowed"}
            >
              {canAfford ? "Comprar" : "Moedas Insuficientes"}
            </Button>
          )}

          {!isAvailable && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
              <CheckCircle className="w-5 h-5" />
              Comprado!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
