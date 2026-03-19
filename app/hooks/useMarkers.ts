import { useState } from "react";
import {
    createMarker,
    deleteMarker,
    getMarkers,
    updateMarker,
} from "../lib/markerService";
export type MarkerType = {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  icon: string;
};
export const useMarkers = (user: any) => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);

  const loadMarkers = async () => {
    if (!user) return;
    const docs = await getMarkers(user.$id);

    const formatted: MarkerType[] = docs.map((doc: any) => ({
      id: doc.$id,
      latitude: doc.latitude,
      longitude: doc.longitude,
      title: doc.title,
      description: doc.description,
      icon: doc.icon,
    }));

    setMarkers(formatted);
  };

  const addMarker = async (data: any) => {
    const response = await createMarker(data);
    if (!response) return;

    setMarkers((prev: any) => [
      ...prev,
      {
        id: response.$id,
        ...data,
      },
    ]);
  };

  const editMarker = async (id: string, data: any) => {
    await updateMarker(id, data);
    await loadMarkers();
  };

  const removeMarker = async (id: string) => {
    await deleteMarker(id);
    await loadMarkers();
  };

  return {
    markers,
    loadMarkers,
    addMarker,
    editMarker,
    removeMarker,
  };
};
