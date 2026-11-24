"use client";

import { cx as cn } from "./cx";
import { progressTrack,progressFill,progressTones } from "./progress-styles";

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
  const safeMax=Number.isFinite(max)&&max>0?max:100;
  const safeValue=Number.isFinite(value)?Math.min(safeMax,Math.max(0,value)):0;
  const pct=safeValue/safeMax*100;
  const fill=progressTones[tone];

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-baseline justify-between">
          <span className="text-body-2-medium text-text-primary">{label}</span>
          <span className="text-caption-1-medium tabular-nums text-text-secondary">
            {safeValue} / {safeMax}
          </span>
        </div>
      )}
      <div role="meter" aria-label={label??"度量"} aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue} className={cn(progressTrack,"h-2")}>
        <div
          className={cn(progressFill, fill)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
