"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * 智能体思考状态：闪烁星形 + 逐字显示的状态文字。
 * 用于 AI 正在推理时的占位指示。
 */
export function AgentThinking({
  text = "正在分析你的请求",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-background-secondary-default px-2.5 py-1",
        className
      )}
    >
      <Icon name="sparkling-fill" className="size-3.5 animate-pulse text-accent-500" />
      <span className="ai-thinking-text bg-[linear-gradient(90deg,var(--color-text-tertiary)_0%,var(--color-text-primary)_50%,var(--color-text-tertiary)_100%)] bg-[length:200%_100%] bg-clip-text text-caption-1-regular text-transparent">
        {text}
      </span>
    </div>
  );
}
