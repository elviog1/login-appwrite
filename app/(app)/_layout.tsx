import { Redirect, Stack } from "expo-router";
import { useAuth } from "../context/authContext";

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
