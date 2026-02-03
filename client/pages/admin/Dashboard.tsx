import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/Cards/StatsCard";
import { PropertyCard } from "@/components/Cards/PropertyCard";
import { TenantCard } from "@/components/Cards/TenantCard";
import { Building2, Users, DollarSign, ClipboardList, Plus, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "landlord") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "landlord") {
    return null;
  }

  // Mock data
  const properties = [
    {
      id: "1",
      name: "Downtown Apartments",
      address: "123 Main St, Downtown",
      type: "Multi-Unit Residential",
      units: 12,
      occupiedUnits: 10,
      monthlyRent: 6000,
      status: "active" as const,
    },
    {
      id: "2",
      name: "Suburban Complex",
      address: "456 Oak Ave, Suburbs",
      type: "Multi-Unit Residential",
      units: 8,
      occupiedUnits: 6,
      monthlyRent: 4000,
      status: "active" as const,
    },
  ];

  const tenants = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      property: "Downtown Apartments",
      unit: "101",
      status: "approved" as const,
      leaseEndDate: "Dec 31, 2025",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "(555) 234-5678",
      property: "Downtown Apartments",
      unit: "102",
      status: "pending" as const,
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      property: "Suburban Complex",
      unit: "201",
      status: "approved" as const,
      leaseEndDate: "Jun 30, 2025",
    },
  ];

  return (
    <Layout showSidebar>
      <div className="flex-1 bg-background p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your property management dashboard.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Active Properties"
            value={properties.length}
            icon={<Building2 className="w-6 h-6" />}
            description="Across all locations"
          />
          <StatsCard
            title="Occupied Units"
            value="16"
            trend={{ value: 5, direction: "up" }}
            icon={<Users className="w-6 h-6" />}
            description="Out of 20 total"
          />
          <StatsCard
            title="Monthly Revenue"
            value="$10,000"
            trend={{ value: 8, direction: "up" }}
            icon={<DollarSign className="w-6 h-6" />}
            description="Current month"
          />
          <StatsCard
            title="Pending Actions"
            value="3"
            icon={<ClipboardList className="w-6 h-6" />}
            description="Tenant approvals needed"
          />
        </div>

        {/* Properties Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Properties</h2>
            <Button
              onClick={() => navigate("/admin/properties")}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                {...property}
                onView={() => navigate("/admin/properties")}
                onEdit={() => navigate("/admin/properties")}
              />
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/admin/properties")}
          >
            View All Properties
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Tenants Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recent Tenants</h2>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/tenants")}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <TenantCard
                key={tenant.id}
                {...tenant}
                onView={() => navigate("/admin/tenants")}
                onApprove={() => console.log("Approve:", tenant.id)}
                onReject={() => console.log("Reject:", tenant.id)}
              />
            ))}
          </div>
        </div>

        {/* AI Insights CTA */}
        <div className="rounded-lg border border-ai/30 bg-gradient-to-r from-ai/10 to-ai-light/30 p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Unlock AI-Powered Insights
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Upload your lease documents and property files to get AI-powered analysis and recommendations. Discover opportunities and mitigate risks.
          </p>
          <Button
            onClick={() => navigate("/admin/documents")}
            className="bg-primary hover:bg-primary/90"
          >
            Explore AI Analysis
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Layout>
  );
}
