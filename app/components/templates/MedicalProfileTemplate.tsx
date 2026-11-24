"use client";

import { ActivityRings } from "@/app/components/ui/ActivityRings";
import { Meter } from "@/app/components/ui/Meter";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Icon } from "@/app/components/ui/Icon";
import { Button } from "@/app/components/ui/Button";
import { LineChart, BarChart } from "@/app/components/ui/Chart";
import { Divider } from "@/app/components/ui/Divider";
import { cn } from "@/lib/utils";

const VITALS = [
  { label: "心率", value: "72", unit: "bpm", icon: "heart-pulse-line", tone: "text-red-500" },
  { label: "血压", value: "118/76", unit: "mmHg", icon: "pulse-line", tone: "text-accent-500" },
  { label: "体温", value: "36.6", unit: "°C", icon: "temp-hot-line", tone: "text-amber-500" },
  { label: "血氧", value: "98", unit: "%", icon: "lungs-line", tone: "text-lime-600" },
];

const MEDICATIONS = [
  { id: "d1", name: "阿莫西林", dose: "500mg · 每日 3 次", until: "至 12-05", active: true },
  { id: "d2", name: "维生素 D", dose: "1000IU · 每日 1 次", until: "长期", active: true },
  { id: "d3", name: "布洛芬", dose: "200mg · 按需", until: "已停用", active: false },
];

const ALLERGIES = ["青霉素", "花粉", "海鲜"];

const HISTORY = [
  { id: "h1", date: "2026-11-18", title: "常规体检", doctor: "陈医生", dept: "内科" },
  { id: "h2", date: "2026-09-02", title: "上呼吸道感染", doctor: "刘医生", dept: "呼吸科" },
  { id: "h3", date: "2026-05-14", title: "牙科洁治", doctor: "孙医生", dept: "口腔科" },
];

/** 医疗档案模板：患者概览、生命体征、用药、就诊记录 */
export function MedicalProfileTemplate() {
  return (
    <div className="flex min-h-[680px] w-full flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-sidebar">
      <p className="border-b border-separator-border px-4 py-2 text-body-2-regular text-text-secondary">虚构医疗资料，仅用于界面演示；不用于诊疗或风险评估。</p>
      {/* 患者头部 */}
      <header className="flex flex-wrap items-center gap-3 border-b border-separator-border p-4">
        <Avatar name="陈静" size="xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-title-3-semibold text-text-primary">陈静</h3>
            <Badge variant="neutral">女 · 34 岁</Badge>
            <Badge variant="success">A 型血</Badge>
          </div>
          <span className="text-caption-1-regular text-text-tertiary">
            档案号 MR-2026-0842 · 主治医师 陈医生 · 上次就诊 11-18
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button isDisabled size="sm" variant="secondary" leading={<Icon name="file-list-3-line" className="size-3.5" />}>
            导出档案
          </Button>
          <Button isDisabled size="sm" leading={<Icon name="calendar-schedule-line" className="size-3.5" />}>
            预约复诊
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-3 p-4">
        {/* 生命体征 */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {VITALS.map((v) => (
            <div
              key={v.label}
              className="flex flex-col gap-1 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4"
            >
              <div className="flex items-center gap-1.5">
                <Icon name={v.icon} className={cn("size-3.5", v.tone)} />
                <span className="text-caption-2-regular text-text-tertiary">{v.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-title-2-semibold tabular-nums text-text-primary">
                  {v.value}
                </span>
                <span className="text-caption-2-regular text-text-tertiary">{v.unit}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-lime-600">
                <Icon name="arrow-up-line" className="size-2.5" />
                在正常范围
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
          {/* 健康环 */}
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4">
            <span className="self-start text-body-2-medium text-text-primary">今日目标</span>
            <ActivityRings
              size={130}
              values={[
                { value: 78, color: "var(--color-lime-500)" },
                { value: 62, color: "var(--color-accent-500)" },
                { value: 45, color: "var(--color-red-500)" },
              ]}
            />
            <div className="grid w-full grid-cols-3 gap-1 text-center">
              {[
                { label: "步数", v: "7,820" },
                { label: "卡路里", v: "1,240" },
                { label: "睡眠", v: "6.4h" },
              ].map((x) => (
                <div key={x.label} className="flex flex-col">
                  <span className="text-caption-2-regular text-text-tertiary">{x.label}</span>
                  <span className="text-caption-1-semibold tabular-nums text-text-primary">
                    {x.v}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 心率趋势 */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-body-2-medium text-text-primary">近 7 日静息心率</span>
              <span className="text-caption-2-regular text-text-tertiary">平均 71 bpm</span>
            </div>
            <LineChart
              height={110}
              series={[{ data: [68, 72, 70, 74, 71, 69, 72], color: "var(--color-red-500)" }]}
            />
            <Divider />
            <div className="flex flex-col gap-1.5">
              <span className="text-caption-2-semibold text-text-tertiary">本月睡眠时长</span>
              <BarChart
                data={[6.2, 7.1, 6.5, 7.8, 6.9, 8.0, 6.4]}
                height={64}
                color="var(--color-purple-400)"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* 用药 */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4">
            <div className="flex items-center justify-between">
              <span className="text-body-2-medium text-text-primary">当前用药</span>
              <Badge variant="accent">{MEDICATIONS.filter((m) => m.active).length} 项在用</Badge>
            </div>
            <div className="flex flex-col divide-y divide-separator-border">
              {MEDICATIONS.map((m) => (
                <div key={m.id} className="flex items-center gap-2 py-2">
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg",
                      m.active
                        ? "bg-badge-new-background text-accent-600"
                        : "bg-background-secondary-default text-text-tertiary"
                    )}
                  >
                    <Icon name="medicine-bottle-line" className="size-3.5" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-caption-1-medium text-text-primary">
                      {m.name}
                    </span>
                    <span className="truncate text-[10px] text-text-tertiary">{m.dose}</span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-[10px]",
                      m.active ? "text-lime-600" : "text-text-tertiary"
                    )}
                  >
                    {m.until}
                  </span>
                </div>
              ))}
            </div>
            <Divider />
            <div className="flex flex-col gap-1.5">
              <span className="text-caption-2-semibold text-text-tertiary">过敏史</span>
              <div className="flex flex-wrap gap-1">
                {ALLERGIES.map((a) => (
                  <span
                    key={a}
                    className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 就诊记录 */}
          <div className="flex flex-col gap-2 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4">
            <span className="text-body-2-medium text-text-primary">就诊记录</span>
            <div className="flex flex-col">
              {HISTORY.map((h, i) => (
                <div key={h.id} className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent-500" />
                    {i < HISTORY.length - 1 && (
                      <span className="my-0.5 w-px flex-1 bg-separator-border" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-caption-1-medium text-text-primary">{h.title}</span>
                      <span className="shrink-0 text-[10px] tabular-nums text-text-tertiary">
                        {h.date}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-tertiary">
                      {h.dept} · {h.doctor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Divider />
            <div className="flex flex-col gap-1.5">
              <span className="text-caption-2-semibold text-text-tertiary">健康指标</span>
              <Meter label="示例指标 A" value={62} max={100} tone="accent" />
              <Meter label="示例指标 B" value={48} max={100} tone="accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
