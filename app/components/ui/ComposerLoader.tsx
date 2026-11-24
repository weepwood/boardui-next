"use client";

import { cn } from "@/lib/utils";

/**
 * 输入框加载状态：三点跳动 + 状态文字。
 * 用于 AI 正在生成回复时占位。
 */
export function ComposerLoader({
  text = "正在思考",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 rounded-2xl border border-border-button-default",
        "bg-background-primary-default px-3 shadow-xs",
        className
      )}
    >
      <span className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 rounded-full bg-accent-500"
            style={{
              animation: "bui-dot-bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </span>
      <span className="text-caption-1-regular text-text-tertiary">{text}</span>
    </div>
  );
}
