"use client";

import {
  ProgressBar as RACProgressBar,
  type ProgressBarProps,
} from "react-aria-components";
import { useRef } from "react";
import { useVisibleActivity } from "./use-visible-activity";
import { cx as cn } from "./cx";
import { progressTrack,progressFill,progressTones } from "./progress-styles";

function IndeterminateFill(){
  const ref=useRef<HTMLDivElement>(null);
  const active=useVisibleActivity(ref);
  return <div ref={ref} data-progress-motion data-motion-active={active?"true":"false"} aria-hidden="true" className="absolute inset-0"><div data-progress-sweep
    className="absolute inset-y-0 start-0 w-1/3 rounded-full bg-[linear-gradient(90deg,transparent,var(--color-accent-400),var(--color-accent-600),transparent)] rtl:bg-[linear-gradient(270deg,transparent,var(--color-accent-400),var(--color-accent-600),transparent)] animate-[bui-progress-sweep_1.6s_ease-in-out_infinite] rtl:[animation-name:bui-progress-sweep-rtl] motion-reduce:animate-none motion-reduce:start-1/3"/></div>;
}

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
            <IndeterminateFill/>
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
