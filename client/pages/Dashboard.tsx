import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Building2, Users, LogOut, Settings } from "lucide-react";

export default function Dashboard() {
  const { user, currentRole, currentCompanyId, memberships, logout } = useAuth();
  const navigate = useNavigate();

  const currentMembership = memberships.find((m) => m.status === "active");

  if (!currentCompanyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Welcome, {user?.name}!</CardTitle>
            <CardDescription>
              You're not part of any company yet. Create one or wait for an invite.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate("/setup-company")} className="w-full">
              <Building2 className="mr-2 h-4 w-4" />
              Create a Company
            </Button>
            <Button variant="outline" onClick={logout} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">PropertyFlow</h1>
            <p className="text-sm text-gray-500">
              {currentMembership?.company_name} &middot;{" "}
              <span className="capitalize">{currentRole}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(currentRole === "owner" || currentRole === "staff") && (
            <>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/team")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team
                  </CardTitle>
                  <CardDescription>Manage team members and invites</CardDescription>
                </CardHeader>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/settings")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Settings
                  </CardTitle>
                  <CardDescription>Company settings</CardDescription>
                </CardHeader>
              </Card>
            </>
          )}

          {currentRole === "tenant" && (
            <Card>
              <CardHeader>
                <CardTitle>Tenant Portal</CardTitle>
                <CardDescription>Your rental information will appear here</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
