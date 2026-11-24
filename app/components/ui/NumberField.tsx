"use client";

import {
  NumberField as RACNumberField,
  Group,
  Input,
  Button,
  Label,
  type NumberFieldProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface BNumberFieldProps extends Omit<NumberFieldProps, "className" | "children"> {
  label?: string;
  className?: string;
}

/** 数字输入：带上下步进按钮 */
export function NumberField({ label, className, ...props }: BNumberFieldProps) {
  return (
    <RACNumberField {...props} className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && <Label className="text-body-2-medium text-text-primary">{label}</Label>}
      <Group
        className={cn(
          "flex h-9 w-full items-center gap-1 rounded-2lg px-2",
          "bg-background-tertiary-default",
          "ring-2 ring-inset ring-transparent",
          "transition-[background-color,box-shadow] duration-150 ease-out",
          "hover:bg-background-tertiary-hover",
          "focus-within:ring-border-focus-ring"
        )}
      >
        <Input
          className={cn(
            "min-w-0 flex-1 bg-transparent text-body-medium text-text-primary tabular-nums outline-none",
            "placeholder:text-text-placeholder"
          )}
        />
        <div className="flex flex-col">
          <Button
            slot="increment"
            className="flex h-3.5 w-5 cursor-pointer items-center justify-center rounded text-foreground-icon-secondary hover:bg-background-secondary-hover"
          >
            <Icon name="arrow-up-s-line" className="size-3" />
          </Button>
          <Button
            slot="decrement"
            className="flex h-3.5 w-5 cursor-pointer items-center justify-center rounded text-foreground-icon-secondary hover:bg-background-secondary-hover"
          >
            <Icon name="arrow-down-s-line" className="size-3" />
          </Button>
        </div>
      </Group>
    </RACNumberField>
  );
}
