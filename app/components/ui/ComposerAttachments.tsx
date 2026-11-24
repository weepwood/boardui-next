"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type Attachment = {
  id: string;
  name: string;
  size?: string;
  kind?: "file" | "image";
};

/**
 * 输入框附件：以横向卡片展示待发送文件。
 */
export function ComposerAttachments({
  items,
  onRemove,
  className,
}: {
  items: Attachment[];
  onRemove?: (id: string) => void;
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((a) => (
        <div
          key={a.id}
          className={cn(
            "group flex items-center gap-1.5 rounded-lg border border-border-primary",
            "bg-background-secondary-default py-1 pe-1 ps-1.5"
          )}
        >
          <Icon
            name={a.kind === "image" ? "image-line" : "file-text-line"}
            className="size-3.5 shrink-0 text-foreground-icon-secondary"
          />
          <span className="max-w-[140px] truncate text-caption-2-medium text-text-primary">
            {a.name}
          </span>
          {a.size && (
            <span className="shrink-0 text-[10px] text-text-tertiary">{a.size}</span>
          )}
          <button
            type="button"
            aria-label={`移除 ${a.name}`}
            onClick={() => onRemove?.(a.id)}
            className="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded text-text-tertiary hover:bg-black/10 hover:text-text-primary"
          >
            <Icon name="close-line" className="size-2.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
