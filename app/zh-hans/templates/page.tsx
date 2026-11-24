import type {Metadata} from "next";
import {DocsLayout} from "@/app/components/docs/DocsLayout";
import {ComponentCatalog} from "@/app/components/docs/ComponentCatalog";
import {catalogGroups} from "@/app/components/docs/catalog-data";
export const metadata:Metadata={title:"模板"};
export default function TemplatesPage(){
 return <DocsLayout variant="catalog" breadcrumbs={[{label:"BoardUI",href:"/"},{label:"模板"}]} header={<header className="flex flex-col gap-3"><h1 className="text-title-1-medium text-text-primary">模板</h1><p className="text-headline-regular text-text-secondary">浏览完整应用界面示例。所有模板使用本地示例数据。</p></header>}><ComponentCatalog templatesOnly available={catalogGroups(true)}/></DocsLayout>;
}
