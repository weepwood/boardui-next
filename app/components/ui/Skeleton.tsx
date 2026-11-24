"use client";
import {useRef} from "react";
import {useVisibleActivity} from "@/packages/react/use-visible-activity";
import { cn } from "@/lib/utils";

/** 骨架屏：微光扫过动画（复用原站 bui-skeleton-sheen） */
export function Skeleton({
  className,
  rounded = "md",
}: {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}) {
  const ref=useRef<HTMLDivElement>(null);
  const active=useVisibleActivity(ref);
  const radius = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-2lg",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      ref={ref}
      data-motion-active={active?"true":"false"}
      data-skeleton
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-background-tertiary-default",
        radius,
        "before:absolute before:inset-0",
        "before:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,white_45%,transparent),transparent)]",
        "before:[animation:bui-skeleton-sheen-x_1.8s_ease-in-out_infinite]",
        "motion-reduce:before:animate-none",
        "before:content-['']",
        className
      )}
    />
  );
}
