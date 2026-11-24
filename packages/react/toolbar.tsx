"use client";
import { Toolbar as AriaToolbar,Button as AriaButton,type ToolbarProps } from "react-aria-components";
import { cx } from "./cx";
import { SvgIcon } from "./svg-icon";
export type ToolbarAction={id:string;label:string;icon:string;disabled?:boolean;onAction?:()=>void};
export function Toolbar({actions,className,...props}:Omit<ToolbarProps,"children"|"className">&{actions:ToolbarAction[];className?:string}){
 return <AriaToolbar {...props} aria-label={props["aria-label"]??"工具栏"} className={cx("flex flex-wrap items-center gap-1 rounded-2lg border border-border-button-default bg-background-primary-default p-1",className)}>{actions.map(a=><AriaButton key={a.id} aria-label={a.label} isDisabled={a.disabled||!a.onAction} onPress={a.onAction} className="flex size-8 items-center justify-center rounded-lg text-foreground-icon-secondary outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-40"><SvgIcon name={a.icon} className="size-5"/></AriaButton>)}</AriaToolbar>;
}
