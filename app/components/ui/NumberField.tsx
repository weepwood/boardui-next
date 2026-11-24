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
import { fieldLabel,fieldState,fieldText } from "@/packages/react/field-styles";

export interface BNumberFieldProps extends Omit<NumberFieldProps, "className" | "children"> {
  label?: string;
  className?: string;
}

/** 数字输入：带上下步进按钮 */
export function NumberField({ label, className, ...props }: BNumberFieldProps) {
  return (
    <RACNumberField {...props} aria-label={props["aria-label"]??(!label?"数值":undefined)} className={cn("flex w-full flex-col gap-1", className)}>
      {label && <Label className={fieldLabel}>{label}</Label>}
      <Group
        className={fieldState}
      >
        <Input
          className={cn(fieldText,"tabular-nums")}
        />
        <div className="flex flex-col">
          <Button
            slot="increment" aria-label="增加"
            className="flex h-3.5 w-5 cursor-pointer items-center justify-center rounded text-foreground-icon-secondary hover:bg-background-secondary-hover outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="arrow-up-s-line" className="size-3" />
          </Button>
          <Button
            slot="decrement" aria-label="减少"
            className="flex h-3.5 w-5 cursor-pointer items-center justify-center rounded text-foreground-icon-secondary hover:bg-background-secondary-hover outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Icon name="arrow-down-s-line" className="size-3" />
          </Button>
        </div>
      </Group>
    </RACNumberField>
  );
}
