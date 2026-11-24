"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * 验证码输入框：分格输入，自动跳格、退格回退、粘贴分发。
 */
export function InputOtp({
  length = 6,
  value,
  onChange,
  className,
}: {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
}) {
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length }, (_, i) => value?.[i] ?? "")
  );
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value === undefined) return;
    setDigits(Array.from({ length }, (_, i) => value[i] ?? ""));
  }, [value, length]);

  const update = (next: string[]) => {
    if (value === undefined) setDigits(next);
    onChange?.(next.join(""));
  };

  const handleChange = (i: number, raw: string) => {
    const chars = raw.replace(/\D/g, "");
    if (!chars) return;
    // 粘贴多位时依次填入
    const next = [...digits];
    for (let k = 0; k < chars.length && i + k < length; k++) {
      next[i + k] = chars[k];
    }
    update(next);
    const target = Math.min(i + chars.length, length - 1);
    refs.current[target]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = "";
        update(next);
      } else if (i > 0) {
        next[i - 1] = "";
        update(next);
        refs.current[i - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) refs.current[i + 1]?.focus();
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          aria-label={`第 ${i + 1} 位`}
          className={cn(
            "size-9 rounded-2lg border text-center text-body-medium tabular-nums",
            "border-border-button-default bg-background-primary-default",
            "text-text-primary shadow-xs outline-none",
            "transition-[border-color,box-shadow] duration-150 ease-out",
            "focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30"
          )}
        />
      ))}
    </div>
  );
}
