"use client";
import {useEffect,useState,type RefObject} from "react";

const listeners=new Map<Element,(visible:boolean)=>void>();
let observer:IntersectionObserver|undefined;
const pageSubscribers=new Set<()=>void>();
const syncPage=()=>{for(const sync of pageSubscribers)sync()};
function subscribePage(sync:()=>void){
 if(!pageSubscribers.size)document.addEventListener("visibilitychange",syncPage);
 pageSubscribers.add(sync);
 return ()=>{pageSubscribers.delete(sync);if(!pageSubscribers.size)document.removeEventListener("visibilitychange",syncPage)};
}

function observe(element:Element,update:(visible:boolean)=>void){
 if(typeof IntersectionObserver==="undefined"){update(true);return ()=>{};}
 if(!observer)observer=new IntersectionObserver(entries=>{
   for(const entry of entries)listeners.get(entry.target)?.(entry.isIntersecting);
 });
 listeners.set(element,update);observer.observe(element);
 return ()=>{
   listeners.delete(element);observer?.unobserve(element);
   if(!listeners.size){observer?.disconnect();observer=undefined;}
 };
}

// SSR starts at a stable resting frame. Never suspend the component itself:
// only periodic animation work is gated by viewport and page visibility.
export function useVisibleActivity(ref:RefObject<Element|null>){
 const [active,setActive]=useState(false);
 useEffect(()=>{
   const element=ref.current;if(!element)return;
   let inView=false;
   const sync=()=>setActive(inView&&!document.hidden);
   const stop=observe(element,visible=>{inView=visible;sync()});
   const unsubscribe=subscribePage(sync);
   return ()=>{stop();unsubscribe()};
 },[ref]);
 return active;
}
