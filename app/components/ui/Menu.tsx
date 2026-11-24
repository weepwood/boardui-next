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
import { MENU_ITEM, MENU_ITEMS_CONTAINER } from "@/packages/react/menu-styles";
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
      className={cn(MENU_ITEMS_CONTAINER, className)}
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
        "group", MENU_ITEM,
        "text-body-medium outline-none select-none",
        "transition-colors duration-150 ease-out",
        danger ? "text-text-error-primary" : "text-text-primary",
        danger
          ? "hovered:bg-red-50 focus:bg-red-50 dark:hovered:bg-red-950/40 dark:focus:bg-red-950/40"
          : "hovered:bg-dropdown-item-hover-background focus:bg-dropdown-item-hover-background",
        "disabled:cursor-not-allowed disabled:text-text-tertiary",
        className
      )}
    >
      {icon && (
        <Icon
          name={icon}
          className={cn(
            "size-5 shrink-0",
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
