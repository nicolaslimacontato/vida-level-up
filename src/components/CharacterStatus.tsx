import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "@/types/rpg";
import { Heart, Zap, Target, TrendingUp, Crown, Coins } from "lucide-react";

interface CharacterStatusProps {
  user: User;
  getAttributeProgress: (attribute: keyof User["attributes"]) => number;
  getLevelProgress: () => number;
  getStrengthXPReduction?: (strength: number) => number;
  getIntelligenceBonus?: (intelligence: number) => number;
  getCharismaDiscount?: (charisma: number) => number;
}

export function CharacterStatus({
  user,
  getAttributeProgress,
  getLevelProgress,
  getStrengthXPReduction,
  getIntelligenceBonus,
  getCharismaDiscount,
}: CharacterStatusProps) {
  const healthProgress = (user.health / user.maxHealth) * 100;
  const manaProgress = (user.mana / user.maxMana) * 100;

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Personagem */}
      <div className="text-center">
        <h2 className="text-foreground text-title1 mb-2 flex items-center justify-center gap-2 font-bold">
          <Crown className="h-6 w-6 text-yellow-500" />
          Seu Personagem
        </h2>
        <div className="text-muted-foreground text-title3 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Nível {user.level}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-amber-500" />
            <span className="coin-text font-semibold text-amber-600 dark:text-amber-400">
              <span className="coin-emoji">🪙</span> {user.coins}
            </span>
          </div>
        </div>
      </div>

      {/* Status Básico */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Barra de Vida */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-title3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Vida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-muted-foreground text-title3 flex justify-between">
                <span>
                  {user.health}/{user.maxHealth}
                </span>
                <span>{Math.round(healthProgress)}%</span>
              </div>
              <Progress value={healthProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Barra de Mana */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-title3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Energia Mental
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-muted-foreground text-title3 flex justify-between">
                <span>
                  {user.mana}/{user.maxMana}
                </span>
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
          <CardTitle className="text-title2 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Atributos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Força */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  💪 Força
                </span>
                <span className="text-muted-foreground text-title3">
                  {user.attributes.strength}/100
                </span>
              </div>
              <Progress
                value={getAttributeProgress("strength")}
                className="h-2"
              />
              <p className="text-muted-foreground text-paragraph">
                Aumenta com exercícios e treinos
              </p>
              {getStrengthXPReduction &&
                getStrengthXPReduction(user.attributes.strength) > 0 && (
                  <p className="text-paragraph text-green-600 dark:text-green-400">
                    ✨ -{getStrengthXPReduction(user.attributes.strength)}% XP
                    necessário para level up
                  </p>
                )}
            </div>

            {/* Inteligência */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  🧠 Inteligência
                </span>
                <span className="text-muted-foreground text-title3">
                  {user.attributes.intelligence}/100
                </span>
              </div>
              <Progress
                value={getAttributeProgress("intelligence")}
                className="h-2"
              />
              <p className="text-muted-foreground text-paragraph">
                Aumenta com estudos e leitura
              </p>
              {getIntelligenceBonus &&
                getIntelligenceBonus(user.attributes.intelligence) > 0 && (
                  <p className="text-paragraph text-blue-600 dark:text-blue-400">
                    ✨ +{getIntelligenceBonus(user.attributes.intelligence)}% XP
                    em quests de estudo
                  </p>
                )}
            </div>

            {/* Carisma */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  😊 Carisma
                </span>
                <span className="text-muted-foreground text-title3">
                  {user.attributes.charisma}/100
                </span>
              </div>
              <Progress
                value={getAttributeProgress("charisma")}
                className="h-2"
              />
              <p className="text-muted-foreground text-paragraph">
                Aumenta com socialização
              </p>
              {getCharismaDiscount &&
                getCharismaDiscount(user.attributes.charisma) > 0 && (
                  <p className="text-paragraph text-purple-600 dark:text-purple-400">
                    ✨ -{getCharismaDiscount(user.attributes.charisma)}%
                    desconto na loja
                  </p>
                )}
            </div>

            {/* Disciplina */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  ⚡ Disciplina
                </span>
                <span className="text-muted-foreground text-title3">
                  {user.attributes.discipline}/100
                </span>
              </div>
              <Progress
                value={getAttributeProgress("discipline")}
                className="h-2"
              />
              <p className="text-muted-foreground text-paragraph">
                Aumenta com consistência (streak)
              </p>
              <p className="text-paragraph text-orange-600 dark:text-orange-400">
                ✨ +1 a cada 7 dias de streak 🔥
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progresso do Nível */}
      <Card>
        <CardHeader>
          <CardTitle className="text-title2 flex items-center gap-2">
            <Target className="h-6 w-6 text-purple-500" />
            Progresso para o Próximo Nível
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-muted-foreground text-title3 flex justify-between">
              <span>XP Atual: {user.currentXP}</span>
              <span>Próximo Nível: {user.level * 100}</span>
            </div>
            <Progress value={getLevelProgress()} className="h-3" />
            <p className="text-muted-foreground text-paragraph text-center">
              Continue completando quests para subir de nível!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
