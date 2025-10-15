"use client";

import {
  NotificationCenter,
  useNotifications,
} from "@/components/NotificationCenter";
import { Button } from "@/components/ui/button";
import { LogoMobile } from "@/components/LogoMobile";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { Menu, User } from "lucide-react";

export function Navbar() {
  const { toggleSidebar } = useSidebarContext();
  const { notifications, markAsRead, markAllAsRead, clearAll } =
    useNotifications();

  return (
    <header className="bg-background border-border sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 lg:px-6">
      {/* Logo and Hamburger (visible on mobile when sidebar is closed) */}
      <div className="flex items-center gap-3 lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <LogoMobile />
        <h1 className="text-title3 font-bold">Vida Level Up</h1>
      </div>

      {/* Right side - Notifications, Profile, Theme */}
      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={clearAll}
        />

        {/* Profile */}
        <Button variant="ghost" size="sm">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
