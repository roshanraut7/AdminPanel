// components/common/stats-card.tsx
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  helper: string;
  icon: LucideIcon;
  tone?: Tone;
};

const tones: Record<
  Tone,
  {
    line: string;
    icon: string;
    badge: string;
    badgeIcon: string;
  }
> = {
  success: {
    line: "bg-chart-3",
    icon: "bg-chart-3/10 text-chart-3",
    badge: "border-chart-3/10 bg-chart-3/15 text-chart-3 hover:bg-chart-3/15",
    badgeIcon: "text-chart-3",
  },

  info: {
    line: "bg-primary",
    icon: "bg-primary/10 text-primary",
    badge: "border-primary/10 bg-primary/10 text-primary hover:bg-primary/10",
    badgeIcon: "text-primary",
  },

  warning: {
    line: "bg-chart-4",
    icon: "bg-chart-4/20 text-chart-1",
    badge: "border-chart-4/20 bg-chart-4/20 text-chart-1 hover:bg-chart-4/20",
    badgeIcon: "text-chart-1",
  },

  danger: {
    line: "bg-destructive",
    icon: "bg-destructive/10 text-destructive",
    badge:
      "border-destructive/10 bg-destructive/10 text-destructive hover:bg-destructive/10",
    badgeIcon: "text-destructive",
  },

  neutral: {
    line: "bg-border",
    icon: "bg-muted text-muted-foreground",
    badge: "border-border bg-muted text-muted-foreground hover:bg-muted",
    badgeIcon: "text-muted-foreground",
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
  const t = tones[tone];

  const isNegative =
    tone === "danger" || change.trim().startsWith("-");

  const ChangeIcon = isNegative ? ArrowDownRight : ArrowUpRight;

  return (
    <Card className="group relative min-w-0 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className={cn("absolute inset-y-0 left-0 w-1", t.line)} />

      <CardContent className="p-6 pl-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  t.icon
                )}
              >
                <Icon className="size-4" />
              </div>

              <p className="truncate text-sm font-medium text-muted-foreground">
                {title}
              </p>
            </div>

            <p className="mt-3 truncate text-[32px] font-bold leading-none tracking-[-0.04em] text-foreground">
              {value}
            </p>

            <p className="mt-3 truncate text-sm font-medium text-muted-foreground">
              {helper}
            </p>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold shadow-none",
              t.badge
            )}
          >
            <ChangeIcon className={cn("mr-1 size-3.5", t.badgeIcon)} />
            {change}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}