"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * 抽屉：从侧边滑入的面板。
 * 使用 slide-in-right 动画，遮罩淡入。
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  side = "right",
  width = 400,
  children,
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  side?: "left" | "right";
  width?: number;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 animate-[fade-in_200ms_ease-out]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 面板 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width, maxWidth: "100vw" }}
        className={cn(
          "relative z-10 ms-auto flex h-full flex-col",
          "border-s border-border-primary bg-background-full shadow-xl",
          side === "right"
            ? "animate-[slide-in-right_280ms_cubic-bezier(0.22,1,0.36,1)]"
            : "me-auto border-e border-s-0 animate-[slide-in-right_280ms_cubic-bezier(0.22,1,0.36,1)]"
        )}
      >
        <div className="flex shrink-0 items-start gap-3 border-b border-border-primary p-4">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-body-medium text-text-primary">{title}</span>
            {description && (
              <span className="text-caption-1-regular text-text-secondary">{description}</span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg text-foreground-icon-secondary transition-colors hover:bg-background-secondary-hover"
          >
            <Icon name="close-line" className="size-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        {footer && (
          <div className="flex shrink-0 items-center justify-end gap-2 border-t border-border-primary p-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
