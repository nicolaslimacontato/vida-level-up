"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Palette,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useRPGContext } from "@/contexts/RPGContext";
import { useToast } from "@/components/Toast";

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user } = useRPGContext();
  const { error } = useToast();

  // Função para resetar tudo com confirmação
  const handleResetAll = () => {
    if (
      window.confirm(
        "⚠️ ATENÇÃO: Esta ação irá APAGAR TODOS os seus dados!\n\n" +
          "• Seu progresso será perdido\n" +
          "• Todas as quests serão resetadas\n" +
          "• Seus itens serão perdidos\n" +
          "• Seus efeitos ativos serão cancelados\n" +
          "• Seu nível voltará para 1\n\n" +
          "Esta ação NÃO pode ser desfeita!\n\n" +
          "Tem certeza que deseja continuar?",
      )
    ) {
      if (
        window.confirm(
          "Última confirmação: Você tem ABSOLUTA certeza que quer apagar TUDO?",
        )
      ) {
        try {
          // Função de reset não implementada ainda
          error(
            "Funcionalidade em desenvolvimento",
            "O reset completo será implementado em breve.",
          );
        } catch {
          error("Erro no Reset", "Não foi possível resetar os dados.");
        }
      }
    }
  };

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-title1 mb-2 flex items-center gap-3 font-bold">
            <Settings className="text-primary h-8 w-8" />
            Configurações
          </h1>
          <p className="text-paragraph text-muted-foreground">
            Personalize sua experiência no Vida Level Up
          </p>
        </div>

        <div className="space-y-6">
          {/* Seção de Tema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="text-primary h-5 w-5" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-paragraph text-muted-foreground">
                  Escolha como você quer que o Vida Level Up apareça
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <Sun className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Claro</div>
                      <div className="text-xs opacity-75">Tema claro</div>
                    </div>
                  </Button>

                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <Moon className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Escuro</div>
                      <div className="text-xs opacity-75">Tema escuro</div>
                    </div>
                  </Button>

                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    onClick={() => setTheme("system")}
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <Monitor className="h-6 w-6" />
                    <div className="text-center">
                      <div className="font-semibold">Sistema</div>
                      <div className="text-xs opacity-75">Segue o sistema</div>
                    </div>
                  </Button>
                </div>

                <div className="bg-muted mt-4 rounded-lg p-3">
                  <p className="text-muted-foreground text-sm">
                    <strong>Tema atual:</strong>{" "}
                    {theme === "system"
                      ? "Sistema"
                      : theme === "light"
                        ? "Claro"
                        : "Escuro"}
                    {theme === "system" && (
                      <span className="ml-2">
                        (Exibindo:{" "}
                        {resolvedTheme === "light" ? "Claro" : "Escuro"})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção de Informações do Usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="text-primary h-5 w-5" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-muted-foreground text-xs font-semibold">
                      Nível Atual
                    </h3>
                    <p className="text-primary text-lg font-bold">
                      {user.level}
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-muted-foreground text-xs font-semibold">
                      Moedas
                    </h3>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      🪙 {user.coins}
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-muted-foreground text-xs font-semibold">
                      Streak Atual
                    </h3>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      🔥 {user.currentStreak} dias
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="text-muted-foreground text-xs font-semibold">
                      Melhor Streak
                    </h3>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      👑 {user.bestStreak} dias
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção de Atributos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="text-primary h-5 w-5" />
                Atributos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="mb-2 text-2xl">💪</div>
                  <h3 className="text-muted-foreground text-sm font-semibold">
                    Força
                  </h3>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    {user.attributes.strength}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="mb-2 text-2xl">🧠</div>
                  <h3 className="text-muted-foreground text-sm font-semibold">
                    Inteligência
                  </h3>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {user.attributes.intelligence}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="mb-2 text-2xl">😎</div>
                  <h3 className="text-muted-foreground text-sm font-semibold">
                    Carisma
                  </h3>
                  <p className="text-xl font-bold text-pink-600 dark:text-pink-400">
                    {user.attributes.charisma}
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="mb-2 text-2xl">⚡</div>
                  <h3 className="text-muted-foreground text-sm font-semibold">
                    Disciplina
                  </h3>
                  <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    {user.attributes.discipline}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seção de Reset */}
          <Card className="border-red-500 bg-red-50 dark:bg-red-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Zona de Perigo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-red-100 p-4 dark:bg-red-900/20">
                  <h3 className="mb-2 font-semibold text-red-800 dark:text-red-200">
                    ⚠️ Reset Completo
                  </h3>
                  <p className="mb-4 text-sm text-red-700 dark:text-red-300">
                    Esta ação irá apagar TODOS os seus dados do jogo:
                  </p>
                  <ul className="mb-4 space-y-1 text-sm text-red-600 dark:text-red-400">
                    <li>• Progresso e nível atual</li>
                    <li>• Todas as quests (completadas e pendentes)</li>
                    <li>• Inventário e itens</li>
                    <li>• Efeitos ativos (buffs, proteções)</li>
                    <li>• Moedas e atributos</li>
                    <li>• Streak e histórico</li>
                  </ul>
                  <p className="text-xs font-semibold text-red-500 dark:text-red-400">
                    ⚠️ Esta ação NÃO pode ser desfeita!
                  </p>
                </div>

                <Button
                  variant="destructive"
                  onClick={handleResetAll}
                  className="w-full"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Resetar Tudo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Seção Futura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="text-primary h-5 w-5" />
                Em Breve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-6 text-center">
                <Settings className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 font-semibold">Mais Configurações</h3>
                <p className="text-muted-foreground text-sm">
                  Novas opções de personalização serão adicionadas em futuras
                  atualizações.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
