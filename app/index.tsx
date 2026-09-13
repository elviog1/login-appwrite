import { useAuth } from "@/contexts/auth-context";
import { isValidEmail } from "@/lib/validatorEmail";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function LoginScreen() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/(tabs)/home");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Por favor, ingresa un email válido");
      return;
    }

    try {
      setSubmitting(true);
      await signIn(email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      if (err.message && err.message.includes("Invalid credentials")) {
        setError("Email o contraseña incorrectos");
        return;
      }
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setSubmitting(false);
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
            icon="tree"
            style={{ backgroundColor: theme.colors.primaryContainer, marginBottom: 12 }}
            color={theme.colors.primary}
          />
          <Text variant="headlineMedium" style={styles.title}>
            Family Tree
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Preserva la historia y raíces de tu familia
          </Text>
        </View>

        <Card style={styles.card} mode="elevated">
          <Card.Content style={styles.cardBody}>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Iniciar Sesión
            </Text>

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
              onPress={handleLogin}
              loading={submitting}
              disabled={submitting}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Ingresar
            </Button>

            <View style={styles.footerRow}>
              <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
                ¿No tienes una cuenta?
              </Text>
              <Button
                mode="text"
                compact
                onPress={() => router.push("/register")}
                style={styles.registerButton}
              >
                Crear cuenta
              </Button>
            </View>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  cardTitle: {
    fontWeight: "600",
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  helperText: {
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  registerButton: {
    marginLeft: 4,
  },
});

