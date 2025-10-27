"use client";

import { Achievement } from "@/types/rpg";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { Button } from "./ui/button";

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementNotification({
  achievement,
  onClose,
}: AchievementNotificationProps) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="fixed top-20 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="relative max-w-[500px] min-w-[400px] rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white shadow-2xl">
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-2 right-2 h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Trophy className="h-12 w-12 text-yellow-200" />
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="absolute inset-0"
                >
                  <Trophy className="h-12 w-12 text-yellow-300" />
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-bold">
                  Conquista Desbloqueada!
                </h3>
                <p className="mb-1 text-lg font-semibold">
                  {achievement.icon} {achievement.title}
                </p>
                <p className="mb-2 text-sm opacity-90">
                  {achievement.description}
                </p>
                <div className="flex gap-3 text-sm">
                  <span className="rounded bg-white/20 px-2 py-1">
                    +{achievement.xpReward} XP
                  </span>
                  <span className="rounded bg-white/20 px-2 py-1">
                    🪙 {achievement.coinReward}
                  </span>
                </div>
              </div>
            </div>

            {/* Confetti effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pointer-events-none absolute inset-0"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 200 - 100,
                    opacity: 1,
                    scale: 1,
                  }}
                  animate={{
                    y: [0, -50, -100],
                    opacity: [1, 0.5, 0],
                    scale: [1, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                  className="absolute text-2xl"
                >
                  🎉
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
