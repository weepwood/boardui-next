"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type SegmentOption = { id: string; label: string; icon?: string };

/**
 * 分段控件：灰底容器 + 白底选中项 + 滑动指示器。
 * 与原站 segmented-control 一致。
 */
export function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  size = "md",
  className,
}: {
  options: SegmentOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.id ?? "");
  const current = value ?? inner;
  const index = Math.max(0, options.findIndex((o) => o.id === current));

  const h = size === "sm" ? "h-6" : "h-7";
  const tx = size === "sm" ? "text-caption-1-medium" : "text-body-2-medium";

  return (
    <div
      role="group"
      className={cn(
        "relative inline-flex w-fit items-center rounded-2lg p-1",
        "bg-segmented-control-background",
        className
      )}
    >
      {/* 滑动指示器 */}
      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 rounded-md bg-segmented-control-selected-background shadow-xs transition-[left,width] duration-300 ease-bui"
        style={{
          width: `calc((100% - 8px) / ${options.length})`,
          left: `calc(${index} * ((100% - 8px) / ${options.length}) + 4px)`,
        }}
      />
      {options.map((o) => {
        const active = o.id === current;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              if (value === undefined) setInner(o.id);
              onChange?.(o.id);
            }}
            aria-pressed={active}
            className={cn(
              "relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-1.5",
              "rounded-md px-[10px] py-1 transition-colors duration-150 ease-out",
              h,
              tx,
              active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
            )}
          >
            {o.icon && <Icon name={o.icon} className="size-3.5" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
