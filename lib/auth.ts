import { ID } from "react-native-appwrite";
import { account } from "./appwrite";

export const register = (email: string, password: string) =>
  account.create({ userId: ID.unique(), email, password });

export const login = (email: string, password: string) =>
  account.createEmailPasswordSession({ email, password });

export const logout = () => account.deleteSession({ sessionId: "current" });

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
