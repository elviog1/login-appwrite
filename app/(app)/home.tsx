import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useAuth } from "../context/authContext";
import {
  createMarker,
  deleteMarker,
  getMarkers,
  updateMarker,
} from "../lib/markerService";
type MarkerType = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  icon: string;
};
export default function App() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [isMarking, setIsMarking] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState<any>(null);
  const [selectedIcon, setSelectedIcon] = useState("map-marker");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const mapRef = useRef<MapView>(null);
  const [search, setSearch] = useState("");
  const ICONS = [
    "map-marker",
    "home",
    "user",
    "tree",
    "car",
    "cutlery",
    "heart",
    "star",
  ];
  const addMarker = (event: any) => {
    if (!isMarking) return;
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoordinate({ latitude, longitude });
    setModalVisible(true);
  };
  const saveMarker = async () => {
    if (!selectedCoordinate) return;

    if (!title.trim() && !description.trim()) {
      setError("El título y descripción son obligatorios.");
      return;
    }
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!description.trim()) {
      setError("La descripción es obligatorio.");
      return;
    }

    setError("");
    if (isEditing && selectedMarkerId) {
      await updateMarker(selectedMarkerId, {
        title,
        description,
        icon: selectedIcon,
      });

      await loadMarkers();
      setIsEditing(false);
      setSelectedMarkerId(null);
    } else {
      const response = await createMarker({
        latitude: selectedCoordinate.latitude,
        longitude: selectedCoordinate.longitude,
        title,
        description,
        icon: selectedIcon,
        userId: user?.$id,
      });

      if (!response) return;

      const newMarker: MarkerType = {
        id: response.$id,
        latitude: response.latitude,
        longitude: response.longitude,
        title: response.title,
        description: response.description,
        icon: response.icon,
      };

      setMarkers((prev) => [...prev, newMarker]);
    }

    setTitle("");
    setDescription("");
    setSelectedIcon("map-marker");
    setModalVisible(false);
    setError("");
  };

  const handleDeleteMarker = async () => {
    if (!selectedMarkerId) return;

    await deleteMarker(selectedMarkerId);

    //if (!success) return;

    await loadMarkers();

    //setMarkers((prev) => prev.filter((m) => m.id !== selectedMarkerId));
    setSelectedMarkerId(null);
  };

  const loadMarkers = async () => {
    if (!user) return;
    const docs = await getMarkers(user.$id);

    if (!docs) return;

    const formatted = docs.map((doc: any) => ({
      id: doc.$id,
      latitude: doc.latitude,
      longitude: doc.longitude,
      title: doc.title,
      description: doc.description,
      icon: doc.icon,
    }));

    setMarkers(formatted);
  };

  const searchLocation = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json`,
        {
          headers: {
            "User-Agent": "MarkingApp (tuemail@email.com)",
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.length === 0) {
        setError("No se encontró el lugar");
        return;
      }

      const place = data[0];

      const latitude = parseFloat(place.lat);
      const longitude = parseFloat(place.lon);

      mapRef.current?.animateCamera({
        center: {
          latitude,
          longitude,
        },
        zoom: 7,
      });
      console.log("LAT:", latitude, "LNG:", longitude);
    } catch (error) {
      console.log("Error searching location:", error);
    }
  };

  useEffect(() => {
    loadMarkers();
  }, [user]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MarkingApp</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        ref={mapRef}
        initialRegion={{
          latitude: -34.6037,
          longitude: -58.3816,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={addMarker}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
            onPress={() => {
              if (!isMarking) {
                setSelectedMarkerId(marker.id);
              }
            }}
          >
            <View style={styles.markerContainer}>
              <FontAwesome
                name={marker.icon as any}
                size={24}
                color="#e53935"
              />
            </View>
          </Marker>
        ))}
      </MapView>
      {/* BOTONES */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar ciudad, país..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => searchLocation(search)}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Buscar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            isMarking ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsMarking(true)}
        >
          <Text style={styles.buttonText}>Marcar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            !isMarking ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsMarking(false)}
        >
          <Text style={styles.buttonText}>Seleccionar</Text>
        </TouchableOpacity>
        {selectedMarkerId && !isMarking && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#e53935" }]}
            onPress={handleDeleteMarker}
          >
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        )}
        {selectedMarkerId && !isMarking && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#ff9800" }]}
            onPress={() => {
              const markerToEdit = markers.find(
                (m) => m.id === selectedMarkerId,
              );
              if (!markerToEdit) return;

              setTitle(markerToEdit.title);
              setDescription(markerToEdit.description);
              setSelectedIcon(markerToEdit.icon);
              setSelectedCoordinate({
                latitude: markerToEdit.latitude,
                longitude: markerToEdit.longitude,
              });

              setIsEditing(true);
              setModalVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Editar marcador" : "Nuevo marcador"}
            </Text>

            <TextInput
              placeholder="Título"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              maxLength={20}
            />
            <TextInput
              placeholder="Descripción"
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              maxLength={50}
            />
            {error ? (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}
            <Text style={{ marginBottom: 5 }}>Seleccionar icono</Text>
            <View style={styles.iconSelector}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconButton,
                    selectedIcon === icon && styles.iconSelected,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <FontAwesome name={icon as any} size={24} color="#333" />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setIsEditing(false);
                  setError("");
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveMarker}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonsContainer: { position: "absolute", right: 15, top: 140 },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
  },
  activeButton: { backgroundColor: "#2196F3" },
  inactiveButton: { backgroundColor: "#999" },
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
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  cancelButton: { backgroundColor: "#999", padding: 10, borderRadius: 6 },
  saveButton: { backgroundColor: "#2196F3", padding: 10, borderRadius: 6 },
  markerContainer: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    width: 40,
  },
  iconSelector: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  iconButton: {
    padding: 8,
    margin: 4,
    borderRadius: 6,
    backgroundColor: "#eee",
  },
  iconSelected: { backgroundColor: "#2196F3" },
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
