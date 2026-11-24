"use client";

import { cn } from "@/lib/utils";

/**
 * 按钮组：相邻按钮合并为整体，仅首尾有圆角。
 * 支持水平/垂直方向与尺寸。
 */
export function ButtonGroup({
  children,
  orientation = "horizontal",
  className,
}: {
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  return (
    <div
      role="group"
      className={cn(
        "inline-flex overflow-hidden rounded-2lg border border-border-button-default",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        // 子按钮之间加分隔线，去掉各自圆角
        "[&>*]:rounded-none [&>*]:border-0 [&>*]:shadow-none [&>*]:px-3",
        orientation === "horizontal"
          ? "[&>*+*]:border-s [&>*+*]:border-border-button-default"
          : "[&>*+*]:border-t [&>*+*]:border-border-button-default",
        className
      )}
    >
      {children}
    </div>
  );
}
