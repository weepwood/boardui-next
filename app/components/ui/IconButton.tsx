"use client";

import { Button as RACButton, type ButtonProps } from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface IconButtonProps extends Omit<ButtonProps, "className" | "children"> {
  icon: string;
  label: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "filled";
  className?: string;
}

const sizes = { sm: "size-7", md: "size-9", lg: "size-10" } as const;
const iconSizes = { sm: "size-3.5", md: "size-4", lg: "size-5" } as const;

const variants = {
  ghost:
    "text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-foreground-icon-primary",
  outline:
    "border border-border-button-default bg-background-primary-default text-text-primary shadow-xs hover:bg-background-primary-hover",
  filled: "bg-background-tertiary-default text-text-primary hover:bg-background-tertiary-hover",
} as const;

/** 图标按钮：纯图标 + 无障碍标签 */
export function IconButton({
  icon,
  label,
  size = "md",
  variant = "ghost",
  className,
  ...props
}: IconButtonProps) {
  return (
    <RACButton
      {...props}
      aria-label={label}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-2lg",
        "transition-[background-color,color,scale] duration-150 ease-out motion-reduce:transition-none motion-reduce:pressed:scale-100",
        "pressed:scale-95 outline-none",
        "focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-full",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size],
        variants[variant],
        className
      )}
    >
      <Icon name={icon} className={iconSizes[size]} />
    </RACButton>
  );
}
