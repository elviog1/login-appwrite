import "react-native-url-polyfill/auto";
import { Account, Client, Databases, TablesDB } from "react-native-appwrite";

export const ENDPOINT = process.env.EXPO_PUBLIC_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
export const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID || "697992680031f91b31f1";
export const PLATFORM = process.env.EXPO_PUBLIC_PLATFORM || "com.ideas";

const client = new Client();
client
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setPlatform(PLATFORM);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const databases = new Databases(client);

// Configuración de la base de datos
export const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID || "697e3ddb003700081cce";
export const COLLECTION_ID = process.env.EXPO_PUBLIC_COLLECTION_ID || "persons";
