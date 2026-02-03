import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, MapPin, ChevronRight } from "lucide-react";

export default function AdminPayments() {
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

  const payments = [
    {
      id: "1",
      tenant: "John Smith",
      property: "Downtown Apartments",
      unit: "101",
      amount: 1200,
      dueDate: "2024-02-01",
      paidDate: "2024-02-01",
      status: "paid" as const,
    },
    {
      id: "2",
      tenant: "Jane Doe",
      property: "Downtown Apartments",
      unit: "102",
      amount: 1200,
      dueDate: "2024-02-01",
      paidDate: null,
      status: "pending" as const,
    },
    {
      id: "3",
      tenant: "Bob Johnson",
      property: "Suburban Complex",
      unit: "201",
      amount: 1000,
      dueDate: "2024-01-15",
      paidDate: null,
      status: "overdue" as const,
    },
    {
      id: "4",
      tenant: "Alice Williams",
      property: "Suburban Complex",
      unit: "202",
      amount: 1000,
      dueDate: "2024-02-01",
      paidDate: "2024-02-02",
      status: "paid" as const,
    },
    {
      id: "5",
      tenant: "Charlie Brown",
      property: "Downtown Apartments",
      unit: "103",
      amount: 1200,
      dueDate: "2024-02-01",
      paidDate: null,
      status: "pending" as const,
    },
  ];

  const statusColors = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    overdue: "bg-red-100 text-red-800",
  };

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <Layout showSidebar>
      <div className="flex-1 bg-background p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Payments & Rent Collection
          </h1>
          <p className="text-muted-foreground">
            Track and manage rent payments from your tenants.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-lg border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-ai" />
              <p className="text-sm font-medium text-muted-foreground">
                Total Expected
              </p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              ${totalAmount.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-muted-foreground">Paid</p>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${paidAmount.toLocaleString()}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-white p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-medium text-muted-foreground">
                Outstanding
              </p>
            </div>
            <p className="text-3xl font-bold text-orange-600">
              ${pendingAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Payment List */}
        <div className="bg-white rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Tenant
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Property
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Due Date
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-border hover:bg-secondary/50 transition"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {payment.tenant}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Unit {payment.unit}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{payment.property}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">
                        ${payment.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{payment.dueDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusColors[payment.status]}>
                        {payment.status.charAt(0).toUpperCase() +
                          payment.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log("View payment:", payment.id)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
