"use client";

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface ProgressCardProps {
  title: string;
  current: number;
  max: number;
  icon?: string;
  className?: string;
  showPercentage?: boolean;
  color?: "default" | "success" | "warning" | "danger";
}

export function ProgressCard({
  title,
  current,
  max,
  icon,
  className,
  showPercentage = true,
  color = "default",
}: ProgressCardProps) {
  const percentage = max > 0 ? Math.round((current / max) * 100) : 0;

  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "danger":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm font-medium">{title}</span>
        </div>
        {showPercentage && (
          <span className={cn("text-sm font-medium", getColorClasses())}>
            {percentage}%
          </span>
        )}
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="text-muted-foreground flex justify-between text-xs">
        <span>{current}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  color?: "default" | "success" | "warning" | "danger";
}

export function CircularProgress({
  value,
  max = 100,
  size = "md",
  className,
  showText = true,
  color = "default",
}: CircularProgressProps) {
  const percentage = Math.round((value / max) * 100);
  const radius = size === "sm" ? 20 : size === "md" ? 30 : 40;
  const strokeWidth = size === "sm" ? 3 : size === "md" ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "stroke-green-500";
      case "warning":
        return "stroke-yellow-500";
      case "danger":
        return "stroke-red-500";
      default:
        return "stroke-blue-500";
    }
  };

  const sizeClasses = {
    sm: "h-12 w-12",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        className="h-full w-full -rotate-90 transform"
        viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}
      >
        {/* Background circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted-foreground/20"
        />
        {/* Progress circle */}
        <circle
          cx={radius + strokeWidth}
          cy={radius + strokeWidth}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "transition-all duration-300 ease-in-out",
            getColorClasses(),
          )}
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium">{percentage}%</span>
        </div>
      )}
    </div>
  );
}
