"use client";

import { cx as cn } from "./cx";
import { SvgIcon as Icon } from "./svg-icon";

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
        "flex w-full flex-col gap-2.5 rounded-3xl border border-border-button-default",
        "bg-background-primary-default p-3 shadow-xs",
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-body-2-medium text-text-primary">{title}</span>
          <span className="text-caption-2-medium tabular-nums text-text-tertiary">{pct}%</span>
        </div>
      )}

      <ol aria-label={title??"任务进度"} className="flex flex-col">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={s.id} aria-current={s.state==="active"?"step":undefined} className="flex gap-2">
              {/* 指示器与连线 */}
              <div aria-hidden="true" className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full",
                    s.state === "done" && "bg-status-lime-background text-status-lime-text",
                    s.state === "active" && "border-2 border-accent-500 bg-background-primary-default",
                    s.state === "pending" && "border border-border-button-default bg-background-primary-default"
                  )}
                >
                  {s.state === "done" ? (
                    <Icon name="check-line" className="size-2.5" />
                  ) : s.state === "active" ? (
                    <span className="size-1.5 animate-pulse motion-reduce:animate-none rounded-full bg-accent-500" />
                  ) : null}
                </span>
                {!last && (
                  <span
                    className={cn(
                      "my-0.5 w-px flex-1",
                      s.state === "done" ? "bg-status-lime-background" : "bg-separator-border"
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
                  <span className="sr-only">{s.state==="done"?"已完成：":s.state==="active"?"进行中：":"待处理："}</span>{s.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
