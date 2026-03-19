import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

import { FloatingButtons } from "../components/FloatingButtons";
import { Header } from "../components/Header";
import { MapViewComponent } from "../components/MapViewComponent";
import { MarkerModal } from "../components/MarkerModal";
import { SearchBar } from "../components/SearchBar";

import { useAuth } from "../context/authContext";
import { useMarkers } from "../hooks/useMarkers";

export default function App() {
  const { user, signOut } = useAuth();
  const { markers, loadMarkers, addMarker, editMarker, removeMarker } =
    useMarkers(user);

  const [isMarking, setIsMarking] = useState(false);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState<any>(null);

  const [selectedIcon, setSelectedIcon] = useState("map-marker");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const mapRef = useRef<MapView>(null);

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

  useEffect(() => {
    loadMarkers();
  }, [user]);

  const addMarkerOnMap = (event: any) => {
    if (!isMarking) return;

    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoordinate({ latitude, longitude });
    setModalVisible(true);
  };

  const saveMarker = async () => {
    if (!selectedCoordinate) return;

    if (!title.trim() && !description.trim()) {
      setError("Título y descripción son obligatorios.");
      return;
    }
    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    setError("");

    if (isEditing && selectedMarkerId) {
      await editMarker(selectedMarkerId, {
        title,
        description,
        icon: selectedIcon,
      });
    } else {
      await addMarker({
        latitude: selectedCoordinate.latitude,
        longitude: selectedCoordinate.longitude,
        title,
        description,
        icon: selectedIcon,
        userId: user?.$id,
      });
    }

    // reset
    setTitle("");
    setDescription("");
    setSelectedIcon("map-marker");
    setModalVisible(false);
    setIsEditing(false);
  };

  const searchLocation = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json`,
        {
          headers: {
            "User-Agent": "MarkingApp",
            Accept: "application/json",
          },
        },
      );

      const data = await response.json();

      const place = data[0];

      const latitude = parseFloat(place.lat);
      const longitude = parseFloat(place.lon);

      const boundingBox = place.boundingbox;

      if (boundingBox) {
        const south = parseFloat(boundingBox[0]);
        const north = parseFloat(boundingBox[1]);
        const west = parseFloat(boundingBox[2]);
        const east = parseFloat(boundingBox[3]);

        mapRef.current?.fitToCoordinates(
          [
            { latitude: south, longitude: west },
            { latitude: north, longitude: east },
          ],
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          },
        );
      } else {
        // fallback si no hay boundingbox
        mapRef.current?.animateCamera({
          center: { latitude, longitude },
          zoom: 10,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Header onLogout={signOut} />

      <MapViewComponent
        markers={markers}
        mapRef={mapRef}
        isMarking={isMarking}
        onMapPress={addMarkerOnMap}
        onMarkerPress={(id) => setSelectedMarkerId(id)}
      />

      <SearchBar
        search={search}
        setSearch={setSearch}
        onSearch={() => searchLocation(search)}
      />

      <FloatingButtons
        isMarking={isMarking}
        selectedMarkerId={selectedMarkerId}
        setIsMarking={setIsMarking}
        onDelete={() => {
          if (selectedMarkerId) {
            removeMarker(selectedMarkerId);
            setSelectedMarkerId(null);
          }
        }}
        onEdit={() => {
          const marker = markers.find((m) => m.id === selectedMarkerId);
          if (!marker) return;

          setTitle(marker.title);
          setDescription(marker.description);
          setSelectedIcon(marker.icon);
          setSelectedCoordinate({
            latitude: marker.latitude,
            longitude: marker.longitude,
          });

          setIsEditing(true);
          setModalVisible(true);
        }}
      />

      <MarkerModal
        visible={modalVisible}
        isEditing={isEditing}
        title={title}
        description={description}
        selectedIcon={selectedIcon}
        error={error}
        icons={ICONS}
        onChangeTitle={setTitle}
        onChangeDescription={setDescription}
        onSelectIcon={setSelectedIcon}
        onClose={() => {
          setModalVisible(false);
          setIsEditing(false);
          setError("");
        }}
        onSave={saveMarker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
