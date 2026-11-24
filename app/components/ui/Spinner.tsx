"use client";

import {useRef} from "react";
import {useVisibleActivity} from "@/packages/react/use-visible-activity";
import {
  ProgressBar as RACProgressBar,
  type ProgressBarProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

/** 不确定进度：无限旋转圆环 */
export function Spinner({
  className,
  size = 16,
  ...props
}: Omit<ProgressBarProps, "className"> & {
  className?: string;
  size?: number;
}) {
  const ref=useRef<SVGSVGElement>(null);
  const active=useVisibleActivity(ref);
  return (
    <RACProgressBar
      {...props}
      isIndeterminate
      aria-label="加载中"
      className={cn("inline-flex", className)}
    >
      <svg
        ref={ref}
        data-motion-active={active?"true":"false"}
        data-spinner
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="animate-spin motion-reduce:animate-none"
        style={{ animationDuration: "0.75s" }}
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="14 44"
          opacity="0.9"
        />
      </svg>
    </RACProgressBar>
  );
}
