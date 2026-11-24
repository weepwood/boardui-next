"use client";

import { useState } from "react";
import { DemoNotice, TemplateSegments, downloadCsv, analyticsPanel, analyticsGrid, AnalyticsSectionHeading } from "./TemplateShared";
import { StatCard } from "@/app/components/ui/StatCard";
import { BarList, RadialChart, Heatmap, BarChart } from "@/app/components/ui/Chart";
import { Avatar } from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Icon } from "@/app/components/ui/Icon";
import { NavigationItem } from "@/packages/react/navigation";
import { Counter } from "@/app/components/ui/Counter";
import { ChartArea } from "@/app/components/ui/ChartArea";
import { ChartDataInspector } from "@/app/components/ui/ChartDataInspector";
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
  const [hirePage,setHirePage]=useState(0),[range,setRange]=useState<"周"|"月"|"年">("周");
  const hires=[["李四","前端工程师"],["王五","产品经理"],["赵六","设计师"],["钱七","测试工程师"],["孙八","后端工程师"],["周九","运营"]];

  const sample=REVENUE.slice(range==="周"?-4:range==="月"?-8:-12);
  const records=sample.map((value,i)=>({label:"样本 "+(REVENUE.length-sample.length+i+1),value:value*1000}));
  return (
    <div className="flex min-h-[720px] w-full overflow-hidden bui-template-shell rounded-3xl border border-border-component-detail-container bg-background-full">
      {/* 侧边导航 */}
      <aside className="hidden w-[60px] shrink-0 flex-col items-stretch gap-1 bg-background-secondary-default p-2 @sm:flex">
        <span className="mb-2 flex size-7 items-center justify-center rounded-lg bg-text-primary text-[12px] font-bold text-background-full">
          A
        </span>
        {NAV.map(n=><NavigationItem key={n.label} label={n.label} icon={n.icon} active={active===n.label} collapsed onClick={()=>setActive(n.label)}/>)}
      </aside>

      {/* 主内容 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 顶栏 */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-separator-border px-4 py-3">
          <div className="flex flex-col">
            <h3 className="text-headline-medium text-text-primary">{active}</h3><select className="max-w-full rounded-lg border border-border-button-default bg-background-primary-default p-1 text-body-2-regular @sm:hidden" aria-label="切换仪表盘视图" value={active} onChange={e=>setActive(e.target.value)}>{NAV.map(n=><option key={n.label}>{n.label}</option>)}</select>
            <span className="text-caption-2-regular text-text-tertiary">2026 年 11 月 · 演示数据</span>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Button onPress={()=>downloadCsv("orders.csv",[["订单号","客户","金额","状态"],...ORDERS.map(o=>[o.id,o.customer,o.amount,o.status])])} size="sm" variant="secondary" leading={<Icon name="download-line" className="size-3.5" />}>
              导出
            </Button>
            <DemoNotice/>
            <Avatar name="张三" size="sm" />
          </div>
        </header>

        <div className="flex min-w-0 flex-col gap-3 p-3 @lg:p-4">
          {/* 统计卡 */}
          <div className={analyticsGrid}>
            <StatCard className="border-transparent bg-background-secondary-default shadow-none" label="总收入" value="¥128,430" delta="+12.5%" trend="up" icon="money-dollar-circle-line" spark={REVENUE} />
            <StatCard className="border-transparent bg-background-secondary-default shadow-none" label="订单数" value="1,284" delta="+8.2%" trend="up" icon="shopping-bag-3-line" spark={[8, 12, 10, 16, 14, 19, 22]} />
            <StatCard className="border-transparent bg-background-secondary-default shadow-none" label="活跃用户" value="8,621" delta="-2.4%" trend="down" icon="user-line" spark={[22, 20, 21, 18, 17, 16, 15]} />
            <StatCard className="border-transparent bg-background-secondary-default shadow-none" label="转化率" value="3.84%" delta="+0.6%" trend="up" icon="line-chart-line" spark={[2, 2.4, 2.8, 3.1, 3.4, 3.6, 3.84]} />
          </div>

          {/* 首屏：核心指标之后为主要分析图表 */}
          <div className="grid min-w-0 grid-cols-1 gap-3 @3xl:grid-cols-3">
            <div className={cn(analyticsPanel,"@3xl:col-span-2")}>
              <AnalyticsSectionHeading title="收入趋势" description="近 12 周 · 单位：元"/>
              <ChartArea series={[{name:"收入",data:REVENUE.map(v=>v*1000),color:"var(--color-accent-500)"}]} labels={REVENUE.map((_,i)=>String(i+1))} height={196} stacked={false}/>
            </div>

            <div className={cn(analyticsPanel,"items-center justify-center")}>
              <span className="self-start text-body-2-medium text-text-primary">目标完成度</span>
              <RadialChart value={72} size={126} label="72%" />
              <span className="text-caption-2-regular text-text-tertiary">距年终目标还差 ¥32,000</span>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 @2xl:grid-cols-2">
          <section className={analyticsPanel}>
            <div className="flex flex-wrap items-start justify-between gap-2"><div><h4 className="text-body-medium text-text-primary">至今已赚到</h4><p className="text-title-1-medium tabular-nums text-text-primary">¥{(sample.reduce((a,b)=>a+b,0)*1000).toLocaleString("en-US")}</p><p className="text-caption-1-regular text-text-secondary">最近 {sample.length} 个收入样本</p></div><TemplateSegments values={["周","月","年"] as const} value={range} onChange={setRange}/></div>
            <ChartDataInspector records={records} resetKey={range}>{active=><BarChart color="var(--color-chart-2-active)" data={sample} activeIndex={active} height={130}/>}</ChartDataInspector>
          </section>
            <section className={analyticsPanel}><div><AnalyticsSectionHeading title="最近的招聘" description={hires.length+" 位候选人 · 第 "+(hirePage+1)+"/3 批"}/></div><div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">{hires.slice(hirePage*2,hirePage*2+2).map(([name,role])=><div key={name} className="flex min-w-0 flex-col gap-2 rounded-xl bg-background-primary-default p-3"><div className="flex items-center gap-2"><Avatar name={name} size="md"/><span className="text-body-medium text-text-primary">{name}</span></div><span className="rounded-md bg-background-secondary-default p-1 text-center text-caption-1-regular text-text-secondary">{role}</span></div>)}</div><div className="flex gap-2"><Button size="sm" variant="secondary" className="flex-1" isDisabled={hirePage===0} onPress={()=>setHirePage(p=>p-1)}>上一批</Button><Button size="sm" variant="secondary" className="flex-1" isDisabled={hirePage>=2} onPress={()=>setHirePage(p=>p+1)}>下一批</Button></div></section>
          </div>

          {/* 渠道 + 热力图 */}
          <div className="grid min-w-0 grid-cols-1 gap-3 @2xl:grid-cols-2">
            <div className={analyticsPanel}>
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

            <div className={analyticsPanel}>
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
          <div className={analyticsPanel}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <AnalyticsSectionHeading title="最近订单" description={"显示 "+count+" / "+ORDERS.length+" 条"}/>
              <div className="flex items-center gap-2">
                <Counter value={count} onChange={setCount} min={1} max={ORDERS.length} />
                <Button size="sm" variant="ghost" onPress={()=>setCount(ORDERS.length)}>查看全部</Button>
              </div>
            </div>
            <div className="min-w-0 overflow-x-auto overscroll-x-contain" tabIndex={0} role="region" aria-label="最近订单表格">
              <table className="bui-table bui-table-sm">
                <thead>
                  <tr className="text-caption-1-semibold text-text-secondary">
                    <th className="px-2 py-1.5 text-start font-medium">订单号</th>
                    <th className="px-2 py-1.5 text-start font-medium">客户</th>
                    <th className="px-2 py-1.5 text-end font-medium">金额</th>
                    <th className="px-2 py-1.5 text-start font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {ORDERS.slice(0,count).map((o) => (
                    <tr key={o.id} className="border-t border-separator-border">
                      <td className="px-2 py-1.5 font-mono text-caption-1-medium text-text-primary">{o.id}</td>
                      <td className="px-2 py-1.5 text-text-primary">{o.customer}</td>
                      <td className="px-2 py-1.5 text-end tabular-nums text-text-primary">{o.amount}</td>
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
