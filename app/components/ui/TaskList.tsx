"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { Badge } from "./Badge";

export type Task = {
  id: string;
  title: string;
  done?: boolean;
  priority?: "高" | "中" | "低";
  due?: string;
};

/**
 * 任务列表：可勾选、带优先级与截止时间的清单。
 * 完成项自动变灰划线。
 */
export function TaskList({
  tasks: initial,onChange,
  className,
}: {
  tasks: Task[];
  className?: string;
  onChange?:(tasks:Task[])=>void;
}) {
  const [tasks, setTasks] = useState(initial);
  const done = tasks.filter((t) => t.done).length;

  const toggle = (id:string)=>{const next=tasks.map(t=>t.id===id?{...t,done:!t.done}:t);setTasks(next);onChange?.(next)};

  const prioVariant = { 高: "danger", 中: "warning", 低: "neutral" } as const;

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-border-component-detail-container",
        "bg-background-primary-default",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-3 py-2">
        <span className="text-body-2-medium text-text-primary">任务</span>
        <span role="status" className="text-caption-2-regular tabular-nums text-text-tertiary">
          {done} / {tasks.length} 已完成
        </span>
      </div>

      <div className="flex flex-col py-1">
        {tasks.map((t) => (
          <div
            key={t.id}
            className={cn(
              "group flex h-7 items-center gap-2.5 pe-3 ps-4",
              "transition-colors duration-150 hover:bg-background-secondary-hover"
            )}
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={!!t.done}
              aria-label={t.title}
              onClick={() => toggle(t.id)}
              className={cn(
                "flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-[5px] border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus-ring",
                "transition-[background-color,border-color] duration-150 ease-out",
                t.done
                  ? "border-transparent bg-[linear-gradient(180deg,var(--color-accent-500),var(--color-accent-600))]"
                  : "border-border-button-default bg-background-primary-default hover:border-border-button-hover"
              )}
            >
              {t.done && <Icon name="check-line" className="size-3 text-white" />}
            </button>

            <span
              className={cn(
                "min-w-0 flex-1 truncate text-body-2-medium",
                t.done ? "text-text-tertiary line-through" : "text-text-primary"
              )}
            >
              {t.title}
            </span>

            {t.priority && (
              <Badge variant={prioVariant[t.priority]}>{t.priority}</Badge>
            )}
            {t.due && (
              <span className="shrink-0 text-caption-2-regular tabular-nums text-text-secondary">
                {t.due}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
