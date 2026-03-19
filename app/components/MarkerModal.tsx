import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  isEditing: boolean;
  title: string;
  description: string;
  selectedIcon: string;
  error: string;
  icons: string[];
  onChangeTitle: (text: string) => void;
  onChangeDescription: (text: string) => void;
  onSelectIcon: (icon: string) => void;
  onClose: () => void;
  onSave: () => void;
};

export const MarkerModal = ({
  visible,
  isEditing,
  title,
  description,
  selectedIcon,
  error,
  icons,
  onChangeTitle,
  onChangeDescription,
  onSelectIcon,
  onClose,
  onSave,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {isEditing ? "Editar marcador" : "Nuevo marcador"}
          </Text>

          <TextInput
            placeholder="Título"
            style={styles.input}
            value={title}
            onChangeText={onChangeTitle}
            maxLength={20}
          />

          <TextInput
            placeholder="Descripción"
            style={styles.input}
            value={description}
            onChangeText={onChangeDescription}
            maxLength={50}
          />

          {error ? (
            <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
          ) : null}

          <Text style={{ marginBottom: 5 }}>Seleccionar icono</Text>

          <View style={styles.iconSelector}>
            {icons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconButton,
                  selectedIcon === icon && styles.iconSelected,
                ]}
                onPress={() => onSelectIcon(icon)}
              >
                <FontAwesome name={icon as any} size={24} color="#333" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonText: { color: "white", fontWeight: "bold" },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelButton: {
    backgroundColor: "#999",
    padding: 10,
    borderRadius: 6,
  },

  saveButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 6,
  },

  iconSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  iconButton: {
    padding: 8,
    margin: 4,
    borderRadius: 6,
    backgroundColor: "#eee",
  },

  iconSelected: {
    backgroundColor: "#2196F3",
  },
});
