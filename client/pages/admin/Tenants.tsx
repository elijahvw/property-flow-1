import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { TenantCard } from "@/components/Cards/TenantCard";

export default function AdminTenants() {
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
      phone: "(555) 345-6789",
      property: "Suburban Complex",
      unit: "201",
      status: "approved" as const,
      leaseEndDate: "Jun 30, 2025",
    },
    {
      id: "4",
      name: "Alice Williams",
      email: "alice@example.com",
      phone: "(555) 456-7890",
      property: "Suburban Complex",
      unit: "202",
      status: "approved" as const,
      leaseEndDate: "Mar 15, 2026",
    },
    {
      id: "5",
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "(555) 567-8901",
      property: "Downtown Apartments",
      unit: "103",
      status: "pending" as const,
    },
    {
      id: "6",
      name: "Diana Davis",
      email: "diana@example.com",
      phone: "(555) 678-9012",
      property: "Suburban Complex",
      unit: "203",
      status: "rejected" as const,
    },
  ];

  return (
    <Layout showSidebar>
      <div className="flex-1 bg-background p-4 md:p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Tenants
          </h1>
          <p className="text-muted-foreground mb-8">
            Manage tenant applications and lease agreements.
          </p>
        </div>

        {/* Tenants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <TenantCard
              key={tenant.id}
              {...tenant}
              onView={() => console.log("View:", tenant.id)}
              onApprove={() => console.log("Approve:", tenant.id)}
              onReject={() => console.log("Reject:", tenant.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
