import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, DollarSign } from "lucide-react";

interface PropertyCardProps {
  id: string;
  name: string;
  address: string;
  type: string;
  units: number;
  occupiedUnits: number;
  monthlyRent: number;
  image?: string;
  status: "active" | "vacant" | "maintenance";
  onView?: () => void;
  onEdit?: () => void;
}

export function PropertyCard({
  name,
  address,
  type,
  units,
  occupiedUnits,
  monthlyRent,
  status,
  onView,
  onEdit,
}: PropertyCardProps) {
  const occupancyRate = Math.round((occupiedUnits / units) * 100);

  const statusColors = {
    active: "bg-green-100 text-green-800",
    vacant: "bg-yellow-100 text-yellow-800",
    maintenance: "bg-red-100 text-red-800",
  };

  return (
    <div className="rounded-lg border border-border bg-white overflow-hidden hover:shadow-lg transition">
      {/* Image placeholder */}
      <div className="h-32 bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground text-lg mb-1">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {address}
            </div>
          </div>
          <Badge className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-border mb-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Units</p>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-primary" />
              <p className="font-semibold text-foreground">{units}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Occupied</p>
            <p className="font-semibold text-foreground">{occupancyRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Revenue</p>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-ai" />
              <p className="font-semibold text-foreground">{monthlyRent / 1000}k</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onView}
          >
            View
          </Button>
          <Button 
            size="sm" 
            className="flex-1"
            onClick={onEdit}
          >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}
