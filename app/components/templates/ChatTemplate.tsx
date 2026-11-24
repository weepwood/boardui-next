"use client";
import {useState,useRef,useEffect} from "react";
import {Composer} from "@/app/components/ui/Composer";
import {Button} from "@/app/components/ui/Button";
import {Icon} from "@/app/components/ui/Icon";
import {SegmentedControl} from "@/app/components/ui/SegmentedControl";
import {cn} from "@/lib/utils";
type Msg={id:number;role:"user"|"assistant";text:string};
type Session={id:string;title:string;messages:Msg[]};
const INITIAL:Session[]=[{id:"1",title:"数据看板搭建",messages:[{id:1,role:"user",text:"帮我用 BoardUI 搭一个数据看板"},{id:2,role:"assistant",text:"建议用 StatCard 展示核心指标，AreaChart 画趋势，再用 Table 列出明细。"}]},{id:"2",title:"表单校验方案",messages:[]},{id:"3",title:"暗色模式适配",messages:[]},{id:"4",title:"组件命名规范",messages:[]}];
export function ChatTemplate(){
 const [sessions,setSessions]=useState(INITIAL),[active,setActive]=useState("1"),[drafts,setDrafts]=useState<Record<string,string>>({}),[workspace,setWorkspace]=useState(true),[tab,setTab]=useState("changes");
 const session=sessions.find(s=>s.id===active)??sessions[0],messages=session.messages;
 const input=drafts[active]??"",setInput=(value:string)=>setDrafts(prev=>({...prev,[active]:value}));
 const [search,setSearch]=useState("");
 const shown=sessions.filter(s=>s.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
 const end=useRef<HTMLDivElement>(null),sequence=useRef(10);
 useEffect(()=>{const node=end.current?.parentElement;if(node)node.scrollTop=node.scrollHeight},[active,messages.length]);
 const create=()=>{const id=String(++sequence.current);setSessions(prev=>[...prev,{id,title:"新对话 "+id,messages:[]}]);setActive(id);setSearch("")};
 const send=()=>{const text=input.trim();if(!text)return;const id=++sequence.current,replyId=++sequence.current;setSessions(prev=>prev.map(s=>s.id===active?{...s,messages:[...s.messages,{id,role:"user",text},{id:replyId,role:"assistant",text:"本地示例：已收到消息。此模板未连接 AI 服务。"}]}:s));setInput("")};
 return <div className="flex h-[min(760px,88dvh)] min-h-[440px] w-full min-w-0 overflow-hidden rounded-3xl border border-border-component-detail-container bg-background-full bui-template-shell p-2 gap-2 @lg:p-3">
 <aside className="hidden w-[220px] shrink-0 flex-col gap-3 rounded-2xl bg-background-secondary-default p-3 @2xl:flex">
  <Button size="sm" variant="secondary" onPress={create} leading={<Icon name="add-line" className="size-4"/>}>新建对话</Button>
  <div className="flex items-center justify-between text-caption-1-medium text-text-secondary"><span>最近对话</span><span className="tabular-nums">{sessions.length}</span></div><input type="search" aria-label="搜索会话" placeholder="搜索会话" value={search} onChange={e=>setSearch(e.target.value)} className="min-w-0 rounded-lg border border-border-button-default bg-background-primary-default px-2 py-1.5 text-body-2-regular"/>
  <nav aria-label="会话列表" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">{shown.length===0&&<p className="p-2 text-caption-1-regular text-text-secondary">暂无匹配会话</p>}{shown.map(s=><button key={s.id} type="button" aria-label={s.title} aria-current={active===s.id?"page":undefined} onClick={()=>{setActive(s.id)}} className={cn("flex min-w-0 flex-col gap-0.5 rounded-lg px-2.5 py-2 text-start text-body-2-medium focus-visible:outline-2 focus-visible:outline-border-focus-ring",active===s.id?"bg-background-tertiary-default text-text-primary":"text-text-secondary hover:bg-background-secondary-hover")}><span className="max-w-full truncate">{s.title}</span><span className="text-caption-2-regular text-text-secondary">{s.messages.length} 条消息{drafts[s.id]?.trim()?" · 草稿":""}</span></button>)}</nav>
 </aside>
 <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-background-secondary-default p-2">
 <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-2 py-1"><div className="min-w-0 flex-1"><p className="text-caption-1-regular text-text-secondary">工作区 / 对话</p><h3 className="break-words text-body-medium text-text-primary">{session.title}</h3></div><div className="flex flex-wrap items-center gap-1"><Button size="sm" variant="secondary" className="@2xl:hidden" onPress={create}>新建对话</Button><Button size="sm" variant="secondary" className="hidden @4xl:inline-flex" onPress={()=>setWorkspace(v=>!v)} aria-expanded={workspace}>工作区</Button></div><select aria-label="切换会话" value={active} onChange={e=>{setActive(e.target.value)}} className="max-w-full rounded-lg border border-border-button-default bg-background-primary-default p-1 text-body-2-regular @2xl:hidden">{sessions.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></header>
 <div role="log" aria-label="对话消息" className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain p-2 @lg:p-4">
 {messages.length===0&&<div className="m-auto flex max-w-xs flex-col items-center gap-2 text-center"><Icon name="chat-3-line" className="size-8 text-text-secondary"/><p className="text-headline-medium text-text-primary">开始一段新对话</p><p className="text-body-2-regular text-text-secondary">输入消息体验本地会话流程，未连接 AI 模型。</p></div>}
 {messages.map(m=><div key={m.id} className={cn("mx-auto flex w-full max-w-[720px] flex-col gap-1",m.role==="user"?"items-end":"items-start")}><span className="px-1 text-caption-1-medium text-text-secondary">{m.role==="user"?"你":"BoardUI 助手"}</span><p className={cn("max-w-full whitespace-pre-wrap break-words text-body-regular leading-relaxed text-text-primary [overflow-wrap:anywhere]",m.role==="user"?"max-w-[85%] rounded-2xl bg-background-primary-default px-3 py-2.5 shadow-xs":"px-1 py-1")}>{m.text}</p></div>)}<div ref={end}/>
 </div>
 <div className="mx-auto w-full max-w-[720px] shrink-0"><Composer value={input} onChange={setInput} onSend={send} tools={false}/><div className="flex flex-wrap items-center justify-between gap-1 px-2 py-1 text-caption-2-regular text-text-secondary"><span>本地演示 · 未连接模型</span><span className="hidden @lg:inline">Enter 发送 · Shift+Enter 换行</span><span>{messages.length} 条消息</span></div></div>
 </div>
 {workspace&&<aside aria-label="工作区详情" className="hidden w-[min(30%,320px)] shrink-0 flex-col gap-3 overflow-y-auto rounded-2xl bg-background-primary-default p-3 @4xl:flex">
 <SegmentedControl value={tab} onChange={setTab} options={[{id:"changes",label:"记录"},{id:"preview",label:"预览"}]}/>
 {tab==="changes"?<><div className="text-body-2-medium text-text-primary">本地会话记录</div><div className="rounded-xl bg-background-secondary-default p-3 text-caption-1-regular text-text-secondary">此处显示实际会话文本，不会修改项目文件。</div><pre className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-xl bg-background-secondary-default p-3 text-caption-1-regular text-text-primary">{messages.map(m=>m.role+": "+m.text).join("\n\n")||"暂无记录"}</pre></>:<div className="rounded-xl bg-background-secondary-default p-3 text-body-2-regular text-text-secondary">{messages.at(-1)?.text??"暂无预览"}</div>}
 </aside>}
 </div>;
}
