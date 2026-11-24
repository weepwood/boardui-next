"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type ContextMenuItem = {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  danger?: boolean;
  dividerBefore?: boolean;
  onSelect?: () => void;
};

/**
 * 右键菜单：在指定区域内右键唤出，点击外部/按 Esc 关闭。
 * 位置自动避让视口边界。
 */
export function ContextMenu({
  items,
  children,
  className,
}: {
  items: ContextMenuItem[];
  children: React.ReactNode;
  className?: string;
}) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pos) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPos(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPos(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [pos]);

  return (
    <div
      className={cn("relative", className)}
      onContextMenu={(e) => {
        e.preventDefault();
        const w = 200;
        const h = items.length * 32 + 16;
        const x = Math.min(e.clientX, window.innerWidth - w - 8);
        const y = Math.min(e.clientY, window.innerHeight - h - 8);
        setPos({ x, y });
      }}
    >
      {children}

      {pos && (
        <div
          ref={ref}
          role="menu"
          style={{ left: pos.x, top: pos.y }}
          className={cn(
            "fixed z-[70] w-[200px] rounded-2lg border border-border-button-default",
            "bg-background-primary-default p-1.5 shadow-lg",
            "animate-[popover-in_160ms_cubic-bezier(0.22,1,0.36,1)]"
          )}
        >
          {items.map((it) => (
            <div key={it.id}>
              {it.dividerBefore && <div className="my-1 h-px bg-border-primary" />}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  it.onSelect?.();
                  setPos(null);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-start",
                  "text-body-2-medium transition-colors duration-100 ease-out",
                  it.danger
                    ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    : "text-text-primary hover:bg-background-secondary-hover"
                )}
              >
                {it.icon && (
                  <Icon
                    name={it.icon}
                    className={cn(
                      "size-3.5 shrink-0",
                      it.danger ? "text-red-500" : "text-foreground-icon-secondary"
                    )}
                  />
                )}
                <span className="flex-1">{it.label}</span>
                {it.shortcut && (
                  <kbd className="text-[10px] text-text-tertiary">{it.shortcut}</kbd>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
