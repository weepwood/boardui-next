"use client";
const callbacks=new Map<Element,(entry?:ResizeObserverEntry)=>void>();
let observer:ResizeObserver|undefined;
export function observeSize(element:Element,callback:(entry?:ResizeObserverEntry)=>void){
 if(typeof ResizeObserver==="undefined"){
  const resize=()=>callback();
  window.addEventListener("resize",resize);callback();
  return ()=>window.removeEventListener("resize",resize);
 }
 if(!observer)observer=new ResizeObserver(entries=>{
  for(const entry of entries)callbacks.get(entry.target)?.(entry);
 });
 callbacks.set(element,callback);observer.observe(element);
 return ()=>{
  callbacks.delete(element);observer?.unobserve(element);
  if(!callbacks.size){observer?.disconnect();observer=undefined;}
 };
}
