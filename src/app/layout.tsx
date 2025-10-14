import type { Metadata } from "next";
import { pressStart2P } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RPGProvider } from "@/contexts/RPGContext";
import { ToastContainer, ToastProvider } from "@/components/Toast";
import { Sidebar } from "@/components/Sidebar";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMobile } from "@/components/LogoMobile";

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
              <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <div className="flex flex-1 flex-col lg:ml-[280px]">
                  {/* Navbar */}
                  <header className="bg-background border-border sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 lg:px-6">
                    {/* Logo (visible on mobile when sidebar is closed) */}
                    <div className="flex items-center gap-3 lg:hidden">
                      <LogoMobile />
                      <h1 className="text-title3 font-bold">Vida Level Up</h1>
                    </div>

                    {/* Right side - Notifications, Profile, Theme */}
                    <div className="ml-auto flex items-center gap-2">
                      {/* Notifications */}
                      <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                        </span>
                      </Button>

                      {/* Profile */}
                      <Button variant="ghost" size="sm">
                        <User className="h-5 w-5" />
                      </Button>
                    </div>
                  </header>

                  {/* Page Content */}
                  <main className="bg-background flex-1 overflow-y-auto">
                    {children}
                  </main>
                </div>
              </div>

              {/* Toast Container */}
              <ToastContainer />
            </RPGProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
