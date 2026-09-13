import { Account, Client, Databases, TablesDB } from "react-native-appwrite";

const client = new Client();
client
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("697992680031f91b31f1")
  .setPlatform("com.ideas");

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const databases = new Databases(client);
// Configuración de la base de datos
export const DATABASE_ID = process.env.EXPO_PUBLIC_DATABASE_ID!;
export const COLLECTION_ID = process.env.EXPO_PUBLIC_COLLECTION_ID!;
