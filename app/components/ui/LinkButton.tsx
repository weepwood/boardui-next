"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  icon?: string;
  trailingIcon?: string;
  external?: boolean;
  variant?: "default" | "muted" | "accent";
  className?: string;
}

/**
 * 链接按钮：外观像内联链接，但可带图标与下划线动效。
 */
export function LinkButton({
  href,
  children,
  icon,
  trailingIcon,
  external,
  variant = "default",
  className,
}: LinkButtonProps) {
  const cls = cn(
    "group inline-flex cursor-pointer items-center gap-1 rounded-sm",
    "text-body-medium transition-colors duration-150 ease-out motion-reduce:transition-none",
    "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-full",
    variant === "default" && "text-text-primary hover:text-accent-600",
    variant === "muted" && "text-text-secondary hover:text-text-primary",
    variant === "accent" && "text-accent-600 hover:text-accent-700 dark:text-accent-400",
    className
  );

  const inner = (
    <>
      {icon && <Icon name={icon} className="size-4 shrink-0" />}
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-px origin-left rtl:origin-right scale-x-0 bg-current transition-transform duration-200 ease-bui group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        />
      </span>
      {trailingIcon && (
        <Icon
          name={trailingIcon}
          className="size-3.5 shrink-0 transition-transform duration-200 ease-bui group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
