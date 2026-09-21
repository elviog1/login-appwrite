import { ID, Query } from "react-native-appwrite";
import { COLLECTION_ID, DATABASE_ID, databases, ENDPOINT, PROJECT_ID, account } from "./appwrite";

export const isUsernameAvailable = async (
  username: string,
  currentUserId?: string,
): Promise<boolean> => {
  const sanitized = username
    .trim()
    .toLowerCase()
    .replace(/^[^a-z0-9]+/, "")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 36);

  if (!sanitized) return false;
  if (currentUserId && sanitized === currentUserId.toLowerCase()) {
    return true;
  }

  // 1. Probar en Appwrite Auth mediante intento de recuperación
  try {
    const res = await fetch(`${ENDPOINT}/account/recovery`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": PROJECT_ID,
      },
      body: JSON.stringify({
        userId: sanitized,
        secret: "probe_token",
        password: "DummyPassword123!",
      }),
    });

    // 401 significa que el usuario existe en Auth (user_invalid_token)
    if (res.status === 401) {
      return false;
    }
  } catch (e) {
    console.error("Error probing username in Auth:", e);
  }

  // 2. Verificar en la colección 'persons'
  try {
    const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", sanitized),
      Query.limit(1),
    ]);
    if (docs.documents.length > 0) {
      const doc = docs.documents[0] as any;
      if (!currentUserId || doc.userId.toLowerCase() !== currentUserId.toLowerCase()) {
        return false;
      }
    }
  } catch (e) {
    console.error("Error checking username in database:", e);
  }

  return true;
};

export const register = (email: string, password: string, name: string) => {
  const sanitizedUserId = name
    .trim()
    .toLowerCase()
    .replace(/^[^a-z0-9]+/, "")
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 36);

  return account.create({
    userId: sanitizedUserId || ID.unique(),
    email,
    password,
    name: name.trim(),
  });
};

export const updateName = (name: string) =>
  account.updateName({ name: name.trim() });

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
