"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "../ui/Icon";

type Entry = { label: string; href: string; group: string };

/** 搜索面板：⌘K 唤起，实时过滤全部导航项 */
export function CommandSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const all = useMemo<Entry[]>(
    () =>
      navigation.flatMap((g) =>
        g.items.map((i) => ({ label: i.label, href: i.href, group: g.title }))
      ),
    []
  );

  const results = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return all.slice(0, 10);
    return all
      .filter(
        (e) =>
          e.label.toLowerCase().includes(key) ||
          e.href.toLowerCase().includes(key) ||
          e.group.includes(key)
      )
      .slice(0, 12);
  }, [q, all]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && results[active]) {
        const target = results[active].href;
        onClose();
        if (target.startsWith("https")) {
          window.open(target, "_blank");
        } else {
          router.push(target);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh]">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-[fade-in_150ms_ease-out]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="搜索文档"
        className={cn(
          "relative z-10 w-[min(560px,calc(100vw-2rem))] overflow-hidden rounded-2xl",
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
            placeholder="搜索组件、文档…"
            className="min-w-0 flex-1 bg-transparent text-body-medium text-text-primary outline-none placeholder:text-text-placeholder"
          />
          <kbd className="rounded border border-border-primary px-1.5 py-0.5 text-[10px] text-text-tertiary">
            ESC
          </kbd>
        </div>

        <div className="max-h-[340px] overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-center text-body-2-regular text-text-tertiary">
              没有找到匹配项
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={r.href}
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  onClose();
                  router.push(r.href);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start",
                  "transition-colors duration-100",
                  i === active ? "bg-background-secondary-hover" : ""
                )}
              >
                <Icon
                  name="file-text-line"
                  className="size-3.5 shrink-0 text-foreground-icon-secondary"
                />
                <span className="flex-1 truncate text-body-2-medium text-text-primary">
                  {r.label}
                </span>
                <span className="shrink-0 text-caption-2-regular text-text-tertiary">
                  {r.group}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-border-primary px-3 py-1.5 text-[11px] text-text-tertiary">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border-primary px-1">↑</kbd>
            <kbd className="rounded border border-border-primary px-1">↓</kbd>
            选择
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border-primary px-1">↵</kbd>
            打开
          </span>
        </div>
      </div>
    </div>
  );
}
