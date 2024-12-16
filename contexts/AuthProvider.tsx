"use client";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext({
  user: null,
  signin: async (email: string, password: string) => {},
  signup: async (email: string, password: string, name: string) => {},
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
        const response = await fetch("http://localhost:8000/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        router.push("/profile");
      } else {
        console.error("Signup failed.");
      }
    } catch (err) {
      console.error("Error during signup:", err);
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

  const value = { user, signin, signup, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {/* {!loading && children} */}{" "}
      {/* Uncomment this line to prevent rendering children until user is loaded */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
