"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Search,
  Filter,
  Coins,
  Shield,
  Zap,
  TrendingUp,
  Gift,
  Sparkles,
} from "lucide-react";
import { SHOP_ITEMS, getItemsByCategory, searchItems } from "@/data/shopItems";
import { ItemCategory } from "@/types/rpg";
import { useRPGContext } from "@/contexts/RPGContext";
import { useToast } from "@/components/Toast";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Hook do RPG (via contexto compartilhado)
  const { user, buyItem, getCharismaDiscount } = useRPGContext();

  // Hook de notificações
  const { success, error, info } = useToast();

  // Função wrapper para compra com notificações
  const handlePurchase = (itemId: string) => {
    const item = SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) {
      error("Erro", "Item não encontrado.");
      return;
    }

    const discount = getCharismaDiscount(user.attributes.charisma);
    const finalPrice = Math.floor(item.price * (1 - discount / 100));

    if (user.coins < finalPrice) {
      error(
        "Moedas Insuficientes",
        "Você não tem moedas suficientes para comprar este item.",
      );
      return;
    }

    try {
      buyItem(item);
      success("Item Comprado!", `${item.name} foi adicionado ao inventário.`);

      if (discount > 0) {
        info("Desconto Aplicado!", `${discount}% de desconto por Carisma!`);
      }
    } catch {
      error("Erro", "Não foi possível comprar o item.");
    }
  };

  // Filtrar itens
  const filteredItems =
    searchQuery.length > 0
      ? searchItems(searchQuery)
      : getItemsByCategory(selectedCategory);

  const categories = [
    { id: "all", name: "Todos", icon: ShoppingBag, color: "text-blue-500" },
    {
      id: "protection",
      name: "Proteção",
      icon: Shield,
      color: "text-green-500",
    },
    { id: "boost", name: "Buffs", icon: Zap, color: "text-yellow-500" },
    {
      id: "attribute",
      name: "Atributos",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    { id: "reward", name: "Recompensas", icon: Gift, color: "text-pink-500" },
    {
      id: "special",
      name: "Especiais",
      icon: Sparkles,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-title1 mb-2 font-bold">🛒 Loja de Itens</h1>
              <p className="text-paragraph text-muted-foreground">
                Compre itens especiais para turbinar sua jornada!
              </p>
            </div>

            {/* Saldo de Moedas */}
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-950/30">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="coin-text text-title3 font-semibold text-amber-600 dark:text-amber-400">
                <span className="coin-emoji">🪙</span> {user.coins}
              </span>
            </div>
          </div>

          {/* Busca e Filtros */}
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Busca */}
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Buscar itens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Botão de Filtros (mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>

        {/* Categorias */}
        <div className={`mb-6 ${showFilters ? "block" : "hidden"} sm:block`}>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-paragraph flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-colors ${
                    selectedCategory === cat.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${cat.color}`} />
                  <span>{cat.name}</span>
                  <span className="text-muted-foreground text-paragraph">
                    (
                    {
                      SHOP_ITEMS.filter(
                        (item) => cat.id === "all" || item.category === cat.id,
                      ).length
                    }
                    )
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Itens */}
        {filteredItems.length === 0 ? (
          <Card className="p-12 text-center">
            <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="text-title2 mb-2 font-semibold">
              Nenhum item encontrado
            </h3>
            <p className="text-paragraph text-muted-foreground">
              Tente buscar por outro termo ou categoria
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                userCoins={user.coins}
                charismaDiscount={getCharismaDiscount(user.attributes.charisma)}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== COMPONENTE DE CARD DE ITEM ==========

interface ItemCardProps {
  item: (typeof SHOP_ITEMS)[0];
  userCoins: number;
  charismaDiscount: number;
  onPurchase: (itemId: string) => void;
}

function ItemCard({
  item,
  userCoins,
  charismaDiscount,
  onPurchase,
}: ItemCardProps) {
  const finalPrice = Math.floor(item.price * (1 - charismaDiscount / 100));
  const canAfford = userCoins >= finalPrice;
  const hasDiscount = charismaDiscount > 0;

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

  return (
    <Card className="flex flex-col transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="mb-3 flex items-start justify-between">
          <div className="text-4xl">{item.icon}</div>
          <span
            className={`text-paragraph rounded-full px-2 py-1 font-medium ${getCategoryColor(item.category)}`}
          >
            {getCategoryLabel(item.category)}
          </span>
        </div>
        <CardTitle className="text-title3 text-foreground">
          {item.name}
        </CardTitle>
        <p className="text-paragraph text-muted-foreground">
          {item.description}
        </p>
      </CardHeader>

      <CardContent className="mt-auto pt-2">
        {/* Preço */}
        <div className="mb-3 flex flex-col items-center justify-center gap-1">
          {hasDiscount && (
            <div className="flex items-center gap-2">
              <span className="text-paragraph text-muted-foreground line-through">
                <span className="coin-emoji">🪙</span> {item.price}
              </span>
              <span className="text-paragraph rounded-full bg-green-100 px-2 py-0.5 font-bold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                -{charismaDiscount}% 😎
              </span>
            </div>
          )}
          <div className="rounded-full bg-amber-100 px-3 py-1.5 font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
            <span className="coin-text text-title3 font-bold">
              <span className="coin-emoji">🪙</span> {finalPrice}
            </span>
          </div>
        </div>

        {/* Botão de Comprar */}
        <Button
          onClick={() => onPurchase(item.id)}
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
          <p className="text-paragraph mt-2 text-center text-red-500 dark:text-red-400">
            Faltam <span className="coin-emoji">🪙</span>{" "}
            {finalPrice - userCoins}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
