"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  signin: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}
const AuthContext = createContext({
  user: null,
  signin: async (email: string, password: string) => {},
  logout: async () => {},
  loading: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();
  }, []);
  const signin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        router.push("/profile");
      } else {
        console.error("Login failed.");
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        setUser(null);
        router.push("/login");
      } else {
        console.error("Logout failed.");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const value = { user, signin, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
