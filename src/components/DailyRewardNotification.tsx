import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DailyReward } from "@/types/rpg";
import { Card } from "@/components/ui/card";
import { Gift, Coins, Zap, Star, Crown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyRewardNotificationProps {
  reward: DailyReward;
  onClose: () => void;
  consecutiveDays?: number;
}

const getRewardIcon = (type: string) => {
  switch (type) {
    case "coins":
      return <Coins className="h-8 w-8 text-yellow-500" />;
    case "xp":
      return <Zap className="h-8 w-8 text-blue-500" />;
    case "item":
      return <Gift className="h-8 w-8 text-purple-500" />;
    case "special":
      return <Crown className="h-8 w-8 text-orange-500" />;
    default:
      return <Star className="h-8 w-8 text-gray-500" />;
  }
};

const getStreakBonus = (consecutiveDays: number) => {
  if (consecutiveDays >= 7)
    return { text: "🔥 Streak de 7 dias!", bonus: "+50%" };
  if (consecutiveDays >= 3)
    return { text: "⚡ Streak de 3 dias!", bonus: "+25%" };
  return null;
};

export const DailyRewardNotification: React.FC<
  DailyRewardNotificationProps
> = ({ reward, onClose, consecutiveDays = 0 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const formatRewardValue = () => {
    if (reward.type === "coins") {
      return `${reward.value} moedas`;
    } else if (reward.type === "xp") {
      return `${reward.value} XP`;
    } else if (reward.type === "item") {
      return reward.itemName || "Item especial";
    } else {
      return reward.description;
    }
  };

  const streakBonus = getStreakBonus(consecutiveDays);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-50 w-full max-w-sm"
        >
          <Card className="relative overflow-hidden border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl dark:border-blue-800 dark:from-blue-900/20 dark:to-purple-900/20">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 rounded-full p-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>

            {/* Confetti Effect */}
            <div className="pointer-events-none absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-yellow-400"
                  initial={{
                    x: Math.random() * 400,
                    y: -10,
                    opacity: 1,
                    scale: 1,
                  }}
                  animate={{
                    y: 300,
                    opacity: 0,
                    scale: 0,
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            <div className="p-4 pt-6">
              {/* Header */}
              <div className="mb-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-2 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
                >
                  {getRewardIcon(reward.type)}
                </motion.div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Recompensa Coletada! 🎁
                </h3>
              </div>

              {/* Reward Info */}
              <div className="mb-4 text-center">
                <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {formatRewardValue()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {reward.description}
                </p>
              </div>

              {/* Streak Bonus */}
              {streakBonus && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4 text-center"
                >
                  <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                    {streakBonus.text} {streakBonus.bonus}
                  </div>
                </motion.div>
              )}

              {/* Consecutive Days */}
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {consecutiveDays > 0 ? (
                    <>
                      <span className="font-medium">{consecutiveDays}</span>{" "}
                      dias consecutivos!
                    </>
                  ) : (
                    "Primeiro dia de streak!"
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
