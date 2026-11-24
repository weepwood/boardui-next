"use client";

import {
  Slider as RACSlider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
  Label,
  type SliderProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

export interface BSliderProps extends Omit<SliderProps<number>, "className" | "children"> {
  label?: string;
  showValue?: boolean;
  className?: string;
}

/**
 * 滑块：严格复刻原站（实测参数）
 *
 * 轨道高 6px（h-1.5）
 *   - 底轨：background-tertiary-default + inset 0 1px 1px rgb(0 0 0/.06)
 *   - 已填充：accent-500 → accent-600 横向渐变
 *             + inset 0 1px 0 rgb(255 255 255/.24) 内高光
 *             + 0 1px 2px rgb(4 80 226/.16) 投影
 *
 * 圆钮 20×20
 *   - 1px #ebebeb 描边（border-button-default）
 *   - 白→浅灰渐变背景
 *   - shadow 0 2px 4px rgb(0 0 0/.10), inset 0 1px 0 rgb(255 255 255/.8)
 *   - 悬停/拖拽不缩放（原站仅改 cursor）
 */
export function Slider({
  label,
  showValue = true,
  className,
  ...props
}: BSliderProps) {
  return (
    <RACSlider
      {...props}
      className={cn("flex w-full flex-col gap-2", className)}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label ? (
            <Label className="text-body-medium text-text-primary">{label}</Label>
          ) : (
            <span />
          )}
          {showValue && (
            <SliderOutput className="text-body-2-medium tabular-nums text-text-secondary" />
          )}
        </div>
      )}

      <SliderTrack className="relative h-8 w-full">
        {({ state }) => (
          <>
            {/* 底轨 */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1/2 start-0 end-0 h-1.5 -translate-y-1/2 rounded-full",
                "bg-background-tertiary-default",
                "shadow-[inset_0_1px_1px_rgb(0_0_0/0.06)]",
                "transition-colors duration-150 ease-out"
              )}
            />
            {/* 已填充 */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full",
                "bg-[linear-gradient(to_right,var(--color-accent-500),var(--color-accent-600))]",
                "shadow-[inset_0_1px_0_rgb(255_255_255/0.24),0_1px_2px_rgb(4_80_226/0.16)]"
              )}
              style={{
                insetInlineStart: 0,
                insetInlineEnd: `${100 - state.getThumbPercent(0) * 100}%`,
              }}
            />
            {/* 圆钮：含拖拽时浮出的数值气泡（原站行为） */}
            <SliderThumb
              className={cn(
                "top-1/2 flex size-5 cursor-grab items-center justify-center rounded-full",
                "border border-border-button-default outline-none",
                "bg-[linear-gradient(to_bottom,var(--color-control-indicator-background)_43.8%,var(--color-control-indicator-background-subtle))]",
                "shadow-[0_2px_4px_rgb(0_0_0/0.10),inset_0_1px_0_rgb(255_255_255/0.8)]",
                "transition-[box-shadow,border-color] duration-150 ease-out",
                "hovered:border-border-button-hover",
                "dragging:cursor-grabbing",
                "focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
              )}
            >
              {({ isDragging, isHovered, isFocusVisible }) => (
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2",
                    "rounded-md border border-border-button-default bg-background-primary-default",
                    "px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-text-primary",
                    "shadow-sm transition-[opacity,scale] duration-150 ease-out",
                    isDragging || isHovered || isFocusVisible
                      ? "scale-100 opacity-100"
                      : "scale-90 opacity-0"
                  )}
                >
                  {Math.round(state.getThumbValue(0))}
                </span>
              )}
            </SliderThumb>
          </>
        )}
      </SliderTrack>
    </RACSlider>
  );
}
