"use client";
import { useId,useState } from "react";
import { ChevronDownSmall } from "@/packages/react/chevrons";
import { cx } from "@/packages/react/cx";
export function Collapsible({title,children,open,defaultOpen=false,onOpenChange,className,isDisabled=false}:{title:React.ReactNode;children:React.ReactNode;open?:boolean;defaultOpen?:boolean;onOpenChange?:(open:boolean)=>void;className?:string;isDisabled?:boolean}){
 const id=useId(),[inner,setInner]=useState(defaultOpen);const expanded=open??inner;
 return <section className={cx("w-full",className)}>
 <button type="button" disabled={isDisabled} aria-expanded={expanded} aria-controls={id} onClick={()=>{if(open===undefined)setInner(!expanded);onOpenChange?.(!expanded)}} className="flex w-full items-center justify-between gap-2 rounded-2lg px-3 py-2 text-start text-body-medium text-text-primary hover:bg-background-primary-hover outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:opacity-50">{title}<ChevronDownSmall className={cx("size-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none",expanded&&"rotate-180")}/></button>
 <div id={id} inert={!expanded} aria-hidden={!expanded} className="grid transition-[grid-template-rows,opacity] duration-300 ease motion-reduce:transition-none" style={{gridTemplateRows:expanded?"1fr":"0fr",opacity:expanded?1:0}}><div className="min-h-0 overflow-hidden"><div className="px-3 py-2 text-body-regular text-text-secondary">{children}</div></div></div></section>;
}
