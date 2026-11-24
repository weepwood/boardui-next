"use client";

import { Breadcrumbs as RACBreadcrumbs, Link } from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type CrumbItem = { id: string; label: string; href?: string };

/**
 * 面包屑导航：层级路径指示。
 * 末项为当前页，不可点击。
 */
export function Breadcrumb({
  items,
  className,
}: {
  items: CrumbItem[];
  className?: string;
}) {
  return (
    <RACBreadcrumbs
      className={cn("flex items-center overflow-x-auto", className)}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={item.id} className="flex items-center gap-1.5">
            {last || !item.href ? (
              <span className="text-caption-1-medium whitespace-nowrap text-text-secondary">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "-mx-1 flex items-center gap-1.5 rounded-md px-1 py-0.5",
                  "text-caption-1-medium whitespace-nowrap text-text-tertiary",
                  "transition-colors duration-150 ease-out hover:text-text-primary",
                  "outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                )}
              >
                {item.label}
              </Link>
            )}
            {!last && (
              <Icon
                name="arrow-right-s-line"
                className="size-3.5 shrink-0 text-text-tertiary"
              />
            )}
          </span>
        );
      })}
    </RACBreadcrumbs>
  );
}
