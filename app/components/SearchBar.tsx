import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export const SearchBar = ({ search, setSearch, onSearch }: any) => (
  <View style={styles.searchContainer}>
    <TextInput
      placeholder="Buscar..."
      style={styles.searchInput}
      value={search}
      onChangeText={setSearch}
    />
    <TouchableOpacity style={styles.searchButton} onPress={onSearch}>
      <Text style={{ color: "white" }}>Buscar</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: 80,
    left: 15,
    right: 15,
    flexDirection: "row",
    zIndex: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },

  searchButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 15,
    justifyContent: "center",
    borderRadius: 8,
  },
});
