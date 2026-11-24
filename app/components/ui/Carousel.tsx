"use client";
import {useState,useRef,useEffect} from "react";
import {useDirection} from "@/packages/react/direction";
import {cn} from "@/lib/utils";
import {Icon} from "./Icon";
export function Carousel({items,className,onChange}:{
 items:{id:string;title:string;description?:string;hue?:number}[];className?:string;onChange?:(index:number)=>void;
}){
 const [inner,setInner]=useState(0),rtl=useDirection()==="rtl",total=items.length;
 const track=useRef<HTMLDivElement>(null);
 const index=Math.max(0,Math.min(total-1,inner));
 const go=(n:number)=>{const el=track.current;const target=el?.children[Math.max(0,Math.min(total-1,n))];if(!el||!target)return;const a=el.getBoundingClientRect(),b=target.getBoundingClientRect();el.scrollBy({left:rtl?b.right-a.right:b.left-a.left,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"})};
 const measure=()=>{const el=track.current;if(!el)return;const a=el.getBoundingClientRect();let next=0,best=Infinity;Array.from(el.children).forEach((c,i)=>{const b=c.getBoundingClientRect(),delta=Math.abs(rtl?b.right-a.right:b.left-a.left);if(delta<best){best=delta;next=i}});if(next!==inner){setInner(next);onChange?.(next)}};
 useEffect(()=>{const el=track.current;if(!el)return;const ro=new ResizeObserver(measure);ro.observe(el);return()=>ro.disconnect()},[rtl,total,inner]);
 if(!total)return <div role="status" className="p-8 text-center text-text-secondary">暂无轮播内容</div>;
 const btn="flex size-9 items-center justify-center rounded-2lg border border-border-button-default bg-background-primary-default text-text-secondary shadow-xs hover:bg-background-primary-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring disabled:opacity-50";
 return <section role="group" aria-roledescription="轮播" aria-label="内容轮播" className={cn("flex w-full min-w-0 flex-col gap-4",className)} onKeyDown={e=>{if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();go(index+((e.key==="ArrowRight")!==rtl?1:-1))}}}>
 <div className="flex items-center justify-end gap-2"><button className={btn} type="button" aria-label="上一张" disabled={index===0} onClick={()=>go(index-1)}><Icon name={rtl?"arrow-right-s-line":"arrow-left-s-line"} className="size-5"/></button><button className={btn} type="button" aria-label="下一张" disabled={index>=total-1} onClick={()=>go(index+1)}><Icon name={rtl?"arrow-left-s-line":"arrow-right-s-line"} className="size-5"/></button></div>
 <div className="overflow-hidden rounded-2xl border border-border-button-default"><div ref={track} dir={rtl?"rtl":"ltr"} onScroll={measure} tabIndex={0} aria-label="轮播内容" className="flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-border-focus-ring">{items.map((it,i)=><div key={it.id} role="group" aria-roledescription="幻灯片" aria-label={`${i+1} / ${total}`} aria-hidden={i!==index} className="flex h-40 w-full shrink-0 snap-start flex-col items-center justify-center gap-1 bg-background-secondary-default p-6 text-center"><span className="text-headline-medium text-text-primary">{it.title}</span><span className="text-body-2-regular text-text-secondary">{it.description}</span></div>)}</div></div>
 <div className="flex items-center justify-center gap-1"><span className="sr-only" aria-live="polite">{index+1} / {total}</span>{items.map((it,i)=><button key={it.id} type="button" aria-label={`第 ${i+1} 张`} aria-current={i===index?true:undefined} onClick={()=>go(i)} className="flex min-h-6 min-w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-border-focus-ring"><span className={cn("h-1.5 rounded-full transition-all duration-200 motion-reduce:transition-none",i===index?"w-4 bg-accent-500":"w-1.5 bg-background-tertiary-hover")}/></button>)}</div>
 </section>;
}
