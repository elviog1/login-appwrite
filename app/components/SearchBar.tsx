import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  search: string;
  setSearch: (text: string) => void;
  onSearch: () => void;
};

export const SearchBar = ({ search, setSearch, onSearch }: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar ciudad, país..."
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity style={styles.button} onPress={onSearch}>
        <Text style={styles.text}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 80,
    left: 15,
    right: 15,
    flexDirection: "row",
    zIndex: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
