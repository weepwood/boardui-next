"use client";

import { useState } from "react";
import { DemoNotice, TemplateSegments, downloadCsv } from "./TemplateShared";
import { Composer } from "@/app/components/ui/Composer";
import { Avatar } from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { Icon } from "@/app/components/ui/Icon";
import { Chip } from "@/app/components/ui/Chip";
import { cn } from "@/lib/utils";

type Msg = { id: number; role: "user" | "assistant"; text: string };

/**
 * AI 聊天模板：侧栏会话列表 + 消息流 + 输入区。
 * 复刻原站 AI 聊天界面的三段式结构。
 */
export function ChatTemplate() {
  const initialMessages:Msg[] = [
    { id: 1, role: "user", text: "帮我用 BoardUI 搭一个数据看板" },
    {
      id: 2,
      role: "assistant",
      text: "可以。建议用 StatCard 展示核心指标，AreaChart 画趋势，再用 Table 列出明细。需要我生成完整代码吗？",
    },
    { id: 3, role: "user", text: "好，先给我统计卡的用法" },
  ];
  const [messages,setMessages]=useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [active,setActive]=useState("1");
  const [saved,setSaved]=useState<Record<string,Msg[]>>({});
  const choose=(id:string)=>{if(id===active)return;setSaved(prev=>({...prev,[active]:messages}));setMessages(saved[id]??(id==="1"?initialMessages:[]));setActive(id)};

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [
      ...m,
      { id: Date.now(), role: "user", text: input },
      {
        id: Date.now() + 1,
        role: "assistant",
        text: "本地示例：已收到消息。此模板未连接 AI 服务。",
      },
    ]);
    setInput("");
  };

  const sessions = [
    { id: "1", title: "数据看板搭建" },
    { id: "2", title: "表单校验方案" },
    { id: "3", title: "暗色模式适配" },
    { id: "4", title: "组件命名规范" },
  ];

  return (
    <div className="flex h-[620px] w-full overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-sidebar">
      {/* 会话列表 */}
      <aside className="hidden w-[180px] shrink-0 flex-col gap-2 border-e border-separator-border bg-background-secondary-default p-2 md:flex">
        <Button onPress={()=>{setSaved(prev=>({...prev,[active]:messages}));setActive("new");setMessages([])}} size="sm" leading={<Icon name="add-line" className="size-3.5" />}>
          新建对话
        </Button>
        <div className="flex flex-col gap-0.5">
          {sessions.map((s) => (
            <button
              key={s.id}
              type="button" onClick={()=>choose(s.id)} aria-current={active===s.id?"page":undefined}
              className={cn(
                "truncate rounded-md px-2 py-1.5 text-start text-body-2-medium",
                "transition-colors duration-150 ease-out",
                active===s.id
                  ? "bg-background-primary-default text-text-primary shadow-xs"
                  : "text-text-secondary hover:bg-background-tertiary-hover hover:text-text-primary"
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
      </aside>

      {/* 对话区 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b border-separator-border px-4 py-2.5">
          <span className="flex size-6 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#a855f7,#6366f1)] text-[11px] font-bold text-white">
            AI
          </span>
          <span className="text-body-2-medium text-text-primary">BoardUI 助手</span>
          <span className="ms-auto flex items-center gap-1 text-caption-2-regular text-text-tertiary">
            <span className="size-1.5 rounded-full bg-lime-500" />
            本地演示
          </span>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex items-start gap-2", m.role === "user" && "flex-row-reverse")}
            >
              <Avatar name={m.role === "user" ? "张三" : "AI"} size="sm" />
              <div
                className={cn(
                  "max-w-[76%] rounded-2xl px-3 py-2 text-body-regular",
                  m.role === "user"
                    ? "bg-accent-500 text-white"
                    : "bg-background-secondary-default text-text-primary"
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="shrink-0 border-t border-separator-border p-3">
          <Composer value={input} onChange={setInput} onSend={send} tools={false}/>
        </div>
      </div>
    </div>
  );
}
