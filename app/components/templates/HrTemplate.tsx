"use client";

import { useState } from "react";
import { DemoNotice, TemplateSegments, downloadCsv } from "./TemplateShared";
import { StatCard } from "@/app/components/ui/StatCard";
import { BarList, RadialChart } from "@/app/components/ui/Chart";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Icon } from "@/app/components/ui/Icon";
import { Button } from "@/app/components/ui/Button";
import { Progress } from "@/app/components/ui/Progress";
import { cn } from "@/lib/utils";

type Member = {
  id: string;
  name: string;
  role: string;
  dept: string;
  status: "在职" | "休假" | "试用";
  load: number;
};

const MEMBERS: Member[] = [
  { id: "m1", name: "张三", role: "前端工程师", dept: "产品研发", status: "在职", load: 82 },
  { id: "m2", name: "李四", role: "产品设计师", dept: "设计中心", status: "在职", load: 64 },
  { id: "m3", name: "王五", role: "产品经理", dept: "产品研发", status: "在职", load: 91 },
  { id: "m4", name: "赵六", role: "后端工程师", dept: "产品研发", status: "休假", load: 0 },
  { id: "m5", name: "钱七", role: "数据分析师", dept: "数据团队", status: "试用", load: 47 },
  { id: "m6", name: "孙八", role: "市场专员", dept: "市场营销", status: "在职", load: 73 },
];

const DEPARTMENTS = [
  { id: "1", name: "产品研发", count: 18, lead: "王五" },
  { id: "2", name: "设计中心", count: 7, lead: "李四" },
  { id: "3", name: "数据团队", count: 5, lead: "钱七" },
  { id: "4", name: "市场营销", count: 9, lead: "孙八" },
  { id: "5", name: "运营支持", count: 6, lead: "周九" },
];

/** 人力资源模板：团队概览、成员表、部门分布 */
export function HrTemplate() {
  const [filter, setFilter] = useState<"全部" | "在职" | "休假" | "试用">("全部");
  const shown = filter === "全部" ? MEMBERS : MEMBERS.filter((m) => m.status === filter);

  return (
    <div className="flex min-h-[660px] w-full flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-sidebar">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border-primary px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-title-3-semibold text-text-primary">人力资源团队</h3>
          <span className="text-caption-2-regular text-text-tertiary">
            示例：45 位成员 · 5 个部门
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button isDisabled size="sm" variant="secondary" leading={<Icon name="user-add-line" className="size-3.5" />}>
            邀请成员
          </Button>
          <DemoNotice/>
          <Avatar name="王五" size="sm" />
        </div>
      </header>

      <div className="flex flex-col gap-3 p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="总人数" value="45" delta="+3" trend="up" icon="team-line" spark={[38, 39, 40, 41, 42, 44, 45]} />
          <StatCard label="平均司龄" value="2.4 年" delta="+0.2" trend="up" icon="time-line" spark={[2.0, 2.1, 2.1, 2.2, 2.2, 2.3, 2.4]} />
          <StatCard label="本月入职" value="3" delta="+1" trend="up" icon="user-add-line" />
          <StatCard label="离职率" value="2.1%" delta="-0.8%" trend="down" icon="logout-box-line" spark={[3.2, 3.0, 2.8, 2.6, 2.4, 2.2, 2.1]} />
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-body-2-medium text-text-primary">成员</span>
              <TemplateSegments values={["全部","在职","休假","试用"] as const} value={filter} onChange={setFilter}/>
            </div>

            <div className="flex flex-col divide-y divide-border-primary">
              {shown.map((m) => (
                <div key={m.id} className="flex items-center gap-2.5 py-2">
                  <Avatar name={m.name} size="sm" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-body-2-medium text-text-primary">{m.name}</span>
                    <span className="truncate text-caption-2-regular text-text-tertiary">
                      {m.role} · {m.dept}
                    </span>
                  </div>
                  <div className="hidden w-24 shrink-0 sm:block">
                    <Progress value={m.load} size="sm" />
                  </div>
                  <Badge
                    variant={
                      m.status === "在职" ? "success" : m.status === "休假" ? "neutral" : "accent"
                    }
                  >
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4">
            <span className="text-body-2-medium text-text-primary">部门分布</span>
            <div className="flex justify-center py-1">
              <RadialChart value={40} size={96} label="18/45" />
            </div>
            <BarList
              items={DEPARTMENTS.map((d) => ({ label: d.name, value: d.count }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4">
          <span className="text-body-2-medium text-text-primary">部门负责人</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENTS.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-2 rounded-lg border border-border-primary p-2"
              >
                <Avatar name={d.lead} size="sm" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-caption-1-medium text-text-primary">
                    {d.lead}
                  </span>
                  <span className="truncate text-[10px] text-text-tertiary">
                    {d.name} · {d.count} 人
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
