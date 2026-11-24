"use client";

import {
  Tooltip as RACTooltip,
  TooltipTrigger,
  type TooltipProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

export { TooltipTrigger };

/**
 * 提示气泡：复刻原站
 * - 深色底 / 白字，圆角 8px，小号字
 * - 淡入 + 轻微上移
 */
export function Tooltip({
  className,
  children,
  ...props
}: Omit<TooltipProps, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACTooltip
      {...props}
      offset={6}
      className={cn(
        "z-50 max-w-[240px] rounded-lg px-2 py-1",
        "bg-text-primary text-caption-1-medium text-background-full",
        "shadow-md outline-none",
        "data-[entering]:animate-[fade-in_150ms_ease-out]",
        "data-[exiting]:animate-[fade-out_120ms_ease-in]",
        className
      )}
    >
      {children}
    </RACTooltip>
  );
}
