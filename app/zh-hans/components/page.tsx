import type { Metadata } from "next";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
import { ComponentCatalog } from "@/app/components/docs/ComponentCatalog";
export const metadata:Metadata={title:"组件"};
export default function ComponentsIndexPage(){
 return <DocsLayout variant="catalog" breadcrumbs={[{label:"BoardUI",href:"/"},{label:"组件"}]} header={<header className="flex flex-col gap-3"><h1 className="text-title-1-medium text-text-primary">组件</h1><p className="text-headline-regular text-text-secondary">浏览真实组件预览与应用模板。实现来源与验收状态独立标注，本站非原版官方组件库。</p></header>}><ComponentCatalog/></DocsLayout>;
}
