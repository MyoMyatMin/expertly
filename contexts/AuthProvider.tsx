"use client";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/helper/apihelper"; // Import the helper function

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

const AuthContext = createContext<{
  user: User | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}>({
  user: null,
  signin: async () => {},
  signup: async () => {},
  logout: async () => {},
  loading: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    const response = await fetch("http://localhost:8000/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData.user);
    } else if (response.status === 401) {
      const errorData = await response.json();
      console.log(errorData.error);
      if (errorData.error === "token is expired") {
        console.log("Token is expired, attempting to refresh...");
        await handleRefreshAndCheckUser();
      } else {
        setUser(null);
        console.log("User session invalid. Redirecting to sign-in.");
        router.push("/auth/signin");
      }
    } else {
      setUser(null);
      console.log("User session invalid. Redirecting to sign-in.");
      router.push("/auth/signin");
    }
  };

  const handleRefreshAndCheckUser = async () => {
    try {
      await refreshToken();
      await fetchUser();
    } catch (err) {
      console.error("Error refreshing token:", err);
      setUser(null);
      router.push("/auth/signin");
    }
  };

  const checkUser = async () => {
    setLoading(true);
    try {
      await fetchUser();
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dummyUsers = [
      {
        ID: "d3a23455-a403-49b9-957a-3c6f90f5cf99",
        Name: "MMM",
        Email: "mmm@gmail.com",
        Role: {
          String: "moderator", //'user', 'contributor', 'moderator', 'superadmin'
          Valid: true,
        },
        SuspendedUntil: {
          Time: "0001-01-01T00:00:00Z",
          Valid: false,
        },
      },
    ];
    // checkUser();
    const authenticatedUser = dummyUsers[0]; // null if u want to see sigin
    setUser(authenticatedUser);
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
        setUser(userData.user);
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
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
      });

      if (response.ok) {
        setUser(null);
        router.push("/auth/signin");
      } else {
        console.error("Logout failed.");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const value = { user, signin, signup, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
