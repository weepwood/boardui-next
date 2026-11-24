"use client";

import { useState } from "react";
import { Icon } from "@/app/components/ui/Icon";
import { Avatar } from "@/app/components/ui/Avatar";
import { cn } from "@/lib/utils";

type EventTone = "blue" | "purple" | "lime" | "pink" | "emerald";

type CalEvent = {
  id: string;
  day: number;
  time: string;
  title: string;
  tone: EventTone;
  attendee?: string;
};

const EVENTS: CalEvent[] = [
  { id: "e1", day: 3, time: "09:30", title: "设计评审", tone: "blue", attendee: "李四" },
  { id: "e2", day: 5, time: "14:00", title: "组件发布同步", tone: "purple", attendee: "张三" },
  { id: "e3", day: 7, time: "11:00", title: "用户访谈", tone: "lime" },
  { id: "e4", day: 12, time: "10:00", title: "季度规划", tone: "pink", attendee: "王五" },
  { id: "e5", day: 12, time: "16:30", title: "一对一沟通", tone: "emerald" },
  { id: "e6", day: 18, time: "13:00", title: "技术分享：动效设计", tone: "blue" },
  { id: "e7", day: 21, time: "09:00", title: "迭代回顾", tone: "purple", attendee: "赵六" },
  { id: "e8", day: 25, time: "15:00", title: "Demo Day", tone: "lime" },
  { id: "e9", day: 27, time: "10:30", title: "路线图评审", tone: "pink" },
];

const TONE: Record<EventTone, string> = {
  blue: "bg-[var(--color-calendar-event-blue-background)] text-[var(--color-calendar-event-blue-title)]",
  purple:
    "bg-[var(--color-calendar-event-purple-background)] text-[var(--color-calendar-event-purple-title)]",
  lime: "bg-[var(--color-calendar-event-lime-background)] text-[var(--color-calendar-event-lime-title)]",
  pink: "bg-[var(--color-calendar-event-pink-background)] text-[var(--color-calendar-event-pink-title)]",
  emerald:
    "bg-[var(--color-calendar-event-emerald-background)] text-[var(--color-calendar-event-emerald-title)]",
};

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

/** 2026 年 8 月的真实布局：1 号是周六 */
const DAYS_IN_MONTH = 31;
const FIRST_WEEKDAY = 5; // 0=周一 … 5=周六

/** 日历模板：月视图 + 事件色块 + 侧栏日程 */
export function CalendarCard() {
  const [selected, setSelected] = useState(12);
  const [month] = useState("2026年8月");

  const cells: (number | null)[] = [
    ...Array.from({ length: FIRST_WEEKDAY }, () => null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const dayEvents = EVENTS.filter((e) => e.day === selected);
  const today = 12;

  return (
    <div className="flex min-h-[620px] w-full flex-col overflow-hidden rounded-3xl border border-border-component-detail-container bg-background-primary-default lg:flex-row">
      {/* 日历主体 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-separator-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-title-3-semibold text-text-primary">{month}</h3>
            <span className="text-caption-1-regular text-text-tertiary">9 个日程</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="上个月"
              className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-foreground-icon-secondary hover:bg-background-secondary-hover"
            >
              <Icon name="arrow-left-s-line" className="size-4" />
            </button>
            <button
              type="button"
              className="h-7 cursor-pointer rounded-lg px-2 text-caption-1-medium text-text-secondary hover:bg-background-secondary-hover"
            >
              今天
            </button>
            <button
              type="button"
              aria-label="下个月"
              className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-foreground-icon-secondary hover:bg-background-secondary-hover"
            >
              <Icon name="arrow-right-s-line" className="size-4" />
            </button>
          </div>
        </header>

        {/* 星期表头 */}
        <div className="grid grid-cols-7 border-b border-separator-border">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="py-1.5 text-center text-caption-2-semibold text-text-tertiary"
            >
              {w}
            </div>
          ))}
        </div>

        {/* 日期网格 */}
        <div className="grid min-w-0 flex-1 grid-cols-7 auto-rows-fr">
          {cells.map((day, i) => {
            if (day === null) {
              return (
                <div
                  key={`e${i}`}
                  className="min-h-[84px] border-b border-e border-separator-border bg-background-secondary-default/40"
                />
              );
            }
            const evs = EVENTS.filter((e) => e.day === day);
            const isToday = day === today;
            const isSel = day === selected;
            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelected(day)}
                className={cn(
                  "flex min-w-0 min-h-[84px] cursor-pointer flex-col gap-1 border-b border-e border-separator-border p-1.5 text-start",
                  "transition-colors duration-150 ease-out",
                  isSel ? "bg-badge-new-background" : "hover:bg-background-secondary-hover"
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-caption-2-medium tabular-nums",
                    isToday
                      ? "bg-accent-500 text-white"
                      : "text-text-secondary"
                  )}
                >
                  {day}
                </span>
                <div className="flex flex-col gap-0.5">
                  {evs.slice(0, 2).map((e) => (
                    <span
                      key={e.id}
                      title={`${e.time} ${e.title}`}
                      className={cn(
                        "truncate rounded px-1 py-px text-[10px] leading-[1.4]",
                        TONE[e.tone]
                      )}
                    >
                      {e.title}
                    </span>
                  ))}
                  {evs.length > 2 && (
                    <span className="px-1 text-caption-2-regular text-text-secondary">
                      +{evs.length - 2} 更多
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 侧栏日程 */}
      <aside className="flex w-full shrink-0 flex-col gap-3 border-t border-separator-border p-4 lg:w-[240px] lg:border-s lg:border-t-0">
        <div className="flex flex-col gap-0.5">
          <span className="text-body-2-medium text-text-primary">8月{selected}日</span>
          <span className="text-caption-2-regular text-text-tertiary">
            {dayEvents.length} 个日程
          </span>
        </div>

        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-8 text-center">
            <Icon name="calendar-blank-line" className="size-6 text-foreground-icon-quaternary" />
            <span className="text-caption-1-regular text-text-tertiary">这天没有安排</span>
          </div>
        ) : (
          dayEvents.map((e) => (
            <div
              key={e.id}
              className={cn(
                "flex flex-col gap-1 rounded-lg border-s-2 p-2",
                TONE[e.tone].replace("text-", "border-s-").split(" ")[0],
                "bg-background-secondary-default"
              )}
            >
              <span className="text-caption-2-medium text-text-tertiary">{e.time}</span>
              <span className="text-body-2-medium text-text-primary">{e.title}</span>
              {e.attendee && (
                <span className="flex items-center gap-1.5 pt-0.5">
                  <Avatar name={e.attendee} size="xs" />
                  <span className="text-caption-2-regular text-text-tertiary">
                    {e.attendee}
                  </span>
                </span>
              )}
            </div>
          ))
        )}

        <div className="mt-auto flex flex-col gap-1.5 border-t border-separator-border pt-3">
          <span className="text-caption-2-semibold text-text-tertiary">成员</span>
          <div className="flex -space-x-1.5">
            {["张三", "李四", "王五", "赵六"].map((n) => (
              <span key={n} className="rounded-full ring-2 ring-background-primary-default">
                <Avatar name={n} size="sm" />
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
