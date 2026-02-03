import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "landlord" | "tenant" | "guest";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "landlord" | "tenant") => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for persisted user
    const stored = localStorage.getItem("propertyflow_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (
    email: string,
    password: string,
    role: "landlord" | "tenant",
  ) => {
    // Mock authentication - in production, this would validate against a real backend
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split("@")[0],
      email,
      role,
    };
    setUser(newUser);
    localStorage.setItem("propertyflow_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("propertyflow_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
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
