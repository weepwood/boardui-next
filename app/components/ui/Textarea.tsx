"use client";

import {
  TextField as RACTextField,
  TextArea as RACTextArea,
  Label,
  Text,
  type TextFieldProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

export interface TextareaProps extends Omit<TextFieldProps, "className" | "children"> {
  label?: string;
  placeholder?: string;
  description?: string;
  rows?: number;
  className?: string;
}

/** 多行文本框：与 Input 同视觉语言 */
export function Textarea({
  label,
  placeholder,
  description,
  rows = 4,
  className,
  ...props
}: TextareaProps) {
  return (
    <RACTextField {...props} className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && <Label className="text-body-2-medium text-text-primary">{label}</Label>}
      {/* 实测规格：10px 圆角，灰底，inset 焦点环，与 Input 同一视觉语言 */}
      <div
        className={cn(
          "relative flex w-full flex-col rounded-2lg",
          "bg-background-tertiary-default",
          "ring-2 ring-inset ring-transparent",
          "transition-[background-color,box-shadow] duration-150 ease-out",
          "hover:bg-background-tertiary-hover",
          "focus-within:ring-border-focus-ring"
        )}
      >
        <RACTextArea
          rows={rows}
          placeholder={placeholder}
          className={cn(
            "w-full resize-y bg-transparent px-3 py-2",
            "text-body-regular text-text-primary",
            "border-0 outline-none",
            "placeholder:text-text-tertiary",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>
      {description && (
        <Text slot="description" className="text-caption-1-regular text-text-tertiary">
          {description}
        </Text>
      )}
    </RACTextField>
  );
}
