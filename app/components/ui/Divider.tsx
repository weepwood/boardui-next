"use client";

import {
  Separator as RACSeparator,
  type SeparatorProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

/** 分隔线：支持水平 / 垂直 */
export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: Omit<SeparatorProps, "className"> & { className?: string }) {
  return (
    <RACSeparator
      {...props}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border-primary",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  );
}
