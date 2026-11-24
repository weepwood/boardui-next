"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Icon } from "@/app/components/ui/Icon";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  {
    id: "s1",
    icon: "code-s-slash-line",
    title: "写一段代码",
    desc: "生成 React 组件或工具函数",
    tone: "text-accent-500 bg-badge-new-background",
  },
  {
    id: "s2",
    icon: "file-text-line",
    title: "总结文档",
    desc: "把长文提炼成要点",
    tone: "text-purple-500 bg-purple-100 dark:bg-purple-950",
  },
  {
    id: "s3",
    icon: "bar-chart-line",
    title: "分析数据",
    desc: "从表格里找出趋势",
    tone: "text-lime-600 bg-lime-100 dark:bg-lime-950",
  },
  {
    id: "s4",
    icon: "translate-2",
    title: "翻译内容",
    desc: "中英互译并保持语气",
    tone: "text-amber-600 bg-amber-100 dark:bg-amber-950",
  },
];

/** 聊天入门模板：空白状态 + 建议卡片 + 首条输入 */
export function ChatStarterTemplate() {
  const [value, setValue] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  return (
    <div className="flex min-h-[560px] w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-card">
      <div className="flex w-full max-w-lg flex-col items-center gap-6">
        {/* 品牌标记 */}
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#a855f7,#6366f1)] text-white shadow-md">
          <Icon name="sparkling-2-fill" className="size-6" />
        </span>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h3 className="text-title-2-semibold text-text-primary">我能帮忙做什么？</h3>
          <p className="text-body-regular text-text-secondary">
            提出任何问题，或从下面的建议开始。
          </p>
        </div>

        {/* 建议卡片 */}
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setPicked(s.id);
                setValue(s.title);
              }}
              className={cn(
                "flex items-start gap-2.5 rounded-2lg border p-3 text-start",
                "transition-[border-color,background-color,transform] duration-150 ease-out",
                "hover:-translate-y-px hover:shadow-sm",
                picked === s.id
                  ? "border-accent-400 bg-badge-new-background"
                  : "border-border-button-default bg-background-primary-default hover:border-border-button-hover"
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  s.tone
                )}
              >
                <Icon name={s.icon} className="size-4" />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-body-2-medium text-text-primary">{s.title}</span>
                <span className="truncate text-caption-2-regular text-text-tertiary">
                  {s.desc}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* 输入框 */}
        <div className="flex w-full flex-col gap-2 rounded-2xl border border-border-button-default bg-background-primary-default p-2 shadow-xs focus-within:ring-2 focus-within:ring-accent-500/30">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="给助手发送消息…"
            rows={2}
            className="resize-none bg-transparent px-1 text-body-medium text-text-primary outline-none placeholder:text-text-placeholder"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="附件"
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-foreground-icon-secondary hover:bg-background-secondary-hover"
              >
                <Icon name="attachment-line" className="size-4" />
              </button>
              <button
                type="button"
                aria-label="语音"
                className="flex size-7 cursor-pointer items-center justify-center rounded-lg text-foreground-icon-secondary hover:bg-background-secondary-hover"
              >
                <Icon name="mic-line" className="size-4" />
              </button>
            </div>
            <Button size="sm" isDisabled={!value.trim()} aria-label="发送" className="w-8 px-0">
              <Icon name="arrow-up-line" className="size-4" />
            </Button>
          </div>
        </div>

        <span className="text-caption-2-regular text-text-tertiary">
          BoardUI 助手可能会出错，请核实重要信息。
        </span>
      </div>
    </div>
  );
}
