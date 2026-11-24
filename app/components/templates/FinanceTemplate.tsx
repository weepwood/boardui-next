"use client";

import { useState } from "react";
import { DemoNotice, TemplateSegments, downloadCsv } from "./TemplateShared";
import { StatCard } from "@/app/components/ui/StatCard";
import { AreaChart, BarChart, RadialChart, BarList } from "@/app/components/ui/Chart";
import { Badge } from "@/app/components/ui/Badge";
import { Icon } from "@/app/components/ui/Icon";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/lib/utils";

const CASH_FLOW = [42, 48, 45, 52, 58, 55, 62, 68, 66, 74, 79, 85];

const TRANSACTIONS = [
  { id: "TX-9821", name: "Stripe 结算", category: "收入", amount: "+¥86,420", date: "11-22", status: "已完成" },
  { id: "TX-9820", name: "AWS 服务费", category: "基础设施", amount: "-¥12,840", date: "11-21", status: "已完成" },
  { id: "TX-9819", name: "团队订阅", category: "软件", amount: "-¥3,260", date: "11-21", status: "已完成" },
  { id: "TX-9818", name: "客户预付款", category: "收入", amount: "+¥42,000", date: "11-20", status: "处理中" },
  { id: "TX-9817", name: "办公场地", category: "运营", amount: "-¥28,000", date: "11-18", status: "已完成" },
];

/** 财务模板：现金流、收支结构、交易明细 */
export function FinanceTemplate() {
  const [range, setRange] = useState<"月" | "季" | "年">("月");

  return (
    <div className="flex min-h-[680px] w-full flex-col overflow-hidden bui-template-shell rounded-3xl border border-border-component-detail-container bg-background-full">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-separator-border px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-headline-medium text-text-primary">财务</h3>
          <span className="text-caption-2-regular text-text-tertiary">2026 财年 · 示例数据</span>
        </div>
        <div className="flex items-center gap-2">
          <TemplateSegments values={["月","季","年"] as const} value={range} onChange={setRange}/>
          <Button onPress={()=>downloadCsv("transactions.csv",[["编号","名称","分类","金额","日期","状态"],...TRANSACTIONS.map(t=>[t.id,t.name,t.category,t.amount,t.date,t.status])])} size="sm" variant="secondary" leading={<Icon name="download-line" className="size-3.5" />}>
            导出报表
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-3 p-4">
        <div className="grid min-w-0 grid-cols-1 gap-3 @sm:grid-cols-2 @3xl:grid-cols-4">
          <StatCard label="营业收入" value="¥2,486,320" delta="+18.4%" trend="up" icon="line-chart-line" spark={CASH_FLOW} />
          <StatCard label="运营支出" value="¥1,142,800" delta="+6.2%" trend="up" icon="wallet-3-line" spark={[30, 32, 31, 36, 34, 38, 40]} />
          <StatCard label="净利润" value="¥1,343,520" delta="+21.7%" trend="up" icon="money-dollar-circle-line" spark={[20, 24, 26, 28, 32, 36, 42]} />
          <StatCard label="应收账款" value="¥384,200" delta="-4.1%" trend="down" icon="file-list-3-line" spark={[45, 43, 44, 41, 40, 38, 36]} />
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 @3xl:grid-cols-3">
          <div className="flex flex-col gap-2 bui-template-panel min-w-0 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4 @3xl:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-body-2-medium text-text-primary">现金流趋势</span>
              <span className="text-caption-2-regular text-text-tertiary">{range==="月"?"月度样本":range==="季"?"季度样本":"年度样本"}</span>
            </div>
            <AreaChart data={range==="月"?CASH_FLOW.slice(-4):range==="季"?CASH_FLOW.filter((_,i)=>i%3===2):CASH_FLOW} height={150} gradientId="fin-cash" />
          </div>

          <div className="flex flex-col items-center justify-center gap-2 bui-template-panel min-w-0 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4">
            <span className="self-start text-body-2-medium text-text-primary">毛利率</span>
            <RadialChart value={54} size={110} label="54%" color="var(--color-lime-500)" />
            <span className="text-caption-2-regular text-text-tertiary">行业平均 42%</span>
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-3 @2xl:grid-cols-2">
          <div className="flex flex-col gap-2 bui-template-panel min-w-0 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4">
            <span className="text-body-2-medium text-text-primary">月度收支</span>
            <BarChart data={[62, 48, 71, 55, 80, 63, 88, 72]} height={130} />
            <div className="flex items-center gap-3 text-caption-2-regular text-text-tertiary">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm bg-accent-500" />
                收入
              </span>
              <span>支出约为收入的 46%</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 bui-template-panel min-w-0 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4">
            <span className="text-body-2-medium text-text-primary">支出结构</span>
            <BarList
              items={[
                { label: "人力成本", value: 620 },
                { label: "基础设施", value: 240 },
                { label: "市场推广", value: 168 },
                { label: "办公运营", value: 84 },
                { label: "其他", value: 30 },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 bui-template-panel min-w-0 rounded-2xl border border-border-component-detail-container bg-background-primary-default p-4">
          <div className="flex items-center justify-between">
            <span className="text-body-2-medium text-text-primary">交易明细</span>
            <DemoNotice/>
          </div>
          <div className="min-w-0 overflow-x-auto overscroll-x-contain">
            <table className="bui-table bui-table-sm">
              <thead>
                <tr className="text-caption-1-semibold text-text-secondary">
                  <th className="px-2 py-1.5 text-start font-medium">编号</th>
                  <th className="px-2 py-1.5 text-start font-medium">名称</th>
                  <th className="px-2 py-1.5 text-start font-medium">分类</th>
                  <th className="px-2 py-1.5 text-end font-medium">金额</th>
                  <th className="px-2 py-1.5 text-start font-medium">日期</th>
                  <th className="px-2 py-1.5 text-start font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {TRANSACTIONS.map((t) => (
                  <tr key={t.id} className="border-t border-separator-border">
                    <td className="px-2 py-1.5 font-mono text-caption-1-medium text-text-primary">{t.id}</td>
                    <td className="px-2 py-1.5 text-text-primary">{t.name}</td>
                    <td className="px-2 py-1.5 text-text-secondary">{t.category}</td>
                    <td
                      className={cn(
                        "px-2 py-1.5 text-end tabular-nums",
                        t.amount.startsWith("+") ? "text-red-600" : "text-text-primary"
                      )}
                    >
                      {t.amount}
                    </td>
                    <td className="px-2 py-1.5 text-text-tertiary">{t.date}</td>
                    <td className="px-2 py-1.5">
                      <Badge variant={t.status === "已完成" ? "success" : "warning"}>
                        {t.status}
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
