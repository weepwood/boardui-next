"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type PanelTab = { id: string; label: string; icon?: string };

/**
 * 对话输入面板：带标签页的工具面板，可嵌入 Composer 上方。
 * 标签切换 + 内容区独立。
 */
export function ComposerPanel({
  tabs,
  defaultTab,
  children,
  className,
}: {
  tabs: PanelTab[];
  defaultTab?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-2lg border border-border-button-default",
        "bg-background-secondary-default",
        className
      )}
    >
      <div className="flex items-center gap-0.5 border-b border-border-primary p-1.5">
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={cn(
                "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-2",
                "text-body-2-medium transition-colors duration-150 ease-out",
                on
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {t.icon && <Icon name={t.icon} className="size-3.5" />}
              {t.label}
            </button>
          );
        })}
      </div>
      <div className="min-h-[80px] p-2.5" data-tab={active}>
        {children}
      </div>
    </div>
  );
}
