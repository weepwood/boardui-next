"use client";

import {
  TagGroup as RACTagGroup,
  TagList as RACTagList,
  Tag as RACTag,
  type TagGroupProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export function TagGroup({
  className,
  children,
  label,
  ...props
}: Omit<TagGroupProps, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
  label?: string;
}) {
  return (
    <RACTagGroup
      {...props}
      className={cn("flex flex-col gap-2", className)}
    >
      {label && <span className="text-body-2-medium text-text-primary">{label}</span>}
      <RACTagList className="flex flex-wrap gap-1.5 outline-none">{children}</RACTagList>
    </RACTagGroup>
  );
}

/** 标签：小胶囊，可关闭 */
export function Tag({
  children,
  className,
  ...props
}: Omit<React.ComponentProps<typeof RACTag>, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACTag
      {...props}
      className={cn(
        "group inline-flex cursor-default items-center gap-1 rounded-md px-2 py-0.5",
        "border border-border-button-default bg-background-primary-default",
        "text-caption-1-medium text-text-secondary",
        "transition-[background-color,border-color] duration-150 ease-out",
        "selected:border-accent-300 selected:bg-badge-new-background selected:text-accent-700",
        "hovered:bg-background-secondary-hover outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent-500",
        className
      )}
    >
      {children}
      {(
        <button
          type="button"
          slot="remove"
          className={cn(
            "flex size-3.5 cursor-pointer items-center justify-center rounded-full",
            "text-text-tertiary transition-colors duration-150 hover:bg-black/10 hover:text-text-primary"
          )}
          aria-label="移除"
        >
          <Icon name="close-line" className="size-3" />
        </button>
      )}
    </RACTag>
  );
}
