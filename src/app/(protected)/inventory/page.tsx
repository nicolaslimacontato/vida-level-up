"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  Zap,
  // Shield, TrendingUp, Gift - não usados atualmente
  Sparkles,
  History,
  // Filter - não usado atualmente
} from "lucide-react";
import { useRPGContext } from "@/contexts/RPGContext";
import { useToast } from "@/components/Toast";
import { Item, ItemCategory } from "@/types/rpg"; // ItemType não usado
import { UseItemModal } from "@/components/UseItemModal";

type InventoryTab = "consumable" | "permanent" | "history";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<InventoryTab>("consumable");
  // const [showFilters, setShowFilters] = useState(false); // Não usado atualmente
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);

  // Hook do RPG
  const { user, useItem: consumeItem } = useRPGContext();

  // Hook de notificações
  const { success, error, info } = useToast();

  // Estado para forçar re-render do countdown
  const [, setCountdownTick] = useState(0);

  // Atualizar countdown a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filtrar itens por tab
  const getItemsByTab = (tab: InventoryTab): Item[] => {
    switch (tab) {
      case "consumable":
        return user.inventory.filter((item) => item.type === "consumable");
      case "permanent":
        return user.inventory.filter((item) => item.type === "permanent");
      case "history":
        // Itens que foram usados (tem usedAt)
        return user.inventory.filter((item) => item.usedAt);
      default:
        return [];
    }
  };

  const filteredItems = getItemsByTab(activeTab);

  const tabs = [
    {
      id: "consumable" as const,
      name: "Consumíveis",
      icon: Zap,
      color: "text-yellow-500",
      count: user.inventory.filter((item) => item.type === "consumable").length,
    },
    {
      id: "permanent" as const,
      name: "Permanentes",
      icon: Sparkles,
      color: "text-purple-500",
      count: user.inventory.filter((item) => item.type === "permanent").length,
    },
    {
      id: "history" as const,
      name: "Histórico",
      icon: History,
      color: "text-gray-500",
      count: user.inventory.filter((item) => item.usedAt).length,
    },
  ];

  const handleUseItem = (item: Item) => {
    setSelectedItem(item);
    setIsUseModalOpen(true);
  };

  const handleConfirmUse = (item: Item, attribute?: string) => {
    // Chamar a função useItem do contexto
    try {
      consumeItem(item.id);
      success("Item Usado!", `${item.name} foi ativado com sucesso.`);

      // Mostrar efeito específico do item
      switch (item.effect) {
        case "xp_boost":
          info("Buff Ativo!", "Próxima quest terá XP dobrado!");
          break;
        case "coin_multiplier":
          info("Buff Ativo!", "Moedas dobradas por 24 horas!");
          break;
        case "attribute_point":
          info("Atributo Aumentado!", `+1 ponto em ${attribute}!`);
          break;
        case "streak_protection":
          info("Proteção Ativa!", "Seu streak está protegido por 1 dia!");
          break;
        case "rest_day":
          info("Dia de Descanso!", "Você pode descansar sem perder progresso!");
          break;
        default:
          info("Efeito Ativo!", "Item usado com sucesso!");
      }
    } catch {
      error("Erro", "Não foi possível usar este item.");
    }

    setIsUseModalOpen(false);
    setSelectedItem(null);
  };

  // Função para calcular tempo restante dos buffs
  const getTimeRemaining = (untilDate?: string): string => {
    if (!untilDate) return "0s";

    const now = new Date().getTime();
    const until = new Date(untilDate).getTime();
    const diff = until - now;

    if (diff <= 0) return "Expirado";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Função para obter buffs ativos
  const getActiveBuffs = () => {
    const buffs = [];

    if (user.activeEffects.xpBoostActive && user.activeEffects.xpBoostUntil) {
      buffs.push({
        id: "xp_boost",
        name: "Poção de XP Duplo",
        icon: "🧪",
        timeRemaining: getTimeRemaining(user.activeEffects.xpBoostUntil),
        description: "Próxima quest terá XP dobrado",
      });
    }

    if (
      user.activeEffects.coinMultiplierActive &&
      user.activeEffects.coinMultiplierUntil
    ) {
      buffs.push({
        id: "coin_multiplier",
        name: "Multiplicador de Moedas",
        icon: "💰",
        timeRemaining: getTimeRemaining(user.activeEffects.coinMultiplierUntil),
        description: "Moedas dobradas por 24 horas",
      });
    }

    if (user.activeEffects.hasStreakProtection) {
      buffs.push({
        id: "streak_protection",
        name: "Barreira de Streak",
        icon: "🛡️",
        timeRemaining: "Ativo",
        description: "Protege seu streak contra quebra",
      });
    }

    return buffs;
  };

  const activeBuffs = getActiveBuffs();

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Buffs Ativos */}
        {activeBuffs.length > 0 && (
          <Card className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <Sparkles className="h-5 w-5" />
                Buffs Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeBuffs.map((buff) => (
                  <div
                    key={buff.id}
                    className="flex items-center gap-3 rounded-lg bg-white/50 p-3 dark:bg-gray-800/50"
                  >
                    <span className="text-2xl">{buff.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-yellow-800 dark:text-yellow-200">
                        {buff.name}
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {buff.description}
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        {buff.id === "streak_protection"
                          ? "Proteção ativa"
                          : `Expira em: ${buff.timeRemaining}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-title1 mb-2 font-bold">🎒 Inventário</h1>
              <p className="text-paragraph text-muted-foreground">
                Gerencie seus itens e recompensas adquiridas!
              </p>
            </div>

            {/* Total de Itens */}
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-800 dark:bg-blue-950/30">
              <Package className="h-5 w-5 text-blue-500" />
              <span className="text-title3 font-semibold text-blue-600 dark:text-blue-400">
                {user.inventory.length} itens
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-paragraph flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${tab.color}`} />
                  <span>{tab.name}</span>
                  <span className="text-muted-foreground text-paragraph">
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Itens */}
        {filteredItems.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-title2 mb-2 font-semibold">
              {activeTab === "consumable" && "Nenhum item consumível"}
              {activeTab === "permanent" && "Nenhum item permanente"}
              {activeTab === "history" && "Nenhum item usado"}
            </h3>
            <p className="text-paragraph text-muted-foreground">
              {activeTab === "consumable" &&
                "Compre itens consumíveis na loja!"}
              {activeTab === "permanent" &&
                "Adquira itens permanentes na loja!"}
              {activeTab === "history" &&
                "Itens que você usou aparecerão aqui."}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <InventoryItemCard
                key={`${item.id}-${item.acquiredAt}`}
                item={item}
                onUse={handleUseItem}
                tab={activeTab}
              />
            ))}
          </div>
        )}

        {/* Modal de Usar Item */}
        <UseItemModal
          isOpen={isUseModalOpen}
          onClose={() => setIsUseModalOpen(false)}
          item={selectedItem}
          onConfirm={handleConfirmUse}
        />
      </div>
    </div>
  );
}

// ========== COMPONENTE DE CARD DE ITEM DO INVENTÁRIO ==========

interface InventoryItemCardProps {
  item: Item;
  onUse: (item: Item) => void;
  tab: InventoryTab;
}

function InventoryItemCard({ item, onUse, tab }: InventoryItemCardProps) {
  // const getCategoryIcon = (category: ItemCategory) => {
  //   // Função não usada atualmente - removida para limpar warnings
  // };

  const getCategoryColor = (category: ItemCategory) => {
    switch (category) {
      case "protection":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
      case "boost":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
      case "attribute":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200";
      case "reward":
        return "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200";
      case "special":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200";
    }
  };

  const getCategoryLabel = (category: ItemCategory) => {
    const labels = {
      protection: "Proteção",
      boost: "Buff",
      attribute: "Atributo",
      reward: "Recompensa",
      special: "Especial",
    };
    return labels[category];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // const CategoryIcon = getCategoryIcon(item.category); // Não usado atualmente
  const canUse =
    item.type === "consumable" && !item.usedAt && tab !== "history";

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="mb-3 flex items-start justify-between">
          <div className="text-4xl">{item.icon}</div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={`text-paragraph rounded-full px-2 py-1 font-medium ${getCategoryColor(item.category)}`}
            >
              {getCategoryLabel(item.category)}
            </span>
            {item.quantity && item.quantity > 1 && (
              <span className="text-paragraph rounded-full bg-blue-100 px-2 py-0.5 font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                x{item.quantity}
              </span>
            )}
          </div>
        </div>
        <CardTitle className="text-title3 text-foreground">
          {item.name}
        </CardTitle>
        <p className="text-paragraph text-muted-foreground">
          {item.description}
        </p>
      </CardHeader>

      <CardContent className="mt-auto pt-2">
        {/* Data de Aquisição */}
        {item.acquiredAt && (
          <div className="text-paragraph text-muted-foreground mb-3 flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>Adquirido em {formatDate(item.acquiredAt)}</span>
          </div>
        )}

        {/* Data de Uso (para histórico) */}
        {item.usedAt && (
          <div className="text-paragraph mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
            <Zap className="h-3 w-3" />
            <span>Usado em {formatDate(item.usedAt)}</span>
          </div>
        )}

        {/* Botão de Ação */}
        {canUse ? (
          <Button
            onClick={() => onUse(item)}
            className="bg-primary hover:bg-primary/90 w-full"
          >
            🎯 Usar Item
          </Button>
        ) : tab === "history" ? (
          <div className="text-paragraph text-muted-foreground text-center">
            ✅ Já foi usado
          </div>
        ) : (
          <div className="text-paragraph text-muted-foreground text-center">
            {item.type === "permanent"
              ? "💎 Item permanente"
              : "❌ Não pode usar"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
