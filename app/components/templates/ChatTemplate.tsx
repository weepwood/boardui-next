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
 const [sessions,setSessions]=useState(INITIAL),[active,setActive]=useState("1"),[input,setInput]=useState(""),[workspace,setWorkspace]=useState(true),[tab,setTab]=useState("changes");
 const session=sessions.find(s=>s.id===active)??sessions[0],messages=session.messages;
 const end=useRef<HTMLDivElement>(null),sequence=useRef(10);
 useEffect(()=>{const node=end.current?.parentElement;if(node)node.scrollTop=node.scrollHeight},[active,messages.length]);
 const create=()=>{const id=String(++sequence.current);setSessions(prev=>[...prev,{id,title:"新对话 "+id,messages:[]}]);setActive(id);setInput("")};
 const send=()=>{const text=input.trim();if(!text)return;const id=++sequence.current,replyId=++sequence.current;setSessions(prev=>prev.map(s=>s.id===active?{...s,messages:[...s.messages,{id,role:"user",text},{id:replyId,role:"assistant",text:"本地示例：已收到消息。此模板未连接 AI 服务。"}]}:s));setInput("")};
 return <div className="flex h-[min(760px,88dvh)] min-h-[440px] w-full min-w-0 overflow-hidden rounded-3xl border border-border-component-detail-container bg-background-full bui-template-shell">
 <aside className="hidden w-[180px] shrink-0 flex-col gap-3 bg-background-secondary-default p-3 @2xl:flex">
  <Button size="sm" variant="secondary" onPress={create} leading={<Icon name="add-line" className="size-4"/>}>新建对话</Button>
  <div className="text-caption-1-medium text-text-secondary">工作区 · 对话</div>
  <nav aria-label="会话列表" className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">{sessions.map(s=><button key={s.id} type="button" aria-current={active===s.id?"page":undefined} onClick={()=>{setActive(s.id);setInput("")}} className={cn("truncate rounded-lg px-2.5 py-2 text-start text-body-2-medium focus-visible:outline-2 focus-visible:outline-border-focus-ring",active===s.id?"bg-background-tertiary-default text-text-primary":"text-text-secondary hover:bg-background-secondary-hover")}>{s.title}</button>)}</nav>
 </aside>
 <div className="flex min-w-0 flex-1 flex-col gap-2 bg-background-secondary-default p-2 @2xl:rounded-s-2xl">
 <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-2 py-1"><div className="min-w-0 text-body-2-medium text-text-secondary"><span className="text-text-tertiary">工作区 / </span>{session.title}</div><div className="flex flex-wrap items-center gap-1"><Button size="sm" variant="secondary" className="@2xl:hidden" onPress={create}>新建对话</Button><Button size="sm" variant="secondary" className="hidden @4xl:inline-flex" onPress={()=>setWorkspace(v=>!v)} aria-expanded={workspace}>工作区</Button></div><select aria-label="切换会话" value={active} onChange={e=>{setActive(e.target.value);setInput("")}} className="max-w-full rounded-lg border border-border-button-default bg-background-primary-default p-1 text-body-2-regular @2xl:hidden">{sessions.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}</select></header>
 <div role="log" aria-label="对话消息" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-2 @lg:p-4">
 {messages.length===0&&<div className="m-auto text-body-2-regular text-text-secondary">开始一段新对话</div>}
 {messages.map(m=><div key={m.id} className={cn("max-w-[90%] break-words rounded-2xl p-3 text-body-2-regular text-text-primary",m.role==="user"?"self-end bg-background-primary-default shadow-xs":"self-start border border-border-button-default bg-background-primary-default")}><span className="sr-only">{m.role==="user"?"你：":"助手："}</span>{m.text}</div>)}<div ref={end}/>
 </div>
 <div className="shrink-0"><Composer value={input} onChange={setInput} onSend={send} tools={false}/><div className="flex items-center justify-between px-2 py-1 text-caption-2-regular text-text-secondary"><span>本地演示 · 未连接模型</span><span>{messages.length} 条消息</span></div></div>
 </div>
 {workspace&&<aside aria-label="工作区详情" className="hidden w-[min(33%,320px)] shrink-0 flex-col gap-3 overflow-y-auto bg-background-primary-default p-3 @4xl:flex">
 <SegmentedControl value={tab} onChange={setTab} options={[{id:"changes",label:"变化"},{id:"preview",label:"预览"}]}/>
 {tab==="changes"?<><div className="text-body-2-medium text-text-primary">本地会话记录</div><div className="rounded-xl bg-background-secondary-default p-3 text-caption-1-regular text-text-secondary">此处显示实际会话文本，不会修改项目文件。</div><pre className="whitespace-pre-wrap break-all rounded-xl bg-background-secondary-default p-3 text-caption-1-regular text-text-primary">{messages.map(m=>m.role+": "+m.text).join("\n\n")||"暂无记录"}</pre></>:<div className="rounded-xl bg-background-secondary-default p-3 text-body-2-regular text-text-secondary">{messages.at(-1)?.text??"暂无预览"}</div>}
 </aside>}
 </div>;
}
