"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  ToggleLeft,
  ToggleRight,
  Trophy,
  BookTemplate,
  Search,
  Filter,
  CheckCircle,
  Circle,
  Target,
} from "lucide-react";
import { MainQuestModal, MainQuestFormData } from "@/components/MainQuestModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useToast } from "@/components/Toast";
import { useRPGContext } from "@/contexts/RPGContext";
import {
  MAIN_QUEST_TEMPLATES,
  searchTemplates,
  getTemplatesByCategory,
  templateToMainQuest,
  MainQuestTemplate,
} from "@/data/mainQuestTemplates";
import { MainQuest } from "@/types/rpg";

export default function MissoesPrincipaisPage() {
  const [activeTab, setActiveTab] = useState<"active" | "templates">("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<
    MainQuestFormData | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [questToDelete, setQuestToDelete] = useState<MainQuest | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Hooks
  const { success, error, info } = useToast();
  const {
    mainQuests,
    addMainQuest,
    updateMainQuest,
    deleteMainQuest,
    duplicateMainQuest,
    completeMainQuestStep,
  } = useRPGContext();

  // Filtrar missões principais
  const filteredQuests = mainQuests.filter((quest) => {
    const matchesSearch =
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Filtrar templates
  const filteredTemplates =
    searchQuery.length > 0
      ? searchTemplates(searchQuery)
      : selectedCategory === "all"
        ? MAIN_QUEST_TEMPLATES
        : getTemplatesByCategory(selectedCategory);

  const handleSaveQuest = (questData: MainQuestFormData): Promise<boolean> => {
    return new Promise((resolve) => {
      if (editingQuest && editingQuest.id) {
        // Atualizar missão existente
        const questUpdated = updateMainQuest(editingQuest.id, {
          title: questData.title,
          description: questData.description,
          xpReward: questData.xpReward,
          coinReward: questData.coinReward,
          steps: questData.steps.map((step) => ({
            ...step,
            id: step.id || `step-${Date.now()}-${Math.random()}`,
            completed: false,
          })),
        });
        if (questUpdated) {
          setIsModalOpen(false);
          setEditingQuest(undefined);
          success("Missão atualizada!", "A missão foi atualizada com sucesso.");
          resolve(true);
        } else {
          error(
            "Erro ao atualizar missão",
            "Não foi possível atualizar a missão.",
          );
          resolve(false);
        }
      } else {
        // Criar nova missão
        const questToAdd = {
          title: questData.title,
          description: questData.description,
          xpReward: questData.xpReward,
          coinReward: questData.coinReward,
          steps: questData.steps.map((step) => ({
            ...step,
            id: `step-${Date.now()}-${Math.random()}`,
            completed: false,
          })),
        };
        const questCreated = addMainQuest(questToAdd);
        if (questCreated) {
          setIsModalOpen(false);
          success(
            "Missão criada!",
            "Nova missão principal foi criada com sucesso.",
          );
          resolve(true);
        } else {
          error("Erro ao criar missão", "Não foi possível criar a missão.");
          resolve(false);
        }
      }
    });
  };

  const handleEditQuest = (quest: MainQuest) => {
    setEditingQuest({
      id: quest.id,
      title: quest.title,
      description: quest.description,
      category: "mensal", // Default category for editing
      xpReward: quest.xpReward,
      coinReward: quest.coinReward,
      steps: quest.steps.map((step) => ({
        id: step.id,
        title: step.title,
        description: step.description,
        xpReward: step.xpReward,
        coinReward: step.coinReward,
      })),
    });
    setIsModalOpen(true);
  };

  const handleDuplicateQuest = (quest: MainQuest) => {
    const questDuplicated = duplicateMainQuest(quest.id);
    if (questDuplicated) {
      success("Missão duplicada!", "A missão foi duplicada com sucesso.");
    } else {
      error("Erro", "Não foi possível duplicar a missão.");
    }
  };

  const handleDeleteQuest = (quest: MainQuest) => {
    setQuestToDelete(quest);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteQuest = async () => {
    if (!questToDelete) return;

    setIsDeleting(true);
    try {
      const questDeleted = deleteMainQuest(questToDelete.id);
      if (questDeleted) {
        success("Missão deletada!", "A missão foi removida com sucesso.");
        setIsConfirmModalOpen(false);
        setQuestToDelete(null);
      } else {
        error("Erro", "Não foi possível deletar a missão.");
      }
    } catch {
      error("Erro", "Não foi possível deletar a missão.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUseTemplate = (template: MainQuestTemplate) => {
    const questData = templateToMainQuest(template);
    const questCreated = addMainQuest(questData);
    if (questCreated) {
      success(
        "Template usado!",
        `"${template.title}" foi adicionada às suas missões.`,
      );
      info(
        "Missão Adicionada!",
        `Template "${template.title}" foi aplicado com sucesso.`,
      );
    } else {
      error("Erro", "Não foi possível usar o template.");
    }
  };

  const handleCompleteStep = (questId: string, stepId: string) => {
    completeMainQuestStep(questId, stepId);
    success("Step completado!", "Progresso salvo com sucesso.");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mensal":
        return "📅";
      case "trimestral":
        return "📊";
      case "semestral":
        return "⏳";
      case "anual":
        return "🎯";
      default:
        return "📋";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mensal":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "trimestral":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "semestral":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "anual":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-title1 mb-2 flex items-center gap-3 font-bold">
            <Trophy className="h-8 w-8 text-purple-500" />
            Missões Principais
          </h1>
          <p className="text-paragraph text-muted-foreground">
            Objetivos de longo prazo para transformar sua vida
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="bg-muted flex space-x-1 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 transition-colors ${
                activeTab === "active"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Target className="h-4 w-4" />
              Ativas ({filteredQuests.length})
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 transition-colors ${
                activeTab === "templates"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookTemplate className="h-4 w-4" />
              Templates ({filteredTemplates.length})
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar missões..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-input bg-background focus:ring-ring w-full rounded-md border py-2 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none"
              />
            </div>

            {activeTab === "templates" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "active" && (
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Missão
              </Button>
            )}

            <div className="border-input flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-accent" : ""}
              >
                <ToggleRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-accent" : ""}
              >
                <ToggleLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros Avançados */}
        {activeTab === "templates" && showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Filtros Avançados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                    <option value="mensal">Mensal</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="semestral">Semestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {activeTab === "active" ? (
          <div className="space-y-6">
            {filteredQuests.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Trophy className="text-muted-foreground mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-lg font-semibold">
                    Nenhuma missão ativa
                  </h3>
                  <p className="text-muted-foreground mb-4 text-center">
                    Crie sua primeira missão principal ou use um template para
                    começar.
                  </p>
                  <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Missão
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 items-start gap-6 lg:grid-cols-2"
                    : "space-y-4"
                }
              >
                {filteredQuests.map((quest) => {
                  const completedSteps = quest.steps.filter(
                    (step) => step.completed,
                  ).length;
                  const progress = (completedSteps / quest.steps.length) * 100;

                  return (
                    <Card
                      key={quest.id}
                      className="group transition-shadow hover:shadow-lg"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="mb-2 text-lg">
                              {quest.title}
                            </CardTitle>
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                              {quest.description}
                            </p>
                          </div>
                          <div className="ml-4 flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditQuest(quest)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicateQuest(quest)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuest(quest)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="mb-1 flex justify-between text-sm">
                            <span>Progresso</span>
                            <span>
                              {completedSteps}/{quest.steps.length}
                            </span>
                          </div>
                          <div className="bg-secondary h-2 w-full rounded-full">
                            <div
                              className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Rewards */}
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-yellow-600">
                            +{quest.xpReward} XP
                          </span>
                          <span className="font-semibold text-amber-600">
                            🪙 {quest.coinReward}
                          </span>
                        </div>

                        {/* Steps */}
                        <div className="space-y-2">
                          {quest.steps.map((step) => (
                            <div
                              key={step.id}
                              className={`flex items-center gap-3 rounded-lg p-2 ${
                                step.completed
                                  ? "bg-green-50 dark:bg-green-900/20"
                                  : "bg-muted"
                              }`}
                            >
                              {step.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Circle className="text-muted-foreground h-4 w-4" />
                              )}
                              <div className="flex-1">
                                <p
                                  className={`text-sm font-medium ${
                                    step.completed
                                      ? "text-green-800 dark:text-green-200"
                                      : ""
                                  }`}
                                >
                                  {step.title}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  +{step.xpReward} XP • 🪙 {step.coinReward}
                                </p>
                              </div>
                              {!step.completed && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleCompleteStep(quest.id, step.id)
                                  }
                                >
                                  Completar
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredTemplates.map((template, index) => (
              <Card
                key={index}
                className="group flex min-h-[400px] flex-col transition-shadow hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="mb-2 text-lg">
                    {template.title}
                  </CardTitle>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {template.description}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col space-y-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(template.category)}`}
                    >
                      {getCategoryIcon(template.category)} {template.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold text-yellow-600">
                      +{template.xpReward} XP
                    </span>
                    <span className="font-semibold text-amber-600">
                      🪙 {template.coinReward}
                    </span>
                  </div>

                  <div className="text-muted-foreground text-xs">
                    {template.steps.length} steps
                  </div>

                  <Button
                    className="mt-auto w-full"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Usar Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modals */}
        <MainQuestModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingQuest(undefined);
          }}
          onSave={handleSaveQuest}
          editingQuest={editingQuest}
        />

        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmDeleteQuest}
          title="Deletar Missão"
          message={`Tem certeza que deseja deletar "${questToDelete?.title}"? Esta ação não pode ser desfeita.`}
          confirmText="Deletar"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
