"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type BarListTab = {
  id: string;
  label: string;
  rows: { name: string; value: number; icon?: string }[];
};

/**
 * 条形列表卡片（严格复刻原站 bar-list-card）
 *
 * 结构：
 *   - 顶部：标签栏（选中项蓝色文字 + 底部蓝线）+ 右侧表头文字
 *   - 每行：左侧浅蓝胶囊条（宽度按占比），条内图标 + 名称；右侧百分比
 *   - 行高 40px，行间距 4px，无分隔线
 *   - 胶囊圆角 10px，浅蓝底 accent-100 色调
 */
export function BarListCard({
  tabs,
  unit = "%",
}: {
  tabs: BarListTab[];
  unit?: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];
  const total = current?.rows.reduce((s, r) => s + r.value, 0) || 1;

  return (
    <div className="flex w-full flex-col gap-2">
      {/* 标签栏 */}
      <div className="flex items-end gap-4 border-b border-separator-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={cn(
              "relative -mb-px cursor-pointer pb-1.5 text-body-2-medium outline-none",
              "transition-colors duration-150 ease-out",
              t.id === active
                ? "text-accent-600 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent-500 dark:text-accent-400"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {t.label}
          </button>
        ))}
        <span className="ms-auto pb-1.5 text-caption-2-regular text-text-tertiary">
          访客
        </span>
      </div>

      {/* 行 */}
      <div className="flex flex-col gap-1">
        {current?.rows.map((r) => {
          const ratio = r.value / total;
          const pct = Math.round(ratio * 100);
          return (
            <div key={r.name} className="flex h-10 items-center gap-3">
              <div
                className="flex h-9 min-w-0 items-center gap-1.5 rounded-2lg bg-[var(--color-accent-100)] px-2.5 dark:bg-accent-950"
                style={{ width: `${Math.max(ratio * 100, 26)}%` }}
                title={`${r.name} ${pct}${unit}`}
              >
                {r.icon && (
                  <Icon
                    name={r.icon}
                    className="size-3.5 shrink-0 text-accent-700 dark:text-accent-300"
                  />
                )}
                <span className="truncate text-caption-1-medium text-accent-900 dark:text-accent-200">
                  {r.name}
                </span>
              </div>
              <span className="ms-auto shrink-0 text-caption-1-medium tabular-nums text-text-primary">
                {pct}
                {unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
