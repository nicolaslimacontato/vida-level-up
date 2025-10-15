"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check, AlertCircle } from "lucide-react";

export interface QuestFormData {
  id?: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  category: "daily" | "weekly" | "main" | "special";
  icon?: string;
  attributeBonus?: "strength" | "intelligence" | "charisma" | "discipline";
}

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quest: QuestFormData) => Promise<boolean>;
  initialData?: QuestFormData;
  mode: "create" | "edit";
  existingQuests?: QuestFormData[]; // Para validação de título único
}

export function QuestModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
  existingQuests = [],
}: QuestModalProps) {
  const [formData, setFormData] = useState<QuestFormData>({
    title: "",
    description: "",
    xpReward: 25,
    coinReward: 10,
    category: "daily",
    icon: "🎯",
    attributeBonus: "strength",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categorias disponíveis
  const CATEGORIES = [
    { value: "daily", label: "Diária", icon: "📅" },
    { value: "weekly", label: "Semanal", icon: "📊" },
  ];

  // Atributos disponíveis
  const ATTRIBUTES = [
    {
      value: "strength",
      label: "Força",
      icon: "💪",
      description: "Reduz XP necessário para level up",
    },
    {
      value: "intelligence",
      label: "Inteligência",
      icon: "🧠",
      description: "Bônus de XP em quests de estudo",
    },
    {
      value: "charisma",
      label: "Carisma",
      icon: "😎",
      description: "Desconto na loja",
    },
    {
      value: "discipline",
      label: "Disciplina",
      icon: "⚡",
      description: "Aumenta com manutenção de streak",
    },
  ];

  // Ícones disponíveis
  const ICONS = [
    "🎯",
    "💪",
    "🧠",
    "📚",
    "🏃",
    "🍎",
    "💧",
    "🌱",
    "🎨",
    "🎵",
    "🏠",
    "💼",
    "💰",
    "🎮",
    "📱",
    "☕",
    "🍳",
    "🧘",
    "🎭",
    "🌟",
  ];

  // Inicializar form com dados existentes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        xpReward: 25,
        coinReward: 10,
        category: "daily",
        icon: "🎯",
        attributeBonus: "strength",
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Validação em tempo real
  const validateField = (field: string, value: string | number) => {
    const newErrors = { ...errors };

    switch (field) {
      case "title":
        const titleValue = String(value);
        if (!titleValue.trim()) {
          newErrors.title = "Título é obrigatório";
        } else if (titleValue.length > 100) {
          newErrors.title = "Título deve ter no máximo 100 caracteres";
        } else if (titleValue.length < 3) {
          newErrors.title = "Título deve ter pelo menos 3 caracteres";
        } else {
          // Verificar se título é único (excluindo a quest atual se estiver editando)
          const isDuplicate = existingQuests.some(
            (quest) =>
              quest.title.toLowerCase() === titleValue.toLowerCase() &&
              quest.id !== initialData?.id,
          );
          if (isDuplicate) {
            newErrors.title = "Já existe uma quest com este título";
          } else {
            delete newErrors.title;
          }
        }
        break;

      case "description":
        const descValue = String(value);
        if (!descValue.trim()) {
          newErrors.description = "Descrição é obrigatória";
        } else if (descValue.length > 500) {
          newErrors.description = "Descrição deve ter no máximo 500 caracteres";
        } else if (descValue.length < 10) {
          newErrors.description = "Descrição deve ter pelo menos 10 caracteres";
        } else {
          delete newErrors.description;
        }
        break;

      case "xpReward":
        const xpValue = Number(value);
        if (isNaN(xpValue) || xpValue <= 0) {
          newErrors.xpReward = "XP deve ser um número maior que 0";
        } else if (xpValue > 9999) {
          newErrors.xpReward = "XP deve ser no máximo 9999";
        } else {
          delete newErrors.xpReward;
        }
        break;

      case "coinReward":
        const coinValue = Number(value);
        if (isNaN(coinValue) || coinValue <= 0) {
          newErrors.coinReward = "Moedas devem ser um número maior que 0";
        } else if (coinValue > 9999) {
          newErrors.coinReward = "Moedas devem ser no máximo 9999";
        } else {
          delete newErrors.coinReward;
        }
        break;

      case "category":
        if (!value) {
          newErrors.category = "Categoria é obrigatória";
        } else {
          delete newErrors.category;
        }
        break;

      case "icon":
        if (!value) {
          newErrors.icon = "Ícone é obrigatório";
        } else {
          delete newErrors.icon;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (
    field: keyof QuestFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos os campos
    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof QuestFormData];
      if (value !== undefined) {
        validateField(field, value);
      }
    });

    // Verificar se há erros
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
      // Se falhou, o toast já foi mostrado na página pai
    } catch (error) {
      console.error("Erro ao salvar quest:", error);
      // Erro ao salvar quest
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.title.trim() &&
    formData.description.trim() &&
    formData.xpReward > 0 &&
    formData.coinReward > 0 &&
    formData.category &&
    formData.icon &&
    formData.attributeBonus;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-title1 font-bold">
              {mode === "create" ? "🎯 Criar Nova Quest" : "✏️ Editar Quest"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <label className="text-title3 font-semibold">
                Título da Quest
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Exercitar-se por 30 minutos"
                className={errors.title ? "border-red-500" : ""}
                maxLength={100}
              />
              {errors.title && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-paragraph">{errors.title}</span>
                </div>
              )}
              <div className="text-paragraph text-muted-foreground">
                {formData.title.length}/100 caracteres
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-title3 font-semibold">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Descreva o que precisa ser feito para completar esta quest..."
                className={`placeholder:text-muted-foreground focus:ring-ring min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                  errors.description
                    ? "border-red-500"
                    : "border-input bg-background"
                }`}
                maxLength={500}
              />
              {errors.description && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-paragraph">{errors.description}</span>
                </div>
              )}
              <div className="text-paragraph text-muted-foreground">
                {formData.description.length}/500 caracteres
              </div>
            </div>

            {/* XP e Moedas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-title3 font-semibold">XP Reward</label>
                <Input
                  type="number"
                  value={formData.xpReward}
                  onChange={(e) =>
                    handleInputChange("xpReward", parseInt(e.target.value) || 0)
                  }
                  placeholder="25"
                  min="1"
                  max="9999"
                  className={errors.xpReward ? "border-red-500" : ""}
                />
                {errors.xpReward && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-paragraph">{errors.xpReward}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-title3 font-semibold">Moedas</label>
                <Input
                  type="number"
                  value={formData.coinReward}
                  onChange={(e) =>
                    handleInputChange(
                      "coinReward",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  placeholder="10"
                  min="1"
                  max="9999"
                  className={errors.coinReward ? "border-red-500" : ""}
                />
                {errors.coinReward && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-paragraph">{errors.coinReward}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <label className="text-title3 font-semibold">Categoria</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("category", category.value)
                    }
                    className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-colors ${
                      formData.category === category.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-title3 font-semibold">
                      {category.label}
                    </span>
                  </button>
                ))}
              </div>
              {errors.category && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-paragraph">{errors.category}</span>
                </div>
              )}
            </div>

            {/* Atributo */}
            <div className="space-y-2">
              <label className="text-title3 font-semibold">
                Atributo Bonus
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ATTRIBUTES.map((attribute) => (
                  <button
                    key={attribute.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("attributeBonus", attribute.value)
                    }
                    className={`flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-left transition-colors ${
                      formData.attributeBonus === attribute.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl">{attribute.icon}</span>
                    <div className="text-center">
                      <span className="text-title3 font-semibold">
                        {attribute.label}
                      </span>
                      <p className="text-paragraph text-muted-foreground text-xs">
                        {attribute.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ícone */}
            <div className="space-y-2">
              <label className="text-title3 font-semibold">Ícone</label>
              <div className="grid grid-cols-10 gap-2">
                {ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleInputChange("icon", icon)}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-2xl transition-colors ${
                      formData.icon === icon
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              {errors.icon && (
                <div className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-paragraph">{errors.icon}</span>
                </div>
              )}
            </div>

            {/* Preview da Quest */}
            <div className="space-y-2">
              <label className="text-title3 font-semibold">Preview</label>
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{formData.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-title3 font-semibold">
                      {formData.title || "Título da Quest"}
                    </h3>
                    <p className="text-paragraph text-muted-foreground mt-1">
                      {formData.description || "Descrição da quest..."}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-paragraph bg-primary/10 text-primary rounded-full px-2 py-0.5">
                        {CATEGORIES.find((c) => c.value === formData.category)
                          ?.label || "Categoria"}
                      </span>
                      <span className="text-paragraph text-yellow-600">
                        +{formData.xpReward} XP
                      </span>
                      <span className="text-paragraph coin-text text-amber-600">
                        <span className="coin-emoji">🪙</span>{" "}
                        {formData.coinReward}
                      </span>
                      {formData.attributeBonus && (
                        <span className="text-paragraph rounded-full bg-purple-100 px-2 py-0.5 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {
                            ATTRIBUTES.find(
                              (a) => a.value === formData.attributeBonus,
                            )?.icon
                          }{" "}
                          {
                            ATTRIBUTES.find(
                              (a) => a.value === formData.attributeBonus,
                            )?.label
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 flex-1"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Salvando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {mode === "create" ? "Criar Quest" : "Salvar Alterações"}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
