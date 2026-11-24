import type { Metadata } from "next";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
import { CatalogCard } from "@/app/components/docs/CatalogCard";
import { navigation } from "@/lib/navigation";
import { docMetaMap } from "@/lib/docs/meta";
export const metadata:Metadata={title:"组件"};
const templates=new Set(["ai-chat","ai-image-generation","ai-profile","calendar","chat-starter","dashboard","finance","hr","marketing","medical-profile","multi-agent-chat","project-board"]);
export default function ComponentsIndexPage(){
 const groups=navigation.filter(g=>["基础组件","组合组件","图表","模板"].includes(g.title));
 return <DocsLayout variant="catalog" breadcrumbs={[{label:"BoardUI",href:"/"},{label:"组件"}]} header={<header className="flex flex-col gap-3"><h1 className="text-title-1-medium text-text-primary">组件</h1><p className="text-headline-regular text-text-secondary">探索 BoardUI Next 的组件和模板。已移植组件使用真实预览，其余按原版逐项校准。</p></header>}>
 {groups.map(group=><section key={group.title} id={group.title} className="flex scroll-mt-10 flex-col gap-4"><div className="flex items-baseline gap-2"><h2 className="text-title-2-medium text-text-primary">{group.title}</h2><span className="text-body-regular text-text-tertiary">{group.items.length}</span></div><div className="grid w-full grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-[repeat(3,minmax(0,304px))]">{group.items.map(item=>{const slug=item.href.split("/").pop()??"";const meta=docMetaMap.get(slug);const isTemplate=group.title==="模板";const hasDoc=isTemplate?templates.has(slug):!!meta;return hasDoc?<CatalogCard key={item.href} slug={slug} title={item.label} description={meta?.description??"应用界面模板"} href={isTemplate?"/zh-hans/templates/"+slug:item.href} isPro={item.isPro} isNew={item.isNew}/>:<article key={item.href} className="flex min-h-40 flex-col justify-end gap-1 rounded-[28px] border border-border-component-detail-container p-5"><h3 className="text-headline-medium text-text-primary">{item.label}</h3><p className="text-body-regular text-text-tertiary">待实现</p></article>})}</div></section>)}
 </DocsLayout>;
}
