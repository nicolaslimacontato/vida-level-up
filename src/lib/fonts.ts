import localFont from "next/font/local";

// Fonte Press Start 2P local (mais confiável que Google Fonts)
export const pressStart2P = localFont({
  src: "../../public/fonts/PressStart2P-Regular.ttf",
  variable: "--font-retro",
  display: "swap",
  fallback: ['"Courier New"', '"Lucida Console"', '"Monaco"', "monospace"],
});

// Export para compatibilidade
export const retroFont = pressStart2P;
