import { Account, Client, Databases, ID } from "react-native-appwrite";
import "react-native-url-polyfill/auto";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("69aa1cba0002c9d29793")
  .setPlatform("com.marking.app");

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

