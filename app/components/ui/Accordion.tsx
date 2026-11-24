"use client";

import { createContext, useContext, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * 手风琴：严格复刻原站（实测参数）
 *
 * 结构：无外框、无圆角、无背景的纯列表
 *   - 每一项仅底部有 1px separator-border 分隔线
 *   - 触发按钮：高 54px、padding 16px 0、圆角 8px（悬停时露出浅灰底）
 *   - 展开区：grid-template-rows 0fr↔1fr，300ms
 */

type AccordionCtx = {
  expandedKeys: Set<string>;
  toggle: (key: string) => void;
};

const Ctx = createContext<AccordionCtx>({
  expandedKeys: new Set(),
  toggle: () => {},
});

export function Accordion({
  children,
  defaultExpandedKeys = [],
  className,
}: {
  children: React.ReactNode;
  allowsMultiple?: boolean;
  defaultExpandedKeys?: string[];
  className?: string;
}) {
  const [expandedKeys, setExpandedKeys] = useState(new Set(defaultExpandedKeys));

  const toggle = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (prev.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Ctx.Provider value={{ expandedKeys, toggle }}>
      <div className={cn("flex w-full flex-col", className)}>{children}</div>
    </Ctx.Provider>
  );
}

export function AccordionItem({
  id: idProp,
  title,
  subtitle,
  children,
  className,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const { expandedKeys, toggle } = useContext(Ctx);
  const isExpanded = expandedKeys.has(id);

  return (
    <div className={cn("flex flex-col border-b border-separator-border", className)}>
      <h3 className="flex">
        <button
          type="button"
          onClick={() => toggle(id)}
          aria-expanded={isExpanded}
          className={cn(
            "group/trigger flex w-full cursor-pointer items-center gap-3 rounded-lg py-4",
            "text-start outline-none",
            "transition-colors duration-150 ease-out",
            "hover:bg-background-secondary-hover",
            "focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          )}
        >
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-headline-regular text-text-primary">{title}</span>
            {subtitle && (
              <span className="text-caption-1-regular text-text-tertiary">{subtitle}</span>
            )}
          </span>
          <Icon
            name="arrow-down-s-line"
            className={cn(
              "size-5 shrink-0 text-foreground-icon-secondary",
              "transition-transform duration-300 ease-in-out",
              isExpanded && "rotate-180"
            )}
          />
        </button>
      </h3>

      {/* 展开区 */}
      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
        style={{
          gridTemplateRows: isExpanded ? "1fr" : "0fr",
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="pb-4 text-body-regular text-text-secondary">{children}</div>
        </div>
      </div>
    </div>
  );
}
