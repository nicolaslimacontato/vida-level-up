"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Play, SkipForward } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TourStep {
  target: string; // CSS selector
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
  action?: "click" | "scroll" | "none";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "#user-header",
    title: "Bem-vindo ao Vida Level Up! 🎮",
    description:
      "Aqui você vê seu nível, XP e moedas. Complete quests para evoluir e ganhar recompensas!",
    position: "bottom",
    action: "none",
  },
  {
    target: "#daily-quests",
    title: "Quests Diárias 🎯",
    description:
      "Complete suas tarefas do dia para ganhar XP e moedas. Cada quest completa te aproxima do próximo nível!",
    position: "top",
    action: "click",
  },
  {
    target: "#main-quests",
    title: "Missões Principais 🏆",
    description:
      "Desafios maiores com múltiplas etapas. Complete todas as etapas para ganhar recompensas especiais!",
    position: "top",
    action: "scroll",
  },
  {
    target: "#sidebar",
    title: "Navegação 📱",
    description:
      "Use o menu lateral para acessar todas as funcionalidades: loja, inventário, conquistas e muito mais!",
    position: "right",
    action: "none",
  },
  {
    target: "#level-progress",
    title: "Progresso de Nível 📈",
    description:
      "Veja quanto XP você precisa para o próximo nível. Quanto maior o nível, mais XP é necessário!",
    position: "top",
    action: "none",
  },
];

interface OnboardingTourProps {
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingTour({
  isActive,
  onComplete,
  onSkip,
}: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setTimeout(() => {
        highlightTarget();
      }, 100);
    } else {
      setIsVisible(false);
    }
  }, [isActive, currentStep]);

  const highlightTarget = () => {
    const target = document.querySelector(
      TOUR_STEPS[currentStep].target,
    ) as HTMLElement;
    if (target) {
      targetRef.current = target;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const skipTour = () => {
    setIsVisible(false);
    setTimeout(() => {
      onSkip();
    }, 300);
  };

  if (!isVisible || !isActive) return null;

  const currentStepData = TOUR_STEPS[currentStep];
  const targetElement = targetRef.current;

  // Calculate position for tooltip
  const getTooltipPosition = () => {
    if (!targetElement)
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

    const rect = targetElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = rect.top + rect.height / 2;
    let left = rect.left + rect.width / 2;
    let transform = "translate(-50%, -50%)";

    switch (currentStepData.position) {
      case "top":
        top = rect.top - 20;
        left = rect.left + rect.width / 2;
        transform = "translate(-50%, -100%)";
        break;
      case "bottom":
        top = rect.bottom + 20;
        left = rect.left + rect.width / 2;
        transform = "translate(-50%, 0)";
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - 20;
        transform = "translate(-100%, -50%)";
        break;
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + 20;
        transform = "translate(0, -50%)";
        break;
    }

    // Keep tooltip within viewport
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    if (left < tooltipWidth / 2) left = tooltipWidth / 2;
    if (left > viewportWidth - tooltipWidth / 2)
      left = viewportWidth - tooltipWidth / 2;
    if (top < tooltipHeight / 2) top = tooltipHeight / 2;
    if (top > viewportHeight - tooltipHeight / 2)
      top = viewportHeight - tooltipHeight / 2;

    return { top: `${top}px`, left: `${left}px`, transform };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60"
            onClick={skipTour}
          />

          {/* Highlighted Element */}
          {targetElement && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="pointer-events-none fixed z-50"
              style={{
                top: targetElement.getBoundingClientRect().top - 4,
                left: targetElement.getBoundingClientRect().left - 4,
                width: targetElement.getBoundingClientRect().width + 8,
                height: targetElement.getBoundingClientRect().height + 8,
                border: "3px solid #4f46e5",
                borderRadius: "8px",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
              }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50"
            style={getTooltipPosition()}
          >
            <Card className="border-primary w-80 max-w-[90vw] border-2 shadow-2xl">
              <CardContent className="p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white">
                      {currentStep + 1}
                    </div>
                    <span className="text-muted-foreground text-sm">
                      {currentStep + 1} de {TOUR_STEPS.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="mb-2 text-lg font-bold">
                    {currentStepData.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {currentStepData.description}
                  </p>
                </div>

                {/* Action Hint */}
                {currentStepData.action === "click" && (
                  <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Play className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Tente clicar em uma quest!
                      </span>
                    </div>
                  </div>
                )}

                {currentStepData.action === "scroll" && (
                  <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <ChevronRight className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Role para baixo para ver mais!
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={skipTour}
                      className="flex items-center gap-2"
                    >
                      <SkipForward className="h-4 w-4" />
                      Pular
                    </Button>
                    <Button
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      {currentStep === TOUR_STEPS.length - 1
                        ? "Finalizar"
                        : "Próximo"}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
