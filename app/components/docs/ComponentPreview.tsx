"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../ui/Icon";

/**
 * 组件预览容器：复刻原站 preview 区。
 * - 顶部工具条：预览 / 代码 分段切换 + 右侧操作
 * - 预览画布：大圆角卡片，居中展示
 * - 代码视图：展示源码
 */
export function ComponentPreview({
  children,
  code,
  minHeight = 260,
}: {
  children: React.ReactNode;
  code?: string;
  minHeight?: number;
}) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 工具条 */}
      <div className="flex items-center justify-between gap-2">
        {/* 分段控件 */}
        <div
          role="tablist"
          aria-label="视图切换"
          className={cn(
            "relative inline-flex items-center rounded-2lg p-1",
            "bg-segmented-control-background"
          )}
        >
          {(
            [
              { key: "preview", label: "预览", icon: "eye-line" },
              { key: "code", label: "代码", icon: "code-s-slash-line" },
            ] as const
          ).map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-[10px] py-1",
                  "text-body-medium transition-colors duration-150 ease-out",
                  active
                    ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                <Icon name={t.icon} className="size-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* 右侧操作 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={copy}
            disabled={!code}
            className={cn(
              "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-2",
              "text-caption-1-medium text-text-secondary",
              "transition-colors duration-150 ease-out hover:bg-background-secondary-hover",
              "disabled:cursor-default disabled:opacity-50"
            )}
          >
            <Icon name={copied ? "check-line" : "file-copy-line"} className="size-3.5" />
            {copied ? "已复制" : "复制代码"}
          </button>
        </div>
      </div>

      {/* 画布 */}
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden",
          "rounded-3xl border border-border-component-detail-container",
          "p-8"
        )}
        style={{ minHeight }}
      >
        {tab === "preview" ? (
          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        ) : (
          <pre
            className={cn(
              "w-full overflow-x-auto rounded-xl p-4 text-left",
              "bg-docs-code-background font-mono text-body-2-regular"
            )}
          >
            <code className="text-text-primary">{code ?? "// 暂无代码示例"}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
