"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type Limit = { id: string; label: string; used: number; max: number; unit?: string };

/**
 * 智能体额度卡：多项用量进度 + 重置时间提示。
 * 接近上限时自动转为警告色。
 */
export function AgentLimitsCard({
  limits,
  resetText,
  className,
}: {
  limits: Limit[];
  resetText?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-2xl border border-border-component-detail-container",
        "bg-background-primary-default p-3 shadow-card",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <Icon name="speed-up-line" className="size-4 text-accent-500" />
        <span className="text-body-2-medium text-text-primary">额度用量</span>
      </div>

      <div className="flex flex-col gap-2">
        {limits.map((l) => {
          const valid=Number.isFinite(l.max)&&l.max>0&&Number.isFinite(l.used);
          const pct=valid?Math.min(100,Math.max(0,Math.round(l.used/l.max*100))):0;
          const tone =
            pct >= 90
              ? "bg-[linear-gradient(90deg,var(--color-red-400),var(--color-red-600))]"
              : pct >= 70
                ? "bg-[linear-gradient(90deg,var(--color-amber-400),var(--color-amber-600))]"
                : "bg-[linear-gradient(90deg,var(--color-accent-400),var(--color-accent-600))]";
          return (
            <div key={l.id} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-caption-1-regular text-text-secondary">{l.label}</span>
                <span className="text-caption-2-regular tabular-nums text-text-secondary">
                  {valid?Math.max(0,l.used):"—"}
                  {valid?(l.unit??""):""} / {valid?l.max:"—"}
                  {valid?(l.unit??""):""}
                </span>
              </div>
              <div role="meter" aria-label={l.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-valuetext={valid?Math.max(0,l.used)+" / "+l.max+(l.unit??""):"额度未知"} className="h-1.5 w-full overflow-hidden rounded-full bg-background-tertiary-default">
                <div
                  className={cn("h-full rounded-full transition-[width] duration-300 ease-bui motion-reduce:transition-none", tone)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {resetText && (
        <div className="flex items-center gap-1 border-t border-separator-border pt-2 text-caption-2-regular text-text-secondary">
          <Icon name="refresh-line" className="size-3" />
          {resetText}
        </div>
      )}
    </div>
  );
}
