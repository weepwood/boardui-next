"use client";

import { cx as cn } from "./cx";
import { SvgIcon as Icon } from "./svg-icon";
import { AreaChart } from "./chart";

/**
 * 统计卡片：数值 + 变化率 + 迷你趋势图。
 * 与原站 stat-cards 一致的结构。
 */
export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  spark,
  icon,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  spark?: number[];
  icon?: string;
  className?: string;
}) {
  const trendStyle = {
    up: "text-status-lime-text bg-status-lime-background",
    down: "text-status-rose-text bg-status-rose-background",
    flat: "text-text-secondary bg-background-secondary-default",
  }[trend];

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-2xl border border-border-component-detail-container",
        "bg-background-primary-default p-4 shadow-xs",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="break-words text-body-2-medium text-text-secondary">{label}</span>
          <span className="text-title-2-semibold [overflow-wrap:anywhere] tabular-nums text-text-primary">{value}</span>
        </div>
        {icon && (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background-secondary-default text-foreground-icon-secondary">
            <Icon name={icon} className="size-4" />
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-px",
              "text-caption-2-medium",
              trendStyle
            )}
          >
            {trend !== "flat" && (
              <Icon
                name={trend === "up" ? "arrow-up-line" : "arrow-down-line"}
                className="size-3"
              />
            )}
            {delta}
          </span>
        )}
        {spark && (
          <div className="h-6 w-20 shrink-0">
            <AreaChart
              data={spark}
              height={24}
              gradientId={`spark-${label.replace(/\s/g, "")}`}
              stroke={trend === "down" ? "var(--color-red-500)" : "var(--color-accent-500)"}
            />
          </div>
        )}
      </div>
    </div>
  );
}
