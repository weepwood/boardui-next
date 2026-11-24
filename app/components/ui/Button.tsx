"use client";

import { Button as RACButton, type ButtonProps } from "react-aria-components";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface BButtonProps extends Omit<ButtonProps, "children" | "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 前置图标 */
  leading?: React.ReactNode;
  /** 后置图标 */
  trailing?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 尺寸（实测原站 button 页）：
 *   md = 80×36，padding 8px，字号 14px/500，圆角 10px，图标间距 2px
 */
const sizes: Record<ButtonSize, string> = {
  sm: "h-7 px-2 text-caption-1-medium gap-0.5",
  md: "h-9 px-2 text-body-medium gap-0.5",
  lg: "h-10 px-2.5 text-body-medium gap-1",
};

const variants: Record<ButtonVariant, string> = {
  // 主按钮：渐变背景 + 内描边高光 + 投影
  primary: cn(
    "bg-[linear-gradient(180deg,var(--color-accent-500)_0%,var(--color-accent-600)_100%)]",
    "text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.18),0_1px_2px_0_rgb(0_0_0/0.12)]",
    "hover:bg-[linear-gradient(180deg,var(--color-accent-400)_0%,var(--color-accent-500)_100%)]",
    "pressed:bg-[linear-gradient(180deg,var(--color-accent-600)_0%,var(--color-accent-700)_100%)]"
  ),
  // 次要：白底 + 描边 + 细投影
  secondary: cn(
    "bg-background-primary-default text-text-primary",
    "border border-border-button-default",
    "shadow-[0_1px_2px_0_rgb(0_0_0/0.05)]",
    "hover:bg-background-primary-hover pressed:bg-background-primary-active hover:border-border-button-hover pressed:border-border-button-active"
  ),
  // 浅色强调
  ghost: cn(
    "bg-button-ghost-background text-button-ghost-foreground",
    "hover:bg-button-ghost-hover",
    "pressed:bg-button-ghost-active"
  ),
  // 危险
  destructive: cn(
    "bg-[linear-gradient(180deg,var(--color-red-500)_0%,var(--color-red-600)_100%)]",
    "text-white shadow-[inset_0_1px_0_0_rgb(255_255_255/0.18),0_1px_2px_0_rgb(0_0_0/0.12)]",
    "hover:bg-[linear-gradient(180deg,var(--color-red-400)_0%,var(--color-red-500)_100%)]",
    "pressed:bg-[linear-gradient(180deg,var(--color-red-600)_0%,var(--color-red-700)_100%)]"
  ),
  outline: cn(
    "bg-transparent text-text-primary border border-separator-border",
    "hover:bg-background-secondary-hover"
  ),
};

/**
 * 按钮：基于 React Aria Components。
 *
 * 复刻原站要点：
 * - 圆角 rounded-2lg (10px)
 * - 渐变背景（180deg 双色）
 * - 内描边高光模拟顶部亮度
 * - 悬停 / 按下 / 焦点 / 禁用 全状态
 * - 按压反馈使用 data-pressed（React Aria 提供）
 */
export function Button({
  variant = "primary",
  size = "md",
  leading,
  trailing,
  className,
  children,
  ...props
}: BButtonProps) {
  return (
    <RACButton
      {...props}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-2lg font-medium",
        "select-none whitespace-nowrap",
        // 全状态过渡，与原站 duration-150 ease 一致
        "transition-[background,background-color,border-color,box-shadow,color,scale]",
        "duration-150 ease-out motion-reduce:transition-none motion-reduce:pressed:scale-100",
        // 按压缩放反馈
        "pressed:scale-[0.98]",
        // 焦点环
        "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-full",
        // 禁用态
        "disabled:cursor-not-allowed disabled:opacity-100",
        "disabled:bg-none disabled:bg-background-primary-disabled",
        "disabled:text-text-disabled disabled:shadow-none",
        "disabled:border-border-button-default",
        sizes[size],
        variants[variant],
        className
      )}
    >
      {leading}
      {children}
      {trailing}
    </RACButton>
  );
}
