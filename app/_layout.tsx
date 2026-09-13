import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { TreeProvider } from "@/contexts/tree-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <TreeProvider>
      <ThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </ThemeProvider>
    </TreeProvider>
  );
}

