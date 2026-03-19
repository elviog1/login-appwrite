import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

type MarkerType = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  icon: string;
};

type Props = {
  markers: MarkerType[];
  mapRef: any;
  isMarking: boolean;
  onMapPress: (event: any) => void;
  onMarkerPress: (id: string) => void;
};

export const MapViewComponent = ({
  markers,
  mapRef,
  isMarking,
  onMapPress,
  onMarkerPress,
}: Props) => {
  return (
    <MapView
      style={styles.map}
      ref={mapRef}
      initialRegion={{
        latitude: -34.6037,
        longitude: -58.3816,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      onPress={onMapPress}
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
              onMarkerPress(marker.id);
            }
          }}
        >
          <View style={styles.markerContainer}>
            <FontAwesome name={marker.icon as any} size={24} color="#e53935" />
          </View>
        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#333",
    alignItems: "center",
    width: 40,
  },
});
