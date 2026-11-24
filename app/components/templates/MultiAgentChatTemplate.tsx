"use client";

import { useState } from "react";
import { AgentProgress } from "@/app/components/ui/AgentProgress";
import { Composer } from "@/app/components/ui/Composer";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Icon } from "@/app/components/ui/Icon";
import { cn } from "@/lib/utils";

type AgentStatus = "thinking" | "done" | "idle" | "running";

type Agent = {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  steps: { text: string; done: boolean }[];
};

const AGENTS: Agent[] = [
  {
    id: "a1",
    name: "安全智能体",
    role: "权限审计",
    status: "done",
    steps: [
      { text: "扫描依赖漏洞", done: true },
      { text: "检查 API 鉴权", done: true },
      { text: "生成审计报告", done: true },
    ],
  },
  {
    id: "a2",
    name: "代码智能体",
    role: "实现重构",
    status: "running",
    steps: [
      { text: "解析现有组件结构", done: true },
      { text: "抽取共享样式令牌", done: true },
      { text: "重写 Button 组件", done: false },
    ],
  },
  {
    id: "a3",
    name: "测试智能体",
    role: "回归验证",
    status: "thinking",
    steps: [
      { text: "等待代码智能体产出", done: false },
      { text: "运行视觉回归", done: false },
    ],
  },
  {
    id: "a4",
    name: "文档智能体",
    role: "撰写说明",
    status: "idle",
    steps: [{ text: "排入队列", done: false }],
  },
];

const STATUS_META: Record<AgentStatus, { label: string; cls: string; dot: string }> = {
  done: { label: "已完成", cls: "text-lime-600", dot: "bg-lime-500" },
  running: { label: "执行中", cls: "text-accent-600", dot: "bg-accent-500" },
  thinking: { label: "思考中", cls: "text-purple-600", dot: "bg-purple-500" },
  idle: { label: "排队中", cls: "text-text-tertiary", dot: "bg-text-tertiary" },
};

/** 多智能体聊天模板：智能体协作面板 + 任务流 */
export function MultiAgentChatTemplate() {
  const [selected, setSelected] = useState("a2");
 const [commands,setCommands]=useState<string[]>([]);
  const current = AGENTS.find((a) => a.id === selected)!;

  return (
    <div className="flex min-h-[640px] w-full flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-sidebar lg:flex-row">
      {/* 智能体列表 */}
      <aside className="flex w-full shrink-0 flex-col gap-2 border-b border-separator-border p-3 lg:w-[220px] lg:border-b-0 lg:border-e">
        <div className="flex items-center justify-between px-1">
          <span className="text-body-2-medium text-text-primary">智能体 · 示例</span>
          <Badge variant="accent">{AGENTS.filter((a) => a.status !== "idle").length} 活跃</Badge>
        </div>

        {AGENTS.map((a) => {
          const meta = STATUS_META[a.status];
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a.id)} aria-pressed={selected===a.id}
              className={cn(
                "flex items-start gap-2 rounded-xl border p-2 text-start",
                "transition-[border-color,background-color] duration-150 ease-out",
                selected === a.id
                  ? "border-accent-400 bg-badge-new-background"
                  : "border-separator-border hover:bg-background-secondary-hover"
              )}
            >
              <Avatar name={a.name} size="sm" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-caption-1-medium text-text-primary">{a.name}</span>
                <span className="truncate text-[10px] text-text-tertiary">{a.role}</span>
                <span className={cn("flex items-center gap-1 text-[10px]", meta.cls)}>
                  <span className={cn("size-1.5 rounded-full", meta.dot, a.status === "running" && "animate-pulse motion-reduce:animate-none")} />
                  {meta.label}
                </span>
              </div>
            </button>
          );
        })}
      </aside>

      {/* 任务流 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-2 border-b border-separator-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Avatar name={current.name} size="md" />
            <div className="flex flex-col">
              <span className="text-body-2-medium text-text-primary">{current.name}</span>
              <span className="text-[10px] text-text-tertiary">{current.role}</span>
            </div>
          </div>
          <Badge
            variant={
              current.status === "done"
                ? "success"
                : current.status === "running"
                  ? "accent"
                  : current.status === "thinking"
                    ? "warning"
                    : "neutral"
            }
          >
            {STATUS_META[current.status].label}
          </Badge>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
          {/* 用户指令 */}
          <div className="flex items-start justify-end gap-2">
            <div className="max-w-[76%] rounded-2xl bg-accent-500 px-3 py-2 text-body-regular text-white">
              重构 Button 组件，把颜色改成设计令牌，并跑一遍回归测试。
            </div>
            <Avatar name="张三" size="sm" />
          </div>

          <AgentProgress title="示例执行步骤" steps={current.steps.map((s,i)=>({id:current.id+"-"+i,label:s.text,state:s.done?"done":current.status==="running"&&i===current.steps.findIndex(t=>!t.done)?"active":"pending"}))}/>
          {/* 协作记录 */}
          <div className="flex flex-col gap-2">
            <span className="text-caption-2-semibold text-text-tertiary">协作记录</span>
            {[
              { from: "安全智能体", to: "代码智能体", msg: "依赖扫描通过，无高危漏洞，可以继续。", done: true },
              { from: "代码智能体", to: "测试智能体", msg: "Button 组件已重写，共 14 处颜色替换为令牌。", done: true },
              { from: "测试智能体", to: "代码智能体", msg: "视觉回归进行中，等待构建产物…", done: false },
            ].map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-col gap-1 rounded-xl border p-2",
                  m.done ? "border-separator-border" : "border-accent-300 bg-badge-new-background"
                )}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary">
                  <span className="font-medium text-text-secondary">{m.from}</span>
                  <Icon name="arrow-right-line" className="size-2.5" />
                  <span className="font-medium text-text-secondary">{m.to}</span>
                </div>
                <span className="text-caption-1-regular text-text-primary">{m.msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-separator-border p-3">
          {commands.map((c,i)=><p key={i} className="break-words text-body-2-regular text-text-secondary">本地记录：{c}</p>)}
          <Composer tools={false} onSend={c=>setCommands(prev=>[...prev,c])} placeholder="记录示例指令…"/>
          <p className="text-caption-1-regular text-text-tertiary">静态协作记录，未连接智能体服务。</p>
        </div>
      </div>
    </div>
  );
}
