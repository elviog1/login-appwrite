import { useAuth } from "@/contexts/auth-context";
import { changePassword, isUsernameAvailable } from "@/lib/auth";
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
  IconButton,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function ProfileScreen() {
  const { user, signOut, updateUserName } = useAuth();
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

  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

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

  const openNameModal = () => {
    setNewName(user?.name || "");
    setNameError(null);
    setNameModalVisible(true);
  };

  const closeNameModal = () => {
    setNameModalVisible(false);
    setNameError(null);
  };

  const handleUpdateName = async () => {
    setNameError(null);
    const cleanName = newName.trim();
    if (!cleanName) {
      setNameError("El nombre de usuario no puede estar vacío");
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,35}$/;
    if (!usernameRegex.test(cleanName)) {
      setNameError(
        "El usuario debe tener entre 3 y 36 caracteres, comenzar con letra o número, y solo usar letras, números, '.', '_' o '-'"
      );
      return;
    }

    // Si es igual al nombre actual, simplemente cerramos sin error
    if (
      cleanName.toLowerCase() === (user?.name || "").toLowerCase() ||
      cleanName.toLowerCase() === (user?.$id || "").toLowerCase()
    ) {
      closeNameModal();
      return;
    }

    try {
      setNameLoading(true);
      const available = await isUsernameAvailable(cleanName, user?.$id);
      if (!available) {
        setNameError("Ese nombre de usuario ya se encuentra en uso por otra persona");
        return;
      }

      await updateUserName(cleanName);
      closeNameModal();
    } catch (err: any) {
      setNameError(err.message || "Error al actualizar el nombre");
    } finally {
      setNameLoading(false);
    }
  };

  const initialLetter = (user?.name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <Portal>
        {/* Modal Cambiar Nombre */}
        <Modal
          visible={nameModalVisible}
          onDismiss={closeNameModal}
          contentContainerStyle={styles.modalOverlay}
        >
          <Surface
            style={[
              styles.surfaceCard,
              { backgroundColor: theme.colors.elevation.level3 },
            ]}
            elevation={4}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>
              Editar nombre de usuario
            </Text>
            <Text variant="bodySmall" style={styles.modalSubtitle}>
              Elige un nombre de usuario único para identificarte
            </Text>

            <TextInput
              label="Nombre de usuario"
              value={newName}
              onChangeText={(text) => setNewName(text.replace(/\s+/g, ""))}
              autoCapitalize="none"
              autoCorrect={false}
              mode="outlined"
              maxLength={36}
              left={<TextInput.Icon icon="at" />}
              style={styles.modalInput}
            />

            {nameError && (
              <HelperText type="error" visible={!!nameError}>
                {nameError}
              </HelperText>
            )}

            <View style={styles.modalActions}>
              <Button mode="text" onPress={closeNameModal}>
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleUpdateName}
                loading={nameLoading}
                disabled={nameLoading}
                style={styles.modalSaveBtn}
              >
                Guardar
              </Button>
            </View>
          </Surface>
        </Modal>

        {/* Modal Cambiar Contraseña */}
        <Modal
          visible={visible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modalOverlay}
        >
          <Surface
            style={[
              styles.surfaceCard,
              { backgroundColor: theme.colors.elevation.level3 },
            ]}
            elevation={4}
          >
            <Text variant="titleLarge" style={styles.modalTitle}>
              Cambiar contraseña
            </Text>

            <Text variant="bodySmall" style={styles.modalSubtitle}>
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
              style={styles.modalInput}
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
              style={styles.modalInput}
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

            <View style={styles.modalActions}>
              <Button mode="text" onPress={closeModal}>
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleChangePassword}
                loading={loading}
                disabled={loading || success}
                style={styles.modalSaveBtn}
              >
                Guardar cambios
              </Button>
            </View>
          </Surface>
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
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text
                variant="headlineSmall"
                style={{
                  color: theme.colors.primary,
                  fontWeight: "800",
                  flex: 1,
                  letterSpacing: -0.5,
                }}
                numberOfLines={1}
              >
                @{user?.name || user?.$id || "usuario"}
              </Text>
              <IconButton
                icon="pencil-outline"
                size={22}
                onPress={openNameModal}
                style={{ margin: 0 }}
              />
            </View>
            <Text variant="bodyMedium" style={{ opacity: 0.65, marginTop: 2 }}>
              {user?.email || ""}
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
  modalOverlay: {
    paddingHorizontal: 16,
    justifyContent: "center", // 👈 Centrado vertical en el medio de la pantalla
    alignItems: "center",
    height: "100%",
  },
  surfaceCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
  },
  modalTitle: {
    fontWeight: "700",
    marginBottom: 4,
  },
  modalSubtitle: {
    opacity: 0.7,
    marginBottom: 16,
  },
  modalInput: {
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 18,
    gap: 8,
  },
  modalSaveBtn: {
    borderRadius: 12,
  },
});

