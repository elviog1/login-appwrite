import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export const Header = ({ onLogout }: any) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>MarkingApp</Text>
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#2196F3",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    zIndex: 10,
    paddingBottom: 7,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#e53935",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});
