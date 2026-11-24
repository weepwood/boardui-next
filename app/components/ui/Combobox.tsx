"use client";

import {
  ComboBox,
  Input,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  Label,
  type ComboBoxProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface BComboboxProps extends Omit<ComboBoxProps<object>, "className" | "children"> {
  label?: string;
  placeholder?: string;
  options: { id: string; label: string }[];
  className?: string;
}

/** 组合框：可输入过滤的下拉选择 */
export function Combobox({
  label,
  placeholder = "搜索或选择…",
  options,
  className,
  ...props
}: BComboboxProps) {
  return (
    <ComboBox {...props} className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && <Label className="text-body-2-medium text-text-primary">{label}</Label>}
      <div
        className={cn(
          "flex h-9 w-full items-center gap-1 rounded-2lg px-2",
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
          className="min-w-0 flex-1 bg-transparent text-body-medium text-text-primary outline-none placeholder:text-text-placeholder"
        />
        <Button className="flex size-5 cursor-pointer items-center justify-center rounded text-foreground-icon-secondary">
          <Icon name="arrow-down-s-line" className="size-4" />
        </Button>
      </div>
      <Popover className="min-w-[var(--trigger-width)] rounded-2lg border border-border-button-default bg-background-primary-default p-1.5 shadow-lg outline-none">
        <ListBox
          className="flex max-h-56 flex-col gap-0.5 overflow-y-auto outline-none"
          renderEmptyState={() => (
            <span className="px-2 py-1.5 text-caption-1-regular text-text-tertiary">
              无匹配项
            </span>
          )}
        >
          {options.map((o) => (
            <ListBoxItem
              key={o.id}
              id={o.id}
              textValue={o.label}
              className={cn(
                "cursor-pointer rounded-md px-2 py-1.5 text-body-2-medium text-text-primary",
                "outline-none transition-colors duration-150",
                "hovered:bg-background-secondary-hover focus:bg-background-secondary-hover",
                "selected:font-medium"
              )}
            >
              {o.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}
