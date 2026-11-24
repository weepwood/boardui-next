"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "../ui/Icon";

export type TocItem = { id: string; label: string };

/**
 * 右侧目录：220px，左侧竖线，选中项 border-s-2 高亮。
 * 使用 IntersectionObserver 跟踪滚动位置。
 */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!items.length) return;

    const headings = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);

    if (!headings.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 取可见的第一个标题
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((h) => observerRef.current?.observe(h));
    return () => observerRef.current?.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <aside className="hidden w-[220px] shrink-0 xl:block">
      <div className="sticky top-10 translate-y-0.5">
        <nav aria-label="在此页面上" className="flex flex-col gap-3">
          <p className="flex items-center gap-2 text-body-medium text-text-primary">
            <Icon name="list-check" className="size-4 text-text-secondary" />
            在此页面上
          </p>
          <ul className="flex flex-col border-s border-border-button-default">
            {items.map((item) => {
              const active = item.id === activeId;
              return (
                <li key={item.id} className="flex">
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "-ms-px w-full border-s-2 py-1.5 ps-3 text-body-2-regular",
                      "transition-colors duration-150 ease-out",
                      active
                        ? "border-accent-500 text-text-primary"
                        : "border-transparent text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
