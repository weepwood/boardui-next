import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "pro";

const styles: Record<BadgeVariant, string> = {
  neutral: "bg-background-secondary-default text-text-secondary",
  accent: "bg-badge-new-background text-accent-600 dark:text-accent-300",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  pro: "bg-[linear-gradient(135deg,#a855f7,#6366f1)] text-white",
};

/** 徽标：圆角小胶囊 */
export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-px",
        "text-caption-2-medium leading-[1.5] whitespace-nowrap",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
