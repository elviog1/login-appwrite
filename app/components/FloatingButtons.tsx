import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export const FloatingButtons = ({
  isMarking,
  setIsMarking,
  onDelete,
  onEdit,
  selectedMarkerId,
}: any) => (
  <View style={styles.buttonsContainer}>
    <TouchableOpacity onPress={() => setIsMarking(true)}>
      <Text>Marcar</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => setIsMarking(false)}>
      <Text>Seleccionar</Text>
    </TouchableOpacity>

    {selectedMarkerId && (
      <>
        <TouchableOpacity onPress={onDelete}>
          <Text>Eliminar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onEdit}>
          <Text>Editar</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  buttonsContainer: { position: "absolute", right: 15, top: 140 },
});
