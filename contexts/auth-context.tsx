import { createContext, useContext, useEffect, useState } from "react";
import type { Models } from "react-native-appwrite";
import * as auth from "../lib/auth";

type User = Models.User<Models.Preferences>;
export type { User };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  updateUserName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const syncUser = async () => {
    const currentUser = await auth.getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    (async () => {
      await syncUser();
      setLoading(false);
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await auth.logout();
    } catch {
      // Ignorar si no había sesión previa
    }
    const cleanEmail = email.trim().toLowerCase();
    await auth.login(cleanEmail, password);
    await syncUser();
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      await auth.logout();
    } catch {
      // Ignorar si no había sesión previa
    }
    const cleanEmail = email.trim().toLowerCase();
    await auth.register(cleanEmail, password, name.trim());
    await auth.login(cleanEmail, password);
    await syncUser();
  };

  const updateUserName = async (name: string) => {
    await auth.updateName(name);
    await syncUser();
  };

  const signOut = async () => {
    try {
      await auth.logout();
    } catch {
      // Ignorar
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, updateUserName, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
