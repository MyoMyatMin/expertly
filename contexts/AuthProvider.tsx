"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/helper/axiosInstance";

interface User {
  ID: string;
  Name: string;
  Email: string;
  Role: {
    String: string;
    Valid: boolean;
  };
  SuspendedUntil: {
    Time: string;
    Valid: boolean;
  };
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signin: async () => {},
  signup: async () => {},
  logout: async () => {},
  loading: false,
  error: null,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = () => setError(null);

  const checkUser = async () => {
    setLoading(true);
    clearError();

    try {
      const response = await api.protected.getMe();
      console.log("User fetched:", response);
      setUser(response.user);
    } catch (err: any) {
      console.log("Here is auth context");
      console.error("Error fetching user:", err);
      setUser(null);

      // Only redirect to signin if not already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/auth/")) {
        router.push("/auth/signin");
      }
    } finally {
      setLoading(false);
    }
    //loadDummyUser();
  };

  useEffect(() => {
    checkUser();
  }, []);

  const signin = async (email: string, password: string) => {
    setLoading(true);
    clearError();

    try {
      const response = await api.public.signin(email, password);
      setUser(response.user);
      router.push("/profile");
    } catch (err: any) {
      console.error("Error during login:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    clearError();

    try {
      const response = await api.public.signup(email, password, name);
      setUser(response.user);
      router.push("/profile");
    } catch (err: any) {
      console.error("Error during signup:", err);
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    clearError();

    try {
      await api.protected.logout();
      setUser(null);
      router.push("/auth/signin");
    } catch (err: any) {
      console.error("Error during logout:", err);
      setError(
        err.response?.data?.message || "Logout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDummyUser = () => {
    const dummyUser: User = {
      ID: "d3a23455-a403-49b9-957a-3c6f90f5cf99",
      Name: "MMM",
      Email: "mmm@gmail.com",
      Role: {
        String: "contributor",
        Valid: true,
      },
      SuspendedUntil: {
        Time: "0001-01-01T00:00:00Z",
        Valid: false,
      },
    };
    setUser(dummyUser);
  };

  const value: AuthContextType = {
    user,
    signin,
    signup,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
