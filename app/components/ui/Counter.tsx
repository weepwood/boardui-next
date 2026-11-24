"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * 计数器：− 数值 + 三部分组合控件。
 */
export function Counter({
  value,
  onChange,
  min = 0,
  max = 99,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const btn = cn(
    "flex size-7 cursor-pointer items-center justify-center rounded-lg",
    "text-foreground-icon-secondary transition-colors duration-150 ease-out",
    "hover:bg-background-secondary-hover hover:text-foreground-icon-primary",
    "disabled:cursor-not-allowed disabled:opacity-40"
  );

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-2lg border border-border-button-default",
        "bg-background-primary-default p-0.5 shadow-xs",
        className
      )}
    >
      <button
        type="button"
        aria-label="减少"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={btn}
      >
        <Icon name="subtract-line" className="size-4" />
      </button>
      <span className="min-w-8 text-center text-body-2-medium tabular-nums text-text-primary">
        {value}
      </span>
      <button
        type="button"
        aria-label="增加"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={btn}
      >
        <Icon name="add-line" className="size-4" />
      </button>
    </div>
  );
}
