import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./context/authContext";
import { SnackbarProvider } from "./context/SnackbarContext";
export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <SnackbarProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SnackbarProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
