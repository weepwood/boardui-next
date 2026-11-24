"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select } from "./Select";
import { Slider } from "./Slider";
import { Switch } from "./Switch";
import { Button } from "./Button";
import { Chip } from "./Chip";

const MODELS = [
  { id: "fast", label: "快速（低延迟）" },
  { id: "balanced", label: "均衡（推荐）" },
  { id: "deep", label: "深度推理" },
];

const CAPS = ["检索网页", "执行代码", "读写文件", "调用 API"];

export type AgentConfiguration={name:string;role:string;model:string;temperature:number;capabilities:string[];stream:boolean};

/**
 * 智能体创建器：名称、角色、模型、能力与温度设置。
 * 分步骤表单，带预览摘要。
 */
export function AgentCreator({
  onSubmit,
  className,
}: {
  onSubmit?: (data:AgentConfiguration) => void;
  className?: string;
}) {
  const [name, setName] = useState("研究助手");
  const [role, setRole] = useState("帮我把长文档提炼成结构化要点，并标注不确定的地方。");
  const [model, setModel] = useState("balanced");
  const [temp, setTemp] = useState(40);
  const [caps, setCaps] = useState<string[]>(["检索网页"]);
  const [stream, setStream] = useState(true);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 rounded-2xl border border-border-component-detail-container",
        "bg-background-primary-default p-4 shadow-card",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary">
          <Icon name="robot-2-line" className="size-4" />
        </span>
        <div className="flex flex-col">
          <span className="text-body-2-medium text-text-primary">创建智能体</span>
          <span className="text-caption-2-regular text-text-secondary">配置名称、角色与能力</span>
        </div>
      </div>

      <Input label="名称" value={name} onChange={setName} placeholder="例如：研究助手" />

      <Textarea
        label="角色设定"
        value={role}
        onChange={setRole}
        rows={3}
        description="描述它擅长什么、以什么风格回答"
      />

      <Select label="模型" value={model} onChange={(v) => setModel(String(v))} options={MODELS} />

      <Slider
        label="温度（越高越有创造性）"
        value={temp}
        onChange={setTemp}
        minValue={0}
        maxValue={100}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-body-2-medium text-text-primary">能力</span>
        <div className="flex flex-wrap gap-1.5">
          {CAPS.map((c) => (
            <Chip
              key={c}
              label={c}
              isSelected={caps.includes(c)}
              onChange={(on) =>
                setCaps((prev) => (on ? [...prev, c] : prev.filter((x) => x !== c)))
              }
            />
          ))}
        </div>
      </div>

      <Switch isSelected={stream} onChange={setStream}>
        流式输出
      </Switch>

      <div className="flex items-center justify-between gap-2 border-t border-separator-border pt-3">
        <span className="text-caption-2-regular text-text-secondary">
          已选 {caps.length} 项能力 · 模型 {MODELS.find((m) => m.id === model)?.label}
        </span>
        <Button size="sm" isDisabled={!name.trim()||!role.trim()} onClick={() => onSubmit?.({name:name.trim(),role:role.trim(),model,temperature:temp,capabilities:[...caps],stream})}>
          创建
        </Button>
      </div>
    </div>
  );
}
