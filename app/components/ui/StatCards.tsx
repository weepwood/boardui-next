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
  // Use the actual available width; avoid an unbalanced 3+1 layout for four cards.
  const grid = columns === 4 ? "@min-[760px]:grid-cols-4" : columns === 3 ? "@min-[568px]:grid-cols-3" : "";
  return (
    <div className="@container min-w-0 w-full">
      <div className={cn("grid grid-cols-1 gap-2 @min-[376px]:grid-cols-2",grid,className)}>
        {items.map((it) => (
          <StatCard key={it.label} {...it} />
        ))}
      </div>
    </div>
  );
}
