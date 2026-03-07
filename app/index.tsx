import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator, Button, TextInput } from "react-native-paper";
import { useAuth } from "./context/authContext";

export default function LoginScreen() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [logginIn, setLogginIn] = useState(false);
  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [user, loading]);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  const handleLogin = async () => {
    setError(null);
    if (!email || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    /* if (!isValidEmail(email)) {
      setError("Por favor, ingresa un email válido");
      return;
    } */

    if (logginIn) return;
    setLogginIn(true);

    try {
      await signIn(email, password);
      router.replace("/home");
    } catch (err: any) {
      if (err.message.includes("Invalid credentials")) {
        setError("Email o contraseña incorrectos");
        return;
      }
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map Notes</Text>
      <TextInput
        label="Email"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" style={styles.button} onPress={handleLogin}>
        Login
      </Button>
      <Button onPress={() => router.push("/register")}>Create account</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  title: {
    fontSize: 34,
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});
