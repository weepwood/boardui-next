"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * 轮播：横向滑动 + 指示点 + 左右箭头。
 * 使用 transform 过渡，缓动对齐原站。
 */
export function Carousel({
  items,
  className,
}: {
  items: { id: string; title: string; description?: string; hue?: number }[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const total = items.length;
  const go = (i: number) => setIndex((i + total) % total);

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div className="relative overflow-hidden rounded-2lg border border-border-button-default">
        <div
          className="flex transition-transform duration-400 ease-bui"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              className="flex h-40 w-full shrink-0 flex-col items-center justify-center gap-1 p-6"
              style={{
                background: `linear-gradient(135deg, hsl(${it.hue ?? 215} 90% 96%), hsl(${it.hue ?? 215} 80% 90%))`,
              }}
            >
              <span className="text-title-3-semibold text-text-primary">{it.title}</span>
              {it.description && (
                <span className="text-caption-1-regular text-text-secondary">{it.description}</span>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="上一张"
          onClick={() => go(index - 1)}
          className={cn(
            "absolute start-2 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center",
            "rounded-full border border-border-button-default bg-background-primary-default/90 shadow-sm",
            "text-text-secondary transition-[background-color,scale] duration-150 hover:scale-105 hover:text-text-primary"
          )}
        >
          <Icon name="arrow-left-s-line" className="size-4" />
        </button>
        <button
          type="button"
          aria-label="下一张"
          onClick={() => go(index + 1)}
          className={cn(
            "absolute end-2 top-1/2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center",
            "rounded-full border border-border-button-default bg-background-primary-default/90 shadow-sm",
            "text-text-secondary transition-[background-color,scale] duration-150 hover:scale-105 hover:text-text-primary"
          )}
        >
          <Icon name="arrow-right-s-line" className="size-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            aria-label={`第 ${i + 1} 张`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 cursor-pointer rounded-full transition-[width,background-color] duration-200 ease-bui",
              i === index ? "w-4 bg-accent-500" : "w-1.5 bg-border-primary hover:bg-text-tertiary"
            )}
          />
        ))}
      </div>
    </div>
  );
}
