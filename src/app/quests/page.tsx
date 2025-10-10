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
} from "lucide-react";
import { QuestModal, QuestFormData } from "@/components/QuestModal";

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "templates" | "create">(
    "active",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState<QuestFormData | undefined>();

  const handleSaveQuest = (quest: QuestFormData) => {
    console.log("Quest salva:", quest);
    // TODO: Implementar salvamento real
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
            7
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
          <QuestItem
            title="Exercitar-se por 30 minutos"
            description="Faça qualquer tipo de exercício físico"
            category="Saúde"
            xp={50}
            coins={10}
            active={true}
          />
          <QuestItem
            title="Ler por 20 minutos"
            description="Leia um livro ou artigo educativo"
            category="Estudo"
            xp={30}
            coins={8}
            active={true}
          />
          <QuestItem
            title="Beber 2L de água"
            description="Mantenha-se hidratado durante o dia"
            category="Saúde"
            xp={25}
            coins={5}
            active={false}
          />

          {/* Empty State */}
          {false && (
            <Card className="p-12 text-center">
              <Target className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="text-title2 mb-2 font-semibold">
                Nenhuma quest ativa
              </h3>
              <p className="text-paragraph text-muted-foreground mb-4">
                Comece adicionando quests ou escolha templates prontos
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Criar Primeira Quest
              </Button>
            </Card>
          )}
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TemplateCard
            title="Exercícios Matinais"
            description="30 minutos de atividade física"
            category="Saúde"
            icon="💪"
          />
          <TemplateCard
            title="Leitura Diária"
            description="20 minutos de leitura"
            category="Estudo"
            icon="📚"
          />
          <TemplateCard
            title="Meditação"
            description="10 minutos de mindfulness"
            category="Bem-estar"
            icon="🧘"
          />
          <TemplateCard
            title="Estudar 2 horas"
            description="Dedique tempo ao aprendizado"
            category="Estudo"
            icon="📖"
          />
          <TemplateCard
            title="Hidratação"
            description="Beber 2L de água"
            category="Saúde"
            icon="💧"
          />
          <TemplateCard
            title="Socializar"
            description="Conectar-se com amigos"
            category="Social"
            icon="🤝"
          />
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
      />
    </div>
  );
}

function QuestItem({
  title,
  description,
  category,
  xp,
  coins,
  active,
}: {
  title: string;
  description: string;
  category: string;
  xp: number;
  coins: number;
  active: boolean;
}) {
  return (
    <Card className="p-4 transition-all hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-title3 font-semibold">{title}</h3>
            <span className="text-paragraph bg-primary/10 text-primary rounded-full px-2 py-0.5">
              {category}
            </span>
          </div>
          <p className="text-paragraph text-muted-foreground mb-3">
            {description}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-paragraph text-yellow-600">+{xp} XP</span>
            <span className="text-paragraph coin-text text-amber-600">
              <span className="coin-emoji">🪙</span> {coins}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {active ? (
            <ToggleRight className="h-5 w-5 text-green-500" />
          ) : (
            <ToggleLeft className="text-muted-foreground h-5 w-5" />
          )}
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function TemplateCard({
  title,
  description,
  category,
  icon,
}: {
  title: string;
  description: string;
  category: string;
  icon: string;
}) {
  return (
    <Card className="p-4 transition-all hover:shadow-md">
      <div className="mb-3 text-center text-3xl">{icon}</div>
      <h3 className="text-title3 mb-1 text-center font-semibold">{title}</h3>
      <p className="text-paragraph text-muted-foreground mb-3 text-center">
        {description}
      </p>
      <div className="mb-3 text-center">
        <span className="text-paragraph bg-primary/10 text-primary rounded-full px-2 py-1">
          {category}
        </span>
      </div>
      <Button className="w-full" size="sm">
        <Plus className="mr-1 h-3 w-3" />
        Adicionar
      </Button>
    </Card>
  );
}
