"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type AgentStep = { id: string; label: string; state: "done" | "active" | "pending" };

/**
 * 智能体任务进度：垂直步骤条 + 连接线 + 当前步骤高亮。
 */
export function AgentProgress({
  steps,
  title,
  className,
}: {
  steps: AgentStep[];
  title?: string;
  className?: string;
}) {
  const doneCount = steps.filter((s) => s.state === "done").length;
  const pct = Math.round((doneCount / Math.max(steps.length, 1)) * 100);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2.5 rounded-2lg border border-border-button-default",
        "bg-background-primary-default p-3",
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-body-2-medium text-text-primary">{title}</span>
          <span className="text-caption-2-medium tabular-nums text-text-tertiary">{pct}%</span>
        </div>
      )}

      <div className="flex flex-col">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <div key={s.id} className="flex gap-2">
              {/* 指示器与连线 */}
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full",
                    s.state === "done" && "bg-lime-500 text-white",
                    s.state === "active" && "border-2 border-accent-500 bg-background-primary-default",
                    s.state === "pending" && "border border-border-button-default bg-background-primary-default"
                  )}
                >
                  {s.state === "done" ? (
                    <Icon name="check-line" className="size-2.5" />
                  ) : s.state === "active" ? (
                    <span className="size-1.5 animate-pulse rounded-full bg-accent-500" />
                  ) : null}
                </span>
                {!last && (
                  <span
                    className={cn(
                      "my-0.5 w-px flex-1",
                      s.state === "done" ? "bg-lime-400" : "bg-border-primary"
                    )}
                  />
                )}
              </div>

              <div className={cn("flex-1", last ? "pb-0" : "pb-2.5")}>
                <span
                  className={cn(
                    "text-caption-1-regular",
                    s.state === "pending"
                      ? "text-text-tertiary"
                      : s.state === "active"
                        ? "font-medium text-text-primary"
                        : "text-text-secondary"
                  )}
                >
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
