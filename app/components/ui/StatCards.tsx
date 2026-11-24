"use client";

import { StatCard } from "./StatCard";
import { cn } from "@/lib/utils";

export type StatItem = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  spark?: number[];
  icon?: string;
};

/**
 * 指标卡片组：统一响应式网格。
 */
export function StatCards({
  items,
  columns = 4,
  className,
}: {
  items: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const grid =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-2", grid, className)}>
      {items.map((it) => (
        <StatCard key={it.label} {...it} />
      ))}
    </div>
  );
}
