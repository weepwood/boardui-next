"use client";
import Link from "next/link";
import { docs } from "@/lib/docs/registry";
const ported=new Set(["button","icon-button","button-group","close-button","checkbox","radio","switch","input","textarea","tabs","segmented-control","select","dropdown","tooltip","notification","announcement","date-picker","slider","input-otp","avatar","badge","chip","pagination","table","tree-view"]);
export function CatalogCard({slug,title,description,href,isPro,isNew}:{slug:string;title:string;description:string;href:string;isPro?:boolean;isNew?:boolean}) {
  const doc=docs[slug];
  const preview=ported.has(slug)&&doc;
  return <article className="landing-showcase-card group relative h-[332px] overflow-hidden rounded-[28px] border border-transparent bg-background-primary-default [container-type:inline-size] dark:bg-transparent xl:h-[299px]">
    <div className="relative flex h-[230px] items-center justify-center overflow-hidden px-6 xl:h-[197px]">
      {preview ? <div inert className="pointer-events-none flex max-w-full flex-wrap items-center justify-center gap-3">{doc.preview}</div> : <span className="text-body-2-regular text-text-tertiary">{isPro?"Pro · 独立实现待验收":"组件预览待校准"}</span>}
    </div>
    <div className="flex flex-col gap-1 px-5 pt-3 pb-5"><h3 className="flex items-center gap-2 text-headline-medium text-text-primary">{title}{isNew&&<span className="rounded-sm bg-badge-new-background px-1 text-caption-2-medium text-accent-600">全新</span>}{isPro&&<span className="text-caption-2-medium text-text-secondary">Pro</span>}</h3><p className="line-clamp-2 text-headline-regular text-pretty text-text-secondary">{description}</p></div>
    <Link href={href} prefetch={false} aria-label={"查看 "+title} className="absolute inset-0 rounded-[25px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"><span className="sr-only">查看 {title}</span></Link>
  </article>
}
