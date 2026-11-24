"use client";
import Link from "next/link";
import {ThemeToggle} from "@/app/components/docs/ThemeToggle";
import {Icon} from "@/app/components/ui/Icon";
import {DashboardTemplate} from "./DashboardTemplate";
import {ProjectBoardTemplate} from "./ProjectBoardTemplate";
import {ChatTemplate} from "./ChatTemplate";
import {FinanceTemplate} from "./FinanceTemplate";
const entries={dashboard:{title:"仪表盘",Component:DashboardTemplate},"project-board":{title:"项目看板",Component:ProjectBoardTemplate},"ai-chat":{title:"AI 聊天",Component:ChatTemplate},finance:{title:"财务",Component:FinanceTemplate}} as const;
export type WorkspaceSlug=keyof typeof entries;
const focus="outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring";
export function WorkspaceShell({slug}:{slug:WorkspaceSlug}){
 const {title,Component}=entries[slug];
 return <main className="min-h-screen min-w-0 bg-background-full p-3 sm:p-4" data-workspace={slug}>
  <div className="mx-auto flex min-w-0 max-w-[1680px] flex-col gap-3">
   <header className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-2xl border border-border-button-default bg-background-primary-default px-3 py-2">
    <div className="flex min-w-0 items-center gap-2"><Link href={`/zh-hans/templates/${slug}/`} aria-label="返回文档" title="返回文档" className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary ${focus}`}><Icon name="arrow-left-line" className="size-4"/></Link><div className="min-w-0 border-s border-separator-border ps-3"><p className="text-caption-1-regular text-text-secondary">BoardUI 工作区</p><h1 className="truncate text-body-medium text-text-primary">{title}</h1></div></div>
    <nav aria-label="工作区导航" className="order-last flex w-full min-w-0 items-center gap-1 overflow-x-auto rounded-2lg bg-background-secondary-default p-1 sm:order-none sm:w-auto">
     {Object.entries(entries).map(([key,e])=><Link key={key} href={`/workspace/${key}/`} aria-current={key===slug?"page":undefined} className={`shrink-0 rounded-lg px-3 py-1.5 text-body-2-medium transition-colors motion-reduce:transition-none ${focus} ${key===slug?"bg-background-primary-default text-text-primary shadow-xs":"text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary"}`}>{e.title}</Link>)}
    </nav><ThemeToggle/>
   </header>
   <div id="preview" className="@container min-w-0"><Component/></div><p className="text-caption-1-regular text-text-secondary">本地独立演示；不连接后端，刷新后恢复示例数据。</p>
  </div>
 </main>
}
