import { TopBar } from "./TopBar";
import { TableOfContents, type TocItem } from "./TableOfContents";
import type { Crumb } from "./Breadcrumbs";

/** Geometry measured against boardui.com/zh-hans/components/button at 1440×1000. */
export function DocsLayout({breadcrumbs,toc=[],children,header,variant="detail"}:{
  breadcrumbs:Crumb[];toc?:TocItem[];children:React.ReactNode;header?:React.ReactNode;variant?:"detail"|"catalog";
}) {
  const top=<div className="flex flex-col gap-8"><TopBar breadcrumbs={breadcrumbs}/>{header}</div>;
  return <>
    {variant==="catalog" ? <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-6 pt-10 pb-14 sm:px-10">{top}{children}</main> :
    <div className="component-detail mx-auto flex w-full max-w-[1200px] justify-center gap-12 px-6 pt-10 pb-14 sm:px-10"><main className="flex w-full min-w-0 max-w-[900px] flex-col gap-3">{header ? <>{top}{children}</> : <div className="flex flex-col gap-8"><TopBar breadcrumbs={breadcrumbs}/>{children}</div>}</main><TableOfContents items={toc}/></div>}
  </>;
}
