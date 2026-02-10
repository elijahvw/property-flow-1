import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProperties from "./pages/admin/Properties";
import AdminTenants from "./pages/admin/Tenants";
import AdminPayments from "./pages/admin/Payments";
import AdminDocuments from "./pages/admin/Documents";
import AdminSettings from "./pages/admin/Settings";
import CompleteRegistration from "./pages/CompleteRegistration";
import AdminPlatform from "./pages/AdminPlatform";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/complete-registration" element={<CompleteRegistration />} />
              <Route path="/platform-admin" element={<AdminPlatform />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/tenants" element={<AdminTenants />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/documents" element={<AdminDocuments />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
