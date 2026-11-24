"use client";
import { memo,useCallback,useEffect,useId,useMemo,useRef,useState } from "react";
import { ModalOverlay,Modal,Dialog } from "react-aria-components";
import { MODAL_BACKDROP,MODAL_MOTION } from "@/packages/react/overlay-styles";
import { MENU_ITEM,MENU_ITEM_ACTIVE } from "@/packages/react/menu-styles";
import { cx } from "@/packages/react/cx";
import { Icon } from "./Icon";
export type CommandItem={id:string;label:string;group:string;icon?:string;shortcut?:string;keywords?:string[];onSelect?:()=>void;disabled?:boolean};
type ResultRowProps={item:CommandItem;id:string;selected:boolean;index:number;activate:(index:number)=>void;choose:(item:CommandItem)=>void};
const ResultRow=memo(function ResultRow({item,id,selected,index,activate,choose}:ResultRowProps){
 return <div id={id} role="option" aria-selected={selected} aria-disabled={!!item.disabled} onMouseDown={e=>e.preventDefault()} onMouseEnter={()=>{if(!item.disabled)activate(index)}} onClick={()=>choose(item)} className={cx(MENU_ITEM,"min-h-9 rounded-lg text-body-medium",selected&&MENU_ITEM_ACTIVE,item.disabled&&"opacity-40 cursor-not-allowed")}>{item.icon&&<Icon name={item.icon} className="size-5"/>}<span className="flex-1 truncate">{item.label}</span>{item.shortcut&&<kbd className="text-caption-1-regular text-text-tertiary">{item.shortcut}</kbd>}</div>;
});
export function CommandPalette({open,onClose,items,placeholder="输入命令或搜索…",dialogLabel="命令面板",inputLabel="搜索命令"}:{open:boolean;onClose:()=>void;items:CommandItem[];placeholder?:string;dialogLabel?:string;inputLabel?:string}){
 const id=useId(),[q,setQ]=useState(""),[active,setActive]=useState(0),input=useRef<HTMLInputElement>(null);
 const indexed=useMemo(()=>items.map(item=>({item,text:[item.label,item.group,...(item.keywords??[])].join(" ").toLocaleLowerCase()})),[items]);
 const {groups,flat,positions}=useMemo(()=>{
   const map=new Map<string,CommandItem[]>(),key=q.trim().toLocaleLowerCase();
   for(const {item,text} of indexed){if(!text.includes(key))continue;let group=map.get(item.group);if(!group){group=[];map.set(item.group,group)}group.push(item);}
   const groups=[...map],flat=groups.flatMap(([,list])=>list).filter(i=>!i.disabled);
   return {groups,flat,positions:new Map(flat.map((item,index)=>[item,index]))};
 },[indexed,q]);
 const current=flat[Math.min(active,Math.max(0,flat.length-1))];const optionId=(i:CommandItem)=>id+"-"+i.id;
 useEffect(()=>{if(open){setQ("");setActive(0)}},[open]);
 useEffect(()=>{if(open&&current)document.getElementById(optionId(current))?.scrollIntoView({block:"nearest"})},[open,current?.id]);
 const choose=useCallback((item?:CommandItem)=>{if(!item||item.disabled)return;item.onSelect?.();onClose()},[onClose]);
 return <ModalOverlay isOpen={open} onOpenChange={v=>{if(!v)onClose()}} isDismissable className={cx(MODAL_BACKDROP,"flex items-start justify-center pt-[12vh] px-3 backdrop-blur-[2px]")}><Modal className={cx("w-full max-w-[560px] outline-none",MODAL_MOTION)}><Dialog aria-label={dialogLabel} className="flex max-h-[78dvh] flex-col overflow-hidden rounded-3xl border border-border-component-detail-container bg-background-primary-default shadow-dropdown outline-none">
 <div className="flex h-14 shrink-0 items-center gap-3 border-b border-separator-border px-4"><Icon name="search-line" className="size-5 text-foreground-icon-tertiary"/><input ref={input} autoFocus role="combobox" aria-label={inputLabel} aria-expanded="true" aria-controls={id} aria-activedescendant={current?optionId(current):undefined} aria-autocomplete="list" value={q} onChange={e=>{setQ(e.target.value);setActive(0)}} placeholder={placeholder} onKeyDown={e=>{if(e.nativeEvent.isComposing)return;if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(flat.length)setActive(i=>(i+(e.key==="ArrowDown"?1:-1)+flat.length)%flat.length)}else if(e.key==="Enter"){e.preventDefault();choose(current)}}} className="min-w-0 flex-1 bg-transparent text-headline-regular text-text-primary outline-none focus-visible:outline-none placeholder:text-text-tertiary"/><kbd className="rounded-md bg-background-tertiary-default px-1.5 py-0.5 text-caption-1-medium text-text-tertiary">ESC</kbd></div>
 <div id={id} role="listbox" aria-label="命令" className="min-h-0 max-h-[min(420px,60dvh)] overflow-y-auto p-2">{groups.length===0?<div role="presentation" className="p-8 text-center text-body-regular text-text-tertiary">没有匹配的命令</div>:groups.map(([group,list])=><div role="group" aria-label={group} key={group} className="mb-1.5"><div aria-hidden className="px-2 py-1.5 text-caption-1-medium text-text-secondary">{group}</div>{list.map(item=><ResultRow key={item.id} item={item} id={optionId(item)} selected={current?.id===item.id} index={positions.get(item)??-1} activate={setActive} choose={choose}/> )}</div>)}</div>
 <div className="flex shrink-0 items-center gap-3 border-t border-separator-border bg-background-secondary-default px-4 py-2.5 text-caption-1-regular text-text-secondary"><span>↑ ↓ 导航</span><span>↵ 执行</span><span className="ms-auto" aria-live="polite">{flat.length} 条命令</span></div></Dialog></Modal></ModalOverlay>;
}
