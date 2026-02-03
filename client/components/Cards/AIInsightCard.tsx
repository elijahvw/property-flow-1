import { Brain, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InsightItem {
  label: string;
  value: string;
  type?: "positive" | "negative" | "neutral";
}

interface AIInsightCardProps {
  title: string;
  documentName: string;
  insights: InsightItem[];
  riskLevel?: "low" | "medium" | "high";
  summary?: string;
}

export function AIInsightCard({
  title,
  documentName,
  insights,
  riskLevel,
  summary,
}: AIInsightCardProps) {
  const riskColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="rounded-lg border border-ai/30 bg-ai-light/30 p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-ai/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-ai" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{title}</h3>
            <p className="text-sm text-muted-foreground">{documentName}</p>
          </div>
        </div>
        {riskLevel && (
          <Badge className={riskColors[riskLevel]}>
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
          </Badge>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <p className="text-sm text-muted-foreground mb-4 p-3 bg-white rounded border border-border">
          {summary}
        </p>
      )}

      {/* Insights */}
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 mt-1">
              {insight.type === "negative" ? (
                <AlertCircle className="w-4 h-4 text-red-600" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-ai/50"></div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {insight.label}
              </p>
              <p className="text-sm text-muted-foreground">{insight.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
