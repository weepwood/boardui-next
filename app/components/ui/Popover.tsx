"use client";
import { Popover as RACPopover, type PopoverProps } from "react-aria-components";
import { cx } from "@/packages/react/cx";
import { MENU_POPOVER_SURFACE } from "@/packages/react/menu-styles";
export function Popover({className,children,offset=4,containerPadding=16,...props}:Omit<PopoverProps,"className"|"children">&{className?:string;children?:React.ReactNode}){
 return <RACPopover {...props} offset={offset} containerPadding={containerPadding} className={cx("z-50 min-w-[min(var(--trigger-width,0px),calc(100vw-32px))]",MENU_POPOVER_SURFACE,"motion-reduce:transition-none",className)}>{children}</RACPopover>;
}
