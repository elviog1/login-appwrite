import { PersonFormModal } from "@/components/Personmodals";
import TreeNode from "@/components/TreeNode";
import { useAuth } from "@/contexts/auth-context";

import {
  createPerson,
  deletePerson,
  getFamilyTree,
  Person,
  updatePerson,
} from "@/lib/personService";

import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  FAB,
  Snackbar,
  Text,
  useTheme,
} from "react-native-paper";

export default function HomeScreen() {
  const theme = useTheme();
  const { user } = useAuth();

  const [familyTree, setFamilyTree] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Modal state unificado
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [parentForNewPerson, setParentForNewPerson] = useState<Person | null>(
    null,
  );
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<
    "success" | "error" | "warning"
  >("success");

  const showMessage = (
    message: string,
    type: "success" | "error" | "warning" = "success",
  ) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  const isModalVisible = modalMode !== null;

  // =============================
  // Cargar árbol
  // =============================
  const loadFamilyTree = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const tree = await getFamilyTree(user.$id);
      setFamilyTree(tree);
      setError("");
    } catch (err) {
      console.error("Error loading family tree:", err);
      setError("Error al cargar el árbol genealógico");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFamilyTree();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadFamilyTree();
  };

  // =============================
  // Crear persona
  // =============================
  const handleCreate = async (data: {
    firstName: string;
    lastName: string;
    birthDate: string;
    description?: string;
  }) => {
    if (!user) return;

    try {
      await createPerson(user.$id, {
        ...data,
        parentId: parentForNewPerson ? parentForNewPerson.$id : null,
      });

      await loadFamilyTree();
      closeModal();
      setError("");
      showMessage("Persona creada correctamente 🎉", "success");
    } catch (err) {
      console.error("Error creating person:", err);
      setError("Error al crear la persona");
      showMessage("Error al crear la persona 🗑️");
    }
  };

  // =============================
  // Editar persona
  // =============================
  const handleEdit = async (data: {
    firstName: string;
    lastName: string;
    birthDate: string;
    description?: string;
  }) => {
    if (!selectedPerson) return;

    try {
      await updatePerson(selectedPerson.$id, data);
      await loadFamilyTree();
      closeModal();
      setError("");
      showMessage("Persona actualizada correctamente ✨", "warning");
    } catch (err) {
      console.error("Error updating person:", err);
      setError("Error al actualizar la persona");
      showMessage("Error al actualizar la persona 🗑️", "error");
    }
  };

  // =============================
  // Eliminar persona
  // =============================
  const handleDelete = async () => {
    if (!selectedPerson) return;

    try {
      await deletePerson(selectedPerson.$id);
      await loadFamilyTree();
      closeModal();
      setError("");
      showMessage("Persona eliminada correctamente 🗑️", "error");
    } catch (err) {
      console.error("Error deleting person:", err);
      setError("Error al eliminar la persona");
      showMessage("Error al eliminar la persona 🗑️", "error");
    }
  };

  // =============================
  // Modal helpers
  // =============================
  const openCreateRoot = () => {
    setParentForNewPerson(null);
    setModalMode("create");
  };

  const openCreateChild = (parent: Person) => {
    setParentForNewPerson(parent);
    setModalMode("create");
  };

  const openEdit = (person: Person) => {
    setSelectedPerson(person);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPerson(null);
    setParentForNewPerson(null);
  };

  // =============================
  // Render
  // =============================
  if (!user) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text variant="headlineSmall">
          Debes iniciar sesión para ver tu árbol genealógico
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View
        style={[
          styles.centerContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Cargando árbol genealógico...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {familyTree.length === 0 ? (
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.emptyIconCircle,
              { backgroundColor: theme.colors.primaryContainer },
            ]}
          >
            <Avatar.Icon
              size={80}
              icon="tree"
              style={{ backgroundColor: "transparent" }}
              color={theme.colors.primary}
            />
          </View>

          <Text variant="headlineSmall" style={styles.emptyText}>
            Tu árbol está listo para crecer 🌱
          </Text>

          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Comienza registrando al primer miembro o antepasado de tu familia.
          </Text>

          <Button
            mode="contained"
            icon="plus"
            onPress={openCreateRoot}
            style={styles.emptyButton}
            contentStyle={{ paddingVertical: 6, paddingHorizontal: 12 }}
          >
            Agregar primera persona
          </Button>
        </View>
      ) : (
        <>
          <ScrollView horizontal contentContainerStyle={{ flexGrow: 1 }}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.colors.primary]}
                />
              }
            >
              {familyTree.map((root) => (
                <TreeNode
                  key={root.$id}
                  person={root}
                  onEdit={openEdit}
                  onCreate={openCreateChild}
                  isRoot
                />
              ))}
            </ScrollView>
          </ScrollView>

          <FAB
            icon="plus"
            style={[styles.fab, { backgroundColor: theme.colors.primary }]}
            color={theme.colors.onPrimary}
            onPress={openCreateRoot}
            label="Nueva raíz"
          />
        </>
      )}

      {/* 🔥 Modal SIEMPRE renderizado */}
      <PersonFormModal
        visible={isModalVisible}
        mode={modalMode === "edit" ? "edit" : "create"}
        person={selectedPerson || undefined}
        onClose={closeModal}
        onSave={modalMode === "edit" ? handleEdit : handleCreate}
        onDelete={modalMode === "edit" ? handleDelete : undefined}
        error={error}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor:
            snackbarType === "success"
              ? "#a1ffa5"
              : snackbarType === "error"
                ? "#ff9c9c"
                : "#ffe282",
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  emptyText: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 24,
    maxWidth: 280,
  },
  emptyButton: {
    borderRadius: 12,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
});
