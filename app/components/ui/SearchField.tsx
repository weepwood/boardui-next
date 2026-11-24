"use client";

import {
  SearchField as RACSearchField,
  Input,
  Button,
  type SearchFieldProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface BSearchFieldProps extends Omit<SearchFieldProps, "className" | "children"> {
  placeholder?: string;
  className?: string;
}

/**
 * 搜索框：复刻原站
 * - 浅灰底胶囊，左侧放大镜，右侧清除按钮（有内容时淡入）
 */
export function SearchField({
  placeholder = "搜索…",
  className,
  ...props
}: BSearchFieldProps) {
  return (
    <RACSearchField
      {...props}
      aria-label={props["aria-label"] ?? placeholder}
      className={cn("group flex w-full flex-col gap-1", className)}
    >
      <div
        className={cn(
          "flex h-9 items-center gap-2 rounded-full ps-1 pe-2",
          "bg-background-tertiary-default",
          "ring-2 ring-inset ring-transparent",
          "transition-[background-color,box-shadow] duration-150 ease-out",
          "hover:bg-background-tertiary-hover",
          "focus-within:ring-border-focus-ring"
        )}
      >
        <Icon name="search-line" className="size-4 shrink-0 text-foreground-icon-secondary" />
        <Input
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-body-2-medium text-text-primary",
            "placeholder:text-text-placeholder outline-none"
          )}
        />
        <Button
          className={cn(
            "flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full",
            "text-text-tertiary opacity-0 transition-opacity duration-150",
            "group-data-[empty]:hidden",
            "hover:bg-black/10 hover:text-text-primary"
          )}
        >
          <Icon name="close-line" className="size-3.5" />
        </Button>
      </div>
    </RACSearchField>
  );
}
