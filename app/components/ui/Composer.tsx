"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * 对话输入框：多行自适应 + 工具按钮 + 发送。
 * 与 composer 系列配合使用。
 */
export function Composer({
  placeholder = "输入消息…",
  value,
  onChange,
  onSend,
  tools = true,
  className,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onSend?: (v: string) => void;
  tools?: boolean;
  className?: string;
}) {
  const [inner, setInner] = useState("");
  const v = value ?? inner;

  const set = (next: string) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1.5 rounded-2xl border border-border-button-default",
        "bg-background-primary-default p-2 shadow-xs",
        "transition-[border-color,box-shadow] duration-150 ease-out",
        "focus-within:border-border-button-hover focus-within:shadow-sm",
        className
      )}
    >
      <textarea
        value={v}
        onChange={(e) => set(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend?.(v);
          }
        }}
        placeholder={placeholder}
        rows={2}
        className="max-h-40 min-h-[36px] resize-none bg-transparent px-1 text-body-medium text-text-primary outline-none placeholder:text-text-placeholder"
      />
      <div className="flex items-center justify-between gap-2">
        {tools ? (
          <div className="flex items-center gap-0.5">
            {[
              { icon: "attachment-2", label: "附件" },
              { icon: "image-line", label: "图片" },
              { icon: "mic-line", label: "语音" },
            ].map((t) => (
              <button
                key={t.icon}
                type="button"
                aria-label={t.label}
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-text-primary"
              >
                <Icon name={t.icon} className="size-4" />
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => onSend?.(v)}
          disabled={!v.trim()}
          aria-label="发送"
          className={cn(
            "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg",
            "transition-[background-color,scale] duration-150 ease-out active:scale-95",
            v.trim()
              ? "bg-accent-500 text-white hover:bg-accent-600"
              : "bg-background-tertiary-default text-text-tertiary"
          )}
        >
          <Icon name="arrow-up-line" className="size-4" />
        </button>
      </div>
    </div>
  );
}
