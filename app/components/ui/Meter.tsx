"use client";

import { cn } from "@/lib/utils";

/**
 * 度量条：分段色带，用于容量/健康度展示。
 * 与原站 meter 一致：轨道 + 填充 + 分段刻度。
 */
export function Meter({
  value,
  max = 100,
  label,
  className,
  tone = "accent",
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  tone?: "accent" | "success" | "warning" | "danger";
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fill = {
    accent: "bg-[linear-gradient(90deg,var(--color-accent-400),var(--color-accent-600))]",
    success: "bg-[linear-gradient(90deg,var(--color-lime-400),var(--color-lime-600))]",
    warning: "bg-[linear-gradient(90deg,var(--color-amber-400),var(--color-amber-600))]",
    danger: "bg-[linear-gradient(90deg,var(--color-red-400),var(--color-red-600))]",
  }[tone];

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-baseline justify-between">
          <span className="text-body-2-medium text-text-primary">{label}</span>
          <span className="text-caption-1-medium tabular-nums text-text-secondary">
            {value} / {max}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-background-tertiary-default">
        <div
          className={cn("h-full rounded-full transition-[width] duration-500 ease-bui", fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
