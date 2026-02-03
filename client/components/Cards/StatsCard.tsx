import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
}: StatsCardProps) {
  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.direction === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.direction === "up" ? "+" : "-"}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
        {icon && <div className="text-ai">{icon}</div>}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
