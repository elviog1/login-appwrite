import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";

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
  isMarking: boolean;
  onMapPress: (event: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => void;
  onMarkerPress: (id: string) => void;
};

// Íconos de Leaflet mapeados desde tus FontAwesome icons
const ICON_COLORS: Record<string, string> = {
  "map-marker": "#e53935",
  home: "#1e88e5",
  user: "#8e24aa",
  tree: "#43a047",
  car: "#fb8c00",
  cutlery: "#f4511e",
  heart: "#e91e63",
  star: "#fdd835",
};

// Íconos unicode aproximados para cada tipo
const ICON_SYMBOLS: Record<string, string> = {
  "map-marker": "📍",
  home: "🏠",
  user: "👤",
  tree: "🌳",
  car: "🚗",
  cutlery: "🍴",
  heart: "❤️",
  star: "⭐",
};

export type MapViewRef = {
  fitToCoordinates: (
    coords: { latitude: number; longitude: number }[],
    options?: any,
  ) => void;
  animateCamera: (options: {
    center: { latitude: number; longitude: number };
    zoom: number;
  }) => void;
};

export const MapViewComponent = forwardRef<MapViewRef, Props>(
  ({ markers, isMarking, onMapPress, onMarkerPress }, ref) => {
    const webViewRef = useRef<WebView>(null);
    const [mapReady, setMapReady] = React.useState(false);

    // Exponemos métodos para controlar el mapa desde el padre
    useImperativeHandle(ref, () => ({
      fitToCoordinates(coords, options) {
        const js = `
          if (window.mapInstance) {
            var bounds = ${JSON.stringify(
              coords.map((c) => [c.latitude, c.longitude]),
            )};
            window.mapInstance.fitBounds(bounds, { padding: [50, 50] });
          }
          true;
        `;
        webViewRef.current?.injectJavaScript(js);
      },
      animateCamera({ center, zoom }) {
        const js = `
          if (window.mapInstance) {
            window.mapInstance.setView([${center.latitude}, ${center.longitude}], ${zoom});
          }
          true;
        `;
        webViewRef.current?.injectJavaScript(js);
      },
    }));

    // Serializamos los marcadores para inyectarlos en el HTML
    const markersJson = JSON.stringify(
      markers.map((m) => ({
        id: m.id,
        lat: m.latitude,
        lng: m.longitude,
        title: m.title,
        description: m.description,
        symbol: ICON_SYMBOLS[m.icon] || "📍",
        color: ICON_COLORS[m.icon] || "#e53935",
      })),
    );

    const html = React.useMemo(() => {
      return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

  <!-- 🔥 IMPORTANTE -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }

    .custom-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 50%;
      border: 2px solid #333;
      font-size: 20px;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    var isMarking = false;
    window.currentMarkers = [];

    var map = L.map('map', { zoomControl: true }).setView([-34.6037, -58.3816], 13);
    window.mapInstance = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    window.updateMarkers = function(markers) {
      if (window.currentMarkers) {
        window.currentMarkers.forEach(m => map.removeLayer(m));
      }

      window.currentMarkers = [];

      markers.forEach(function(m) {
        var icon = L.divIcon({
          html: '<div class="custom-marker">' + m.symbol + '</div>',
          className: '',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
        });

        var marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

        marker.bindPopup('<b>' + m.title + '</b><br>' + m.description);

        marker.on('click', function() {
          if (!isMarking) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'MARKER_PRESS',
              id: m.id
            }));
          }
        });

        window.currentMarkers.push(marker);
      });
    };

    map.on('click', function(e) {
      if (!isMarking) return;

      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'MAP_PRESS',
        latitude: e.latlng.lat,
        longitude: e.latlng.lng
      }));
    });
  </script>
</body>
</html>
  `;
    }, []);

    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === "MAP_PRESS") {
          onMapPress({
            nativeEvent: {
              coordinate: {
                latitude: data.latitude,
                longitude: data.longitude,
              },
            },
          });
        } else if (data.type === "MARKER_PRESS") {
          onMarkerPress(data.id);
        }
      } catch (e) {
        console.log("WebView message error:", e);
      }
    };

    // Cuando cambia isMarking, lo sincronizamos con el webview
    React.useEffect(() => {
      if (!mapReady) return;
      const js = `isMarking = ${isMarking}; true;`;
      webViewRef.current?.injectJavaScript(js);
    }, [isMarking, mapReady]);

    React.useEffect(() => {
      if (!mapReady) return;
      const formatted = markers.map((m) => ({
        id: m.id,
        lat: m.latitude,
        lng: m.longitude,
        title: m.title,
        description: m.description,
        symbol: ICON_SYMBOLS[m.icon] || "📍",
      }));

      const js = `
    if (window.updateMarkers) {
      window.updateMarkers(${JSON.stringify(formatted)});
    }
    true;
  `;

      webViewRef.current?.injectJavaScript(js);
    }, [markers, mapReady]);

    return (
      <WebView
        ref={webViewRef}
        style={styles.map}
        source={{ html }}
        onMessage={handleMessage}
        javaScriptEnabled
        originWhitelist={["*"]}
        // Importante para que cargue recursos externos (Leaflet CDN)
        mixedContentMode="always"
        onLoadEnd={() => setMapReady(true)}
      />
    );
  },
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
