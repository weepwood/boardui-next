"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** 某月 1 号是周几（0=周一） */
function firstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay(); // 0=周日
  return (d + 6) % 7;
}

/**
 * 日期日历：月视图选择器。
 * 支持上/下月切换、今日高亮、选中态、禁用过去日期。
 */
export function DateCalendar({
  value,
  onChange,
  disablePast,
  className,
}: {
  value?: Date;
  onChange?: (d: Date) => void;
  disablePast?: boolean;
  className?: string;
}) {
  const today = new Date();
  const [view, setView] = useState({
    year: (value ?? today).getFullYear(),
    month: (value ?? today).getMonth(),
  });
  const [selected, setSelected] = useState<Date | undefined>(value);

  const total = daysInMonth(view.year, view.month);
  const offset = firstWeekday(view.year, view.month);
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const shift = (delta: number) => {
    const m = view.month + delta;
    const y = view.year + Math.floor(m / 12);
    setView({ year: y, month: ((m % 12) + 12) % 12 });
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <div
      className={cn(
        "w-[252px] rounded-2lg border border-border-button-default",
        "bg-background-primary-default p-2.5 shadow-lg",
        className
      )}
    >
      {/* 头部 */}
      <div className="mb-1.5 flex items-center justify-between">
        <button
          type="button"
          aria-label="上个月"
          onClick={() => shift(-1)}
          className="flex size-6 cursor-pointer items-center justify-center rounded-md text-foreground-icon-secondary hover:bg-background-secondary-hover"
        >
          <Icon name="arrow-left-s-line" className="size-4" />
        </button>
        <span className="text-caption-1-semibold tabular-nums text-text-primary">
          {view.year} 年 {view.month + 1} 月
        </span>
        <button
          type="button"
          aria-label="下个月"
          onClick={() => shift(1)}
          className="flex size-6 cursor-pointer items-center justify-center rounded-md text-foreground-icon-secondary hover:bg-background-secondary-hover"
        >
          <Icon name="arrow-right-s-line" className="size-4" />
        </button>
      </div>

      {/* 星期表头 */}
      <div className="grid grid-cols-7 gap-0.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-center text-[10px] text-text-tertiary">
            {w}
          </div>
        ))}
      </div>

      {/* 日期 */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const date = new Date(view.year, view.month, day);
          const isToday = isSameDay(date, today);
          const isSel = selected ? isSameDay(date, selected) : false;
          const past = disablePast && date < new Date(today.toDateString());

          return (
            <button
              key={day}
              type="button"
              disabled={past}
              onClick={() => {
                setSelected(date);
                onChange?.(date);
              }}
              className={cn(
                "flex size-7 cursor-pointer items-center justify-center rounded-md",
                "text-caption-1-medium tabular-nums transition-colors duration-150 ease-out",
                "disabled:cursor-not-allowed disabled:text-text-disabled",
                isSel
                  ? "bg-accent-500 text-white"
                  : isToday
                    ? "bg-badge-new-background text-accent-600 dark:text-accent-300"
                    : "text-text-primary hover:bg-background-secondary-hover"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 底部 */}
      <div className="mt-1.5 flex items-center justify-between border-t border-border-primary pt-1.5">
        <button
          type="button"
          onClick={() => {
            setSelected(undefined);
            onChange?.(undefined as unknown as Date);
          }}
          className="cursor-pointer rounded px-1.5 py-0.5 text-[11px] text-text-tertiary hover:bg-background-secondary-hover hover:text-text-primary"
        >
          清除
        </button>
        <button
          type="button"
          onClick={() => {
            setSelected(today);
            setView({ year: today.getFullYear(), month: today.getMonth() });
            onChange?.(today);
          }}
          className="cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-medium text-accent-600 hover:bg-badge-new-background dark:text-accent-400"
        >
          今天
        </button>
      </div>
    </div>
  );
}

/** 格式化日期为 YYYY-MM-DD */
export function formatDate(d?: Date) {
  if (!d) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
