import React from "react";
import { Snackbar } from "react-native-paper";
import type { NotificationType } from "@/hooks/useNotification";

interface NotificationSnackbarProps {
  visible: boolean;
  message: string;
  type?: NotificationType;
  onDismiss: () => void;
  duration?: number;
}

export function NotificationSnackbar({
  visible,
  message,
  type = "info",
  onDismiss,
  duration = 3000,
}: NotificationSnackbarProps) {
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50"; // Green
      case "error":
        return "#F44336"; // Red
      case "info":
        return "#2196F3"; // Blue
      default:
        return "#323232"; // Default
    }
  };

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      {message}
    </Snackbar>
  );
}
