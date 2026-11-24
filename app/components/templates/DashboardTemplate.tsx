"use client";

import { useState } from "react";
import { StatCard } from "@/app/components/ui/StatCard";
import { AreaChart, BarList, RadialChart, Heatmap, BarChart } from "@/app/components/ui/Chart";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Icon } from "@/app/components/ui/Icon";
import { Counter } from "@/app/components/ui/Counter";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: "dashboard-line", label: "概览" },
  { icon: "bar-chart-line", label: "分析" },
  { icon: "shopping-bag-line", label: "订单" },
  { icon: "user-line", label: "客户" },
  { icon: "settings-3-line", label: "设置" },
];

const REVENUE = [12, 18, 15, 24, 22, 31, 28, 38, 35, 44, 41, 52];

const ORDERS = [
  { id: "ORD-2841", customer: "张三", amount: "¥1,280", status: "已完成" },
  { id: "ORD-2840", customer: "李四", amount: "¥860", status: "处理中" },
  { id: "ORD-2839", customer: "王五", amount: "¥2,140", status: "已完成" },
  { id: "ORD-2838", customer: "赵六", amount: "¥420", status: "待付款" },
];

/**
 * 仪表盘模板：侧边导航 + 统计卡 + 图表 + 表格。
 * 完整复刻原站 dashboard 模板的视觉结构与信息密度。
 */
export function DashboardTemplate() {
  const [active, setActive] = useState("概览");
  const [count, setCount] = useState(3);

  return (
    <div className="flex min-h-[720px] w-full overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default shadow-card">
      {/* 侧边导航 */}
      <aside className="hidden w-[52px] shrink-0 flex-col items-center gap-1 border-e border-border-primary bg-background-secondary-default p-2 sm:flex">
        <span className="mb-2 flex size-7 items-center justify-center rounded-lg bg-text-primary text-[12px] font-bold text-background-full">
          A
        </span>
        {NAV.map((n) => (
          <button
            key={n.label}
            type="button"
            onClick={() => setActive(n.label)}
            aria-label={n.label}
            className={cn(
              "flex size-8 cursor-pointer items-center justify-center rounded-lg",
              "transition-colors duration-150 ease-out",
              active === n.label
                ? "bg-background-primary-default text-text-primary shadow-xs"
                : "text-foreground-icon-secondary hover:bg-background-tertiary-hover hover:text-text-primary"
            )}
          >
            <Icon name={n.icon} className="size-4" />
          </button>
        ))}
      </aside>

      {/* 主内容 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶栏 */}
        <header className="flex items-center justify-between gap-3 border-b border-border-primary px-4 py-3">
          <div className="flex flex-col">
            <h3 className="text-body-large-medium text-text-primary">概览</h3>
            <span className="text-caption-2-regular text-text-tertiary">2026 年 11 月 · 实时数据</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" leading={<Icon name="download-line" className="size-3.5" />}>
              导出
            </Button>
            <Avatar name="张三" size="sm" />
          </div>
        </header>

        <div className="flex flex-col gap-3 p-4">
          {/* 统计卡 */}
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            <StatCard label="总收入" value="¥128,430" delta="+12.5%" trend="up" icon="money-dollar-circle-line" spark={REVENUE} />
            <StatCard label="订单数" value="1,284" delta="+8.2%" trend="up" icon="shopping-bag-3-line" spark={[8, 12, 10, 16, 14, 19, 22]} />
            <StatCard label="活跃用户" value="8,621" delta="-2.4%" trend="down" icon="user-line" spark={[22, 20, 21, 18, 17, 16, 15]} />
            <StatCard label="转化率" value="3.84%" delta="+0.6%" trend="up" icon="line-chart-line" spark={[2, 2.4, 2.8, 3.1, 3.4, 3.6, 3.84]} />
          </div>

          {/* 主图表 + 环形 */}
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
            <div className="flex flex-col gap-2 rounded-2lg border border-border-button-default p-3 lg:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-body-2-medium text-text-primary">收入趋势</span>
                <span className="text-caption-2-regular text-text-tertiary">近 12 周</span>
              </div>
              <AreaChart data={REVENUE} height={140} gradientId="dash-revenue" />
            </div>

            <div className="flex flex-col items-center justify-center gap-2 rounded-2lg border border-border-button-default p-3">
              <span className="self-start text-body-2-medium text-text-primary">目标完成度</span>
              <RadialChart value={72} size={100} label="72%" />
              <span className="text-caption-2-regular text-text-tertiary">距年终目标还差 ¥32,000</span>
            </div>
          </div>

          {/* 渠道 + 热力图 */}
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <div className="flex flex-col gap-2 rounded-2lg border border-border-button-default p-3">
              <span className="text-body-2-medium text-text-primary">流量来源</span>
              <BarList
                items={[
                  { label: "自然搜索", value: 4820 },
                  { label: "直接访问", value: 3210 },
                  { label: "社交媒体", value: 2140 },
                  { label: "邮件营销", value: 960 },
                ]}
              />
            </div>

            <div className="flex flex-col gap-2 rounded-2lg border border-border-button-default p-3">
              <div className="flex items-center justify-between">
                <span className="text-body-2-medium text-text-primary">活跃热力图</span>
                <span className="text-caption-2-regular text-text-tertiary">近 20 周</span>
              </div>
              <div className="overflow-x-auto pb-1">
                <Heatmap weeks={20} />
              </div>
              <div className="flex items-center gap-1 self-end">
                <span className="text-caption-2-regular text-text-tertiary">少</span>
                {["bg-background-tertiary-default", "bg-lime-200", "bg-lime-300", "bg-lime-500", "bg-lime-700"].map((c) => (
                  <span key={c} className={cn("size-2.5 rounded-[2px]", c)} />
                ))}
                <span className="text-caption-2-regular text-text-tertiary">多</span>
              </div>
            </div>
          </div>

          {/* 最近订单 */}
          <div className="flex flex-col gap-2 rounded-2lg border border-border-button-default p-3">
            <div className="flex items-center justify-between">
              <span className="text-body-2-medium text-text-primary">最近订单</span>
              <div className="flex items-center gap-2">
                <Counter value={count} onChange={setCount} min={1} max={10} />
                <Button size="sm" variant="ghost">查看全部</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-body-2-regular">
                <thead>
                  <tr className="text-caption-1-semibold text-text-secondary">
                    <th className="px-2 py-1.5 text-start font-medium">订单号</th>
                    <th className="px-2 py-1.5 text-start font-medium">客户</th>
                    <th className="px-2 py-1.5 text-start font-medium">金额</th>
                    <th className="px-2 py-1.5 text-start font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.map((o) => (
                    <tr key={o.id} className="border-t border-border-primary">
                      <td className="px-2 py-1.5 font-mono text-caption-1-medium text-text-primary">{o.id}</td>
                      <td className="px-2 py-1.5 text-text-primary">{o.customer}</td>
                      <td className="px-2 py-1.5 tabular-nums text-text-primary">{o.amount}</td>
                      <td className="px-2 py-1.5">
                        <Badge
                          variant={
                            o.status === "已完成" ? "success" : o.status === "处理中" ? "accent" : "warning"
                          }
                        >
                          {o.status}
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
    </div>
  );
}
