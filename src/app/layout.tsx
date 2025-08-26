import type { Metadata } from "next";
import { pressStart2P } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

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
    <html lang="pt-BR">
      <body className={pressStart2P.variable}>
        <ThemeProvider>
          <header className="bg-background text-foreground border-border border-b shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                    <span className="text-paragraph flex items-center justify-center font-bold text-slate-900">
                      VL
                    </span>
                  </div>
                  <h1 className="text-title3 text-foreground font-bold">
                    Vida Level Up
                  </h1>
                </div>
                <nav className="text-title3 hidden items-center gap-6 md:flex">
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
                {/* Mobile theme toggle */}
                <div className="md:hidden">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>
          <main className="bg-background text-foreground">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
