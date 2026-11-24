"use client";
import {useCallback,useEffect,useLayoutEffect,useMemo,useRef,type ReactNode} from "react";
import {usePathname,useRouter} from "next/navigation";
import {Sidebar} from "./Sidebar";
import {NavContext,normalize,type Intent} from "./navigation-context";

export function DocsShell({children}:{children:ReactNode}){
 const pathname=normalize(usePathname()??"/"),router=useRouter();
 const pathRef=useRef(pathname);pathRef.current=pathname;
 const shell=useRef<HTMLDivElement>(null);
 const content=useRef<HTMLDivElement>(null);
 const feedback=useRef<HTMLDivElement>(null);
 const targetLabel=useRef<HTMLHeadingElement>(null);
 const targetCrumb=useRef<HTMLParagraphElement>(null);
 const intent=useRef<Intent|null>(null);
 const timeout=useRef<ReturnType<typeof setTimeout>|null>(null);
 const delay=useRef<ReturnType<typeof setTimeout>|null>(null);
 const warmed=useRef(new Map<string,number>());
 const clear=useCallback(()=>{
   if(timeout.current)clearTimeout(timeout.current);
   if(delay.current)clearTimeout(delay.current);
   timeout.current=null;delay.current=null;intent.current=null;
   shell.current?.querySelectorAll("[data-nav-pending]").forEach(el=>el.removeAttribute("data-nav-pending"));
   content.current?.removeAttribute("data-route-pending");
   content.current?.removeAttribute("aria-busy");
   if(feedback.current)feedback.current.hidden=true;
 },[]);
 // A narrow imperative feedback surface avoids an urgent React render of the
 // old route before the Next.js navigation transition can commit. The router
 // remains the sole authority for the URL and aria-current.
 const begin=useCallback((href:string,label:string)=>{
   clear();href=normalize(href);
   if(href===pathRef.current)return;
   const next={href,label,from:pathRef.current};intent.current=next;
   shell.current?.querySelectorAll<HTMLAnchorElement>("nav a[data-doc-path]").forEach(el=>{
     if(el.dataset.docPath===href)el.setAttribute("data-nav-pending","true");
   });
   content.current?.setAttribute("aria-busy","true");
   // Avoid flashing a skeleton for a navigation that commits within a frame
   // or two. The sidebar marker is immediate.
   delay.current=setTimeout(()=>{
     if(intent.current!==next)return;
     if(targetLabel.current)targetLabel.current.textContent=label;
     if(targetCrumb.current)targetCrumb.current.textContent="BoardUI / "+label;
     content.current?.setAttribute("data-route-pending","true");
     if(feedback.current)feedback.current.hidden=false;
   },100);
   timeout.current=setTimeout(clear,12000);
 },[clear]);
 useLayoutEffect(()=>{if(intent.current&&intent.current.from!==pathname)clear()},[pathname,clear]);
 useEffect(()=>clear,[clear]);
 const warm=useCallback((href:string)=>{
   href=normalize(href);
   if(href===pathRef.current)return;
   const connection=(navigator as Navigator&{connection?:{saveData?:boolean;effectiveType?:string}}).connection;
   if(connection?.saveData||/^(slow-)?2g$/.test(connection?.effectiveType??""))return;
   const now=Date.now(),last=warmed.current.get(href);
   if(last&&now-last<60_000)return;
   for(const [key,time] of warmed.current)if(now-time>=60_000)warmed.current.delete(key);
   if(warmed.current.size>=8)return;
   warmed.current.set(href,now);
   router.prefetch(href);
 },[router]);
 const value=useMemo(()=>({begin,warm}),[begin,warm]);
 return <NavContext.Provider value={value}><div ref={shell} className="flex min-h-screen w-full bg-background-full"><Sidebar/><div ref={content} data-doc-content className="relative min-w-0 flex-1">
  <div data-doc-route>{children}</div>
  <div ref={feedback} hidden data-navigation-pending className="absolute inset-0 bg-background-full" role="status" aria-live="polite"><div className="sticky top-0 mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-6 pt-10 sm:px-10"><p ref={targetCrumb} className="text-body-2-regular text-text-secondary"/><h2 ref={targetLabel} className="text-title-1-medium text-text-primary"/><div className="flex max-w-[900px] flex-col gap-4"><div className="h-4 w-3/5 rounded-md bg-background-tertiary-default"/><div className="h-[327px] rounded-3xl border border-border-component-detail-container"/><span className="sr-only">正在加载页面</span></div></div></div>
 </div></div></NavContext.Provider>
}
