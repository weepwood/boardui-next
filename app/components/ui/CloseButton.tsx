"use client";

import { Button as RACButton, type ButtonProps } from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface CloseButtonProps extends Omit<ButtonProps, "className" | "children"> {
  size?: "sm" | "md" | "lg";
  /** 是否为实心圆底 */
  variant?: "ghost" | "filled";
  className?: string;
}

const sizes = { sm: "size-5", md: "size-6", lg: "size-7" } as const;
const icons = { sm: "size-3", md: "size-3.5", lg: "size-4" } as const;

/** 关闭按钮：用于弹窗、标签、提示等场景的统一关闭控件 */
export function CloseButton({
  size = "md",
  variant = "ghost",
  className,
  ...props
}: CloseButtonProps) {
  return (
    <RACButton
      {...props}
      aria-label={props["aria-label"] ?? "关闭"}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full",
        "transition-[background-color,color,scale] duration-150 ease-out",
        "pressed:scale-90 outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-40",
        sizes[size],
        variant === "filled"
          ? "bg-background-tertiary-default text-text-secondary hover:bg-background-tertiary-hover hover:text-text-primary"
          : "text-text-tertiary hover:bg-background-secondary-hover hover:text-text-primary",
        className
      )}
    >
      <Icon name="close-line" className={icons[size]} />
    </RACButton>
  );
}
