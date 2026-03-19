import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isMarking: boolean;
  selectedMarkerId: string | null;
  setIsMarking: (value: boolean) => void;
  onDelete: () => void;
  onEdit: () => void;
};

export const FloatingButtons = ({
  isMarking,
  selectedMarkerId,
  setIsMarking,
  onDelete,
  onEdit,
}: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isMarking ? styles.active : styles.inactive]}
        onPress={() => setIsMarking(true)}
      >
        <Text style={styles.text}>Marcar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, !isMarking ? styles.active : styles.inactive]}
        onPress={() => setIsMarking(false)}
      >
        <Text style={styles.text}>Seleccionar</Text>
      </TouchableOpacity>

      {selectedMarkerId && !isMarking && (
        <>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#e53935" }]}
            onPress={onDelete}
          >
            <Text style={styles.text}>Eliminar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ff9800" }]}
            onPress={onEdit}
          >
            <Text style={styles.text}>Editar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 15,
    top: 140,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  active: {
    backgroundColor: "#2196F3",
  },
  inactive: {
    backgroundColor: "#999",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
