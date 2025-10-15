"use client";

import { useState } from "react";
import { Bell, X, CheckCircle, AlertTriangle, Info, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FadeIn, SlideIn } from "@/components/ui/animations";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "achievement";
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  className?: string;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  className,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "achievement":
        return <Star className="h-5 w-5 text-purple-500" />;
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950";
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950";
      case "info":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950";
      case "achievement":
        return "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950";
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <SlideIn direction="down" className="absolute top-12 right-0 z-50 w-80">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notificações</CardTitle>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onMarkAllAsRead}
                      className="text-xs"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-xs"
                  >
                    Limpar todas
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="text-muted-foreground p-6 text-center">
                  <Bell className="mx-auto mb-2 h-12 w-12 opacity-50" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <FadeIn key={notification.id} delay={index * 0.1}>
                      <div
                        className={cn(
                          "hover:bg-muted/50 border-b p-4 transition-colors",
                          !notification.read && "bg-muted/30",
                          getTypeColor(notification.type),
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {getIcon(notification.type)}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">
                                {notification.title}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onMarkAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {notification.message}
                            </p>
                            <p className="text-muted-foreground mt-2 text-xs">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                            {notification.action && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={notification.action.onClick}
                                className="mt-2"
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </SlideIn>
      )}
    </div>
  );
}

// Hook para gerenciar notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const clearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearRead,
  };
}
