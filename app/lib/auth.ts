import { ID } from "react-native-appwrite";
import { account } from "./appwrite";

export const register = (name: string, email: string, password: string) =>
  account.create({ userId: ID.unique(), email, password });

export const login = async (email: string, password: string) => {
  try {
    // eliminar sesiones previas
    try {
      await account.deleteSessions();
    } catch {}

    return await account.createEmailPasswordSession({
      email,
      password,
    });
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.log("Logout error:", error);
  }
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  return await account.updatePassword({ password: newPassword, oldPassword });
};
