"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CloseButton } from "@/packages/react/close-button";
import { fieldSurface,fieldText,fieldLabel } from "@/packages/react/field-styles";

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
  const id=useId();
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

      return;
    }
    if (tokens.includes(v)) {
      setDraft("");
      return;
    }
    setInvalid(false);
    commit([...tokens, v]);
    setDraft("");
  };

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && <label htmlFor={id} className={fieldLabel}>{label}</label>}

      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          fieldSurface,"w-full cursor-text flex-wrap gap-1",
          invalid
            ? "bg-background-tertiary-error ring-border-error-default"
            : "hover:ring-border-button-hover focus-within:ring-border-button-active"
        )}
      >
        {tokens.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-md bg-background-secondary-default px-1.5 py-0.5 text-caption-1-medium text-text-primary"
          >
            {t}
            <CloseButton size="2xs" aria-label={`移除 ${t}`} onClick={e=>{e.stopPropagation();commit(tokens.filter(x=>x!==t));inputRef.current?.focus();}}/>
          </span>
        ))}

        <input
          ref={inputRef} id={id} aria-label={label??"标签输入"} aria-invalid={invalid} aria-describedby={invalid?id+"-error":undefined}
          value={draft}
          onChange={(e) => {setDraft(e.target.value);setInvalid(false)}}
          onPaste={e=>{const raw=e.clipboardData.getData("text");if(!/[,，;\n]/.test(raw))return;e.preventDefault();const parts=raw.split(/[,，;\n]+/).map(s=>s.trim()).filter(Boolean);const accepted=parts.filter(t=>!validate||validate(t));const rejected=parts.filter(t=>validate&&!validate(t));commit([...new Set([...tokens,...accepted])]);setDraft(rejected.join(", "));setInvalid(!!rejected.length);}}
          onKeyDown={(e) => {
            if(e.nativeEvent.isComposing)return;
            if (e.key === "Enter" || e.key === "," || e.key==="，") {
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
          className={cn(fieldText,"min-w-[100px]")}
        />
      </div>
      {invalid && (
        <span id={id+"-error"} role="alert" className="text-caption-2-regular text-text-error-primary">格式不正确，请检查后重试</span>
      )}
    </div>
  );
}
