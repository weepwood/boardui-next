import { cn } from "@/lib/utils";

/** 骨架屏：微光扫过动画（复用原站 bui-skeleton-sheen） */
export function Skeleton({
  className,
  rounded = "md",
}: {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}) {
  const radius = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-2lg",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden bg-background-tertiary-default",
        radius,
        "before:absolute before:inset-0",
        "before:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,white_45%,transparent),transparent)]",
        "before:[animation:bui-skeleton-sheen_1.8s_ease-in-out_infinite]",
        "before:content-['']",
        className
      )}
    />
  );
}
