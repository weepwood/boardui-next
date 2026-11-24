"use client";

import {
  ProgressBar as RACProgressBar,
  type ProgressBarProps,
} from "react-aria-components";
import { cx as cn } from "./cx";
import { progressTrack,progressFill,progressTones } from "./progress-styles";

/** 进度条：复刻原站，蓝色渐变填充 + 圆角轨道 */
export function Progress({
  className,
  size = "md",
  ...props
}: Omit<ProgressBarProps, "className"> & {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <RACProgressBar
      aria-label={props["aria-label"]??(!props["aria-labelledby"]?"进度":undefined)}
      {...props}
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      {({ percentage, isIndeterminate }) => (
        <div
          className={cn(
            progressTrack,
            size === "sm" ? "h-1.5" : "h-2"
          )}
        >
          {isIndeterminate ? (
            // 不确定态：三分之一宽的渐变块循环扫过（原站行为）
            <div
              className={cn(
                "absolute inset-y-0 w-1/3 rounded-full",
                "bg-[linear-gradient(90deg,transparent,var(--color-accent-400),var(--color-accent-600),transparent)]",
                "animate-[bui-progress-sweep_1.6s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:start-1/3"
              )}
            />
          ) : (
            <div
              className={cn(
                progressFill,progressTones.accent
              )}
              style={{ width: `${percentage ?? 0}%` }}
            />
          )}
        </div>
      )}
    </RACProgressBar>
  );
}
