"use client";
import { cx } from "./cx";
import { SvgIcon } from "./svg-icon";
import { Badge } from "./badge";
export const navigationRow="flex h-9 w-full min-w-0 shrink-0 items-center gap-2 overflow-hidden rounded-2lg px-2 text-start text-body-medium outline-none transition-colors duration-150 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring";
export function NavigationItem({label,icon,active=false,collapsed=false,badge,onClick,href}:{label:string;icon:string;active?:boolean;collapsed?:boolean;badge?:string;onClick?:()=>void;href?:string}){
 const cls=cx(navigationRow,active?"bg-linear-to-b from-accent-500 to-accent-600 text-white shadow-nav-selected":"text-text-secondary hover:bg-background-secondary-hover");
 const content=<><SvgIcon name={icon} className="size-5 shrink-0"/><span aria-hidden={collapsed} className={cx("min-w-0 flex-1 overflow-hidden whitespace-nowrap text-start transition-[opacity,filter] duration-200 motion-reduce:transition-none",collapsed?"opacity-0 blur-sm":"opacity-100")}>{label}</span>{badge&&!collapsed&&<Badge color={active?"primary":"neutral"}>{badge}</Badge>}</>;
 return href?<a href={href} aria-label={label} aria-current={active?"page":undefined} title={collapsed?label:undefined} className={cls}>{content}</a>:<button type="button" aria-label={label} aria-current={active?"page":undefined} title={collapsed?label:undefined} onClick={onClick} className={cls}>{content}</button>;
}
