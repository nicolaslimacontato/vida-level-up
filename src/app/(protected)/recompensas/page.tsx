"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Filter,
  Zap,
  Star,
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { useRPGContext } from "@/contexts/RPGContext";
import { Upgrade, UpgradeCategory } from "@/types/rpg";

export default function RecompensasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Hooks
  const { success, error } = useToast();
  const { user, upgrades, purchaseUpgrade, toggleUpgrade } = useRPGContext();

  // Filtrar upgrades
  const filteredUpgrades = upgrades.filter((upgrade) => {
    const matchesSearch =
      upgrade.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      upgrade.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || upgrade.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Função para verificar se tem atributos suficientes
  const hasEnoughAttributes = (upgrade: Upgrade): boolean => {
    return (
      (!upgrade.attributeCost.strength ||
        user.attributes.strength >= upgrade.attributeCost.strength) &&
      (!upgrade.attributeCost.intelligence ||
        user.attributes.intelligence >= upgrade.attributeCost.intelligence) &&
      (!upgrade.attributeCost.charisma ||
        user.attributes.charisma >= upgrade.attributeCost.charisma) &&
      (!upgrade.attributeCost.discipline ||
        user.attributes.discipline >= upgrade.attributeCost.discipline)
    );
  };

  // Ordenar upgrades: disponíveis primeiro, depois comprados, depois bloqueados
  const sortedUpgrades = [...filteredUpgrades].sort((a, b) => {
    // Primeiro: disponíveis (não comprados e tem atributos)
    const aAvailable = !a.purchased && hasEnoughAttributes(a);
    const bAvailable = !b.purchased && hasEnoughAttributes(b);

    if (aAvailable && !bAvailable) return -1;
    if (!aAvailable && bAvailable) return 1;

    // Segundo: comprados
    if (a.purchased && !b.purchased) return -1;
    if (!a.purchased && b.purchased) return 1;

    // Terceiro: bloqueados (por ordem de categoria)
    return a.category.localeCompare(b.category);
  });

  const handlePurchaseUpgrade = async (upgrade: Upgrade) => {
    if (!hasEnoughAttributes(upgrade)) {
      error(
        "Atributos insuficientes",
        `Você precisa de mais atributos para desbloquear "${upgrade.name}".`,
      );
      return;
    }

    const success_purchase = await purchaseUpgrade(upgrade.id);
    if (success_purchase) {
      success(
        "Upgrade desbloqueado!",
        `"${upgrade.name}" foi desbloqueado com sucesso!`,
      );
    } else {
      error("Erro", "Não foi possível desbloquear o upgrade.");
    }
  };

  const handleToggleUpgrade = async (upgrade: Upgrade) => {
    const success_toggle = await toggleUpgrade(upgrade.id, !upgrade.isActive);
    if (success_toggle) {
      success(
        upgrade.isActive ? "Upgrade desativado" : "Upgrade ativado",
        `"${upgrade.name}" foi ${upgrade.isActive ? "desativado" : "ativado"}.`,
      );
    } else {
      error("Erro", "Não foi possível alterar o estado do upgrade.");
    }
  };

  const getCategoryIcon = (category: UpgradeCategory) => {
    switch (category) {
      case "streak":
        return "⚡";
      case "xp":
        return "🧠";
      case "coins":
        return "💰";
      case "protection":
        return "🛡️";
      case "multiplier":
        return "✨";
      default:
        return "🎁";
    }
  };

  const getCategoryColor = (category: UpgradeCategory) => {
    switch (category) {
      case "streak":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "xp":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "coins":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "protection":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "multiplier":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryLabel = (category: UpgradeCategory) => {
    switch (category) {
      case "streak":
        return "Streak";
      case "xp":
        return "XP";
      case "coins":
        return "Moedas";
      case "protection":
        return "Proteção";
      case "multiplier":
        return "Multiplicador";
      default:
        return "Outros";
    }
  };

  const formatAttributeCost = (upgrade: Upgrade): string => {
    const costs = [];
    if (upgrade.attributeCost.strength) {
      costs.push(`💪 ${upgrade.attributeCost.strength}`);
    }
    if (upgrade.attributeCost.intelligence) {
      costs.push(`🧠 ${upgrade.attributeCost.intelligence}`);
    }
    if (upgrade.attributeCost.charisma) {
      costs.push(`😎 ${upgrade.attributeCost.charisma}`);
    }
    if (upgrade.attributeCost.discipline) {
      costs.push(`⚡ ${upgrade.attributeCost.discipline}`);
    }
    return costs.join(" + ");
  };

  const getUpgradeStatus = (upgrade: Upgrade) => {
    if (upgrade.purchased) {
      return upgrade.isActive ? "active" : "inactive";
    }
    return hasEnoughAttributes(upgrade) ? "available" : "blocked";
  };

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-title1 mb-2 flex items-center gap-3 font-bold">
            <Zap className="h-8 w-8 text-purple-500" />
            Upgrades Permanentes
          </h1>
          <p className="text-paragraph text-muted-foreground">
            Desbloqueie poderes permanentes usando seus atributos como moeda
          </p>
        </div>

        {/* Atributos disponíveis */}
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardContent className="py-4">
            <h3 className="mb-3 font-semibold">Seus Atributos</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl">💪</div>
                <div className="text-lg font-bold text-red-600">
                  {user.attributes.strength}
                </div>
                <div className="text-muted-foreground text-xs">Força</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">🧠</div>
                <div className="text-lg font-bold text-blue-600">
                  {user.attributes.intelligence}
                </div>
                <div className="text-muted-foreground text-xs">
                  Inteligência
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl">😎</div>
                <div className="text-lg font-bold text-pink-600">
                  {user.attributes.charisma}
                </div>
                <div className="text-muted-foreground text-xs">Carisma</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">⚡</div>
                <div className="text-lg font-bold text-yellow-600">
                  {user.attributes.discipline}
                </div>
                <div className="text-muted-foreground text-xs">Disciplina</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar upgrades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-input bg-background focus:ring-ring w-full rounded-md border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Filtros Avançados */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filtros Avançados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="all">Todas</option>
                    <option value="streak">⚡ Streak</option>
                    <option value="xp">🧠 XP</option>
                    <option value="coins">💰 Moedas</option>
                    <option value="protection">🛡️ Proteção</option>
                    <option value="multiplier">✨ Multiplicador</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        <div className="space-y-6">
          {sortedUpgrades.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">
                  Nenhum upgrade encontrado
                </h3>
                <p className="text-muted-foreground mb-4 text-center">
                  {searchQuery || selectedCategory !== "all"
                    ? "Tente ajustar os filtros de busca."
                    : "Continue desenvolvendo seus atributos para desbloquear novos upgrades."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedUpgrades.map((upgrade) => {
                const status = getUpgradeStatus(upgrade);
                const isBlocked = status === "blocked";
                const isAvailable = status === "available";
                const isActive = status === "active";
                const isInactive = status === "inactive";

                return (
                  <Card
                    key={upgrade.id}
                    className={`group flex min-h-[400px] flex-col transition-all ${
                      isBlocked
                        ? "opacity-60"
                        : isActive
                          ? "shadow-lg ring-2 ring-green-500"
                          : isAvailable
                            ? "shadow-lg ring-2 ring-blue-500"
                            : "hover:shadow-lg"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{upgrade.icon}</span>
                          <div>
                            <CardTitle className="mb-1 text-lg">
                              {upgrade.name}
                            </CardTitle>
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(upgrade.category)}`}
                            >
                              {getCategoryIcon(upgrade.category)}{" "}
                              {getCategoryLabel(upgrade.category)}
                            </span>
                          </div>
                        </div>

                        {/* Status Icon */}
                        <div className="flex items-center">
                          {isBlocked && (
                            <Lock className="h-5 w-5 text-red-500" />
                          )}
                          {isAvailable && (
                            <Unlock className="h-5 w-5 text-blue-500" />
                          )}
                          {isActive && (
                            <div className="rounded-full bg-green-500 p-1">
                              <Star className="h-3 w-3 text-white" />
                            </div>
                          )}
                          {isInactive && (
                            <div className="rounded-full bg-gray-400 p-1">
                              <ToggleLeft className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col space-y-4">
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {upgrade.description}
                      </p>

                      {/* Custo em atributos */}
                      <div className="bg-muted rounded-lg p-3">
                        <div className="text-muted-foreground mb-1 text-xs font-medium">
                          Custo:
                        </div>
                        <div className="text-sm font-semibold">
                          {formatAttributeCost(upgrade)}
                        </div>
                      </div>

                      {/* Botões de ação */}
                      <div className="mt-auto flex items-center justify-between">
                        {isBlocked && (
                          <div className="text-muted-foreground flex w-full items-center justify-center gap-2">
                            <Lock className="h-4 w-4" />
                            <span className="text-sm">Bloqueado</span>
                          </div>
                        )}

                        {isAvailable && (
                          <Button
                            onClick={() => handlePurchaseUpgrade(upgrade)}
                            className="w-full"
                          >
                            <Unlock className="mr-2 h-4 w-4" />
                            Desbloquear
                          </Button>
                        )}

                        {upgrade.purchased && upgrade.isPermanent && (
                          <div className="flex w-full items-center justify-center gap-2 text-green-600">
                            <Star className="h-4 w-4" />
                            <span className="text-sm font-medium">Ativo</span>
                          </div>
                        )}

                        {upgrade.purchased && !upgrade.isPermanent && (
                          <Button
                            onClick={() => handleToggleUpgrade(upgrade)}
                            variant={isActive ? "default" : "outline"}
                            className="w-full"
                          >
                            {isActive ? (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Ativar
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
