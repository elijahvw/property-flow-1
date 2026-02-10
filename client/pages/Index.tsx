import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, Users } from "lucide-react";

export default function Index() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PropertyFlow</span>
          </div>
          <Button onClick={login} disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign In"}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Property Management
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            PropertyFlow helps landlords manage properties, screen tenants, and
            collect rent — all in one platform.
          </p>
          <Button size="lg" onClick={login} disabled={isLoading}>
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <Building2 className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Property Management</h3>
            <p className="text-gray-600">
              Track properties, units, and occupancy in one place.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <Users className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Team & Tenants</h3>
            <p className="text-gray-600">
              Invite staff and tenants with role-based access control.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <Shield className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
            <p className="text-gray-600">
              Auth0 authentication with enterprise-grade security.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
