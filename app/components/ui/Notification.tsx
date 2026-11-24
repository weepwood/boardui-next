"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type NotificationVariant = "information" | "success" | "error";

const variants: Record<NotificationVariant, { bg: string; fg: string; icon: string }> = {
  information: {
    bg: "bg-[var(--color-notification-information-background)]",
    fg: "text-[var(--color-notification-information-foreground)]",
    icon: "information-fill",
  },
  success: {
    bg: "bg-[var(--color-notification-success-background)]",
    fg: "text-[var(--color-notification-success-foreground)]",
    icon: "checkbox-circle-fill",
  },
  error: {
    bg: "bg-[var(--color-notification-error-background)]",
    fg: "text-[var(--color-notification-error-foreground)]",
    icon: "error-warning-fill",
  },
};

/**
 * 通知横幅：比公告更强调，带色块图标。
 */
export function Notification({
  variant = "information",
  title,
  description,
  action,
  onClose,
  className,
}: {
  variant?: NotificationVariant;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  const v = variants[variant];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-2lg border border-border-button-default p-3",
        v.bg,
        className
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full",
          v.bg
        )}
      >
        <Icon name={v.icon} className={cn("size-4", v.fg)} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-body-2-medium text-text-primary">{title}</span>
        {description && (
          <span className="text-caption-1-regular text-text-secondary">{description}</span>
        )}
      </div>
      {action}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-black/5 hover:text-text-primary"
        >
          <Icon name="close-line" className="size-3.5" />
        </button>
      )}
    </div>
  );
}
