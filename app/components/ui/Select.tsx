"use client";

import {
  Select as RACSelect,
  SelectValue,
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Label,
  type SelectProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type SelectOption = { id: string; label: string; icon?: string };

export interface BSelectProps extends Omit<SelectProps<object>, "className" | "children"> {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
}

/**
 * 下拉选择：复刻原站
 * - 触发按钮：白底 + 描边 + shadow-xs，高度 36px，圆角 10px
 * - 面板：圆角 10px，选中项浅灰底 + 对勾
 */
export function Select({
  label,
  placeholder = "请选择…",
  options,
  className,
  ...props
}: BSelectProps) {
  return (
    <RACSelect {...props} className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label className="text-body-2-medium text-text-primary">{label}</Label>}

      <Button
        className={cn(
          "flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-2lg px-3",
          "border border-border-button-default bg-background-primary-default shadow-xs",
          "text-body-medium text-text-primary",
          "transition-[background-color,border-color,box-shadow] duration-150 ease-out",
          "hover:bg-background-primary-hover hover:border-border-button-hover",
          "outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
          "disabled:cursor-not-allowed disabled:bg-background-primary-disabled disabled:text-text-tertiary"
        )}
      >
        <SelectValue className="truncate placeholder:text-text-placeholder" />
        <Icon
          name="arrow-down-s-line"
          className="size-4 shrink-0 text-foreground-icon-secondary"
        />
      </Button>

      <Popover
        className={cn(
          "min-w-[var(--trigger-width)] rounded-2lg border border-border-button-default",
          "bg-background-primary-default p-1.5 shadow-lg outline-none",
          "data-[entering]:animate-[popover-in_200ms_cubic-bezier(0.22,1,0.36,1)]"
        )}
      >
        <ListBox className="flex max-h-64 flex-col gap-0.5 overflow-y-auto outline-none">
          {options.map((opt) => (
            <ListBoxItem
              key={opt.id}
              id={opt.id}
              textValue={opt.label}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5",
                "text-body-2-medium text-text-primary outline-none",
                "transition-colors duration-150 ease-out",
                "hovered:bg-background-secondary-hover focus:bg-background-secondary-hover",
                "selected:font-medium"
              )}
            >
              {({ isSelected }) => (
                <>
                  {opt.icon && (
                    <Icon
                      name={opt.icon}
                      className="size-4 shrink-0 text-foreground-icon-secondary"
                    />
                  )}
                  <span className="flex-1 truncate">{opt.label}</span>
                  {isSelected && (
                    <Icon name="check-line" className="size-4 shrink-0 text-accent-500" />
                  )}
                </>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </RACSelect>
  );
}
