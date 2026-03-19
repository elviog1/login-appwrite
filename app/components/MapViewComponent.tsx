import { FontAwesome } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

export const MapViewComponent = ({
  markers,
  onPressMap,
  onSelectMarker,
  mapRef,
}: any) => (
  <MapView
    style={{ flex: 1 }}
    ref={mapRef}
    initialRegion={{
      latitude: -34.6037,
      longitude: -58.3816,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }}
    onPress={onPressMap}
  >
    {markers.map((marker: any) => (
      <Marker
        key={marker.id}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        onPress={() => onSelectMarker(marker.id)}
      >
        <FontAwesome name={marker.icon} size={24} color="red" />
      </Marker>
    ))}
  </MapView>
);
