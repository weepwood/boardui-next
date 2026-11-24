"use client";

import {useState,useEffect} from "react";
import {cn} from "@/lib/utils";
import {Icon} from "./Icon";
import {Avatar} from "./Avatar";
import {Button} from "./Button";
import {SegmentedControl} from "./SegmentedControl";

export type NoticeItem={
 id:string;title:string;body:string;time:string;unread?:boolean;avatar?:string;icon?:string;
 category?:"mention"|"system"|"other";
};

export function NotificationCenter({items:initial,onClose,onRead,className}:{
 items:NoticeItem[];onClose?:()=>void;onRead?:(ids:string[])=>void;className?:string;
}){
 // The caller supplies current notifications; a stable ID identifies one event.
 const [readIds,setReadIds]=useState<Set<string>>(()=>new Set());
 const [filter,setFilter]=useState("all");
 useEffect(()=>{
   const ids=new Set(initial.map(i=>i.id));
   setReadIds(prev=>{const next=new Set([...prev].filter(id=>ids.has(id)));return next.size===prev.size?prev:next});
 },[initial]);
 const items=initial.map(item=>({...item,unread:!!item.unread&&!readIds.has(item.id)}));
 const unread=items.filter(i=>i.unread).length;
 const visible=items.filter(i=>filter==="all"||i.category===filter);
 const markRead=(ids:string[])=>{
   if(!ids.length)return;
   setReadIds(previous=>new Set([...previous,...ids]));
   onRead?.(ids);
 };
 return <section aria-label="通知中心" className={cn("flex w-full max-w-[430px] min-w-0 flex-col gap-3 rounded-3xl border border-border-button-default bg-background-primary-default p-4 shadow-xs",className)}>
   <header className="flex flex-wrap items-start justify-between gap-2">
    <div className="flex flex-col gap-1"><h3 className="text-headline-medium text-text-primary">通知</h3><div className="flex items-center gap-1 text-body-2-regular text-text-secondary"><span role="status" aria-label="未读通知数量">{unread}</span><span>条未读</span></div></div>
    <div className="flex items-center gap-1"><Button size="sm" variant="ghost" isDisabled={unread===0} onPress={()=>markRead(items.filter(i=>i.unread).map(i=>i.id))}>全部已读</Button>{onClose&&<Button size="sm" variant="outline" aria-label="关闭" onPress={onClose}><Icon name="close-line" className="size-4"/></Button>}</div>
   </header>
   <SegmentedControl className="w-full [&_[role=radio]]:flex-1 [&_[role=radio]]:justify-center" value={filter} onChange={setFilter} size="sm" options={[{id:"all",label:"全部 "+items.length},{id:"mention",label:"提及 "+items.filter(i=>i.category==="mention").length},{id:"system",label:"系统 "+items.filter(i=>i.category==="system").length}]}/>
   <div className="flex max-h-[460px] min-w-0 flex-col gap-2 overflow-y-auto rounded-2xl bg-background-secondary-default p-2">
    {visible.length===0?<div className="flex flex-col items-center gap-2 px-3 py-10 text-center"><Icon name="notification-3-line" className="size-6 text-foreground-icon-quaternary"/><span className="text-body-2-regular text-text-secondary">暂无通知</span></div>:visible.map(n=><button key={n.id} type="button" onClick={()=>markRead(n.unread?[n.id]:[])} aria-label={n.title+(n.unread?"，未读":"，已读")} className="flex w-full min-w-0 items-start gap-3 rounded-xl bg-background-primary-default p-3 text-start outline-none transition-colors hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring motion-reduce:transition-none">
      {n.avatar?<Avatar name={n.avatar} size="md"/>:<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary"><Icon name={n.icon??"notification-3-line"} className="size-5"/></span>}
      <span className="flex min-w-0 flex-1 flex-col gap-1"><span className="flex items-start gap-2"><span className="min-w-0 flex-1 text-body-medium text-text-primary">{n.title}</span><span className="shrink-0 text-caption-2-regular text-text-tertiary">{n.time}</span>{n.unread&&<span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-accent-500"/>}</span><span className="text-body-2-regular text-text-secondary">{n.body}</span></span>
    </button>)}
   </div>
 </section>;
}
