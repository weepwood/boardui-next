"use client";
import Link from "next/link";
import { memo,useEffect,useLayoutEffect,useRef,useState } from "react";
import { docs } from "@/lib/docs/registry";
import { observeCatalogCard,observePreviewSize } from "./catalog-observers";
import { useDocsNavigation } from "./navigation-context";

export type CatalogStatus="ported"|"independent"|"existing"|"missing";
const statusLabels={ported:"原版公开源码",independent:"独立实现",existing:"本地实现",missing:"待实现"};
const compactPreviews=new Set(["color","typography","agent-creator","agent-progress","agent-limits-card","composer-panel","notification-center","settings-modal","sidebar","calendar","data-grid","data-table","table","questionnaire","task-list","auth-card","stat-cards","web-search","date-calendar"]);
function PreviewFit({children,wide}:{children:React.ReactNode;wide:boolean}){
  const outer=useRef<HTMLDivElement>(null),inner=useRef<HTMLDivElement>(null);
  const [scale,setScale]=useState(1);
  useLayoutEffect(()=>{
    const viewport=outer.current,node=inner.current;if(!viewport||!node)return;
    const fit=()=>{const w=node.scrollWidth,h=node.scrollHeight;setScale(Math.min(1,(viewport.clientWidth-24)/Math.max(w,1),(viewport.clientHeight-24)/Math.max(h,1)))};
    fit();
    return observePreviewSize([viewport,node],fit);
  },[]);
  return <div ref={outer} className="absolute inset-0 overflow-hidden"><div ref={inner} data-live-preview className={"pointer-events-none absolute top-1/2 left-1/2 flex max-w-none flex-wrap items-center justify-center gap-3 "+(wide?"w-[600px]":"w-[calc(100%-48px)]")} style={{transform:`translate(-50%,-50%) scale(${Math.max(.1,scale)})`}}>{children}</div></div>;
}
export const CatalogCard=memo(function CatalogCard({slug,title,description,href,isPro,isNew,status,template=false}:{slug:string;title:string;description:string;href:string;isPro?:boolean;isNew?:boolean;status:CatalogStatus;template?:boolean}) {
  const ref=useRef<HTMLElement>(null);
  const {begin,warm}=useDocsNavigation();
  const [visible,setVisible]=useState(false);
  const doc=docs[slug];
  useEffect(()=>{
    if(template||!doc||!ref.current)return;
    return observeCatalogCard(ref.current,setVisible);
  },[doc,template]);
  const hasPreview=!!doc&&!template;
  return <article ref={ref} data-catalog-slug={slug} data-catalog-status={status} className={template||!hasPreview?"docs-entry-card group relative flex min-h-[116px] flex-col justify-center gap-2 rounded-2xl bg-background-primary-default p-5":"landing-showcase-card group relative h-[332px] overflow-hidden rounded-[28px] border border-transparent bg-background-primary-default [container-type:inline-size] dark:bg-transparent xl:h-[299px]"}>
    {hasPreview&&<div className="relative flex h-[230px] items-center justify-center overflow-hidden px-6 xl:h-[197px]" aria-hidden="true" inert>
      {visible?<PreviewFit wide={compactPreviews.has(slug)}>{doc.preview}</PreviewFit>:<div className="h-9 w-24 rounded-lg bg-background-tertiary-default opacity-35"/>}
    </div>}
    <div data-card-caption className={hasPreview?"flex min-w-0 flex-col gap-1 px-5 py-2":"flex flex-col gap-1"}>
      <h3 className="flex min-w-0 items-center gap-2 text-headline-medium leading-5 text-text-primary"><span className="truncate">{title}</span>{isNew&&<span className="shrink-0 rounded-sm bg-badge-new-background px-1 text-caption-2-medium text-accent-600 dark:text-accent-300">全新</span>}{isPro&&<span title="原版 Pro；本站为独立实现，非授权 Pro 源码" className="shrink-0 text-caption-2-medium text-text-secondary">原版 Pro</span>}</h3>
      <p className="line-clamp-2 text-body-regular leading-[18px] text-pretty text-text-secondary">{description}</p>
      <p className="text-caption-1-regular leading-[14px] truncate text-text-secondary">{template?"完整模板 · ": ""}{statusLabels[status]}</p>
    </div>
    {status!=="missing"&&<Link href={href} prefetch={false} onFocus={e=>{if(e.currentTarget.matches(":focus-visible"))warm(href)}} onNavigate={()=>begin(href,title)} aria-label={"查看 "+title} title={statusLabels[status]+" · 待完整验收"} className="absolute inset-0 z-50 rounded-[25px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"><span className="sr-only">查看 {title}</span></Link>}
  </article>
});
