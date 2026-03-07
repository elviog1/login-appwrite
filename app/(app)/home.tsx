import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../context/authContext";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  /* if (!user) {
    return (
      <View style={[styles.container]}>
        <Text variant="headlineSmall">
          Debes iniciar sesión para ver tu perfil
        </Text>
      </View>
    );
  } */

  /* if (loading) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Cargando perfil...</Text>
      </View>
    );
  } */

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Welcome to Map Notes</Text>

      <Button mode="contained" onPress={handleLogout} style={{ marginTop: 20 }}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
