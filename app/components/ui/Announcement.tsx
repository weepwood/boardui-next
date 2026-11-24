"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type AnnouncementVariant = "info" | "success" | "warning" | "error";

const styles: Record<AnnouncementVariant, { wrap: string; icon: string; name: string }> = {
  info: {
    wrap: "bg-[color-mix(in_srgb,var(--color-blue-100)_70%,transparent)] border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-200",
    icon: "text-blue-500",
    name: "information-line",
  },
  success: {
    wrap: "bg-lime-100/70 border-lime-200 text-lime-900 dark:bg-lime-950/40 dark:border-lime-900 dark:text-lime-200",
    icon: "text-lime-600",
    name: "checkbox-circle-line",
  },
  warning: {
    wrap: "bg-amber-100/70 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-200",
    icon: "text-amber-500",
    name: "alert-line",
  },
  error: {
    wrap: "bg-red-100/70 border-red-200 text-red-900 dark:bg-red-950/40 dark:border-red-900 dark:text-red-200",
    icon: "text-red-500",
    name: "error-warning-line",
  },
};

/**
 * 公告条：页面级提示。
 * 支持标题、描述、操作按钮与关闭。
 */
export function Announcement({
  variant = "info",
  title,
  description,
  action,
  onClose,
  className,
}: {
  variant?: AnnouncementVariant;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  const s = styles[variant];
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-2lg border p-3",
        s.wrap,
        className
      )}
    >
      <Icon name={s.name} className={cn("mt-0.5 size-4 shrink-0", s.icon)} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-2-medium">{title}</span>
        {description && (
          <span className="text-caption-1-regular opacity-80">{description}</span>
        )}
      </div>
      {action}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md opacity-60 transition-opacity hover:opacity-100"
        >
          <Icon name="close-line" className="size-3.5" />
        </button>
      )}
    </div>
  );
}
