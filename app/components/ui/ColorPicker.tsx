"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { fieldLabel,fieldSurface,fieldText } from "@/packages/react/field-styles";

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
  const id=useId();
  const [draft,setDraft]=useState(color.replace(/^#/,"").toUpperCase());
  useEffect(()=>setDraft(color.replace(/^#/,"").toUpperCase()),[color]);
  const valid=/^[0-9a-f]{6}$/i.test(draft);

  const commit = (hex: string) => {
    if(!/^#[0-9a-f]{6}$/i.test(hex))return;
    setDraft(hex.slice(1).toUpperCase());
    if (value === undefined) setInner(hex);
    onChange?.(hex);
  };

  return (
    <div className={cn("flex w-full max-w-[220px] flex-col gap-2", className)}>
      {label && <label htmlFor={id} className={fieldLabel}>{label}</label>}

      <div className="flex items-center gap-2">
        <span
          className="size-8 shrink-0 rounded-2lg border border-border-button-default shadow-xs"
          style={{ backgroundColor: color }}
        />
        <div
          className={cn(
            fieldSurface,"flex-1 focus-within:ring-border-button-active",!valid&&"bg-background-tertiary-error"
          )}
        >
          <span className="text-caption-1-medium text-text-tertiary">#</span>
          <input
            id={id} value={draft} aria-invalid={!valid}
            onChange={(e) => {
              const v = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
              setDraft(v.toUpperCase());
              if(v.length===6)commit("#"+v.toLowerCase());
            }}
            aria-label={label??"颜色十六进制值"}
            onBlur={()=>{if(!valid)setDraft(color.slice(1).toUpperCase())}}
            onKeyDown={e=>{if(e.key==="Escape")setDraft(color.slice(1).toUpperCase())}}
            className={cn(fieldText,"font-mono uppercase")}
          />
        </div>
      </div>

      <div className="grid grid-cols-6 gap-1">
        {PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c} aria-pressed={color.toLowerCase()===c}
            onClick={() => commit(c)}
            className={cn(
              "size-6 cursor-pointer rounded-md border transition-[scale,box-shadow] duration-150 ease-out",
              "hover:scale-105 motion-reduce:transition-none outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
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
