import { useRouter } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Models } from "react-native-appwrite";
import { account } from "../lib/appwrite";
import * as auth from "../lib/auth";

type User = Models.User<Models.Preferences>;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
      setLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    await auth.login(email, password);
    await refreshUser();
  };

  const signUp = async (name: string, email: string, password: string) => {
    await auth.register(name, email, password);
    await refreshUser();
  };

  const signOut = async () => {
    try {
      await auth.logout();
      setUser(null);
      router.replace("/");
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get();
        setUser(session);
      } catch {
        setUser(null);
      }
    };

    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
