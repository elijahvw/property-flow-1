import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { TenantCard } from "@/components/Cards/TenantCard";
import { Button } from "@/components/ui/button";
import { Plus, Send, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  name: string;
}

export default function AdminTenants() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    propertyId: "",
  });

  const fetchData = async () => {
    if (!token) return;
    setIsPageLoading(true);
    try {
      const [propsRes, tenantsRes] = await Promise.all([
        fetch("/api/properties", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/tenants", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const [propsData, tenantsData] = await Promise.all([
        propsRes.json(),
        tenantsRes.json(),
      ]);

      if (Array.isArray(propsData)) setProperties(propsData);
      if (Array.isArray(tenantsData)) setTenants(tenantsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "landlord") {
      navigate("/");
    } else {
      fetchData();
    }
  }, [user, token, navigate]);

  if (!user || user.role !== "landlord") {
    return null;
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/invite-tenant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inviteForm),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send invitation");
      }

      toast({
        title: "Success",
        description: `Invitation sent to ${inviteForm.email}`,
      });
      setShowInviteModal(false);
      setInviteForm({ name: "", email: "", propertyId: "" });
      fetchData(); // Refresh list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showSidebar>
      <div className="flex-1 bg-background p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Tenants
            </h1>
            <p className="text-muted-foreground">
              Manage tenant applications and lease agreements.
            </p>
          </div>
          <Button onClick={() => setShowInviteModal(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Invite Tenant
          </Button>
        </div>

        {/* Tenants Grid */}
        {isPageLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : tenants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <TenantCard
                key={tenant.id}
                id={tenant.id}
                name={tenant.name}
                email={tenant.email}
                phone={tenant.phone}
                property={tenant.property_name}
                status={tenant.status}
                leaseEndDate={tenant.lease_end_date}
                onView={() => console.log("View:", tenant.id)}
                onApprove={() => console.log("Approve:", tenant.id)}
                onReject={() => console.log("Reject:", tenant.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No tenants found. Invite your first tenant to get started!</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">Invite New Tenant</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tenant Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned Property</label>
                <select
                  required
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={inviteForm.propertyId}
                  onChange={(e) => setInviteForm({ ...inviteForm, propertyId: e.target.value })}
                >
                  <option value="">Select a property</option>
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Invitation
              </Button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
