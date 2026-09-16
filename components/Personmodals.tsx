import { Person } from "@/lib/personService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  HelperText,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

interface PersonFormModalProps {
  visible: boolean;
  mode: "create" | "edit";
  person?: Person;
  onClose: () => void;
  onSave: (data: {
    firstName: string;
    lastName: string;
    birthDate: string;
    description?: string;
  }) => void;
  onDelete?: () => void;
  error?: string;
}

export function PersonFormModal({
  visible,
  mode,
  person,
  onClose,
  onSave,
  onDelete,
  error,
}: PersonFormModalProps) {
  const theme = useTheme();
  const isEdit = mode === "edit";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // 🔥 Sincroniza datos cuando cambia persona o se abre el modal
  useEffect(() => {
    if (visible) {
      if (isEdit && person) {
        setFirstName(person.firstName);
        setLastName(person.lastName);
        setDescription(person.description || "");
        setDate(person.birthDate ? new Date(person.birthDate) : new Date());
      } else {
        // Reset modo create
        setFirstName("");
        setLastName("");
        setDescription("");
        setDate(new Date());
      }
    }
  }, [person, visible, isEdit]);

  // ✅ Formato YYYY-MM-DD para backend
  const formatDateForBackend = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleSave = () => {
    Keyboard.dismiss();
    if (!firstName.trim() || !lastName.trim()) return;

    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate: formatDateForBackend(date),
      description: description.trim(),
    });

    if (!isEdit) {
      setFirstName("");
      setLastName("");
      setDescription("");
      setDate(new Date());
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleDelete = () => {
    Keyboard.dismiss();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalOverlay}
      >
        <Surface
          style={[
            styles.surfaceCard,
            { backgroundColor: theme.colors.elevation.level3 },
          ]}
          elevation={4}
        >
          {/* Header / Título */}
          <Text variant="titleLarge" style={styles.title}>
            {isEdit ? "Editar Persona" : "Agregar Nueva Persona"}
          </Text>

          {/* Formulario scrolleable */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              label="Nombre"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              dense
              maxLength={50}
              style={styles.input}
            />

            <TextInput
              label="Apellido"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              dense
              maxLength={50}
              style={styles.input}
            />

            <TextInput
              label="Fecha de nacimiento"
              value={date.toLocaleDateString("es-AR")}
              mode="outlined"
              dense
              style={styles.input}
              editable={false}
              right={
                <TextInput.Icon
                  icon="calendar"
                  onPress={() => {
                    Keyboard.dismiss();
                    setShowPicker(true);
                  }}
                />
              }
              onPressIn={() => {
                Keyboard.dismiss();
                setShowPicker(true);
              }}
            />

            {showPicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={(_, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}

            <TextInput
              label="Descripción (opcional)"
              value={description}
              onChangeText={(text) => {
                if (text.length <= 200) {
                  setDescription(text);
                }
              }}
              mode="outlined"
              dense
              multiline
              numberOfLines={2}
              maxLength={200}
              style={styles.input}
            />

            <Text style={styles.counter}>{description.length}/200</Text>

            {error && (
              <HelperText type="error" visible>
                {error}
              </HelperText>
            )}
          </ScrollView>

          {/* Botones de Acción dentro de la tarjeta */}
          <View style={styles.actionsContainer}>
            {isEdit && onDelete && (
              <Button
                onPress={handleDelete}
                textColor="#d32f2f"
                style={styles.deleteButton}
              >
                Eliminar
              </Button>
            )}
            <View style={styles.rightButtons}>
              <Button onPress={handleClose}>Cancelar</Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveBtn}
              >
                {isEdit ? "Guardar" : "Crear"}
              </Button>
            </View>
          </View>
        </Surface>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    paddingHorizontal: 16,
    justifyContent: "center", // 👈 Centrado en el medio de la pantalla
    alignItems: "center",
    height: "100%",
  },
  surfaceCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
  },
  title: {
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  scrollArea: {
    // Sin límite restrictivo de altura para que se muestre todo sin scrollear
  },
  scrollContent: {
    paddingVertical: 2,
  },
  input: {
    marginBottom: 10,
  },
  counter: {
    textAlign: "right",
    marginBottom: 4,
    opacity: 0.6,
    fontSize: 11,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(150, 150, 150, 0.25)",
  },
  deleteButton: {
    marginRight: "auto",
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 8,
  },
  saveBtn: {
    borderRadius: 12,
    paddingHorizontal: 8,
  },
});
