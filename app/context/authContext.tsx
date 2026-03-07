import { createContext, useContext, useEffect, useState } from "react";
import type { Models } from "react-native-appwrite";
import * as auth from "../lib/auth";

type User = Models.User<Models.Preferences>;
type AuthContextType = {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
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
    await auth.login(email, password);
    await syncUser();
  };

  const signUp = async (name: string, email: string, password: string) => {
    await auth.register(name, email, password);
    await syncUser();
  };

  const signOut = async () => {
    try {
      await auth.logout();
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
