"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { Avatar } from "./Avatar";

export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  children?: { id: string; label: string }[];
};

/**
 * 应用侧边栏：图标 + 文字 + 二级展开 + 收起模式。
 * 收起时只显示图标（带 tooltip 效果）。
 */
export function AppSidebar({
  items,
  defaultActive,
  collapsed: initialCollapsed,
  className,
}: {
  items: SidebarItem[];
  defaultActive?: string;
  collapsed?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(defaultActive ?? items[0]?.id ?? "");
  const [collapsed, setCollapsed] = useState(initialCollapsed ?? false);
  const [expanded, setExpanded] = useState<string[]>([items[0]?.id ?? ""]);

  const toggle = (id: string) =>
    setExpanded((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <aside
      className={cn(
        "flex h-full flex-col gap-2 rounded-2lg border border-border-button-default",
        "bg-background-secondary-default p-2 transition-[width] duration-300 ease-bui",
        collapsed ? "w-[52px]" : "w-[200px]",
        className
      )}
    >
      {/* 品牌 */}
      <div className="flex items-center gap-2 px-1 py-1">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-text-primary text-[12px] font-bold text-background-full">
          B
        </span>
        {!collapsed && (
          <span className="truncate text-body-2-semibold text-text-primary">BoardUI</span>
        )}
      </div>

      {/* 导航 */}
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
        {items.map((it) => {
          const on = active === it.id;
          const open = expanded.includes(it.id);
          return (
            <div key={it.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => {
                  setActive(it.id);
                  if (it.children?.length) toggle(it.id);
                }}
                title={collapsed ? it.label : undefined}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-2 py-1.5",
                  "text-body-2-medium transition-colors duration-150 ease-out",
                  on
                    ? "bg-background-primary-default text-text-primary shadow-xs"
                    : "text-text-secondary hover:bg-background-tertiary-hover hover:text-text-primary"
                )}
              >
                <Icon name={it.icon} className="size-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate text-start">{it.label}</span>
                    {it.badge && (
                      <span className="rounded-full bg-accent-500 px-1.5 text-[10px] font-medium text-white">
                        {it.badge}
                      </span>
                    )}
                    {it.children?.length ? (
                      <Icon
                        name="arrow-down-s-line"
                        className={cn(
                          "size-3.5 shrink-0 transition-transform duration-200 ease-bui",
                          !open && "-rotate-90"
                        )}
                      />
                    ) : null}
                  </>
                )}
              </button>

              {!collapsed && it.children?.length ? (
                <div
                  className="grid transition-[grid-template-rows,opacity] duration-250 ease-in-out"
                  style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-0.5 py-0.5 ps-6">
                      {it.children.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="truncate rounded px-2 py-1 text-start text-caption-1-regular text-text-tertiary hover:bg-background-tertiary-hover hover:text-text-primary"
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>

      {/* 底部 */}
      <div className="flex items-center gap-2 border-t border-border-primary pt-2">
        <Avatar name="张三" size="sm" />
        {!collapsed && (
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-caption-1-medium text-text-primary">张三</span>
            <span className="truncate text-[10px] text-text-tertiary">个人版</span>
          </div>
        )}
        <button
          type="button"
          aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
          onClick={() => setCollapsed((v) => !v)}
          className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-text-tertiary hover:bg-background-tertiary-hover hover:text-text-primary"
        >
          <Icon
            name={collapsed ? "arrow-right-s-line" : "arrow-left-s-line"}
            className="size-3.5"
          />
        </button>
      </div>
    </aside>
  );
}
