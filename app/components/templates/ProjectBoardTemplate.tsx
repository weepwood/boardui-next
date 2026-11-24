"use client";

import { useState } from "react";
import { TemplateSegments, downloadCsv } from "./TemplateShared";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Icon } from "@/app/components/ui/Icon";
import { Button } from "@/app/components/ui/Button";
import {ModalDialog,DialogBody,DialogFooter} from "@/app/components/ui/Dialog";
import { cn } from "@/lib/utils";

type Card = {
  id: string;
  title: string;
  tag?: { label: string; variant: "accent" | "success" | "warning" | "danger" };
  assignees: string[];
  comments?: number;
  progress?: number;
};

type Column = { id: string; title: string; cards: Card[] };

const INITIAL: Column[] = [
  {
    id: "backlog",
    title: "积压",
    cards: [
      {
        id: "c1",
        title: "探索智能体移交的批准卡",
        tag: { label: "功能", variant: "accent" },
        assignees: ["张三", "李四"],
        comments: 3,
      },
      {
        id: "c2",
        title: "为每个项目团队添加保存的视图",
        tag: { label: "改进", variant: "success" },
        assignees: ["王五"],
      },
      {
        id: "c3",
        title: "记录智能体操作的审计跟踪",
        tag: { label: "合规", variant: "warning" },
        assignees: ["赵六", "钱七", "孙八"],
        comments: 7,
      },
    ],
  },
  {
    id: "todo",
    title: "要做的事",
    cards: [
      {
        id: "c4",
        title: "定义高架表面的语义变量",
        tag: { label: "设计", variant: "accent" },
        assignees: ["李四"],
        comments: 2,
      },
      {
        id: "c5",
        title: "将键盘导航添加到模型选择器",
        assignees: ["张三", "周九"],
      },
      {
        id: "c6",
        title: "返回带有重置时间戳的滚动限制",
        tag: { label: "缺陷", variant: "danger" },
        assignees: ["吴十"],
      },
    ],
  },
  {
    id: "doing",
    title: "进行中",
    cards: [
      {
        id: "c7",
        title: "在嵌套任务组流式传输时对其进行动画处理",
        tag: { label: "功能", variant: "accent" },
        assignees: ["王五", "张三"],
        progress: 60,
        comments: 4,
      },
      {
        id: "c8",
        title: "调整深色仪表盘卡上的图表对比度",
        tag: { label: "改进", variant: "success" },
        assignees: ["赵六"],
        progress: 30,
      },
    ],
  },
  {
    id: "done",
    title: "已完成",
    cards: [
      {
        id: "c9",
        title: "重构令牌抽取脚本",
        assignees: ["李四"],
        comments: 1,
      },
    ],
  },
];

/** 项目看板模板：四列看板 + 任务卡 + 成员头像堆叠 */
export function ProjectBoardTemplate() {
  const [columns,setColumns] = useState(INITIAL);
  const [draft,setDraft]=useState("");const [target,setTarget]=useState<string|null>(null);
  const add=()=>{if(!target||!draft.trim())return;setColumns(prev=>prev.map(c=>c.id===target?{...c,cards:[...c.cards,{id:crypto.randomUUID(),title:draft.trim(),assignees:[]}]}:c));setDraft("");setTarget(null)};
  const [query,setQuery]=useState(""),[filter,setFilter]=useState("all"),[editing,setEditing]=useState<{id:string;title:string;column:string}|null>(null);
  const [feedback,setFeedback]=useState("");
  const matches=(c:Card)=> (filter==="all"||c.tag?.label===filter)&&[c.title,...c.assignees,c.id].some(v=>v.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const tags=Array.from(new Set(columns.flatMap(c=>c.cards.flatMap(t=>t.tag?[t.tag.label]:[]))));
  const visible=columns.reduce((n,c)=>n+c.cards.filter(matches).length,0);
  const open=(card:Card,column:string)=>setEditing({id:card.id,title:card.title,column});
  const [dragging,setDragging]=useState<string|null>(null),[dropColumn,setDropColumn]=useState<string|null>(null);
  const move=(id:string,destination:string,title?:string)=>{
    setColumns(prev=>{
      const source=prev.find(c=>c.cards.some(t=>t.id===id)),card=source?.cards.find(t=>t.id===id);
      if(!source||!card||!prev.some(c=>c.id===destination))return prev;
      const next={...card,title:title??card.title};
      return prev.map(c=>c.id===destination?{...c,cards:source.id===destination?c.cards.map(t=>t.id===id?next:t):[...c.cards,next]}:c.id===source.id?{...c,cards:c.cards.filter(t=>t.id!==id)}:c);
    });
  };
  const save=()=>{if(!editing||!editing.title.trim())return;move(editing.id,editing.column,editing.title.trim());setFeedback("已保存："+editing.title.trim());setEditing(null)};
  const clearDrag=()=>{setDragging(null);setDropColumn(null)};
  const total=columns.reduce((n,c)=>n+c.cards.length,0);
  const filtered=query.trim()!==""||filter!=="all";
  const [view, setView] = useState<"board" | "list">("board");

  return (
    <div className="flex min-h-[680px] w-full flex-col overflow-hidden bui-template-shell rounded-3xl border border-border-component-detail-container bg-background-full">
      {/* 头部 */}
      <header className="flex flex-col gap-3 border-b border-separator-border p-3 @lg:p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-headline-medium text-text-primary">BoardUI 设计任务</h3>
              <Badge variant="accent">进行中</Badge>
            </div>
            <span className="text-caption-1-regular text-text-tertiary">
              {columns.reduce((n,c)=>n+c.cards.length,0)} 个任务 · 本地示例
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {["张三", "李四", "王五", "赵六"].map((n) => (
                <span key={n} className="rounded-full ring-2 ring-background-primary-default">
                  <Avatar name={n} size="sm" />
                </span>
              ))}
              <span className="flex size-6 items-center justify-center rounded-full bg-background-tertiary-default text-[10px] font-medium text-text-secondary ring-2 ring-background-primary-default">
                +4
              </span>
            </div>
            <Button onPress={()=>setTarget(columns[0].id)} size="sm" leading={<Icon name="add-line" className="size-3.5" />}>
              新建任务
            </Button>
          </div>
        </div>

        {/* 视图切换 */}
        <div className="flex flex-wrap items-center gap-2">
          <TemplateSegments values={["看板","列表"] as const} value={view==="board"?"看板":"列表"} onChange={v=>setView(v==="看板"?"board":"list")}/>
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
            <input type="search" aria-label="搜索任务" placeholder="搜索任务" value={query} onChange={e=>{setQuery(e.target.value);setFeedback("")}} className="w-28 min-w-0 flex-1 @lg:flex-none rounded-lg border border-border-button-default bg-background-primary-default px-2 py-1.5 text-body-2-regular @lg:w-40"/>
            <select aria-label="筛选任务标签" value={filter} onChange={e=>{setFilter(e.target.value);setFeedback("")}} className="max-w-full rounded-lg border border-border-button-default bg-background-primary-default px-2 py-1.5 text-body-2-regular"><option value="all">全部标签</option>{tags.map(t=><option key={t}>{t}</option>)}</select>
            <Button size="sm" variant="secondary" onPress={()=>downloadCsv("board.csv",[["任务","状态"],...columns.flatMap(c=>c.cards.filter(matches).map(t=>[t.title,c.title]))])}>导出</Button>
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-2"><p role="status" className="text-caption-1-regular text-text-secondary">{feedback||("显示 "+visible+" / "+total+" 个任务")}</p>{filtered&&<Button size="sm" variant="ghost" onPress={()=>{setQuery("");setFilter("all");setFeedback("")}}>清除筛选</Button>}</div>
      {target&&<form className="flex flex-wrap items-center gap-2 p-3" onSubmit={e=>{e.preventDefault();add()}}><input autoFocus aria-label="任务标题" value={draft} onChange={e=>setDraft(e.target.value)} className="min-w-0 flex-1 rounded-2lg bg-background-tertiary-default p-2 text-body-medium outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring" placeholder="任务标题"/><button type="submit" disabled={!draft.trim()} className="rounded-2lg bg-button-primary px-3 py-2 text-white disabled:opacity-40">添加</button><Button variant="secondary" onPress={()=>setTarget(null)}>取消</Button></form>}
      {/* 看板 */}
      {view === "board" ? (
        <div className="flex min-h-0 flex-1 gap-3 overflow-x-auto overscroll-x-contain p-3 [scrollbar-width:thin]" aria-label="任务看板" role="region" tabIndex={0}>
          {columns.map((col) => (
            <div
              key={col.id} data-board-column={col.id}
              onDragOver={e=>{if(dragging){e.preventDefault();e.dataTransfer.dropEffect="move";setDropColumn(col.id)}}}
              onDragLeave={e=>{if(!(e.relatedTarget instanceof Node)||!e.currentTarget.contains(e.relatedTarget))setDropColumn(null)}}
              onDrop={e=>{e.preventDefault();if(dragging){move(dragging,col.id);setFeedback("已移动至："+col.title)}clearDrag()}}
              className={cn("flex min-w-[220px] flex-1 flex-col gap-2 rounded-2xl bg-background-secondary-default p-2.5",dropColumn===col.id&&"ring-2 ring-inset ring-border-focus-ring")}
            >
              <div className="flex items-center justify-between gap-2 px-1 py-1">
                <div className="flex items-center gap-1.5">
                  <span aria-hidden className={cn("size-2 shrink-0 rounded-full",col.id==="done"?"bg-emerald-500":col.id==="doing"?"bg-accent-500":col.id==="todo"?"bg-amber-400":"bg-chart-neutral")}/><h4 className="text-body-2-medium text-text-primary">{col.title}</h4>
                  <span className="rounded-full bg-background-tertiary-default px-1.5 text-[10px] font-medium text-text-secondary">
                    {col.cards.filter(matches).length} / {col.cards.length}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`在${col.title}中添加`} onClick={()=>setTarget(col.id)}
                  className="flex size-7 cursor-pointer items-center justify-center rounded text-text-tertiary hover:bg-background-tertiary-hover hover:text-text-primary"
                >
                  <Icon name="add-line" className="size-3.5" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {col.cards.filter(matches).map((card) => (
                  <div
                    key={card.id} data-board-card={card.id}
                    className={cn(
                      "group flex flex-col gap-2 rounded-xl border border-border-component-detail-container",
                      "bg-background-primary-default p-3 hover:border-border-button-hover shadow-xs",
                      dragging===card.id&&"opacity-60",
                      "transition-colors duration-150 motion-reduce:transition-none"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1"><span className="flex items-center gap-1 text-caption-1-regular text-text-secondary"><span draggable onDragStart={e=>{e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/plain",card.id);setDragging(card.id)}} onDragEnd={clearDrag} title="拖动到其他列，也可通过编辑任务移动" aria-hidden className="cursor-grab rounded p-0.5 active:cursor-grabbing"><Icon name="drag-move-2-line" className="size-4"/></span>{card.id.startsWith("c")?"任务 "+card.id.slice(1):"新任务"}</span><button type="button" aria-label={"编辑任务 "+card.title} onClick={()=>open(card,col.id)} className="flex size-7 items-center justify-center rounded-md text-text-secondary hover:bg-background-tertiary-hover"><Icon name="more-2-line" className="size-4"/></button></div>
                    {card.tag && (
                      <Badge className="self-start" variant={card.tag.variant}>{card.tag.label}</Badge>
                    )}
                    <span className="break-words text-body-2-medium leading-snug text-text-primary [overflow-wrap:anywhere]">
                      {card.title}
                    </span>

                    {typeof card.progress === "number" && (
                      <div className="flex items-center gap-1.5">
                        <div role="progressbar" aria-label="任务进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={card.progress} className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-tertiary-default">
                          <div
                            className="h-full rounded-full bg-accent-500"
                            style={{ width: `${card.progress}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-[10px] tabular-nums text-text-tertiary">
                          {card.progress}%
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex -space-x-1">
                        {card.assignees.map((a) => (
                          <span
                            key={a}
                            className="rounded-full ring-2 ring-background-primary-default"
                          >
                            <Avatar name={a} size="xs" />
                          </span>
                        ))}
                      </div>
                      {card.comments ? (
                        <span className="flex items-center gap-1 text-caption-2-regular text-text-secondary">
                          <Icon name="chat-3-line" className="size-3" />
                          {card.comments}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}

                {!col.cards.filter(matches).length&&<p className="px-2 py-4 text-center text-caption-1-regular text-text-secondary">暂无匹配任务</p>}
                <button
                  type="button" onClick={()=>setTarget(col.id)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5",
                    "text-caption-1-regular text-text-tertiary",
                    "transition-colors duration-150 hover:bg-background-tertiary-hover hover:text-text-primary"
                  )}
                >
                  <Icon name="add-line" className="size-3.5" />
                  添加任务
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-separator-border">
          {columns.flatMap((col) =>
            col.cards.filter(matches).map((card) => (
              <div
                key={card.id}
                className="flex flex-wrap items-center gap-2 px-4 py-2.5 transition-colors motion-reduce:transition-none hover:bg-background-secondary-hover"
              >
                <Icon
                  name="checkbox-blank-circle-line"
                  className="size-4 shrink-0 text-foreground-icon-tertiary"
                />
                <button type="button" onClick={()=>open(card,col.id)} className="min-w-[120px] flex-1 break-words text-start text-body-2-medium text-text-primary hover:underline">{card.title}</button>
                {card.tag && <Badge className="self-start" variant={card.tag.variant}>{card.tag.label}</Badge>}
                <span className="shrink-0 text-caption-2-regular text-text-tertiary">
                  {col.title}
                </span>
                <div className="flex -space-x-1">
                  {card.assignees.slice(0, 2).map((a) => (
                    <span key={a} className="rounded-full ring-2 ring-background-primary-default">
                      <Avatar name={a} size="xs" />
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {editing&&<ModalDialog isOpen onOpenChange={v=>{if(!v)setEditing(null)}} title="编辑任务" description="修改任务标题或移动到其他状态；同列编辑保留原顺序。"><DialogBody><label className="flex flex-col gap-1 text-body-2-medium">任务标题<input aria-label="编辑任务标题" value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} className="rounded-lg border border-border-button-default bg-background-primary-default p-2"/></label><label className="flex flex-col gap-1 text-body-2-medium">任务状态<select aria-label="移动至" value={editing.column} onChange={e=>setEditing({...editing,column:e.target.value})} className="rounded-lg border border-border-button-default bg-background-primary-default p-2">{columns.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label></DialogBody><DialogFooter><Button variant="secondary" onPress={()=>setEditing(null)}>取消</Button><Button isDisabled={!editing.title.trim()} onPress={save}>保存任务</Button></DialogFooter></ModalDialog>}
    </div>
  );
}
