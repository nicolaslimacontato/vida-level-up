"use client";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animar entrada
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-remover após duração
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 300); // Aguardar animação de saída
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          icon: (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          ),
          bgColor:
            "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
          textColor: "text-green-800 dark:text-green-200",
        };
      case "error":
        return {
          icon: (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          ),
          bgColor:
            "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
          textColor: "text-red-800 dark:text-red-200",
        };
      case "warning":
        return {
          icon: (
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          ),
          bgColor:
            "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
          textColor: "text-yellow-800 dark:text-yellow-200",
        };
      case "info":
        return {
          icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
          bgColor:
            "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
          textColor: "text-blue-800 dark:text-blue-200",
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`pointer-events-auto mb-4 w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${styles.bgColor}`}
      style={{ minHeight: "80px" }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">{styles.icon}</div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-title3 leading-tight font-semibold ${styles.textColor}`}
          >
            {toast.title}
          </p>
          {toast.message && (
            <p
              className={`text-paragraph mt-1 leading-relaxed ${styles.textColor} opacity-90`}
            >
              {toast.message}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(toast.id), 300);
            }}
            className={`inline-flex rounded-full p-1 ${styles.textColor} transition-opacity hover:bg-black/5 hover:opacity-75 dark:hover:bg-white/5`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Context para gerenciar toasts globalmente

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext)!;

  return (
    <div className="pointer-events-none fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

// Hook para usar toasts
export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }

  const { addToast } = context;

  const success = (title: string, message?: string) => {
    addToast({ type: "success", title, message });
  };

  const error = (title: string, message?: string) => {
    addToast({ type: "error", title, message });
  };

  const info = (title: string, message?: string) => {
    addToast({ type: "info", title, message });
  };

  const warning = (title: string, message?: string) => {
    addToast({ type: "warning", title, message });
  };

  return { success, error, info, warning };
}
