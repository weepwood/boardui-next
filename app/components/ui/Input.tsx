"use client";

import {
  Input as RACInput,
  TextField as RACTextField,
  Label,
  Text,
  FieldError,
  type TextFieldProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<TextFieldProps, "className" | "children"> {
  label?: string;
  placeholder?: string;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 右侧附加内容 */
  suffix?: React.ReactNode;
  description?: string;
  className?: string;
  invalidMessage?: string;
}

/**
 * 输入框：复刻原站
 * - 浅灰底（background-secondary-default）无边框
 * - 圆角 rounded-2lg
 * - focus 时白底 + 描边 + 焦点环
 */
export function Input({
  label,
  placeholder,
  icon,
  suffix,
  description,
  className,
  invalidMessage,
  ...props
}: InputProps) {
  return (
    <RACTextField {...props} className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label className="text-body-2-medium text-text-primary">{label}</Label>
      )}
      {/* 实测规格：250×36，10px 圆角，灰底 235,235,235，无描边，聚焦用 inset ring */}
      <div
        className={cn(
          "group flex h-9 w-full items-center gap-2 rounded-2lg px-2.5",
          "bg-background-tertiary-default",
          "ring-2 ring-inset ring-transparent",
          "transition-[background-color,box-shadow,color] duration-150 ease-out",
          "hover:bg-background-tertiary-hover",
          // 聚焦：inset 焦点环，底色不变
          "focus-within:ring-border-focus-ring",
          // 无效态
          "group-data-[invalid]:ring-red-500"
        )}
      >
        {icon && (
          <span className="shrink-0 text-foreground-icon-secondary">{icon}</span>
        )}
        <RACInput
          placeholder={placeholder}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-body-medium text-text-primary",
            "placeholder:text-text-placeholder",
            "outline-none"
          )}
        />
        {suffix}
      </div>
      {description && (
        <Text slot="description" className="text-caption-1-regular text-text-tertiary">
          {description}
        </Text>
      )}
      <FieldError className="text-caption-1-regular text-red-500">
        {invalidMessage}
      </FieldError>
    </RACTextField>
  );
}
