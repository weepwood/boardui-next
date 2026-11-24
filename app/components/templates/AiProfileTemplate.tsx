"use client";

import { useState } from "react";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Icon } from "@/app/components/ui/Icon";
import { Divider } from "@/app/components/ui/Divider";
import { Progress } from "@/app/components/ui/Progress";
import { Tabs, TabList, Tab, TabPanel } from "@/app/components/ui/Tabs";
import { cn } from "@/lib/utils";

const SKILLS = [
  { label: "产品设计", value: 92 },
  { label: "前端开发", value: 78 },
  { label: "动效设计", value: 86 },
  { label: "用户研究", value: 64 },
];

const ACTIVITY = [
  { id: "a1", text: "发布了组件「手风琴」", time: "2 小时前", icon: "upload-line" },
  { id: "a2", text: "更新了设计令牌", time: "昨天", icon: "palette-line" },
  { id: "a3", text: "创建了项目「BoardUI 设计任务」", time: "3 天前", icon: "folder-add-line" },
  { id: "a4", text: "加入了团队设计中心", time: "上周", icon: "team-line" },
];

const ARTIFACTS = [
  { id: "p1", name: "仪表盘套件", type: "模板", hue: 215 },
  { id: "p2", name: "AI 聊天界面", type: "模板", hue: 280 },
  { id: "p3", name: "图标集 Pro", type: "资源", hue: 160 },
  { id: "p4", name: "营销落地页", type: "模板", hue: 32 },
];

/** AI 个人资料模板：封面 + 简介 + 能力 + 作品 */
export function AiProfileTemplate() {
  const [followed, setFollowed] = useState(false);

  return (
    <div className="flex min-h-[620px] w-full flex-col overflow-hidden bui-template-shell rounded-3xl border border-border-component-detail-container bg-background-full">
      {/* 封面 */}
      <div
        className="h-28 w-full shrink-0"
        style={{
          background:
            "linear-gradient(120deg, var(--color-accent-400), var(--color-purple-400) 55%, var(--color-pink-400))",
        }}
      />

      {/* 资料头 */}
      <div className="flex flex-wrap items-end gap-3 px-4">
        <div className="-mt-8 rounded-full ring-4 ring-background-primary-default">
          <Avatar name="张三" size="xl" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 pb-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-headline-medium text-text-primary">张三</h3>
            <Badge variant="pro">Pro</Badge>
            <Badge variant="success">已验证</Badge>
          </div>
          <span className="text-caption-1-regular text-text-secondary">
            虚构个人资料 · 产品设计师
          </span>
        </div>
        <div className="flex items-center gap-2 pb-1">
          <Button
            size="sm"
            variant={followed ? "secondary" : "primary"}
            onClick={() => setFollowed((v) => !v)}
            leading={
              <Icon name={followed ? "check-line" : "user-add-line"} className="size-3.5" />
            }
          >
            {followed ? "已关注" : "关注"}
          </Button>
          <Button size="sm" variant="secondary" aria-label="更多（未配置）" isDisabled>
            <Icon name="more-2-line" className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* 数据条 */}
      <div className="mx-4 mt-3 grid grid-cols-2 @lg:grid-cols-4 gap-2 rounded-2lg bg-background-secondary-default p-2">
        {[
          { label: "作品", v: "24" },
          { label: "关注者", v: followed?"1,201":"1,200" },
          { label: "获赞", v: "8.6k" },
          { label: "使用次数", v: "412" },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span className="text-body-medium tabular-nums text-text-primary">{s.v}</span>
            <span className="text-caption-2-regular text-text-secondary">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <Tabs aria-label="个人资料" defaultSelectedKey="about">
          <TabList>
            <Tab id="about">简介</Tab>
            <Tab id="skills">能力</Tab>
            <Tab id="works">作品</Tab>
          </TabList>

          <TabPanel id="about" className="flex flex-col gap-3 pt-2">
            <p className="text-body-regular leading-relaxed text-text-secondary">
              专注 B 端产品与 AI 原生界面的设计。相信好的动效不是装饰，而是解释界面如何运作的语言。
              目前在维护 BoardUI 组件库的设计系统部分。
            </p>
            <Divider />
            <div className="flex flex-col gap-2">
              <span className="text-caption-2-semibold text-text-tertiary">最近动态</span>
              {ACTIVITY.map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-background-secondary-default text-foreground-icon-secondary">
                    <Icon name={a.icon} className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">
                    {a.text}
                  </span>
                  <span className="shrink-0 text-caption-2-regular text-text-secondary">{a.time}</span>
                </div>
              ))}
            </div>
          </TabPanel>

          <TabPanel id="skills" className="flex flex-col gap-2.5 pt-2">
            {SKILLS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-caption-1-medium text-text-primary">{s.label}</span>
                  <span className="text-[10px] tabular-nums text-text-tertiary">{s.value}%</span>
                </div>
                <Progress value={s.value} size="sm" />
              </div>
            ))}
          </TabPanel>

          <TabPanel id="works" className="grid grid-cols-2 gap-2 pt-2">
            {ARTIFACTS.map((a) => (
              <div
                key={a.id}
                className={cn(
                  "group flex cursor-pointer flex-col gap-1.5 overflow-hidden rounded-xl border border-separator-border",
                  "transition-[border-color,box-shadow] duration-150 ease-out hover:border-border-button-hover hover:shadow-sm"
                )}
              >
                <div
                  className="h-20 w-full"
                  style={{
                    background: `linear-gradient(135deg, hsl(${a.hue} 90% 94%), hsl(${a.hue} 80% 84%))`,
                  }}
                />
                <div className="flex flex-wrap items-center justify-between gap-1 px-2 pb-2">
                  <span className="truncate text-caption-1-medium text-text-primary">
                    {a.name}
                  </span>
                  <span className="shrink-0 text-caption-2-regular text-text-secondary">{a.type}</span>
                </div>
              </div>
            ))}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
