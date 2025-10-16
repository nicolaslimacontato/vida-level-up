import type { Metadata } from "next";
import { pressStart2P } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RPGProvider } from "@/contexts/RPGContext";
import { ToastProvider, ToastContainer } from "@/components/Toast";

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
          <ToastProvider>
            <RPGProvider>
              {children}
              {/* Toast Container */}
              <ToastContainer />
            </RPGProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
