import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { User, Bell, Lock, CreditCard, HelpCircle } from "lucide-react";

export default function AdminSettings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "landlord") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "landlord") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const settingsSections = [
    {
      icon: User,
      title: "Profile Settings",
      description: "Manage your account information and preferences",
      action: "Edit Profile",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Control email and notification preferences",
      action: "Manage Notifications",
    },
    {
      icon: Lock,
      title: "Security",
      description: "Update password and security settings",
      action: "Change Password",
    },
    {
      icon: CreditCard,
      title: "Billing",
      description: "Manage subscription and payment methods",
      action: "Billing Information",
    },
  ];

  return (
    <Layout showSidebar>
      <div className="flex-1 bg-background p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and preferences.
          </p>
        </div>

        {/* Current User Info */}
        <div className="rounded-lg border border-border bg-white p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="rounded-lg border border-border bg-white p-6 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {section.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
                <Button variant="outline" className="mt-auto">
                  {section.action}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Help & Support */}
        <div className="rounded-lg border border-border bg-white p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-ai/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-ai" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                Help & Support
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Need help with PropertyFlow? Access our documentation, contact
                support, or explore our knowledge base.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Documentation
                </Button>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            Logout from your account or delete your data.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-700 border-red-200 hover:bg-red-50"
            >
              Logout
            </Button>
            <Button variant="destructive" disabled title="Coming soon">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
