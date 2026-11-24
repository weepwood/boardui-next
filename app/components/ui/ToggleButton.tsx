"use client";

import {
  ToggleButton as RACToggleButton,
  ToggleButtonGroup as RACToggleButtonGroup,
  type ToggleButtonProps,
  type ToggleButtonGroupProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

/** 切换按钮组：分段式容器 */
export function ToggleButtonGroup({
  className,
  children,
  ...props
}: Omit<ToggleButtonGroupProps, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACToggleButtonGroup
      {...props}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-2lg p-0.5",
        "bg-segmented-control-background",
        className
      )}
    >
      {children}
    </RACToggleButtonGroup>
  );
}

/**
 * 切换按钮：复刻原站分段控件项
 * 选中态白底 + 细阴影
 */
export function ToggleButton({
  className,
  children,
  ...props
}: Omit<ToggleButtonProps, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACToggleButton
      {...props}
      className={cn(
        "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-[7px] px-2.5",
        "text-body-2-medium text-text-secondary",
        "transition-colors duration-150 ease-out",
        "hovered:text-text-primary outline-none",
        "selected:bg-segmented-control-selected-background selected:text-text-primary selected:shadow-xs",
        "focus-visible:ring-2 focus-visible:ring-accent-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {children}
    </RACToggleButton>
  );
}
