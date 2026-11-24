"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * 时间输入框：时/分双格输入 + 上下步进。
 */
export function TimeField({
  label,
  defaultValue = { hour: 9, minute: 0 },
  onChange,
  className,
}: {
  label?: string;
  defaultValue?: { hour: number; minute: number };
  onChange?: (v: { hour: number; minute: number }) => void;
  className?: string;
}) {
  const [hour, setHour] = useState(defaultValue.hour);
  const [minute, setMinute] = useState(defaultValue.minute);

  const commit = (h: number, m: number) => {
    const nh = (h + 24) % 24;
    const nm = (m + 60) % 60;
    setHour(nh);
    setMinute(nm);
    onChange?.({ hour: nh, minute: nm });
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className={cn("flex w-full max-w-[160px] flex-col gap-1.5", className)}>
      {label && <span className="text-body-2-medium text-text-primary">{label}</span>}
      <div
        className={cn(
          "flex h-9 items-center justify-center gap-1 rounded-2lg px-2.5",
          "border border-border-button-default bg-background-primary-default shadow-xs",
          "focus-within:ring-2 focus-within:ring-accent-500/30"
        )}
      >
        <Icon name="time-line" className="me-1 size-4 shrink-0 text-foreground-icon-secondary" />
        <input
          value={pad(hour)}
          onChange={(e) => {
            const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
            if (!isNaN(v)) commit(v, minute);
            else commit(0, minute);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              commit(hour + 1, minute);
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              commit(hour - 1, minute);
            }
          }}
          aria-label="小时"
          className="w-6 bg-transparent text-center text-body-medium tabular-nums text-text-primary outline-none"
        />
        <span className="text-text-tertiary">:</span>
        <input
          value={pad(minute)}
          onChange={(e) => {
            const v = parseInt(e.target.value.replace(/\D/g, ""), 10);
            if (!isNaN(v)) commit(hour, v);
            else commit(hour, 0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              commit(hour, minute + 1);
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              commit(hour, minute - 1);
            }
          }}
          aria-label="分钟"
          className="w-6 bg-transparent text-center text-body-medium tabular-nums text-text-primary outline-none"
        />
      </div>
    </div>
  );
}
