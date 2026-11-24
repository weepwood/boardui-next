"use client";

import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * 分页：页码 + 上下页。
 * 当前页蓝底白字，其余描边。
 */
export function Pagination({
  page,
  total,
  onChange,
  className,
}: {
  page: number;
  total: number;
  onChange?: (p: number) => void;
  className?: string;
}) {
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const btn = cn(
    "inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg px-2",
    "text-body-2-medium transition-[background-color,border-color,color] duration-150 ease-out",
    "outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
    "disabled:cursor-not-allowed disabled:opacity-40"
  );

  return (
    <nav aria-label="分页" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        aria-label="上一页"
        disabled={page <= 1}
        onClick={() => onChange?.(page - 1)}
        className={cn(btn, "border border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-secondary-hover")}
      >
        <Icon name="arrow-left-s-line" className="size-4" />
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="flex size-8 items-center justify-center text-text-tertiary">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-current={p === page ? "page" : undefined}
            onClick={() => onChange?.(p)}
            className={cn(
              btn,
              p === page
                ? "border border-transparent bg-accent-500 text-white"
                : "border border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-secondary-hover"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        aria-label="下一页"
        disabled={page >= total}
        onClick={() => onChange?.(page + 1)}
        className={cn(btn, "border border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-secondary-hover")}
      >
        <Icon name="arrow-right-s-line" className="size-4" />
      </button>
    </nav>
  );
}
