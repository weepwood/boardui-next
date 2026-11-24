// BoardUI MIT source, pinned upstream; see LICENSE.
"use client";



import { useEffect, useRef, useState } from "react";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import { Button } from "./button";
import { cx } from "./cx";

/**
 * Pagination — designed to match the Board UI dashboard style (no dedicated
 * Figma frame yet, so it reuses shipped tokens/components):
 *   - Previous / Next use the secondary small `Button` (same as the Recent
 *     hires card pager) with arrow icons.
 *   - Page numbers are 32×32 (radius/lg) cells. Active cell borrows the
 *     secondary-button surface (white + border/button/default + shadow/xs);
 *     inactive cells are ghost with a secondary-hover background on hover.
 *   - Overflow collapses to leading/trailing dots around a sibling window.
 *
 * Below `COMPACT_WIDTH`, a `ResizeObserver` on the nav switches to a compact
 * layout — icon-only Previous/Next and `siblingCount` clamped to 0 — so the
 * row never overflows a narrow container instead of clipping mid-label.
 *
 * Controlled: pass `page`, `totalPages`, and `onChange`.
 */

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Page numbers shown on each side of the current page. Default 1. */
  siblingCount?: number;
  className?: string;
  /** Visible and accessible navigation labels for the application's locale. */
  previousLabel?: string;
  nextLabel?: string;
  "aria-label"?: string;
}

const DOTS = "dots";

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function paginationRange(
  current: number,
  total: number,
  sibling: number,
): (number | typeof DOTS)[] {
  // first + last + current + 2*sibling + 2 dots
  const totalPageNumbers = sibling * 2 + 5;
  if (totalPageNumbers >= total) return range(1, total);

  const leftSibling = Math.max(current - sibling, 1);
  const rightSibling = Math.min(current + sibling, total);
  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < total - 2;

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + 2 * sibling), DOTS, total];
  }
  if (showLeftDots && !showRightDots) {
    return [1, DOTS, ...range(total - (2 + 2 * sibling), total)];
  }
  return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, total];
}

// No transition on the cells: animating background/shadow/color makes the
// previously-active number visibly fade out ("flicker") on every page change.
const cell = "flex size-8 shrink-0 items-center justify-center rounded-lg text-body-medium";

/** Below this nav width, Previous/Next drop their labels and siblingCount
 *  clamps to 0 — the full-label, full-sibling layout starts clipping
 *  somewhere around 380–420px depending on totalPages' digit count. */
const COMPACT_WIDTH = 420;

function useIsCompact(visible:boolean) {
  const ref = useRef<HTMLElement>(null);
  const [width, setWidth] = useState<number|null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!visible || !el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return [ref, width!==null && width<COMPACT_WIDTH, width!==null && width<260] as const;
}

export function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  className,
  previousLabel = "上一页",
  nextLabel = "下一页",
  "aria-label": ariaLabel = "分页",
}: PaginationProps) {

  const [navRef, isCompact, isTiny] = useIsCompact(totalPages > 1);
  if (totalPages <= 1) return null;
  const current=Math.max(1,Math.min(totalPages,Math.trunc(page)||1));
  const pages = isTiny?[current]:paginationRange(current, totalPages, isCompact ? 0 : Math.max(0,Math.min(5,Math.trunc(siblingCount))));

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className={cx("flex w-full items-center justify-between gap-2", className)}
    >
      <Button
        variant="secondary"
        size="small"
        iconOnly={isCompact}
        leadingIcon={RiArrowLeftLine}
        aria-label={isCompact ? previousLabel : undefined}
        disabled={current <= 1}
        onClick={() => onChange(current - 1)}
      >
        {isCompact ? undefined : previousLabel}
      </Button>

      <ul className="flex min-w-0 items-center gap-0.5">
        {isTiny&&<li className="text-caption-1-regular text-text-secondary tabular-nums" aria-current="page">{current} / {totalPages}</li>}
        {!isTiny&&pages.map((item, i) =>
          item === DOTS ? (
            <li
              key={`dots-${i}`}
              aria-hidden
              className={cx(cell, "text-text-tertiary")}
            >
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-label={`前往第 ${item} 页`}
                aria-current={item === current ? "page" : undefined}
                onClick={() => onChange(item)}
                className={cx(
                  cell,
                  "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background-full focus-visible:ring-border-focus-ring",
                  item === current
                    ? "border border-border-button-default bg-background-primary-default text-text-primary shadow-xs"
                    : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary",
                )}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <Button
        variant="secondary"
        size="small"
        iconOnly={isCompact}
        leadingIcon={isCompact ? RiArrowRightLine : undefined}
        trailingIcon={isCompact ? undefined : RiArrowRightLine}
        aria-label={isCompact ? nextLabel : undefined}
        disabled={current >= totalPages}
        onClick={() => onChange(current + 1)}
      >
        {isCompact ? undefined : nextLabel}
      </Button>
    </nav>
  );
}
