import { Query } from "react-native-appwrite";
import { databases, ID } from "./appwrite";

const DATABASE_ID = "69b6e43d0013d9c895c9";
const COLLECTION_ID = "mark";

export const createMarker = async (marker: any) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      marker,
    );

    return response;
  } catch (error) {
    console.log("Error creating marker:", error);
  }
};

export const getMarkers = async (userId: string) => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId), // 🔥 FILTRO CLAVE
  ]);

  return response.documents;
};

export const deleteMarker = async (markerId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, markerId);
  } catch (error) {
    console.log("Error deleting marker", error);
    return false;
  }
};

export const updateMarker = async (
  markerId: string,
  data: {
    title?: string;
    description?: string;
    icon?: string;
  },
) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      markerId,
      data,
    );

    return response;
  } catch (error) {
    console.log("Error updating marker:", error);
    return null;
  }
};
