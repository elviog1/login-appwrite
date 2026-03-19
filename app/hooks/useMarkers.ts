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

type CreateMarkerDTO = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  icon: string;
  userId?: string;
};

export const useMarkers = (user: any) => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  const loadMarkers = async () => {
    if (!user) return;

    try {
      const docs = await getMarkers(user.$id);
      if (!docs) return;

      const formatted: MarkerType[] = docs.map((doc: any) => ({
        id: doc.$id,
        latitude: doc.latitude,
        longitude: doc.longitude,
        title: doc.title,
        description: doc.description,
        icon: doc.icon,
      }));

      setMarkers(formatted);
    } catch (error) {
      console.log("Error loading markers:", error);
    }
  };

  const addMarker = async (data: CreateMarkerDTO) => {
    try {
      const response = await createMarker(data);
      if (!response) return;

      setMarkers((prev) => [
        ...prev,
        {
          id: response.$id,
          latitude: response.latitude,
          longitude: response.longitude,
          title: response.title,
          description: response.description,
          icon: response.icon,
        },
      ]);
    } catch (error) {
      console.log("Error creating marker:", error);
    }
  };

  const editMarker = async (id: string, data: Partial<CreateMarkerDTO>) => {
    try {
      await updateMarker(id, data);
      await loadMarkers();
    } catch (error) {
      console.log("Error updating marker:", error);
    }
  };

  const removeMarker = async (id: string) => {
    try {
      await deleteMarker(id);
      await loadMarkers();
      setSelectedMarkerId(null);
    } catch (error) {
      console.log("Error deleting marker:", error);
    }
  };

  return {
    markers,
    selectedMarkerId,
    setSelectedMarkerId,
    loadMarkers,
    addMarker,
    editMarker,
    removeMarker,
  };
};
