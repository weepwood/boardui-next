"use client";
import Link from "next/link";
import { useEffect,useRef,useState } from "react";
import { docs } from "@/lib/docs/registry";

export type CatalogStatus="ported"|"independent"|"existing"|"missing";
const statusLabels={ported:"原版公开源码",independent:"独立实现",existing:"本地实现",missing:"待实现"};
const compactPreviews=new Set(["color","typography","agent-creator","agent-progress","agent-limits-card","composer-panel","notification-center","settings-modal","sidebar","calendar","data-grid","data-table","table","questionnaire","task-list","auth-card","stat-cards","web-search","date-calendar"]);
export function CatalogCard({slug,title,description,href,isPro,isNew,status,template=false}:{slug:string;title:string;description:string;href:string;isPro?:boolean;isNew?:boolean;status:CatalogStatus;template?:boolean}) {
  const ref=useRef<HTMLElement>(null);
  const [visible,setVisible]=useState(false);
  const doc=docs[slug];
  useEffect(()=>{
    if(template||!doc||!ref.current)return;
    const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{rootMargin:"240px 0px"});
    observer.observe(ref.current);
    return ()=>observer.disconnect();
  },[doc,template]);
  const hasPreview=!!doc&&!template;
  return <article ref={ref} data-catalog-slug={slug} data-catalog-status={status} className={template||!hasPreview?"group relative flex min-h-[128px] flex-col justify-center gap-2 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-5":"landing-showcase-card group relative h-[332px] overflow-hidden rounded-[28px] border border-transparent bg-background-primary-default [container-type:inline-size] dark:bg-transparent xl:h-[299px]"}>
    {hasPreview&&<div className="relative flex h-[230px] items-center justify-center overflow-hidden px-6 xl:h-[197px]" aria-hidden="true" inert>
      {visible?<div data-live-preview className={compactPreviews.has(slug)?"pointer-events-none flex w-[600px] max-w-none shrink-0 origin-center scale-[.44] flex-wrap items-center justify-center gap-3":"pointer-events-none flex max-w-full flex-wrap items-center justify-center gap-3"}>{doc.preview}</div>:<div className="h-12 w-32 rounded-xl bg-background-tertiary-default opacity-50"/>}
    </div>}
    <div className={hasPreview?"flex flex-col gap-1 px-5 pt-3 pb-5":"flex flex-col gap-1"}>
      <h3 className="flex flex-wrap items-center gap-2 text-headline-medium text-text-primary">{title}{isNew&&<span className="rounded-sm bg-badge-new-background px-1 text-caption-2-medium text-accent-600">全新</span>}{isPro&&<span title="原版 Pro；本站为独立实现，非授权 Pro 源码" className="text-caption-2-medium text-text-secondary">原版 Pro</span>}</h3>
      <p className="line-clamp-2 text-body-regular text-pretty text-text-secondary">{description}</p>
      <p className="text-caption-1-regular text-text-secondary">{template?"完整模板 · ": ""}{statusLabels[status]} · 待完整验收</p>
    </div>
    {status!=="missing"&&<Link href={href} prefetch={false} aria-label={"查看 "+title} className="absolute inset-0 rounded-[25px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"><span className="sr-only">查看 {title}</span></Link>}
  </article>
}
