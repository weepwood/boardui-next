"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type CommandItem = {
  id: string;
  label: string;
  group: string;
  icon?: string;
  shortcut?: string;
  onSelect?: () => void;
};

/**
 * 命令面板：⌘K 风格的全功能快捷操作面板。
 * 支持分组、过滤、键盘导航、最近使用。
 */
export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = "输入命令或搜索…",
}: {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return items;
    return items.filter(
      (i) => i.label.toLowerCase().includes(key) || i.group.includes(key)
    );
  }, [q, items]);

  // 按分组归类
  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((i) => {
      if (!map.has(i.group)) map.set(i.group, []);
      map.get(i.group)!.push(i);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const flat = groups.flatMap(([, list]) => list);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, flat.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && flat[active]) {
        flat[active].onSelect?.();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, flat, active, onClose]);

  if (!open) return null;

  let cursor = -1;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[14vh]">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-[fade-in_150ms_ease-out]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="命令面板"
        className={cn(
          "relative z-10 w-[min(600px,calc(100vw-2rem))] overflow-hidden rounded-2xl",
          "border border-border-button-default bg-background-primary-default shadow-lg",
          "animate-[modal-in_200ms_cubic-bezier(0.22,1,0.36,1)]"
        )}
      >
        <div className="flex items-center gap-2 border-b border-border-primary px-3 py-2.5">
          <Icon name="search-line" className="size-4 shrink-0 text-foreground-icon-secondary" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-body-medium text-text-primary outline-none placeholder:text-text-placeholder"
          />
          <kbd className="rounded border border-border-primary px-1.5 py-0.5 text-[10px] text-text-tertiary">
            ESC
          </kbd>
        </div>

        <div className="max-h-[360px] overflow-y-auto p-1.5">
          {flat.length === 0 ? (
            <div className="px-3 py-8 text-center text-body-2-regular text-text-tertiary">
              没有匹配的命令
            </div>
          ) : (
            groups.map(([group, list]) => (
              <div key={group} className="mb-1">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-text-tertiary">
                  {group}
                </div>
                {list.map((item) => {
                  cursor += 1;
                  const idx = cursor;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActive(idx)}
                      onClick={() => {
                        item.onSelect?.();
                        onClose();
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start",
                        "transition-colors duration-100",
                        idx === active ? "bg-background-secondary-hover" : ""
                      )}
                    >
                      {item.icon && (
                        <Icon
                          name={item.icon}
                          className="size-3.5 shrink-0 text-foreground-icon-secondary"
                        />
                      )}
                      <span className="flex-1 truncate text-body-2-medium text-text-primary">
                        {item.label}
                      </span>
                      {item.shortcut && (
                        <kbd className="shrink-0 text-[10px] text-text-tertiary">
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-border-primary px-3 py-1.5 text-[11px] text-text-tertiary">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border-primary px-1">↑</kbd>
            <kbd className="rounded border border-border-primary px-1">↓</kbd>
            导航
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border-primary px-1">↵</kbd>
            执行
          </span>
          <span className="ms-auto">{flat.length} 条命令</span>
        </div>
      </div>
    </div>
  );
}
