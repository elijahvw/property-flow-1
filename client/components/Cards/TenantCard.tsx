import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, FileText } from "lucide-react";

interface TenantCardProps {
  id: string;
  name: string;
  email: string;
  phone?: string;
  property: string;
  unit: string;
  status: "approved" | "pending" | "rejected";
  leaseEndDate?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onView?: () => void;
}

export function TenantCard({
  name,
  email,
  phone,
  property,
  unit,
  status,
  leaseEndDate,
  onApprove,
  onReject,
  onView,
}: TenantCardProps) {
  const statusColors = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="rounded-lg border border-border bg-white p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-lg mb-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {property} - Unit {unit}
          </p>
        </div>
        <Badge className={statusColors[status]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4 pb-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <a href={`mailto:${email}`} className="text-primary hover:underline">
            {email}
          </a>
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <a href={`tel:${phone}`} className="text-primary hover:underline">
              {phone}
            </a>
          </div>
        )}
      </div>

      {/* Details */}
      {leaseEndDate && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Lease Ends</p>
          <p className="text-sm font-medium text-foreground">{leaseEndDate}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onView}
        >
          <FileText className="w-4 h-4 mr-1" />
          Details
        </Button>
        {status === "pending" && (
          <>
            <Button 
              size="sm" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={onApprove}
            >
              Approve
            </Button>
            <Button 
              variant="destructive"
              size="sm" 
              className="flex-1"
              onClick={onReject}
            >
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
