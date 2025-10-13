"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRPGContext } from "@/contexts/RPGContext";
import {
  Home,
  Target,
  Trophy,
  Gift,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Quests",
    href: "/quests",
    icon: Target,
  },
  {
    name: "Missões Principais",
    href: "/dashboard#main-quests",
    icon: Trophy,
  },
  {
    name: "Loja",
    href: "/shop",
    icon: ShoppingBag,
  },
  {
    name: "Inventário",
    href: "/inventory",
    icon: Package,
    disabled: false,
  },
  {
    name: "Recompensas",
    href: "/dashboard#shop",
    icon: Gift,
  },
  {
    name: "Estatísticas",
    href: "/dashboard#stats",
    icon: BarChart3,
  },
  {
    name: "Configurações",
    href: "/settings",
    icon: Settings,
    disabled: true,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useRPGContext();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`border-border bg-background fixed top-0 left-0 z-40 h-screen w-[280px] border-r transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="border-border flex h-16 items-center gap-3 border-b px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
              <span className="text-paragraph flex items-center justify-center font-bold text-slate-900">
                VL
              </span>
            </div>
            <h1 className="text-title3 font-bold">Vida Level Up</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href.includes("#") &&
                  pathname === item.href.split("#")[0]);

              // Badge para inventário
              const inventoryCount =
                item.name === "Inventário" ? user.inventory.length : 0;

              return (
                <Link
                  key={item.name}
                  href={item.disabled ? "#" : item.href}
                  onClick={() => !item.disabled && setIsOpen(false)}
                  className={`text-title3 flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : item.disabled
                        ? "text-muted-foreground cursor-not-allowed opacity-50"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.name}</span>
                  {inventoryCount > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-bold">
                      {inventoryCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Info */}
          <div className="border-border border-t p-4">
            <div className="bg-accent/50 rounded-lg p-3">
              <p className="text-paragraph text-muted-foreground">
                💡 Dica: Complete quests diárias para manter seu streak!
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
