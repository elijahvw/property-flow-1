import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/Cards/PropertyCard";
import { Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  monthly_rent: number | string;
  status: 'active' | 'vacant' | 'maintenance';
}

export default function AdminProperties() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    type: "Residential",
    units: 1,
    monthly_rent: 0,
    status: "active" as const,
  });

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== "landlord") {
      navigate("/");
      return;
    }

    if (token) {
      fetchProperties();
    }
  }, [user, token, navigate]);

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add property");
      }

      toast({
        title: "Success",
        description: "Property added successfully",
      });
      setShowAddModal(false);
      setForm({
        name: "",
        address: "",
        type: "Residential",
        units: 1,
        monthly_rent: 0,
        status: "active",
      });
      fetchProperties();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "landlord") {
    return null;
  }

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
          <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            Add Property
          </Button>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                name={property.name}
                address={property.address}
                type={property.type}
                units={property.units}
                monthlyRent={property.monthly_rent}
                status={property.status}
                onView={() => console.log("View:", property.id)}
                onEdit={() => console.log("Edit:", property.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">No properties found. Add your first property to get started!</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Property</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddProperty} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Property Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Sunset Apartments"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Units</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full p-2 rounded-md border border-input bg-background"
                    value={form.units}
                    onChange={(e) => setForm({ ...form, units: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Rent ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={form.monthly_rent}
                  onChange={(e) => setForm({ ...form, monthly_rent: parseFloat(e.target.value) })}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Add Property
              </Button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
