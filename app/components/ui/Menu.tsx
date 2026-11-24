"use client";

import {
  Menu as RACMenu,
  MenuItem,
  MenuTrigger,
  MenuSection,
  Separator as MenuSeparator,
  Text,
  type MenuItemProps,
  type MenuProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export { MenuTrigger, MenuItem, MenuSection, MenuSeparator };

/**
 * 下拉菜单：复刻原站
 * 菜单项：圆角 6px、高度 32px、悬停浅灰底、危险项红色
 */
export function Menu({
  className,
  children,
  ...props
}: Omit<MenuProps<object>, "className" | "children"> & {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <RACMenu
      {...props}
      className={cn("flex flex-col gap-0.5 outline-none", className)}
    >
      {children}
    </RACMenu>
  );
}

export interface BMenuItemProps extends Omit<MenuItemProps, "className" | "children"> {
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  danger?: boolean;
  className?: string;
}

/** 菜单项：图标 + 标签 + 快捷键 */
export function BMenuItem({
  label,
  description,
  icon,
  shortcut,
  danger,
  className,
  ...props
}: BMenuItemProps) {
  return (
    <MenuItem
      {...props}
      className={cn(
        "group flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5",
        "text-body-2-medium outline-none select-none",
        "transition-colors duration-150 ease-out",
        danger ? "text-red-600" : "text-text-primary",
        danger
          ? "hovered:bg-red-50 focus:bg-red-50 dark:hovered:bg-red-950/40 dark:focus:bg-red-950/40"
          : "hovered:bg-background-secondary-hover focus:bg-background-secondary-hover",
        "disabled:cursor-not-allowed disabled:text-text-tertiary",
        className
      )}
    >
      {icon && (
        <Icon
          name={icon}
          className={cn(
            "size-4 shrink-0",
            danger ? "text-red-500" : "text-foreground-icon-secondary"
          )}
        />
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">{label}</span>
        {description && (
          <Text slot="description" className="truncate text-caption-2-regular text-text-tertiary">
            {description}
          </Text>
        )}
      </span>
      {shortcut && (
        <kbd className="ms-auto shrink-0 text-[11px] text-text-tertiary">{shortcut}</kbd>
      )}
    </MenuItem>
  );
}
