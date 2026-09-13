import { Person } from "@/lib/personService";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet } from "react-native";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
  TextInput,
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

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose} style={styles.dialog}>
        <Dialog.Title>
          {isEdit ? "Editar Persona" : "Agregar Nueva Persona"}
        </Dialog.Title>

        <Dialog.ScrollArea>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TextInput
              label="Nombre"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              maxLength={50}
              style={styles.input}
            />

            <TextInput
              label="Apellido"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              maxLength={50}
              style={styles.input}
            />

            <TextInput
              label="Fecha de nacimiento"
              value={date.toLocaleDateString("es-AR")}
              mode="outlined"
              style={styles.input}
              editable={false}
              right={
                <TextInput.Icon
                  icon="calendar"
                  onPress={() => setShowPicker(true)}
                />
              }
              onPressIn={() => setShowPicker(true)}
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
              multiline
              numberOfLines={3}
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
        </Dialog.ScrollArea>

        <Dialog.Actions>
          {isEdit && onDelete && (
            <Button onPress={onDelete} textColor="red">
              Eliminar
            </Button>
          )}
          <Button onPress={onClose}>Cancelar</Button>
          <Button onPress={handleSave}>{isEdit ? "Guardar" : "Crear"}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    maxHeight: "80%",
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  input: {
    marginBottom: 12,
  },
  counter: {
    textAlign: "right",
    marginBottom: 12,
    opacity: 0.6,
    fontSize: 12,
  },
});
