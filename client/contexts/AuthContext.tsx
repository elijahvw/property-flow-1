import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiClient } from "@/lib/api";
import type { AuthMeResponse, CompanyMembership } from "@shared/api";

export interface AuthUser {
  id: string;
  auth0Sub: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  memberships: CompanyMembership[];
  currentCompanyId: string | null;
  currentRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  getToken: () => Promise<string>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [memberships, setMemberships] = useState<CompanyMembership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = useCallback(async () => {
    return getAccessTokenSilently();
  }, [getAccessTokenSilently]);

  const refreshProfile = useCallback(async () => {
    try {
      const token = await getToken();
      const data = await apiClient<AuthMeResponse>("/auth/me", {
        method: "POST",
        token,
      });
      setUser(data.user);
      setMemberships(data.memberships);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  }, [getToken]);

  useEffect(() => {
    if (auth0IsLoading) return;

    if (!auth0IsAuthenticated) {
      setUser(null);
      setMemberships([]);
      setIsLoading(false);
      return;
    }

    refreshProfile().finally(() => setIsLoading(false));
  }, [auth0IsAuthenticated, auth0IsLoading, refreshProfile]);

  const activeMembership = memberships.find((m) => m.status === "active");

  return (
    <AuthContext.Provider
      value={{
        user,
        memberships,
        currentCompanyId: activeMembership?.company_id || null,
        currentRole: activeMembership?.role || null,
        isLoading: auth0IsLoading || isLoading,
        isAuthenticated: auth0IsAuthenticated && !!user,
        login: () => loginWithRedirect(),
        logout: () => auth0Logout({ logoutParams: { returnTo: window.location.origin } }),
        getToken,
        refreshProfile,
      }}
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
