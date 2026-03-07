import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Portal, Snackbar, TextInput } from "react-native-paper";
import { useSnackbar } from "./context/SnackbarContext";
import { register } from "./lib/auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const { showSnackbar } = useSnackbar();
  const handleRegister = async () => {
    try {
      await register(name, email, password);
      showSnackbar("Account created successfully", "success");
      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error) {
      showSnackbar("Error creating account", "error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        label="Name"
        mode="outlined"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
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
      <Button mode="contained" style={styles.button} onPress={handleRegister}>
        Register
      </Button>

      <Button onPress={() => router.back()}>Back to login</Button>
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={{
            backgroundColor: snackbarMessage.includes("Error")
              ? "#B00020"
              : "#2e7d32",
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
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
    fontSize: 30,
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
