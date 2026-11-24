"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

const PRESETS = [
  "#3080ff", "#155dfc", "#9810fa", "#fb2c36",
  "#fe6e00", "#f99c00", "#00bb7f", "#00b7d7",
  "#737373", "#0a0a0a", "#ffffff", "#f7f7f7",
];

/**
 * 颜色选择器：预设色板 + HEX 输入。
 */
export function ColorPicker({
  label,
  value,
  defaultValue = "#3080ff",
  onChange,
  className,
}: {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultValue);
  const color = value ?? inner;

  const commit = (hex: string) => {
    if (value === undefined) setInner(hex);
    onChange?.(hex);
  };

  return (
    <div className={cn("flex w-full max-w-[220px] flex-col gap-2", className)}>
      {label && <span className="text-body-2-medium text-text-primary">{label}</span>}

      <div className="flex items-center gap-2">
        <span
          className="size-8 shrink-0 rounded-2lg border border-border-button-default shadow-xs"
          style={{ backgroundColor: color }}
        />
        <div
          className={cn(
            "flex h-9 flex-1 items-center gap-1 rounded-2lg px-2.5",
            "border border-border-button-default bg-background-primary-default shadow-xs",
            "focus-within:ring-2 focus-within:ring-accent-500/30"
          )}
        >
          <span className="text-caption-1-medium text-text-tertiary">#</span>
          <input
            value={color.replace("#", "").toUpperCase()}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
              commit("#" + v.toLowerCase());
            }}
            aria-label="颜色十六进制值"
            className="min-w-0 flex-1 bg-transparent font-mono text-caption-1-medium uppercase text-text-primary outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1">
        {PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            onClick={() => commit(c)}
            className={cn(
              "size-6 cursor-pointer rounded-md border transition-[scale,box-shadow] duration-150 ease-out",
              "hover:scale-110",
              color.toLowerCase() === c
                ? "border-accent-500 ring-2 ring-accent-500/30"
                : "border-border-primary"
            )}
            style={{ backgroundColor: c }}
          >
            {color.toLowerCase() === c && (
              <Icon
                name="check-line"
                className={cn(
                  "mx-auto size-3",
                  ["#ffffff", "#f7f7f7"].includes(c) ? "text-black" : "text-white"
                )}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
