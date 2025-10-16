"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <AuthGuard>
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
    </AuthGuard>
  );
}
