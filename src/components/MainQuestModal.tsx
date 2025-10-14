"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export interface MainQuestFormData {
  id?: string;
  title: string;
  description: string;
  category: "mensal" | "trimestral" | "semestral" | "anual";
  xpReward: number;
  coinReward: number;
  steps: Array<{
    id?: string;
    title: string;
    description: string;
    xpReward: number;
    coinReward: number;
  }>;
}

interface MainQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MainQuestFormData) => Promise<boolean>;
  editingQuest?: MainQuestFormData | null;
}

export function MainQuestModal({
  isOpen,
  onClose,
  onSave,
  editingQuest,
}: MainQuestModalProps) {
  const [formData, setFormData] = useState<MainQuestFormData>({
    title: "",
    description: "",
    category: "mensal",
    xpReward: 300,
    coinReward: 100,
    steps: [
      {
        title: "",
        description: "",
        xpReward: 100,
        coinReward: 25,
      },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens/closes or editing quest changes
  useEffect(() => {
    if (isOpen) {
      if (editingQuest) {
        setFormData(editingQuest);
      } else {
        setFormData({
          title: "",
          description: "",
          category: "mensal",
          xpReward: 300,
          coinReward: 100,
          steps: [
            {
              title: "",
              description: "",
              xpReward: 100,
              coinReward: 25,
            },
          ],
        });
      }
      setErrors({});
    }
  }, [isOpen, editingQuest]);

  const validateField = (name: string, value: string | number) => {
    switch (name) {
      case "title":
        if (!String(value).trim()) return "Título é obrigatório";
        if (String(value).trim().length < 3)
          return "Título deve ter pelo menos 3 caracteres";
        if (String(value).trim().length > 100)
          return "Título deve ter no máximo 100 caracteres";
        return "";
      case "description":
        if (!String(value).trim()) return "Descrição é obrigatória";
        if (String(value).trim().length < 10)
          return "Descrição deve ter pelo menos 10 caracteres";
        if (String(value).trim().length > 500)
          return "Descrição deve ter no máximo 500 caracteres";
        return "";
      case "xpReward":
        const xp = Number(value);
        if (isNaN(xp) || xp < 100) return "XP deve ser pelo menos 100";
        if (xp > 2000) return "XP deve ser no máximo 2000";
        return "";
      case "coinReward":
        const coins = Number(value);
        if (isNaN(coins) || coins < 25) return "Moedas devem ser pelo menos 25";
        if (coins > 1000) return "Moedas devem ser no máximo 1000";
        return "";
      default:
        return "";
    }
  };

  const validateStep = (
    step: {
      title: string;
      description: string;
      xpReward: number;
      coinReward: number;
    },
    index: number,
  ) => {
    const stepErrors: Record<string, string> = {};

    if (!step.title.trim()) {
      stepErrors[`step-${index}-title`] = "Título do step é obrigatório";
    }
    if (!step.description.trim()) {
      stepErrors[`step-${index}-description`] =
        "Descrição do step é obrigatória";
    }
    if (step.xpReward < 25 || step.xpReward > 500) {
      stepErrors[`step-${index}-xpReward`] =
        "XP do step deve estar entre 25 e 500";
    }
    if (step.coinReward < 10 || step.coinReward > 200) {
      stepErrors[`step-${index}-coinReward`] =
        "Moedas do step devem estar entre 10 e 200";
    }

    return stepErrors;
  };

  const handleInputChange = (
    name: string,
    value: string | number,
    stepIndex?: number,
  ) => {
    if (stepIndex !== undefined) {
      // Atualizando step
      setFormData((prev) => ({
        ...prev,
        steps: prev.steps.map((step, index) =>
          index === stepIndex ? { ...step, [name]: value } : step,
        ),
      }));
    } else {
      // Atualizando dados principais
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Validar campo em tempo real
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const addStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          title: "",
          description: "",
          xpReward: 100,
          coinReward: 25,
        },
      ],
    }));
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      setFormData((prev) => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validar todos os campos
    const newErrors: Record<string, string> = {};

    // Validar campos principais
    Object.keys(formData).forEach((key) => {
      if (key !== "steps" && key !== "id") {
        const error = validateField(
          key,
          formData[key as keyof MainQuestFormData] as string | number,
        );
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    // Validar steps
    formData.steps.forEach((step, index) => {
      const stepErrors = validateStep(step, index);
      Object.assign(newErrors, stepErrors);
    });

    // Verificar se há pelo menos 2 steps
    if (formData.steps.length < 2) {
      newErrors.steps = "Deve ter pelo menos 2 steps";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingQuest
              ? "Editar Missão Principal"
              : "Criar Missão Principal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Completar Certificação Profissional"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(
                  value: "mensal" | "trimestral" | "semestral" | "anual",
                ) => handleInputChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mensal">Mensal</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva os objetivos e detalhes da missão..."
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Recompensas */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="xpReward">XP de Recompensa *</Label>
              <Input
                id="xpReward"
                type="number"
                value={formData.xpReward}
                onChange={(e) =>
                  handleInputChange("xpReward", Number(e.target.value))
                }
                min="100"
                max="2000"
                className={errors.xpReward ? "border-red-500" : ""}
              />
              {errors.xpReward && (
                <p className="text-sm text-red-500">{errors.xpReward}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coinReward">Moedas de Recompensa *</Label>
              <Input
                id="coinReward"
                type="number"
                value={formData.coinReward}
                onChange={(e) =>
                  handleInputChange("coinReward", Number(e.target.value))
                }
                min="25"
                max="1000"
                className={errors.coinReward ? "border-red-500" : ""}
              />
              {errors.coinReward && (
                <p className="text-sm text-red-500">{errors.coinReward}</p>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Steps da Missão *</Label>
              <Button type="button" onClick={addStep} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Adicionar Step
              </Button>
            </div>

            {errors.steps && (
              <p className="text-sm text-red-500">{errors.steps}</p>
            )}

            <div className="max-h-96 space-y-4 overflow-y-auto">
              {formData.steps.map((step, index) => (
                <Card key={index} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Step {index + 1}
                      </CardTitle>
                      {formData.steps.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStep(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Título do Step *</Label>
                        <Input
                          value={step.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value, index)
                          }
                          placeholder="Ex: Escolher a certificação"
                          className={
                            errors[`step-${index}-title`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors[`step-${index}-title`] && (
                          <p className="text-sm text-red-500">
                            {errors[`step-${index}-title`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Descrição do Step *</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) =>
                            handleInputChange(
                              "description",
                              e.target.value,
                              index,
                            )
                          }
                          placeholder="Descreva o que precisa ser feito..."
                          rows={2}
                          className={
                            errors[`step-${index}-description`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors[`step-${index}-description`] && (
                          <p className="text-sm text-red-500">
                            {errors[`step-${index}-description`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>XP do Step *</Label>
                        <Input
                          type="number"
                          value={step.xpReward}
                          onChange={(e) =>
                            handleInputChange(
                              "xpReward",
                              Number(e.target.value),
                              index,
                            )
                          }
                          min="25"
                          max="500"
                          className={
                            errors[`step-${index}-xpReward`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors[`step-${index}-xpReward`] && (
                          <p className="text-sm text-red-500">
                            {errors[`step-${index}-xpReward`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Moedas do Step *</Label>
                        <Input
                          type="number"
                          value={step.coinReward}
                          onChange={(e) =>
                            handleInputChange(
                              "coinReward",
                              Number(e.target.value),
                              index,
                            )
                          }
                          min="10"
                          max="200"
                          className={
                            errors[`step-${index}-coinReward`]
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors[`step-${index}-coinReward`] && (
                          <p className="text-sm text-red-500">
                            {errors[`step-${index}-coinReward`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : editingQuest ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
