import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { pixelify } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vida Level Up - RPG da Vida Real",
  description:
    "Transforme suas tarefas diárias em uma aventura épica! Complete quests, ganhe XP e suba de nível.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${pixelify.variable}`}>
      <body className={inter.className}>
        <ThemeProvider>
          <header className="bg-background text-foreground border-b border-border shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-slate-900 font-bold text-sm">VL</span>
                  </div>
                  <h1 className="text-xl font-bold text-foreground">
                    Vida Level Up
                  </h1>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                  <a
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    Quests
                  </a>
                  <a
                    href="/dashboard"
                    className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    Perfil
                  </a>
                  <ThemeToggle />
                </nav>
              </div>
            </div>
          </header>
          <main className="bg-background text-foreground">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}