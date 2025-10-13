"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          borderColor: "border-red-200",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
          borderColor: "border-yellow-200",
        };
      case "info":
        return {
          icon: <AlertTriangle className="h-12 w-12 text-blue-500" />,
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
          borderColor: "border-blue-200",
        };
      default:
        return {
          icon: <AlertTriangle className="h-12 w-12 text-red-500" />,
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
          borderColor: "border-red-200",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className={`w-full max-w-md ${styles.borderColor}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-title2 font-bold">{title}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Ícone e Mensagem */}
          <div className="space-y-4 text-center">
            <div className="flex justify-center">{styles.icon}</div>
            <p className="text-paragraph text-muted-foreground">{message}</p>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className={`flex-1 ${styles.confirmButton}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processando...
                </div>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
