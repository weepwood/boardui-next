"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { Avatar } from "./Avatar";

export type NoticeItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
  avatar?: string;
  icon?: string;
};

/**
 * 通知中心：通知列表 + 未读标记 + 全部已读。
 */
export function NotificationCenter({
  items: initial,
  onClose,
  className,
}: {
  items: NoticeItem[];
  onClose?: () => void;
  className?: string;
}) {
  const [items, setItems] = useState(initial);
  const unread = items.filter((i) => i.unread).length;

  return (
    <div
      className={cn(
        "flex w-full max-w-[340px] flex-col overflow-hidden rounded-2lg",
        "border border-border-button-default bg-background-primary-default shadow-lg",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border-primary px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-body-2-medium text-text-primary">通知</span>
          {unread > 0 && (
            <span className="rounded-full bg-accent-500 px-1.5 text-[10px] font-medium text-white">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setItems((p) => p.map((i) => ({ ...i, unread: false })))}
            className="cursor-pointer rounded px-1.5 py-0.5 text-[10px] text-text-tertiary hover:bg-background-secondary-hover hover:text-text-primary"
          >
            全部已读
          </button>
          {onClose && (
            <button
              type="button"
              aria-label="关闭"
              onClick={onClose}
              className="flex size-5 cursor-pointer items-center justify-center rounded text-text-tertiary hover:bg-background-secondary-hover"
            >
              <Icon name="close-line" className="size-3" />
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[320px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-10">
            <Icon name="notification-3-line" className="size-6 text-foreground-icon-quaternary" />
            <span className="text-caption-1-regular text-text-tertiary">暂无通知</span>
          </div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() =>
                setItems((p) => p.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))
              }
              className={cn(
                "flex w-full gap-2 border-b border-border-primary p-2.5 text-start last:border-0",
                "transition-colors duration-150 hover:bg-background-secondary-hover"
              )}
            >
              {n.avatar ? (
                <Avatar name={n.avatar} size="sm" />
              ) : (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-background-secondary-default text-foreground-icon-secondary">
                  <Icon name={n.icon ?? "notification-3-line"} className="size-3.5" />
                </span>
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-start gap-1.5">
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-caption-1-medium",
                      n.unread ? "text-text-primary" : "text-text-secondary"
                    )}
                  >
                    {n.title}
                  </span>
                  {n.unread && (
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent-500" />
                  )}
                </div>
                <span className="line-clamp-2 text-[10px] leading-snug text-text-tertiary">
                  {n.body}
                </span>
                <span className="text-[10px] text-text-quaternary">{n.time}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
