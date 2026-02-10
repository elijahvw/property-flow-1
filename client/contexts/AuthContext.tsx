import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "landlord" | "tenant" | "guest" | "admin";
  companyId?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("propertyflow_user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("propertyflow_token");
  });

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    const data = await response.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("propertyflow_user", JSON.stringify(data.user));
    localStorage.setItem("propertyflow_token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("propertyflow_user");
    localStorage.removeItem("propertyflow_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
