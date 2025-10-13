"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Zap, Shield, TrendingUp, Gift, Sparkles } from "lucide-react";
import { Item, ItemEffect } from "@/types/rpg";

interface UseItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
  onConfirm: (item: Item, attribute?: string) => void;
}

export function UseItemModal({
  isOpen,
  onClose,
  item,
  onConfirm,
}: UseItemModalProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");

  if (!isOpen || !item) return null;

  const handleConfirm = () => {
    if (item.effect === "attribute_point" && !selectedAttribute) {
      return; // Não pode confirmar sem selecionar atributo
    }
    onConfirm(item, selectedAttribute || undefined);
  };

  const getEffectDescription = (effect: ItemEffect): string => {
    switch (effect) {
      case "streak_protection":
        return "Protege seu streak contra quebra por 1 dia. Use antes de faltar para garantir que não perde seu progresso!";
      case "xp_boost":
        return "Dobra o XP ganho na próxima quest que você completar. Perfeito para missões difíceis!";
      case "coin_multiplier":
        return "Dobra todas as moedas ganhas por 24 horas. Ative e complete várias quests para lucrar!";
      case "attribute_point":
        return "Adiciona +1 ponto permanente no atributo escolhido. Escolha sabiamente!";
      case "rest_day":
        return "Garante 1 dia de pausa total. Não perde streak, mas também não ganha XP.";
      default:
        return "Este item tem um efeito especial. Use com sabedoria!";
    }
  };

  const getEffectIcon = (effect: ItemEffect) => {
    switch (effect) {
      case "streak_protection":
        return Shield;
      case "xp_boost":
      case "coin_multiplier":
        return Zap;
      case "attribute_point":
        return TrendingUp;
      case "rest_day":
        return Gift;
      default:
        return Sparkles;
    }
  };

  const EffectIcon = getEffectIcon(item.effect);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{item.icon}</div>
              <div>
                <CardTitle className="text-title3">{item.name}</CardTitle>
                <p className="text-paragraph text-muted-foreground">
                  Usar este item?
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Descrição do Efeito */}
          <div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <EffectIcon className="text-primary h-4 w-4" />
              <span className="text-title3 text-primary font-semibold">
                Efeito do Item
              </span>
            </div>
            <p className="text-paragraph text-muted-foreground">
              {getEffectDescription(item.effect)}
            </p>
          </div>

          {/* Seleção de Atributo (para pontos de atributo) */}
          {item.effect === "attribute_point" && (
            <div className="space-y-2">
              <label className="text-title3 font-semibold">
                Escolha o atributo:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "strength",
                    name: "Força",
                    icon: "💪",
                    desc: "Reduz XP necessário",
                  },
                  {
                    id: "intelligence",
                    name: "Inteligência",
                    icon: "🧠",
                    desc: "Bônus em estudos",
                  },
                  {
                    id: "charisma",
                    name: "Carisma",
                    icon: "😎",
                    desc: "Desconto na loja",
                  },
                  {
                    id: "discipline",
                    name: "Disciplina",
                    icon: "⚡",
                    desc: "Consistência",
                  },
                ].map((attr) => (
                  <button
                    key={attr.id}
                    onClick={() => setSelectedAttribute(attr.id)}
                    className={`rounded-lg border-2 p-3 text-left transition-colors ${
                      selectedAttribute === attr.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-title3 font-semibold">
                      {attr.icon} {attr.name}
                    </div>
                    <div className="text-paragraph text-muted-foreground">
                      {attr.desc}
                    </div>
                  </button>
                ))}
              </div>
              {!selectedAttribute && (
                <p className="text-paragraph text-red-500">
                  ⚠️ Selecione um atributo para continuar
                </p>
              )}
            </div>
          )}

          {/* Aviso para itens importantes */}
          {item.effect === "streak_protection" && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950/30">
              <p className="text-paragraph text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Atenção:</strong> Use este item antes de faltar um
                dia para proteger seu streak!
              </p>
            </div>
          )}

          {item.effect === "xp_boost" && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/30">
              <p className="text-paragraph text-blue-800 dark:text-blue-200">
                💡 <strong>Dica:</strong> Use antes de completar uma quest
                difícil para maximizar o XP!
              </p>
            </div>
          )}

          {item.effect === "coin_multiplier" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/30">
              <p className="text-paragraph text-green-800 dark:text-green-200">
                💰 <strong>Estratégia:</strong> Ative e complete várias quests
                hoje para lucrar mais!
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={item.effect === "attribute_point" && !selectedAttribute}
              className="bg-primary hover:bg-primary/90 flex-1"
            >
              🎯 Confirmar Uso
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
