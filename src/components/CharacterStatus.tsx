import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "@/types/rpg";
import { Heart, Zap, Target, TrendingUp, Crown, Coins } from "lucide-react";

interface CharacterStatusProps {
  user: User;
  getAttributeProgress: (attribute: keyof User['attributes']) => number;
  getLevelProgress: () => number;
}

export function CharacterStatus({ user, getAttributeProgress, getLevelProgress }: CharacterStatusProps) {
  const healthProgress = (user.health / user.maxHealth) * 100;
  const manaProgress = (user.mana / user.maxMana) * 100;

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Personagem */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
          <Crown className="w-6 h-6 text-yellow-500" />
          Seu Personagem
        </h2>
        <div className="flex items-center justify-center gap-4 text-lg text-muted-foreground">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Nível {user.level}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {user.coins} 🪙
            </span>
          </div>
        </div>
      </div>

      {/* Status Básico */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Barra de Vida */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="w-5 h-5 text-red-500" />
              Vida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{user.health}/{user.maxHealth}</span>
                <span>{Math.round(healthProgress)}%</span>
              </div>
              <Progress value={healthProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Barra de Mana */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="w-5 h-5 text-blue-500" />
              Energia Mental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{user.mana}/{user.maxMana}</span>
                <span>{Math.round(manaProgress)}%</span>
              </div>
              <Progress value={manaProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atributos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Atributos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Força */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  💪 Força
                </span>
                <span className="text-sm text-muted-foreground">
                  {user.attributes.strength}/100
                </span>
              </div>
              <Progress value={getAttributeProgress('strength')} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Aumenta com exercícios e treinos
              </p>
            </div>

            {/* Inteligência */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  🧠 Inteligência
                </span>
                <span className="text-sm text-muted-foreground">
                  {user.attributes.intelligence}/100
                </span>
              </div>
              <Progress value={getAttributeProgress('intelligence')} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Aumenta com estudos e leitura
              </p>
            </div>

            {/* Carisma */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  😊 Carisma
                </span>
                <span className="text-sm text-muted-foreground">
                  {user.attributes.charisma}/100
                </span>
              </div>
              <Progress value={getAttributeProgress('charisma')} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Aumenta com socialização
              </p>
            </div>

            {/* Disciplina */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium flex items-center gap-2">
                  ⚡ Disciplina
                </span>
                <span className="text-sm text-muted-foreground">
                  {user.attributes.discipline}/100
                </span>
              </div>
              <Progress value={getAttributeProgress('discipline')} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Aumenta com consistência
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso do Nível */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="w-6 h-6 text-purple-500" />
            Progresso para o Próximo Nível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>XP Atual: {user.currentXP}</span>
              <span>Próximo Nível: {user.level * 100}</span>
            </div>
            <Progress value={getLevelProgress()} className="h-3" />
            <p className="text-xs text-muted-foreground text-center">
              Continue completando quests para subir de nível!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
