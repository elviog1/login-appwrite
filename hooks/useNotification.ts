import { useState } from "react";

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  message: string;
  type: NotificationType;
  duration?: number;
}

export function useNotification() {
  const [notification, setNotification] = useState<Notification | null>(null);

  const show = (
    message: string,
    type: NotificationType = "info",
    duration: number = 3000,
  ) => {
    setNotification({ message, type, duration });
  };

  const success = (message: string, duration?: number) => {
    show(message, "success", duration);
  };

  const error = (message: string, duration?: number) => {
    show(message, "error", duration);
  };

  const info = (message: string, duration?: number) => {
    show(message, "info", duration);
  };

  const hide = () => {
    setNotification(null);
  };

  return {
    notification,
    show,
    success,
    error,
    info,
    hide,
  };
}
