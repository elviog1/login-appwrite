import { useAuth } from "@/contexts/auth-context";
import { changePassword } from "@/lib/auth";
import { getPersonsByUser } from "@/lib/personService";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const [visible, setVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [personCount, setPersonCount] = useState(0);
  const [rootCount, setRootCount] = useState(0);
  const [descendantCount, setDescendantCount] = useState(0);

  const handleLogout = async () => {
    await signOut();
    router.replace("/");
  };

  const closeModal = () => {
    setVisible(false);
    setError(null);
    setSuccess(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(false);

    if (!currentPassword || !newPassword) {
      setError("Completá todos los campos");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(async () => {
        await signOut();
        router.replace("/");
      }, 1200);
    } catch (err: any) {
      setError("La contraseña actual es incorrecta");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        if (!user) return;

        try {
          const persons = await getPersonsByUser(user.$id);
          const roots = persons.filter((p) => !p.parentId);
          const nonRoots = persons.filter((p) => p.parentId);

          setPersonCount(persons.length);
          setRootCount(roots.length);
          setDescendantCount(nonRoots.length);
        } catch (err) {
          console.error("Error loading stats:", err);
        }
      };

      loadStats();
    }, [user]),
  );

  const initialLetter = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeModal}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text variant="titleLarge" style={{ fontWeight: "700", marginBottom: 4 }}>
            Cambiar contraseña
          </Text>

          <Text variant="bodySmall" style={{ opacity: 0.7, marginBottom: 16 }}>
            Ingresa tu contraseña actual y define tu nueva clave
          </Text>

          <TextInput
            label="Contraseña actual"
            secureTextEntry={!showCurrentPass}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            mode="outlined"
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showCurrentPass ? "eye-off-outline" : "eye-outline"}
                onPress={() => setShowCurrentPass(!showCurrentPass)}
              />
            }
            style={{ marginBottom: 12 }}
          />

          <TextInput
            label="Nueva contraseña"
            secureTextEntry={!showNewPass}
            value={newPassword}
            onChangeText={setNewPassword}
            mode="outlined"
            left={<TextInput.Icon icon="lock-check-outline" />}
            right={
              <TextInput.Icon
                icon={showNewPass ? "eye-off-outline" : "eye-outline"}
                onPress={() => setShowNewPass(!showNewPass)}
              />
            }
          />

          {error && (
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          )}

          {success && (
            <Text style={{ color: "#22c55e", marginTop: 8, fontWeight: "600" }}>
              ✅ Contraseña actualizada. Redirigiendo...
            </Text>
          )}

          <Button
            mode="contained"
            onPress={handleChangePassword}
            loading={loading}
            disabled={loading || success}
            style={{ marginTop: 16, borderRadius: 12 }}
            contentStyle={{ height: 48 }}
          >
            Guardar cambios
          </Button>

          <Button mode="text" onPress={closeModal} style={{ marginTop: 8 }}>
            Cancelar
          </Button>
        </Modal>
      </Portal>

      {/* Tarjeta del Usuario */}
      <Card style={styles.card} mode="elevated">
        <Card.Content style={styles.profileHeader}>
          <Avatar.Text
            size={64}
            label={initialLetter}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.onPrimaryContainer}
          />
          <View style={styles.profileDetails}>
            <Text variant="titleMedium" style={{ fontWeight: "700" }}>
              {user?.email || "Usuario"}
            </Text>
            <Text variant="bodySmall" style={{ opacity: 0.6, marginTop: 2 }}>
              ID: {user?.$id ? `${user.$id.slice(0, 10)}...` : ""}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Tarjeta de Estadísticas del Árbol (KPIs) */}
      <Card style={[styles.card, { marginTop: 16 }]} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "700", marginBottom: 16 }}>
            📊 Resumen de tu Árbol
          </Text>

          <View style={styles.kpiRow}>
            <View
              style={[
                styles.kpiCard,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Text variant="headlineMedium" style={[styles.kpiValue, { color: theme.colors.onPrimaryContainer }]}>
                {personCount}
              </Text>
              <Text variant="labelSmall" style={[styles.kpiLabel, { color: theme.colors.onPrimaryContainer }]}>
                Miembros
              </Text>
            </View>

            <View
              style={[
                styles.kpiCard,
                { backgroundColor: theme.colors.secondaryContainer },
              ]}
            >
              <Text variant="headlineMedium" style={[styles.kpiValue, { color: theme.colors.onSecondaryContainer }]}>
                {rootCount}
              </Text>
              <Text variant="labelSmall" style={[styles.kpiLabel, { color: theme.colors.onSecondaryContainer }]}>
                Raíces
              </Text>
            </View>

            <View
              style={[
                styles.kpiCard,
                { backgroundColor: theme.colors.tertiaryContainer || "#f3e8ff" },
              ]}
            >
              <Text
                variant="headlineMedium"
                style={[
                  styles.kpiValue,
                  { color: theme.colors.onTertiaryContainer || "#6b21a8" },
                ]}
              >
                {descendantCount}
              </Text>
              <Text
                variant="labelSmall"
                style={[
                  styles.kpiLabel,
                  { color: theme.colors.onTertiaryContainer || "#6b21a8" },
                ]}
              >
                Descendientes
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Opciones de Cuenta */}
      <Card style={[styles.card, { marginTop: 16 }]} mode="elevated">
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
            ⚙️ Ajustes de Cuenta
          </Text>

          <Button
            mode="contained-tonal"
            icon="key-outline"
            onPress={() => setVisible(true)}
            style={{ borderRadius: 12, marginBottom: 12 }}
          >
            Cambiar contraseña
          </Button>

          <Divider style={{ marginVertical: 8 }} />

          <Button
            mode="outlined"
            icon="logout"
            textColor={theme.colors.error}
            style={{ borderRadius: 12, borderColor: theme.colors.error }}
            onPress={handleLogout}
          >
            Cerrar sesión
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  profileDetails: {
    marginLeft: 16,
    flex: 1,
  },
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: {
    fontWeight: "800",
  },
  kpiLabel: {
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  modal: {
    padding: 24,
    margin: 20,
    borderRadius: 24,
  },
});

