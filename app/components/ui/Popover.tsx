"use client";

import {
  Popover as RACPopover,
  type PopoverProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

/**
 * 弹出层：复刻原站
 * - 圆角 10px、白底、1px 浅灰描边、shadow-lg
 * - 进入动效：scale 0.96 + 上移 → 归位，220ms cubic-bezier(0.22,1,0.36,1)
 */
export function Popover({
  className,
  children,
  offset = 6,
  ...props
}: Omit<PopoverProps, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACPopover
      {...props}
      offset={offset}
      className={cn(
        "z-50 min-w-[var(--trigger-width)] rounded-2lg border border-border-button-default",
        "bg-background-primary-default p-1.5 shadow-lg outline-none",
        "data-[entering]:animate-[popover-in_200ms_cubic-bezier(0.22,1,0.36,1)]",
        "data-[exiting]:animate-[popover-out_140ms_ease-in]",
        className
      )}
    >
      {children}
    </RACPopover>
  );
}
