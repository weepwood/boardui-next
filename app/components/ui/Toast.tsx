"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

type ToastKind = "info" | "success" | "error";
type ToastItem = { id: number; title: string; kind: ToastKind };

const ToastCtx = createContext<(title: string, kind?: ToastKind) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

const kindIcon: Record<ToastKind, { name: string; color: string }> = {
  info: { name: "information-line", color: "text-blue-500" },
  success: { name: "checkbox-circle-line", color: "text-lime-600" },
  error: { name: "error-warning-line", color: "text-red-500" },
};

/**
 * 轻提示：底部居中浮出，2.6s 自动消失。
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((title: string, kind: ToastKind = "info") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, title, kind }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-2lg px-3 py-2",
              "border border-border-button-default bg-background-primary-default shadow-lg",
              "animate-[popover-in_200ms_cubic-bezier(0.22,1,0.36,1)]"
            )}
          >
            <Icon name={kindIcon[t.kind].name} className={cn("size-4", kindIcon[t.kind].color)} />
            <span className="text-body-2-medium text-text-primary">{t.title}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
