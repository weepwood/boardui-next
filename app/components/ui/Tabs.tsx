"use client";
import { cn } from "@/lib/utils";
export { Tabs, TabList, Tab, TabPanel } from "@/packages/react/tabs";
/** 标签项内的数量徽标：选中态样式由父级 Tab 的 selected 状态驱动 */
export function TabCount({ count }: { count: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-1.5 py-px text-[11px] font-medium tabular-nums",
        "bg-background-tertiary-default text-text-tertiary",
        "group-data-[selected]:bg-[var(--color-tab-count-selected-background)] group-data-[selected]:text-accent-600"
      )}
    >
      {count}
    </span>
  );
}
