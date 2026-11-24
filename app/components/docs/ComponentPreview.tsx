"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const id = useId();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copyStatus, setCopyStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRequest = useRef(0);
  const copyPending = useRef(false);
  useEffect(() => {
    setCopyStatus("idle");
    return () => {
      copyRequest.current++;
      copyPending.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [code]);

  const copy = async () => {
    if (!code || copyPending.current) return;
    const request = ++copyRequest.current;
    copyPending.current = true;
    if (timer.current) clearTimeout(timer.current);
    setCopyStatus("pending");
    try {
      await navigator.clipboard.writeText(code);
      if (request !== copyRequest.current) return;
      setCopyStatus("success");
    } catch {
      if (request !== copyRequest.current) return;
      setCopyStatus("error");
    } finally {
      if (request === copyRequest.current) {
        copyPending.current = false;
        timer.current = setTimeout(() => setCopyStatus("idle"), 2200);
      }
    }
  };

  const copyLabel = { idle: "复制代码", pending: "复制中…", success: "已复制", error: "复制失败" }[copyStatus];

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-[22px]">
      {/* 工具条 */}
      <div className="flex min-h-[38px] flex-wrap items-center justify-between gap-2">
        {/* 分段控件 */}
        <div
          role="tablist"
          aria-label="视图切换"
          className={cn(
            "docs-preview-switch relative isolate inline-grid grid-cols-2 items-center gap-0.5 rounded-2lg p-1",
            "bg-segmented-control-background"
          )}
        >
          <span aria-hidden="true" data-preview-indicator className="docs-preview-indicator" data-view={tab}/>
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
                id={`${id}-${t.key}`}
                aria-controls={`${id}-panel`}
                tabIndex={active ? 0 : -1}
                onKeyDown={(e) => {
                  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
                  e.preventDefault();
                  const next = e.key === "Home" ? "preview" : e.key === "End" ? "code" : t.key === "preview" ? "code" : "preview";
                  setTab(next);
                  document.getElementById(`${id}-${next}`)?.focus();
                }}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "relative z-10 inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md px-[10px] py-1 outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  "text-body-medium transition-colors duration-150 ease-out",
                  active
                    ? "text-text-primary"
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
            aria-disabled={copyStatus === "pending" || !code}
            title={code ? "复制当前代码示例" : "暂无可复制的代码示例"}
            className={cn(
              "inline-flex h-[38px] cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-2lg border border-border-button-default bg-background-primary-default px-3 shadow-xs",
              "text-body-medium text-text-primary",
              "transition-colors duration-150 ease-out hover:bg-background-primary-hover hover:border-border-button-hover",
              "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-full",
              "active:shadow-none disabled:cursor-default disabled:opacity-50"
            )}
          >
            <Icon name={copyStatus === "success" ? "check-line" : "file-copy-line"} className="size-3.5 shrink-0" />
            <span className="min-w-[4em] text-center">{copyLabel}</span>
          </button>
        </div>
      </div>

      <span aria-live="polite" aria-atomic="true" className="sr-only">{copyStatus === "success" ? "代码已复制" : copyStatus === "error" ? "复制失败，请打开代码视图手动复制" : ""}</span>
      {/* 画布 */}
      <div
        className={cn(
          "docs-preview-canvas relative flex min-w-0 items-center justify-center overflow-hidden",
          "rounded-3xl border border-border-component-detail-container",
          tab === "preview" ? "p-4 sm:p-8" : "items-start p-3 sm:p-5"
        )}
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${tab}`}
        style={{ minHeight }}
      >
        {/* Keep demo state while reading the code; hidden content must not receive focus. */}
        <div hidden={tab !== "preview"} inert={tab !== "preview"} data-preview-content
          className={cn("w-full min-w-0 flex-wrap items-center justify-center gap-3", tab === "preview" ? "flex" : "hidden")}>
          {children}
        </div>
        {tab === "code" && (
          <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border-component-detail-container bg-docs-code-background">
            <div className="flex items-center justify-between gap-2 border-b border-separator-border px-3 py-2">
              <span className="text-caption-1-medium text-text-secondary">代码示例</span>
              {code && <span className="text-caption-1-regular tabular-nums text-text-secondary">{code.split("\n").length} 行</span>}
            </div>
            <pre aria-label="示例代码" tabIndex={0}
              className="max-h-[480px] w-full min-w-0 overflow-auto p-3 text-start font-mono text-body-2-regular outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring sm:p-4">
              <code className="text-text-primary">{code ?? "// 暂无代码示例"}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
