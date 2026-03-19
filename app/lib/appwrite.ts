import { Account, Client, Databases, ID } from "react-native-appwrite";
import "react-native-url-polyfill/auto";

export const client = new Client();

client
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_SETPLATFORM!);

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

