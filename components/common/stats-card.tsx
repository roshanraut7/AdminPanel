import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  helper: string;
  icon: LucideIcon;
  tone?: "success" | "warning" | "danger" | "neutral";
};

const toneClasses = {
  success: {
    icon: "border-primary/20 bg-primary/10 text-primary",
    badge: "bg-primary/10 text-primary hover:bg-primary/10",
  },
  warning: {
    icon: "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    badge:
      "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/10 dark:text-yellow-400",
  },
  danger: {
    icon: "border-destructive/20 bg-destructive/10 text-destructive",
    badge: "bg-destructive/10 text-destructive hover:bg-destructive/10",
  },
  neutral: {
    icon: "border-border bg-muted text-muted-foreground",
    badge: "bg-muted text-muted-foreground hover:bg-muted",
  },
};

export function StatCard({
  title,
  value,
  change,
  helper,
  icon: Icon,
  tone = "neutral",
}: StatCardProps) {
  return (
    <Card className="rounded-xl border-border bg-card text-card-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <h3 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-foreground">
              {value}
            </h3>
          </div>

          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border",
              toneClasses[tone].icon
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {helper}
          </p>

          <Badge
            className={cn(
              "rounded-md px-2 py-1 text-[11px] font-semibold",
              toneClasses[tone].badge
            )}
          >
            {change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}