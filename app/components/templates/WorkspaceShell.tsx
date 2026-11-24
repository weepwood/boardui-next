"use client";
import Link from "next/link";
import {useTheme} from "@/app/components/ThemeProvider";
import {Button} from "@/app/components/ui/Button";
import {DashboardTemplate} from "./DashboardTemplate";
import {ProjectBoardTemplate} from "./ProjectBoardTemplate";
import {ChatTemplate} from "./ChatTemplate";
import {FinanceTemplate} from "./FinanceTemplate";
const entries={dashboard:{title:"仪表盘",Component:DashboardTemplate},"project-board":{title:"项目看板",Component:ProjectBoardTemplate},"ai-chat":{title:"AI 聊天",Component:ChatTemplate},finance:{title:"财务",Component:FinanceTemplate}} as const;
export type WorkspaceSlug=keyof typeof entries;
export function WorkspaceShell({slug}:{slug:WorkspaceSlug}){
 const {toggle}=useTheme(),{title,Component}=entries[slug];
 return <main className="min-h-screen min-w-0 bg-background-full p-3 sm:p-4" data-workspace={slug}>
 <div className="mx-auto flex min-w-0 max-w-[1680px] flex-col gap-3"><header className="flex flex-wrap items-center justify-between gap-2"><div className="flex flex-wrap items-center gap-2"><Link href={`/zh-hans/templates/${slug}/`} className="rounded-lg border border-border-button-default px-3 py-2 text-body-2-medium text-text-primary hover:bg-background-primary-hover">返回文档</Link><h1 className="text-headline-medium text-text-primary">{title} · 独立工作区</h1></div><Button variant="secondary" size="sm" onPress={toggle}>切换主题</Button></header>
 <nav aria-label="工作区导航" className="flex flex-wrap gap-1 rounded-xl bg-background-secondary-default p-1">{Object.entries(entries).map(([key,e])=><Link key={key} href={`/workspace/${key}/`} aria-current={key===slug?"page":undefined} className={`rounded-lg px-3 py-1.5 text-body-2-medium ${key===slug?"bg-background-primary-default text-text-primary shadow-xs":"text-text-secondary hover:bg-background-secondary-hover"}`}>{e.title}</Link>)}</nav>
 <div id="preview" className="@container min-w-0"><Component/></div><p className="text-caption-1-regular text-text-secondary">本地独立演示；不连接后端，刷新后恢复示例数据。</p></div></main>
}
