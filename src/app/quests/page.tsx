"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Target,
  BookTemplate,
  Search,
  Filter,
} from "lucide-react";
import { QuestModal, QuestFormData } from "@/components/QuestModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useToast } from "@/components/Toast";
import { useRPGContext } from "@/contexts/RPGContext";
import {
  QUEST_TEMPLATES,
  searchTemplates,
  getTemplatesByCategory,
  templateToQuest,
} from "@/data/questTemplates";
import { Quest } from "@/types/rpg";

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "templates">("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<QuestFormData | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [questToDelete, setQuestToDelete] = useState<Quest | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Hooks
  const { success, error, info } = useToast();
  const {
    quests,
    addQuest,
    updateQuest,
    deleteQuest,
    duplicateQuest,
    addQuestFromTemplate,
  } = useRPGContext();

  // Filtrar quests
  const filteredQuests = quests.filter((quest) => {
    const matchesSearch =
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || quest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtrar templates
  const filteredTemplates =
    searchQuery.length > 0
      ? searchTemplates(searchQuery)
      : getTemplatesByCategory(selectedCategory);

  const handleSaveQuest = (questData: QuestFormData): Promise<boolean> => {
    return new Promise((resolve) => {
      if (editingQuest && editingQuest.id) {
        // Atualizar quest existente
        const questUpdated = updateQuest(editingQuest.id, {
          title: questData.title,
          description: questData.description,
          xpReward: questData.xpReward,
          coinReward: questData.coinReward,
          category: questData.category,
        });
        if (questUpdated) {
          setIsModalOpen(false);
          setEditingQuest(undefined);
          success("Quest atualizada!", "A quest foi atualizada com sucesso.");
          resolve(true);
        } else {
          error(
            "Erro ao atualizar quest",
            "Não foi possível atualizar a quest.",
          );
          resolve(false);
        }
      } else {
        // Criar nova quest
        const questToAdd = {
          title: questData.title,
          description: questData.description,
          xpReward: questData.xpReward,
          coinReward: questData.coinReward,
          category: questData.category,
          progress: 0,
          maxProgress: 1,
        };
        const questCreated = addQuest(questToAdd);
        if (questCreated) {
          setIsModalOpen(false);
          setEditingQuest(undefined);
          success("Quest criada!", "A nova quest foi criada com sucesso.");
          resolve(true);
        } else {
          error("Erro ao criar quest", "Já existe uma quest com este título.");
          resolve(false);
        }
      }
    });
  };

  const handleDeleteQuest = (quest: Quest) => {
    setQuestToDelete(quest);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteQuest = async () => {
    if (questToDelete) {
      setIsDeleting(true);
      try {
        const questDeleted = deleteQuest(questToDelete.id);
        if (questDeleted) {
          setQuestToDelete(null);
          setIsConfirmModalOpen(false);
          success(
            "Quest deletada!",
            `"${questToDelete.title}" foi removida com sucesso.`,
          );
        } else {
          error("Erro ao deletar quest", "Não foi possível deletar a quest.");
        }
      } catch (err) {
        error("Erro ao deletar quest", "Ocorreu um erro inesperado.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleUseTemplate = (template: any) => {
    const templateAdded = addQuestFromTemplate(template);
    if (templateAdded) {
      success(
        "Template adicionado!",
        `"${template.title}" foi adicionada às suas quests.`,
      );
    } else {
      error(
        "Erro ao adicionar template",
        "Não foi possível adicionar o template.",
      );
    }
  };

  const handleEditQuest = (quest: QuestFormData) => {
    setEditingQuest(quest);
    setIsModalOpen(true);
  };

  const handleCreateQuest = () => {
    setEditingQuest(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-title1 mb-2 font-bold">Gerenciar Quests</h1>
          <p className="text-paragraph text-muted-foreground">
            Crie, edite e organize suas quests personalizadas
          </p>
        </div>
        <Button className="gap-2" onClick={handleCreateQuest}>
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Quest</span>
        </Button>
      </div>

      {/* Busca */}
      <div className="mb-4 flex gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar quests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-input bg-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border px-10 py-2 text-sm focus:ring-2 focus:outline-none"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border-input bg-background focus:ring-ring rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
        >
          <option value="all">Todas as categorias</option>
          <option value="daily">Diárias</option>
          <option value="weekly">Semanais</option>
          <option value="main">Principais</option>
          <option value="special">Especiais</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-border mb-6 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("active")}
          className={`text-title3 flex items-center gap-2 border-b-2 px-4 py-2 transition-colors ${
            activeTab === "active"
              ? "border-primary text-primary"
              : "text-muted-foreground hover:text-foreground border-transparent"
          }`}
        >
          <Target className="h-4 w-4" />
          <span>Quests Ativas</span>
          <span className="bg-primary/10 text-paragraph rounded-full px-2 py-0.5">
            {filteredQuests.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`text-title3 flex items-center gap-2 border-b-2 px-4 py-2 transition-colors ${
            activeTab === "templates"
              ? "border-primary text-primary"
              : "text-muted-foreground hover:text-foreground border-transparent"
          }`}
        >
          <BookTemplate className="h-4 w-4" />
          <span>Templates</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === "active" && (
        <div className="space-y-4">
          {/* Quest List */}
          {filteredQuests.length === 0 ? (
            <Card className="p-12 text-center">
              <Target className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="text-title2 mb-2 font-semibold">
                {searchQuery
                  ? "Nenhuma quest encontrada"
                  : "Nenhuma quest ativa"}
              </h3>
              <p className="text-paragraph text-muted-foreground mb-4">
                {searchQuery
                  ? "Tente buscar por outro termo ou categoria"
                  : "Comece adicionando quests ou escolha templates prontos"}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateQuest}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Quest
                </Button>
              )}
            </Card>
          ) : (
            filteredQuests.map((quest) => (
              <QuestItem
                key={quest.id}
                quest={quest}
                onEdit={() =>
                  handleEditQuest({
                    id: quest.id,
                    title: quest.title,
                    description: quest.description,
                    xpReward: quest.xpReward,
                    coinReward: quest.coinReward,
                    category: quest.category,
                  })
                }
                onDelete={() => handleDeleteQuest(quest)}
                onDuplicate={() => duplicateQuest(quest.id)}
              />
            ))
          )}
        </div>
      )}

      {activeTab === "templates" && (
        <div className="space-y-4">
          {filteredTemplates.length === 0 ? (
            <Card className="p-12 text-center">
              <BookTemplate className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="text-title2 mb-2 font-semibold">
                Nenhum template encontrado
              </h3>
              <p className="text-paragraph text-muted-foreground">
                Tente buscar por outro termo ou categoria
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template, index) => (
                <TemplateCard
                  key={index}
                  template={template}
                  onUse={() => handleUseTemplate(template)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quest Modal */}
      <QuestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingQuest(undefined);
        }}
        onSave={handleSaveQuest}
        initialData={editingQuest}
        mode={editingQuest ? "edit" : "create"}
        existingQuests={quests.map((q) => ({
          id: q.id,
          title: q.title,
          description: q.description,
          xpReward: q.xpReward,
          coinReward: q.coinReward,
          category: q.category,
          icon: q.icon,
        }))}
      />

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setQuestToDelete(null);
        }}
        onConfirm={confirmDeleteQuest}
        title="Deletar Quest"
        message={`Tem certeza que deseja deletar a quest "${questToDelete?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

function QuestItem({
  quest,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  quest: Quest;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <Card className="p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-title3 font-semibold">{quest.title}</h3>
            <span className="text-paragraph bg-primary/10 text-primary rounded-full px-2 py-0.5">
              {quest.category}
            </span>
          </div>
          <p className="text-paragraph text-muted-foreground mb-3">
            {quest.description}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-paragraph text-yellow-600">
              +{quest.xpReward} XP
            </span>
            <span className="text-paragraph coin-text text-amber-600">
              <span className="coin-emoji">🪙</span> {quest.coinReward}
            </span>
            {quest.completed && (
              <span className="text-paragraph rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                ✅ Concluída
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDuplicate}>
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function TemplateCard({
  template,
  onUse,
}: {
  template: any;
  onUse: () => void;
}) {
  return (
    <Card className="flex h-full flex-col p-4 transition-all hover:shadow-md">
      {/* Header - Ícone e Título */}
      <div className="mb-3 flex flex-col items-center text-center">
        <div className="mb-2 text-3xl">{template.icon}</div>
        <h3 className="text-title3 mb-1 line-clamp-2 font-semibold">
          {template.title}
        </h3>
      </div>

      {/* Descrição - Flexível */}
      <div className="mb-3 flex-1">
        <p className="text-paragraph text-muted-foreground line-clamp-3 text-center">
          {template.description}
        </p>
      </div>

      {/* Tags */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="text-paragraph bg-primary/10 text-primary rounded-full px-2 py-1">
          {template.category}
        </span>
        <span className="text-paragraph rounded-full bg-yellow-100 px-2 py-1 text-yellow-700">
          {template.type === "daily" ? "Diária" : "Semanal"}
        </span>
      </div>

      {/* Recompensas */}
      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="text-paragraph text-yellow-600">
          +{template.xpReward} XP
        </span>
        <span className="text-paragraph coin-text text-amber-600">
          <span className="coin-emoji">🪙</span> {template.coinReward}
        </span>
      </div>

      {/* Botão - Sempre no final */}
      <div className="mt-auto">
        <Button className="w-full" size="sm" onClick={onUse}>
          <Plus className="mr-1 h-3 w-3" />
          Adicionar
        </Button>
      </div>
    </Card>
  );
}
