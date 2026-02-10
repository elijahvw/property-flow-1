import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import SetupCompany from "./pages/SetupCompany";
import Team from "./pages/Team";
import AcceptInvite from "./pages/AcceptInvite";

const queryClient = new QueryClient();

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || "";
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || "";
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || "";

export default function App() {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin + "/dashboard",
        audience: AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/setup-company"
                  element={
                    <ProtectedRoute>
                      <SetupCompany />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team"
                  element={
                    <ProtectedRoute requiredRoles={["owner", "staff"]}>
                      <Team />
                    </ProtectedRoute>
                  }
                />
                <Route path="/invite" element={<AcceptInvite />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Auth0Provider>
  );
}
