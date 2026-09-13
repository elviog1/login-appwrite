import { useThemeToggle } from "@/contexts/theme-context";
import { Appbar } from "react-native-paper";

export function AppHeader({ title }: { title: string }) {
  const { isDark, toggleTheme } = useThemeToggle();

  return (
    <Appbar.Header elevated mode="center-aligned">
      <Appbar.Action icon="tree" size={24} />
      <Appbar.Content
        title={title}
        titleStyle={{ fontWeight: "700", letterSpacing: 0.5 }}
      />
      <Appbar.Action
        icon={isDark ? "weather-sunny" : "weather-night"}
        onPress={toggleTheme}
      />
    </Appbar.Header>
  );
}

