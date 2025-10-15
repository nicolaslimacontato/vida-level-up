"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  className,
  trend,
}: StatCardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600 dark:text-green-400";
    if (trend === "down") return "text-red-600 dark:text-red-400";
    return "text-muted-foreground";
  };

  return (
    <div className={cn("bg-card rounded-lg border p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      {(change !== undefined || changeLabel) && (
        <div className="mt-4 flex items-center gap-1">
          {getTrendIcon()}
          <span className={cn("text-sm font-medium", getTrendColor())}>
            {changeLabel || `${change && change > 0 ? "+" : ""}${change || 0}%`}
          </span>
        </div>
      )}
    </div>
  );
}

interface StatGridProps {
  stats: StatCardProps[];
  className?: string;
}

export function StatGrid({ stats, className }: StatGridProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
