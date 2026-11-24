"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { DateCalendar, formatDate } from "./DateCalendar";

/**
 * 日期选择器：输入框 + 弹出日历。
 * 点击外部或 Esc 关闭。
 */
export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "选择日期",
  className,
}: {
  label?: string;
  value?: Date;
  onChange?: (d: Date) => void;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [inner, setInner] = useState<Date | undefined>(value);
  const current = value ?? inner;
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={cn("relative flex w-full max-w-[200px] flex-col gap-1.5", className)}>
      {label && <span className="text-body-2-medium text-text-primary">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-9 w-full cursor-pointer items-center gap-2 rounded-2lg px-2.5",
          "border bg-background-primary-default shadow-xs",
          "text-body-medium transition-[border-color,box-shadow] duration-150 ease-out",
          open ? "border-accent-500 ring-2 ring-accent-500/25" : "border-border-button-default",
          "hover:bg-background-primary-hover",
          "outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        )}
      >
        <Icon name="calendar-line" className="size-4 shrink-0 text-foreground-icon-secondary" />
        <span
          className={cn(
            "flex-1 truncate text-start tabular-nums",
            current ? "text-text-primary" : "text-text-placeholder"
          )}
        >
          {current ? formatDate(current) : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute top-full z-50 mt-1.5 animate-[popover-in_180ms_cubic-bezier(0.22,1,0.36,1)]">
          <DateCalendar
            value={current}
            onChange={(d) => {
              if (value === undefined) setInner(d);
              onChange?.(d);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
