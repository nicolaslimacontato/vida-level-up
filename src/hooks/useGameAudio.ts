import { useCallback, useRef } from "react";

interface GameAudioOptions {
  volume?: number;
  playbackRate?: number;
}

export function useGameAudio() {
  const audioCache = useRef<Map<string, HTMLAudioElement>>(new Map());

  const preloadAudio = useCallback((src: string) => {
    if (!audioCache.current.has(src)) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioCache.current.set(src, audio);
    }
    return audioCache.current.get(src)!;
  }, []);

  const playSound = useCallback(
    (src: string, options: GameAudioOptions = {}) => {
      try {
        const audio = preloadAudio(src);

        // Reset audio to beginning
        audio.currentTime = 0;

        // Apply options
        if (options.volume !== undefined) {
          audio.volume = Math.max(0, Math.min(1, options.volume));
        }
        if (options.playbackRate !== undefined) {
          audio.playbackRate = options.playbackRate;
        }

        // Play with promise handling for better browser compatibility
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Audio play failed:", error);
          });
        }
      } catch (error) {
        console.warn("Failed to play audio:", error);
      }
    },
    [preloadAudio],
  );

  // Specific game sound functions
  const playLevelUpSound = useCallback(() => {
    playSound("/sound/levelup.mp3", { volume: 0.3 });
  }, [playSound]);

  const playOrbSound = useCallback(() => {
    playSound("/sound/orb.mp3", { volume: 0.5 });
  }, [playSound]);

  const playOrbSoundWithVariation = useCallback(() => {
    // Add slight pitch variation for more interesting sound
    const randomPitch = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    playSound("/sound/orb.mp3", {
      volume: 0.4 + Math.random() * 0.2, // 0.4 to 0.6
      playbackRate: randomPitch,
    });
  }, [playSound]);

  // Preload all game sounds on hook initialization
  const preloadGameSounds = useCallback(() => {
    preloadAudio("/sound/levelup.mp3");
    preloadAudio("/sound/orb.mp3");
  }, [preloadAudio]);

  return {
    playSound,
    playLevelUpSound,
    playOrbSound,
    playOrbSoundWithVariation,
    preloadGameSounds,
  };
}
