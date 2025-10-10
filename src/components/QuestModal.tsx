"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { X } from "lucide-react";

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quest: QuestFormData) => void;
  initialData?: QuestFormData;
  mode: "create" | "edit";
}

export interface QuestFormData {
  title: string;
  description: string;
  category: string;
  xpReward: number;
  coinReward: number;
  icon: string;
  type: "daily" | "weekly" | "one-time";
}

const CATEGORIES = [
  "Saúde",
  "Estudo",
  "Social",
  "Produtividade",
  "Bem-estar",
  "Exercício",
  "Leitura",
  "Trabalho",
  "Criatividade",
  "Outro",
];

const ICONS = ["💪", "📚", "🧘", "💧", "🤝", "🎯", "🏃", "🧠", "🎨", "⚡"];

export function QuestModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: QuestModalProps) {
  const [formData, setFormData] = useState<QuestFormData>(
    initialData || {
      title: "",
      description: "",
      category: "Saúde",
      xpReward: 50,
      coinReward: 10,
      icon: "🎯",
      type: "daily",
    },
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }
    if (formData.xpReward < 1) {
      newErrors.xpReward = "XP deve ser maior que 0";
    }
    if (formData.coinReward < 0) {
      newErrors.coinReward = "Moedas não podem ser negativas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-title2">
                  {mode === "create" ? "Criar Nova Quest" : "Editar Quest"}
                </CardTitle>
                <CardDescription className="text-paragraph mt-1">
                  {mode === "create"
                    ? "Crie uma quest personalizada para suas metas"
                    : "Atualize as informações da quest"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Título */}
              <div>
                <label className="text-title3 mb-2 block font-medium">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="text-title3 border-border bg-background focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Ex: Exercitar-se por 30 minutos"
                />
                {errors.title && (
                  <p className="text-paragraph text-destructive mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Descrição */}
              <div>
                <label className="text-title3 mb-2 block font-medium">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="text-paragraph border-border bg-background focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                  placeholder="Descreva o que precisa ser feito..."
                />
                {errors.description && (
                  <p className="text-paragraph text-destructive mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Categoria e Ícone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-title3 mb-2 block font-medium">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="text-title3 border-border bg-background focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-title3 mb-2 block font-medium">
                    Ícone
                  </label>
                  <div className="flex gap-2">
                    {ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon })}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-colors ${
                          formData.icon === icon
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* XP e Moedas */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-title3 mb-2 block font-medium">
                    Recompensa XP
                  </label>
                  <input
                    type="number"
                    value={formData.xpReward}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        xpReward: parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                    className="text-title3 border-border bg-background focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                  {errors.xpReward && (
                    <p className="text-paragraph text-destructive mt-1">
                      {errors.xpReward}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-title3 mb-2 block font-medium">
                    Recompensa Moedas
                  </label>
                  <input
                    type="number"
                    value={formData.coinReward}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coinReward: parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="text-title3 border-border bg-background focus:ring-primary w-full rounded-lg border px-3 py-2 focus:ring-2 focus:outline-none"
                  />
                  {errors.coinReward && (
                    <p className="text-paragraph text-destructive mt-1">
                      {errors.coinReward}
                    </p>
                  )}
                </div>
              </div>

              {/* Tipo */}
              <div>
                <label className="text-title3 mb-2 block font-medium">
                  Tipo de Quest
                </label>
                <div className="flex gap-2">
                  {(["daily", "weekly", "one-time"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type })}
                      className={`text-paragraph flex-1 rounded-lg border-2 px-3 py-2 transition-colors ${
                        formData.type === type
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {type === "daily"
                        ? "Diária"
                        : type === "weekly"
                          ? "Semanal"
                          : "Única"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <label className="text-title3 mb-2 block font-medium">
                  Preview
                </label>
                <Card className="border-2 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{formData.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-title3 mb-1 font-semibold">
                          {formData.title || "Título da Quest"}
                        </h3>
                        <p className="text-paragraph text-muted-foreground mb-2">
                          {formData.description || "Descrição da quest..."}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-paragraph text-yellow-600">
                            +{formData.xpReward} XP
                          </span>
                          <span className="text-paragraph coin-text text-amber-600">
                            <span className="coin-emoji">🪙</span>{" "}
                            {formData.coinReward}
                          </span>
                          <span className="text-paragraph bg-primary/10 text-primary rounded-full px-2 py-0.5">
                            {formData.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {mode === "create" ? "Criar Quest" : "Salvar Alterações"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
