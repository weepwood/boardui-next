"use client";
import {useState,type ReactNode} from "react";
import {Tabs,TabList,Tab,TabPanel} from "react-aria-components";
import {cn} from "@/lib/utils";
import {Icon} from "./Icon";

export type PanelTab={id:string;label:string;icon?:string};
export function ComposerPanel({tabs,defaultTab,activeTab,onTabChange,children,className}:{
 tabs:PanelTab[];defaultTab?:string;activeTab?:string;onTabChange?:(id:string)=>void;
 children:ReactNode|((id:string)=>ReactNode);className?:string;
}){
 const [inner,setInner]=useState(defaultTab??tabs[0]?.id??"");
 const requested=activeTab??inner;
 const active=tabs.some(t=>t.id===requested)?requested:tabs[0]?.id;
 if(!active)return null;
 return <Tabs selectedKey={active} onSelectionChange={key=>{const id=String(key);if(activeTab===undefined)setInner(id);onTabChange?.(id)}} className={cn("flex w-full flex-col overflow-hidden rounded-2xl border border-border-component-detail-container bg-background-secondary-default",className)}>
 <TabList aria-label="输入面板" className="flex items-center gap-0.5 overflow-x-auto border-b border-separator-border p-1.5">
 {tabs.map(t=><Tab key={t.id} id={t.id} className={({isSelected,isFocusVisible})=>cn("inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-body-2-medium outline-none transition-colors duration-150 motion-reduce:transition-none",isSelected?"bg-background-primary-default text-text-primary shadow-xs":"text-text-secondary hover:text-text-primary",isFocusVisible&&"ring-2 ring-inset ring-border-focus-ring")}>{t.icon&&<Icon name={t.icon} className="size-3.5"/>}{t.label}</Tab>)}
 </TabList>
 {tabs.map(t=><TabPanel key={t.id} id={t.id} className="min-h-[80px] p-2.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring" data-tab={t.id}>{typeof children==="function"?children(t.id):children}</TabPanel>)}
 </Tabs>;
}
