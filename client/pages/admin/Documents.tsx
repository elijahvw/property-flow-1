import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { AIInsightCard } from "@/components/Cards/AIInsightCard";
import { Upload, FileText, Plus } from "lucide-react";

export default function AdminDocuments() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "landlord") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user || user.role !== "landlord") {
    return null;
  }

  const insights = [
    {
      id: "1",
      title: "Lease Analysis",
      documentName: "Downtown Apartments - Unit 101 Lease",
      riskLevel: "low" as const,
      summary:
        "Lease agreement is standard. All critical terms are clearly defined. No red flags detected.",
      insights: [
        {
          label: "Lease Term",
          value: "12 months (Jan 2024 - Dec 2024)",
        },
        {
          label: "Monthly Rent",
          value: "$1,200 with 3% annual increase",
        },
        {
          label: "Deposit",
          value: "$2,400 (2 months)",
        },
        {
          label: "Key Terms",
          value: "Standard lease with maintenance responsibility",
        },
      ],
    },
    {
      id: "2",
      title: "Property Valuation",
      documentName: "Downtown Apartments - Investment Analysis",
      riskLevel: "medium" as const,
      summary:
        "Property shows strong fundamentals with 83% occupancy. Market conditions are favorable.",
      insights: [
        {
          label: "Current Valuation",
          value: "$850,000 (based on comparable properties)",
        },
        {
          label: "Cap Rate",
          value: "7.2% - Above market average",
        },
        {
          label: "Occupancy Rate",
          value: "83% - Slightly below optimal",
        },
        {
          label: "Market Trend",
          value: "Upward - Rent growth of 5-7% expected",
          type: "positive",
        },
      ],
    },
    {
      id: "3",
      title: "Tenant Risk Assessment",
      documentName: "Jane Doe - Tenant Application",
      riskLevel: "high" as const,
      summary:
        "Application shows some concerns that should be reviewed before approval.",
      insights: [
        {
          label: "Credit Score",
          value: "620 - Below ideal range",
          type: "negative",
        },
        {
          label: "Income Verification",
          value: "Required - Not yet provided",
          type: "negative",
        },
        {
          label: "Employment",
          value: "Currently employed, stable position",
        },
        {
          label: "Recommendation",
          value:
            "Request additional income verification before approval",
          type: "negative",
        },
      ],
    },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload
    console.log("Files dropped:", e.dataTransfer.files);
  };

  return (
    <Layout showSidebar>
      <div className="flex-1 bg-background p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Documents & AI Insights
          </h1>
          <p className="text-muted-foreground">
            Upload documents for AI-powered analysis and recommendations.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-12 mb-8 transition ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-secondary/30"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground mb-1">
                Drop files here or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Upload lease agreements, property documents, or tenant applications
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Choose Files
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Uploaded Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-white p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  Downtown Apartments Lease
                </p>
                <p className="text-xs text-muted-foreground">
                  Uploaded 2 days ago
                </p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-white p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Property Appraisal</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded 5 days ago
                </p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>

            <div className="rounded-lg border border-border bg-white p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Tenant Application</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded 1 week ago
                </p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            AI Insights & Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <AIInsightCard
                key={insight.id}
                title={insight.title}
                documentName={insight.documentName}
                riskLevel={insight.riskLevel}
                summary={insight.summary}
                insights={insight.insights}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
