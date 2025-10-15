import type { Metadata } from "next";
import { pressStart2P } from "@/lib/fonts";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { RPGProvider } from "@/contexts/RPGContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ToastProvider, ToastContainer } from "@/components/Toast";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

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
              <SidebarProvider>
                <div className="flex h-screen overflow-hidden">
                  {/* Sidebar */}
                  <Sidebar />

                  {/* Main Content */}
                  <div className="flex flex-1 flex-col lg:ml-[280px]">
                    {/* Navbar */}
                    <Navbar />

                    {/* Page Content */}
                    <main className="bg-background flex-1 overflow-y-auto">
                      {children}
                    </main>
                  </div>
                </div>
              </SidebarProvider>

              {/* Toast Container */}
              <ToastContainer />
            </RPGProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
