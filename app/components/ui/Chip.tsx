"use client";

import { ToggleButton, type ToggleButtonProps } from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface ChipProps extends Omit<ToggleButtonProps, "className" | "children"> {
  label: string;
  icon?: string;
  className?: string;
}

/**
 * 筛选胶囊：可选中的小标签，选中态蓝底。
 * 对应原站 chip 组件。
 */
export function Chip({ label, icon, className, ...props }: ChipProps) {
  return (
    <ToggleButton
      {...props}
      className={cn(
        "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2",
        "border border-border-button-default bg-background-primary-default",
        "text-caption-1-medium text-text-secondary",
        "transition-[background-color,border-color,color] duration-150 ease-out",
        "hovered:bg-background-secondary-hover hovered:text-text-primary",
        "selected:border-border-button-active selected:bg-background-secondary-hover selected:text-text-primary",
        "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring motion-reduce:transition-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {icon && <Icon name={icon} className="size-3.5" />}
      {label}
    </ToggleButton>
  );
}
