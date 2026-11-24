"use client";

import { useState } from "react";
import { DemoNotice,TemplateSegments,downloadCsv } from "./TemplateShared";
import { StatCard } from "@/app/components/ui/StatCard";
import { AreaChart, BarList, FunnelChart, Heatmap, LineChart } from "@/app/components/ui/Chart";
import { Badge } from "@/app/components/ui/Badge";
import { Icon } from "@/app/components/ui/Icon";
import { Button } from "@/app/components/ui/Button";
import { Avatar } from "@/app/components/ui/Avatar";

const TRAFFIC = [32, 38, 35, 44, 48, 45, 52, 58, 55, 64, 68, 72];

const CAMPAIGNS = [
  { id: "c1", name: "秋季新品发布", channel: "社交媒体", budget: "¥120,000", roas: "4.2x", status: "进行中" },
  { id: "c2", name: "搜索广告 A/B 测试", channel: "搜索引擎", budget: "¥68,000", roas: "3.8x", status: "进行中" },
  { id: "c3", name: "KOL 合作推广", channel: "内容", budget: "¥45,000", roas: "5.1x", status: "已结束" },
  { id: "c4", name: "邮件唤醒计划", channel: "邮件", budget: "¥12,000", roas: "6.4x", status: "已结束" },
];

/** 营销模板：流量、转化漏斗、渠道 ROI、活动列表 */
export function MarketingTemplate() {
 const [filter,setFilter]=useState<"全部"|"进行中"|"已结束">("全部");
 const rows=CAMPAIGNS.filter(c=>filter==="全部"||c.status===filter);
  return (
    <div className="flex min-h-[680px] w-full flex-col overflow-hidden bui-template-shell rounded-3xl border border-border-component-detail-container bg-background-full">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-separator-border px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-headline-medium text-text-primary">营销</h3>
          <span className="text-caption-2-regular text-text-tertiary">
            示例季度 4 个活动 · 总预算 ¥245,000
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Avatar name="李四" size="sm" />
          <Button size="sm" onPress={()=>downloadCsv("campaigns.csv",[["活动","渠道","预算","ROAS","状态"],...rows.map(c=>[c.name,c.channel,c.budget,c.roas,c.status])])} leading={<Icon name="download-line" className="size-3.5" />}>
            导出活动
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-3 p-4">
        <div className="grid min-w-0 grid-cols-1 gap-3 @sm:grid-cols-2 @3xl:grid-cols-4">
          <StatCard className="border-transparent bg-background-secondary-default shadow-none" label="访问量" value="284,620" delta="+24.3%" trend="up" icon="eye-line" spark={TRAFFIC} />
          <StatCard className="border-transparent bg-background-secondary-default shadow-none" label="获客成本" value="¥42.80" delta="-8.6%" trend="down" icon="money-cny-circle-line" spark={[52, 50, 48, 47, 45, 44, 43]} />
          <StatCard className="border-transparent bg-background-secondary-default shadow-none" label="广告回报" value="4.6x" delta="+0.8x" trend="up" icon="funds-line" spark={[3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6]} />
          <StatCard className="border-transparent bg-background-secondary-default shadow-none" label="转化率" value="4.82%" delta="+0.9%" trend="up" icon="percent-line" spark={[3.2, 3.6, 3.9, 4.1, 4.4, 4.6, 4.82]} />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 @3xl:grid-cols-3">
          <div className="flex flex-col gap-2 min-w-0 rounded-2xl bg-background-secondary-default p-4 @3xl:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-body-2-medium text-text-primary">流量趋势</span>
              <div className="flex items-center gap-2 text-caption-2-regular text-text-tertiary">
                <span className="flex items-center gap-1">
                  <span className="h-0.5 w-3 rounded bg-accent-500" />
                  自然流量
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-0.5 w-3 rounded bg-purple-500" />
                  投放流量
                </span>
              </div>
            </div>
            <LineChart
              height={140}
              series={[
                { data: TRAFFIC, color: "var(--color-accent-500)" },
                { data: TRAFFIC.map((v) => v * 0.62), color: "var(--color-purple-500)" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2 min-w-0 rounded-2xl bg-background-secondary-default p-4">
            <span className="text-body-2-medium text-text-primary">转化漏斗</span>
            <FunnelChart
              steps={[
                { label: "曝光", value: 28460 },
                { label: "点击", value: 8420 },
                { label: "加购", value: 2140 },
                { label: "下单", value: 862 },
                { label: "支付", value: 412 },
              ]}
            />
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 @2xl:grid-cols-2">
          <div className="flex flex-col gap-2 min-w-0 rounded-2xl bg-background-secondary-default p-4">
            <span className="text-body-2-medium text-text-primary">渠道 ROI</span>
            <BarList
              items={[
                { label: "邮件", value: 640, color: "var(--color-lime-500)" },
                { label: "内容", value: 510, color: "var(--color-teal-500)" },
                { label: "社交", value: 420, color: "var(--color-accent-500)" },
                { label: "搜索", value: 380, color: "var(--color-purple-500)" },
                { label: "展示", value: 180, color: "var(--color-amber-500)" },
              ]}
            />
          </div>

          <div className="flex flex-col gap-2 min-w-0 rounded-2xl bg-background-secondary-default p-4">
            <div className="flex items-center justify-between">
              <span className="text-body-2-medium text-text-primary">内容发布密度</span>
              <span className="text-caption-2-regular text-text-tertiary">近 16 周</span>
            </div>
            <div className="overflow-x-auto pb-1">
              <Heatmap weeks={16} seed={3} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-0 rounded-2xl bg-background-secondary-default p-4">
          <div className="flex items-center justify-between">
            <span className="text-body-2-medium text-text-primary">活动列表</span>
            <TemplateSegments values={["全部","进行中","已结束"] as const} value={filter} onChange={setFilter}/>
          </div>
          <div className="min-w-0 overflow-x-auto overscroll-x-contain">
            <table className="bui-table bui-table-sm">
              <thead>
                <tr className="text-caption-1-semibold text-text-secondary">
                  <th className="px-2 py-1.5 text-start font-medium">活动</th>
                  <th className="px-2 py-1.5 text-start font-medium">渠道</th>
                  <th className="px-2 py-1.5 text-end font-medium">预算</th>
                  <th className="px-2 py-1.5 text-end font-medium">ROAS</th>
                  <th className="px-2 py-1.5 text-start font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} className="border-t border-separator-border">
                    <td className="px-2 py-1.5 text-text-primary">{c.name}</td>
                    <td className="px-2 py-1.5 text-text-secondary">{c.channel}</td>
                    <td className="px-2 py-1.5 text-end tabular-nums text-text-primary">{c.budget}</td>
                    <td className="px-2 py-1.5 text-end tabular-nums text-lime-600">{c.roas}</td>
                    <td className="px-2 py-1.5">
                      <Badge variant={c.status === "进行中" ? "accent" : "neutral"}>
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
