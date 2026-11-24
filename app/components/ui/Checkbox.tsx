"use client";

import {
  Checkbox as RACCheckbox,
  type CheckboxProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

export interface BCheckboxProps extends Omit<CheckboxProps, "className" | "children"> {
  className?: string;
  children?: React.ReactNode;
}

/**
 * 复选框：严格复刻原站（实测参数）
 *
 * 方框 16×16、圆角 4px
 *   未选：白底 + 1px border-checkbox-default
 *   选中/不确定：accent-500 → accent-600 渐变 + shadow-checkbox-selected，无描边
 * 对勾 SVG 16×16 viewBox，路径 M4 7.7 L6.646 10.347 L12 5.7，stroke-width 2
 * 不确定：M4.5 8 H11.5
 */
export function Checkbox({ className, children, ...props }: BCheckboxProps) {
  return (
    <RACCheckbox
      {...props}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2 select-none",
        "text-body-medium text-text-primary",
        "outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {({ isSelected, isIndeterminate }) => {
        const active = isSelected || isIndeterminate;
        return (
          <>
            <span
              className={cn(
                "relative flex size-4 shrink-0 items-center justify-center rounded-[4px]",
                "transition-[background-color,border-color,box-shadow] duration-150 ease-out",
                active
                  ? cn(
                      "bg-[linear-gradient(to_bottom,var(--color-accent-500),var(--color-accent-600))]",
                      "shadow-[inset_0_2px_0_0_rgb(255_255_255/0.25),inset_0_0_0_1px_var(--color-accent-500)]"
                    )
                  : "border border-border-checkbox-default bg-background-primary-default",
                "group-focus-visible:ring-2 group-focus-visible:ring-accent-500",
                "group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background-full"
              )}
            >
              {/* 对勾：原站 16×16 viewBox */}
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className={cn(
                  "size-4 transition-opacity duration-150",
                  isSelected && !isIndeterminate ? "opacity-100" : "opacity-0"
                )}
              >
                <path
                  d="M4 7.7002L6.64645 10.3466C6.84171 10.5419 7.15829 10.5419 7.35355 10.3466L12 5.7002"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* 不确定：横线 */}
              {isIndeterminate && (
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="absolute size-4"
                >
                  <path
                    d="M4.5 8H11.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
            {children && <span>{children}</span>}
          </>
        );
      }}
    </RACCheckbox>
  );
}
