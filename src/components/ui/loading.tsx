"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className,
      )}
    />
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn("bg-muted/50 animate-pulse rounded-lg p-6", className)}>
      <div className="space-y-3">
        <div className="bg-muted h-4 w-3/4 rounded"></div>
        <div className="bg-muted h-3 w-1/2 rounded"></div>
        <div className="bg-muted h-3 w-2/3 rounded"></div>
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  className?: string;
}

export function LoadingButton({ className }: LoadingButtonProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
        "bg-muted text-muted-foreground cursor-not-allowed",
        className,
      )}
    >
      <LoadingSpinner size="sm" className="mr-2" />
      Carregando...
    </div>
  );
}
