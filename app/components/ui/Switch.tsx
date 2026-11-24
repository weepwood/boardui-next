"use client";

import {
  Switch as RACSwitch,
  type SwitchProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

export interface BSwitchProps extends Omit<SwitchProps, "className" | "children"> {
  size?: "sm" | "md" | "lg";
  /** pill = 胶囊（全圆角）；rect = 矩形（6px 圆角） */
  shape?: "pill" | "rect";
  className?: string;
  children?: React.ReactNode;
}

/**
 * 开关：严格复刻原站三层结构
 *
 *   轨道（渐变 + 内描边高光）
 *   └── 圆钮（白→浅灰渐变 + 外阴影）
 *       └── 内芯（蓝色渐变 + 0.5px 描边）
 *
 * 实测参数（原站 switch 页）：
 *   Pill Small   轨道 28×16  圆钮 12  无内芯
 *   Pill Medium  轨道 42×24  圆钮 18  内芯 7.5
 *   Pill Large   轨道 56×32  圆钮 24  内芯 10
 *   Rect Large   轨道 56×32  圆角 6px
 */
const SIZES = {
  sm: { track: "h-4 w-7", knob: "size-3", knobPos: "inset-0.5", core: "" },
  md: {
    track: "h-6 w-[42px]",
    knob: "size-[18px]",
    knobPos: "inset-[3px]",
    core: "size-[7.5px]",
  },
  lg: { track: "h-8 w-14", knob: "size-6", knobPos: "inset-1", core: "size-[10px]" },
} as const;

/** 位移需字面量，Tailwind 才能扫描到 */
const SHIFT = {
  sm: "translate-x-3",
  md: "translate-x-[18px]",
  lg: "translate-x-6",
} as const;

export function Switch({
  size = "md",
  shape = "pill",
  className,
  children,
  ...props
}: BSwitchProps) {
  const s = SIZES[size];
  const isRect = shape === "rect";

  return (
    <RACSwitch
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
          {/* 轨道 */}
          <span
            className={cn(
              "relative inline-block shrink-0 transition-colors duration-200 ease-out",
              isRect ? "rounded-md" : "rounded-full",
              s.track,
              isSelected
                ? cn(
                    "bg-[linear-gradient(to_bottom,var(--color-switch-on-chip-start),var(--color-switch-on-chip-end))]",
                    isRect
                      ? "shadow-[inset_0_2px_0_0_rgb(255_255_255/0.25),inset_0_0_0_1px_var(--color-accent-500)]"
                      : size === "sm"
                        ? "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.25),inset_0_0_0_0.5px_var(--color-accent-500)]"
                        : "shadow-[inset_0_1.5px_0_0_rgb(255_255_255/0.25),inset_0_0_0_0.5px_var(--color-accent-500)]"
                  )
                : "bg-background-tertiary-default shadow-[inset_0_1px_1px_rgb(0_0_0/0.06)]"
            )}
          >
            {/* 圆钮 */}
            <span
              className={cn(
                "absolute flex items-center justify-center",
                "bg-[linear-gradient(to_bottom,var(--color-control-indicator-background)_43.8%,var(--color-control-indicator-background-subtle))]",
                "transition-transform duration-200 ease-bui",
                isRect ? "rounded-[2px]" : "rounded-full",
                s.knob,
                s.knobPos,
                isRect
                  ? "shadow-[0_1px_2px_rgb(0_0_0/0.10)]"
                  : "shadow-[0_1px_2px_rgb(0_0_0/0.10),inset_0_1px_0_rgb(255_255_255/0.8)]",
                isSelected ? SHIFT[size] : "translate-x-0"
              )}
            >
              {/* 内芯：仅选中态且 md / lg 尺寸 */}
              {s.core && isSelected && (
                <span
                  className={cn(
                    "border-solid border-accent-600",
                    "bg-[linear-gradient(to_top,var(--color-accent-600)_43.8%,var(--color-accent-500))]",
                    "shadow-[0_4px_4px_0_rgb(0_0_0/0.03)] border-[0.5px]",
                    isRect ? "rounded-[1px]" : "rounded-full",
                    s.core
                  )}
                />
              )}
            </span>
          </span>
          {children && <span>{children}</span>}
        </>
      )}
    </RACSwitch>
  );
}
