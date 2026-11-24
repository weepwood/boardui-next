"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type SearchSource = {
  id: string;
  title: string;
  url: string;
  snippet: string;
  favicon?: string;
};

/**
 * 网页搜索：搜索状态卡 + 引用来源列表。
 * 展示"正在检索 → 找到 N 个来源"的过程。
 */
export function WebSearch({
  query,
  sources,
  status = "done",
  className,
}: {
  query: string;
  sources: SearchSource[];
  status?: "searching" | "done";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2xl border border-border-component-detail-container",
        "bg-background-primary-default",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 text-start transition-colors hover:bg-background-secondary-hover"
      >
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-lg",
            status === "searching"
              ? "bg-badge-new-background text-accent-600"
              : "bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300"
          )}
        >
          <Icon
            name={status === "searching" ? "loader-4-line" : "global-line"}
            className={cn("size-3.5", status === "searching" && "animate-spin")}
          />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-caption-1-medium text-text-primary">
            {status === "searching" ? "正在检索网页…" : `检索到 ${sources.length} 个来源`}
          </span>
          <span className="truncate text-caption-2-regular text-text-secondary">{query}</span>
        </div>
        <Icon
          name="arrow-down-s-line"
          className={cn(
            "size-4 shrink-0 text-text-tertiary transition-transform duration-200 ease-bui",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1.5 border-t border-separator-border p-2.5">
            {sources.map((s, i) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-0.5 rounded-lg p-1.5 transition-colors hover:bg-background-secondary-hover"
              >
                <span className="flex items-center gap-1.5">
                  <span className="flex size-4 shrink-0 items-center justify-center rounded bg-background-tertiary-default text-[8px] font-bold text-text-secondary">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary group-hover:text-accent-600">
                    {s.title}
                  </span>
                  <Icon
                    name="external-link-line"
                    className="size-3 shrink-0 text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </span>
                <span className="line-clamp-2 ps-5 text-[10px] leading-snug text-text-tertiary">
                  {s.snippet}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
