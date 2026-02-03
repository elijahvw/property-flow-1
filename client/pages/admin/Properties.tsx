import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/Cards/PropertyCard";
import { Plus } from "lucide-react";

export default function AdminProperties() {
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
    {
      id: "3",
      name: "Beach House",
      address: "789 Ocean Dr, Beach",
      type: "Single Family Home",
      units: 1,
      occupiedUnits: 0,
      monthlyRent: 2500,
      status: "vacant" as const,
    },
    {
      id: "4",
      name: "Commercial Space",
      address: "321 Business Blvd, Downtown",
      type: "Commercial",
      units: 4,
      occupiedUnits: 2,
      monthlyRent: 5000,
      status: "maintenance" as const,
    },
  ];

  return (
    <Layout showSidebar>
      <div className="flex-1 bg-background p-4 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Properties
            </h1>
            <p className="text-muted-foreground">
              Manage all your properties in one place.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Property
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              {...property}
              onView={() => console.log("View:", property.id)}
              onEdit={() => console.log("Edit:", property.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
