import { useAuth } from "@/contexts/auth-context";
import { isUsernameAvailable } from "@/lib/auth";
import { isValidEmail } from "@/lib/validatorEmail";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function RegisterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { signUp } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);

    const cleanUsername = username.trim();
    if (!cleanUsername || !email.trim() || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    // Appwrite userId rules: 1-36 characters, lowercase/uppercase letters, numbers, period, hyphen, underscore.
    // Cannot start with a special character.
    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,35}$/;
    if (!usernameRegex.test(cleanUsername)) {
      setError(
        "El usuario debe tener entre 3 y 36 caracteres, comenzar con letra o número, y solo usar letras, números, '.', '_' o '-'"
      );
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Por favor, ingresa un email válido");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      setLoading(true);
      const available = await isUsernameAvailable(cleanUsername);
      if (!available) {
        setError("El nombre de usuario ya se encuentra en uso por otra persona");
        return;
      }

      await signUp(email.trim(), password, cleanUsername);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      if (
        (err.message && err.message.toLowerCase().includes("already exists")) ||
        err.code === 409
      ) {
        setError("El nombre de usuario o el email ya se encuentra en uso");
        return;
      }
      setError(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Avatar.Icon
            size={72}
            icon="account-plus"
            style={{ backgroundColor: theme.colors.primaryContainer, marginBottom: 12 }}
            color={theme.colors.primary}
          />
          <Text variant="headlineMedium" style={styles.title}>
            Crear Cuenta
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Comienza a construir el legado de tu familia
          </Text>
        </View>

        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardBody}>
            <TextInput
              label="Nombre de usuario"
              value={username}
              onChangeText={(text) => setUsername(text.replace(/\s+/g, ""))}
              autoCapitalize="none"
              autoCorrect={false}
              mode="outlined"
              maxLength={36}
              left={<TextInput.Icon icon="account-outline" />}
              style={styles.input}
            />

            <TextInput
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              mode="outlined"
              left={<TextInput.Icon icon="email-outline" />}
              style={styles.input}
            />

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              mode="outlined"
              left={<TextInput.Icon icon="lock-outline" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
            />

            {error && (
              <HelperText type="error" visible={!!error} style={styles.helperText}>
                {error}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
            >
              Registrarse
            </Button>

            <Button
              mode="text"
              icon="arrow-left"
              onPress={() => router.back()}
              style={styles.backButton}
            >
              Ya tengo una cuenta
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    opacity: 0.7,
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    borderRadius: 20,
    elevation: 4,
  },
  cardBody: {
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  input: {
    marginBottom: 12,
  },
  helperText: {
    marginBottom: 8,
  },
  registerButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  backButton: {
    marginTop: 12,
  },
});

