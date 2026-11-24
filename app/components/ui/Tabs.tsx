"use client";

import {
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  type TabsProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

/**
 * 标签页：严格复刻原站下划线样式（实测参数）
 *
 * 容器（tablist）
 *   无背景、无圆角、gap 4px、底部 1px separator-border 分隔线
 * 标签项（tab）
 *   36px 高，padding 8px 10px，图标与文字间距 10px
 *   选中：文字 accent-600 + 底部 2px 蓝线
 *   未选中：文字 text-secondary，悬停变深
 */
export function Tabs({
  className,
  children,
  ...props
}: Omit<TabsProps, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACTabs
      {...props}
      className={cn("flex w-full flex-col gap-3 outline-none", className)}
    >
      {children}
    </RACTabs>
  );
}

export function TabList({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof RACTabList>, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACTabList
      {...props}
      className={cn(
        "flex w-full items-center gap-1 overflow-x-auto",
        "border-b border-separator-border",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {children}
    </RACTabList>
  );
}

export function Tab({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof RACTab>, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACTab
      {...props}
      className={cn(
        "relative inline-flex cursor-pointer items-center gap-2.5 whitespace-nowrap",
        "px-2.5 py-2 outline-none",
        "text-body-medium text-text-secondary",
        "transition-colors duration-150 ease-out",
        "hover:text-text-primary",
        // 选中：文字变强调色
        "selected:text-accent-600 dark:selected:text-accent-400",
        // 底部指示线
        "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-transparent",
        "selected:after:bg-accent-500",
        "after:transition-colors after:duration-150",
        "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        "disabled:cursor-not-allowed disabled:text-text-disabled",
        className
      )}
    >
      {children}
    </RACTab>
  );
}

/** 标签项内的数量徽标：选中态样式由父级 Tab 的 selected 状态驱动 */
export function TabCount({ count }: { count: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-1.5 py-px text-[11px] font-medium tabular-nums",
        "bg-background-tertiary-default text-text-tertiary",
        "group-selected:bg-[var(--color-tab-count-selected-background)] group-selected:text-accent-600"
      )}
    >
      {count}
    </span>
  );
}

export function TabPanel({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof RACTabPanel>, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACTabPanel
      {...props}
      className={cn(
        "outline-none",
        "data-[entering]:animate-[fade-in_180ms_ease-out]",
        className
      )}
    >
      {children}
    </RACTabPanel>
  );
}
