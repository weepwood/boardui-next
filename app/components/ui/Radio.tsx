"use client";

import {
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
  type RadioGroupProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

export function RadioGroup({
  className,
  children,
  label,
  ...props
}: Omit<RadioGroupProps, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
  label?: string;
}) {
  return (
    <RACRadioGroup
      {...props}
      className={cn("flex flex-col gap-2 outline-none", className)}
    >
      {label && (
        <span className="text-body-2-medium text-text-primary">{label}</span>
      )}
      <div className="flex flex-col gap-2">{children}</div>
    </RACRadioGroup>
  );
}

/**
 * 单选框：复刻原站
 * - 圆形；选中态蓝色渐变 + 白色内点
 * 状态属性在 label 根元素上，用 [&[data-selected]>...] 定位内部圆环。
 */
export function Radio({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof RACRadio>, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACRadio
      {...props}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-2 select-none",
        "text-body-medium text-text-primary",
        "outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      {({ isSelected }) => (
        <>
          <span
            className={cn(
              "relative flex size-4 shrink-0 items-center justify-center rounded-full border shadow-xs",
              "transition-[background,border-color] duration-150 ease-out",
              isSelected
                ? "border-transparent bg-[linear-gradient(180deg,var(--color-accent-500)_0%,var(--color-accent-600)_100%)]"
                : "border-border-button-default bg-background-primary-default",
              "group-focus-visible:ring-2 group-focus-visible:ring-accent-500",
              "group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background-full"
            )}
          >
            <span
              className={cn(
                "block size-1.5 rounded-full bg-white",
                "transition-[opacity,transform] duration-150 ease-out",
                isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            />
          </span>
          {children && <span>{children}</span>}
        </>
      )}
    </RACRadio>
  );
}
