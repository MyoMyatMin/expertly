"use client";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  // const [user, setUser] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const dummyUsers = [
      {
        ID: "d3a23455-a403-49b9-957a-3c6f90f5cf99",
        Name: "MMM",
        Email: "mmm@gmail.com",
        Role: {
          String: "user", //'user', 'contributor', 'moderator', 'superadmin'
          Valid: true,
        },
        SuspendedUntil: {
          Time: "0001-01-01T00:00:00Z",
          Valid: false,
        },
      },
    ];
    const checkUser = async () => {
      setLoading(true);
      try {
        // const response = await fetch("http://localhost:8000/auth/me", {
        //   method: "GET",
        //   credentials: "include",
        // });

        // if (response.ok) {
        //   const userData = await response.json();
        //   setUser(userData);
        // } else {
        //   setUser(null);
        // }
        const authenticatedUser = dummyUsers[0]; // null if u want to see sigin
        setUser(authenticatedUser);
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
      {/* {!loading && children} */}
      {/* Uncomment this line to prevent rendering children until user is loaded */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
