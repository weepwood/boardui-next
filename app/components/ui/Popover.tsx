"use client";
import { Popover as RACPopover, type PopoverProps } from "react-aria-components";
import { cx } from "@/packages/react/cx";
import { MENU_POPOVER_SURFACE } from "@/packages/react/menu-styles";
export function Popover({className,children,offset=4,...props}:Omit<PopoverProps,"className"|"children">&{className?:string;children?:React.ReactNode}){
 return <RACPopover {...props} offset={offset} className={cx("z-50 min-w-[var(--trigger-width)]",MENU_POPOVER_SURFACE,"motion-reduce:transition-none",className)}>{children}</RACPopover>;
}
