import { useGameAudio } from "@/hooks/useGameAudio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Star, Coins } from "lucide-react";

export function AudioTest() {
  const { playLevelUpSound, playOrbSound, playOrbSoundWithVariation } =
    useGameAudio();

  return (
    <Card className="mx-auto mt-4 w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="h-5 w-5" />
          Teste de Áudio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={playLevelUpSound}
          className="flex w-full items-center gap-2"
          variant="outline"
        >
          <Star className="h-4 w-4" />
          Level Up!
        </Button>

        <Button
          onClick={playOrbSound}
          className="flex w-full items-center gap-2"
          variant="outline"
        >
          <Coins className="h-4 w-4" />
          Orb (Normal)
        </Button>

        <Button
          onClick={playOrbSoundWithVariation}
          className="flex w-full items-center gap-2"
          variant="outline"
        >
          <Coins className="h-4 w-4" />
          Orb (Variação)
        </Button>
      </CardContent>
    </Card>
  );
}
