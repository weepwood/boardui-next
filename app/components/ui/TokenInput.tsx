"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * Token 输入框：多值标签输入。
 * Enter / 逗号 添加，Backspace 空输入时删除末项，支持邮箱格式校验。
 */
export function TokenInput({
  label,
  value,
  defaultValue = [],
  onChange,
  placeholder = "输入后按 Enter 添加",
  validate,
  className,
}: {
  label?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (tokens: string[]) => void;
  placeholder?: string;
  validate?: (v: string) => boolean;
  className?: string;
}) {
  const [inner, setInner] = useState<string[]>(defaultValue);
  const tokens = value ?? inner;
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (list: string[]) => {
    if (value === undefined) setInner(list);
    onChange?.(list);
  };

  const add = () => {
    const v = draft.trim().replace(/,$/, "");
    if (!v) return;
    if (validate && !validate(v)) {
      setInvalid(true);
      setTimeout(() => setInvalid(false), 1200);
      return;
    }
    if (tokens.includes(v)) {
      setDraft("");
      return;
    }
    commit([...tokens, v]);
    setDraft("");
  };

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && <span className="text-body-2-medium text-text-primary">{label}</span>}

      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex min-h-9 w-full cursor-text flex-wrap items-center gap-1 rounded-2lg px-2 py-1",
          "border bg-background-primary-default shadow-xs",
          "transition-[border-color,box-shadow] duration-150 ease-out",
          invalid
            ? "border-red-500 ring-2 ring-red-500/25"
            : "border-border-button-default focus-within:ring-2 focus-within:ring-accent-500/30"
        )}
      >
        {tokens.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md bg-background-secondary-default px-1.5 py-0.5 text-caption-1-medium text-text-primary"
          >
            {t}
            <button
              type="button"
              aria-label={`移除 ${t}`}
              onClick={(e) => {
                e.stopPropagation();
                commit(tokens.filter((x) => x !== t));
              }}
              className="flex size-3.5 cursor-pointer items-center justify-center rounded-full text-text-tertiary hover:bg-black/10 hover:text-text-primary"
            >
              <Icon name="close-line" className="size-2.5" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
            if (e.key === "Backspace" && !draft && tokens.length) {
              e.preventDefault();
              commit(tokens.slice(0, -1));
            }
          }}
          onBlur={add}
          placeholder={tokens.length ? "" : placeholder}
          className="min-w-[100px] flex-1 bg-transparent px-1 text-body-medium text-text-primary outline-none placeholder:text-text-placeholder"
        />
      </div>
      {invalid && (
        <span className="text-caption-2-regular text-red-500">格式不正确，请检查后重试</span>
      )}
    </div>
  );
}
