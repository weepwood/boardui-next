"use client";

import {useState} from "react";
import {SegmentedControl} from "./SegmentedControl";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { ChartArea, ChartLegend, type Series } from "./ChartArea";
import { BarChart, BarList, RadarChart, Heatmap, FunnelChart, FunnelLegend } from "./Chart";
import { RadialRings } from "./RadialRings";
import { BarListCard } from "./BarListCard";
import { SankeyChart, ScatterChart, ComboChart, OrdersBars } from "./ChartExtra";
import {ChartDataInspector,type ChartDatum} from "./ChartDataInspector";
import { ActivityRings } from "./ActivityRings";

export type ChartCardKind =
  | "area" | "line" | "bar" | "bar-list" | "radial" | "radar" | "heatmap"
  | "funnel" | "sankey" | "scatter" | "combo" | "rings" | "sleep" | "steps"
  | "contributions" | "active-days" | "orders" | "revenue" | "earnings" | "stage-bars";

export type ChartCardProps = {
  kind: ChartCardKind;
  title: string;
  subtitle?: string;
  value?: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon?: string;
  className?: string;
  height?: number;
  /** Local sample time range selector for monthly chart series. */
  periodFilter?: boolean;
  /** External data for area/line charts. */
  data?:{labels:string[];series:Series[]};
  /** Named records for bar, radar, radial, heatmap and scatter charts. Scatter uses x/y coordinates. */
  records?:ChartDatum[];
};

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月"];

/** 各图表的默认数据 */
const AREA_SERIES: Series[] = [
  { name: "有机", data: [3400, 4100, 3800, 4600, 4200, 5200, 4900, 5600], color: "var(--color-lime-500)" },
  { name: "推荐", data: [2600, 3100, 2900, 3600, 3300, 4200, 3900, 4600], color: "var(--color-accent-500)" },
  { name: "其他", data: [1800, 2200, 2000, 2600, 2400, 3000, 2800, 3200], color: "var(--color-purple-500)" },
];

/** 径向图数据：与原生图例一一对应 */
const RADIAL_ITEMS = [
  { name: "铬镀", value: 275, color: "var(--color-amber-400)" },
  { name: "狩猎之旅", value: 200, color: "var(--color-pink-400)" },
  { name: "火狐浏览器", value: 187, color: "var(--color-purple-400)" },
  { name: "边缘", value: 173, color: "var(--color-accent-500)" },
  { name: "其他", value: 90, color: "var(--color-lime-500)" },
];

const LEGEND = [
  { name: "有机", value: "50,500", color: "var(--color-lime-500)" },
  { name: "推荐", value: "25,900", color: "var(--color-accent-500)" },
  { name: "其他", value: "18,300", color: "var(--color-purple-500)" },
];

/** 卡片外壳：与 StatCard 同一视觉语言 */
function Card({
  title, subtitle, value, delta, trend = "up", children, className, controls, hideHeader=false,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  children: React.ReactNode;
  controls?: React.ReactNode;
  hideHeader?:boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // 实测原站：576×365，16px 圆角，浅灰底，padding 16/16/12，无边框无阴影，gap 16
        "flex w-full flex-col gap-4 rounded-2xl",
        "bg-background-secondary-default px-4 pt-4 pb-3",
        className
      )}
    >
      {!hideHeader&&<div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-body-medium text-text-secondary">{title}</span>{controls}</div>
        {(value || delta) && (
          <div className="flex items-center gap-2">
            {value && (
              <span className="text-title-1-medium tabular-nums text-text-primary">{value}</span>
            )}
            {delta && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5",
                  "text-body-medium",
                  trend === "up"
                    ? "bg-lime-200 text-lime-800 dark:bg-lime-950 dark:text-lime-300"
                    : trend === "down"
                      ? "bg-red-200 text-red-800 dark:bg-red-950 dark:text-red-300"
                      : "bg-background-secondary-default text-text-secondary"
                )}
              >
                {delta}
              </span>
            )}
          </div>
        )}
        {subtitle && !value && (
          <span className="text-caption-1-regular text-text-tertiary">{subtitle}</span>
        )}
      </div>}
      {children}
    </div>
  );
}

/**
 * 通用图表卡片：20 种图表类型。
 * 折线/面积类使用 ChartArea（含网格、双轴、图例），其余复用基础图表。
 */
export function ChartCard({ kind, height = 196, periodFilter=false, data, records, ...rest }: ChartCardProps) {
  const { title, subtitle, value, delta, trend, className } = rest;
  void rest.icon;
  const [period,setPeriod]=useState("8");
  const [hidden,setHidden]=useState<string[]>([]);
  const toggle=(name:string)=>setHidden(p=>p.includes(name)?p.filter(n=>n!==name):[...p,name]);
  const showPeriods=periodFilter&&["area","line","earnings","orders","revenue"].includes(kind);
  const sourceSeries=data?.series??AREA_SERIES;
  const sourceLabels=data?.labels??MONTHS;
  const range=showPeriods?Number(period):sourceLabels.length;
  const months=sourceLabels.slice(Math.max(0,sourceLabels.length-range));
  const windowSeries=(series:Series[])=>series.map(s=>({...s,data:s.data.slice(Math.max(0,sourceLabels.length-range),sourceLabels.length)}));
  const format=(n:number)=>n.toLocaleString("en-US");
  const all=windowSeries(sourceSeries);
  const shown=all.filter(s=>!hidden.includes(s.name));
  const sum=(s:Series)=>s.data.reduce((a,b)=>a+(Number.isFinite(b)?b:0),0);
  const displayLegend=all.map(s=>({name:s.name,color:s.color,value:format(sum(s))}));
  const orderRows=(records??MONTHS.map((label,i)=>({label,value:[1680,1740,1920,1850,2040,2110,2290,2180][i],secondary:[1510,1480,1650,1620,1710,1760,1840,1890][i]}))).filter(r=>Number.isFinite(r.value)&&r.value>=0&&Number.isFinite(r.secondary)&&r.secondary!>=0).slice(showPeriods?-range:0);
  const orderTotal=orderRows.reduce((n,r)=>n+r.value,0);
  const orderPrevious=orderRows.reduce((n,r)=>n+(r.secondary??0),0);
  const total=["area","line"].includes(kind)?format(shown.reduce((n,s)=>n+sum(s),0)):kind==="orders"?format(orderTotal):value;

  const sample=(rows:ChartDatum[])=>records??rows;
  const prepare=(rows:ChartDatum[],predicate:(r:ChartDatum)=>boolean=()=>true)=>rows.filter(r=>Number.isFinite(r.value)&&predicate(r));
  const radar=prepare(sample(["速度","体积","复用","文档","无障碍"].map((label,i)=>({label,value:[85,62,78,90,72][i]}))),r=>r.value>=0&&r.value<=100);
  const radial=prepare(sample(RADIAL_ITEMS.map(r=>({label:r.name,value:r.value,color:r.color}))),r=>r.value>=0);
  const scatter=prepare(sample([[12,24],[18,32],[24,28],[30,44],[38,40],[44,52],[52,48],[58,62],[65,56],[72,70],[80,66],[88,78]].map(([x,y],i)=>({label:"样本 "+(i+1),value:y,x,y}))),r=>Number.isFinite(r.x)&&Number.isFinite(r.y));
  const bars=prepare(sample([42,58,36,64,48,72,55].map((value,i)=>({label:"第 "+(i+1)+" 期",value}))));
  const heat=prepare(sample(Array.from({length:16*7},(_,i)=>({label:"第 "+(Math.floor(i/7)+1)+" 周 第 "+(i%7+1)+" 天",value:Math.floor(Math.abs(Math.sin((i+7)*1.7))*5)}))),r=>r.value>=0);
  const colors=["var(--color-amber-400)","var(--color-pink-400)","var(--color-purple-400)","var(--color-accent-500)","var(--color-lime-500)"];
  const periodControls=showPeriods?<SegmentedControl value={period} onChange={setPeriod} size="sm" options={[{id:"4",label:"近4月"},{id:"8",label:"近8月"}]}/>:undefined;
  if(kind==="orders"){
    return <Card title={title} className={className} hideHeader>
      <ChartDataInspector resetKey={period} records={orderRows} seriesLabels={["今年","去年"]} renderSummary={row=>{
        const current=row?.value??orderTotal, previous=row?.secondary??orderPrevious;
        const percent=previous?Math.round((current-previous)/previous*1000)/10:null;
        const change=percent===null?(current?"新增":"—"):(percent>0?"+":"")+percent+"%";
        return <div className="flex min-w-0 flex-col gap-3 pb-2" data-orders-summary>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1"><p className="text-body-medium text-text-secondary" data-orders-label>{row?.label??title}</p>
              <div className="flex flex-wrap items-center gap-2 pt-1"><span data-orders-value className="text-title-1-medium tabular-nums text-text-primary">{format(current)}</span>
                <span data-orders-delta className={cn("rounded-md px-1.5 py-0.5 text-caption-1-medium tabular-nums",percent!==null&&percent>0?"bg-lime-200 text-lime-800 dark:bg-lime-950 dark:text-lime-300":percent!==null&&percent<0?"bg-red-200 text-red-800 dark:bg-red-950 dark:text-red-300":"bg-background-tertiary-default text-text-secondary")}>{change}</span>
              </div>
              <p data-orders-previous className="pt-1 text-body-2-regular tabular-nums text-text-secondary">去年同期 {format(previous)}</p>
            </div>{periodControls}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3 text-caption-1-medium text-text-secondary"><span className="flex items-center gap-1.5"><i className="size-2 shrink-0 rounded-full bg-chart-9-active"/>今年</span><span className="flex items-center gap-1.5"><i className="size-2 shrink-0 rounded-full bg-chart-neutral"/>去年</span></div>
        </div>
      }}>{active=><OrdersBars rows={orderRows} height={height} activeIndex={active}/>}</ChartDataInspector>
    </Card>;
  }
  const body = (() => {
    switch (kind) {
      case "area":
        return (
          <>
            <ChartArea series={shown} labels={months} height={height} />
            <ChartLegend items={displayLegend} hidden={hidden} onToggle={toggle}/>
          </>
        );
      case "line":
        return (
          <>
            <ChartArea series={shown} labels={months} height={height} stacked={false} showFill={false} />
            <ChartLegend items={displayLegend} hidden={hidden} onToggle={toggle}/>
          </>
        );
      case "revenue":
        return (
          <>
            <ChartArea
              series={windowSeries([{ name: "营收", data: [30, 42, 38, 55, 48, 68, 62, 82].map((v) => v * 1000), color: "var(--color-lime-500)" }])}
              labels={months}
              height={height}
            />
          </>
        );
      case "earnings":
        return (
          <ChartArea
            series={windowSeries([{ name: "收入", data: [22, 30, 28, 42, 38, 56, 50, 68].map((v) => v * 800), color: "var(--color-accent-500)" }])}
            labels={months}
            height={height}
          />
        );
      case "steps":
        return (
          <ChartArea
            series={[{ name: "步数", data: [4200, 6800, 5200, 9100, 7400, 8600, 7820, 8100], color: "var(--color-lime-500)" }]}
            labels={["一", "二", "三", "四", "五", "六", "日", ""]}
            height={height}
            yTicks={3}
          />
        );
      case "sleep":
        return (
          <ChartArea
            series={[{ name: "睡眠", data: [6.2, 7.1, 6.5, 7.8, 6.9, 8.0, 6.4, 7.2].map((v) => v * 60), color: "var(--color-purple-500)" }]}
            labels={["一", "二", "三", "四", "五", "六", "日", ""]}
            height={height}
            yTicks={3}
          />
        );
      case "bar":
        return <ChartDataInspector records={bars}>{active=><BarChart data={bars.map(r=>r.value)} activeIndex={active} height={height}/>}</ChartDataInspector>;
      case "bar-list":
        return (
          <BarListCard
            tabs={[
              {
                id: "device",
                label: "设备",
                rows: [
                  { name: "桌面", value: 390, icon: "computer-line" },
                  { name: "手机", value: 198, icon: "smartphone-line" },
                  { name: "平板电脑", value: 51, icon: "tablet-line" },
                ],
              },
              {
                id: "browser",
                label: "浏览器",
                rows: [
                  { name: "铬镀", value: 420, icon: "global-line" },
                  { name: "火狐", value: 168, icon: "firefox-line" },
                  { name: "狩猎之旅", value: 96, icon: "safari-line" },
                ],
              },
              {
                id: "os",
                label: "操作系统",
                rows: [
                  { name: "Windows", value: 380, icon: "windows-line" },
                  { name: "macOS", value: 210, icon: "apple-line" },
                  { name: "Linux", value: 62, icon: "terminal-box-line" },
                ],
              },
            ]}
          />
        );
      case "radial":
        return <ChartDataInspector records={radial}>{active=><><div className="flex justify-center py-2"><RadialRings items={radial.map((r,i)=>({name:r.label,value:r.value,color:r.color??colors[i%colors.length]}))} activeIndex={active} size={Math.max(140,height-40)}/></div><FunnelLegend items={radial.map((r,i)=>({name:r.label,value:String(r.value),color:r.color??colors[i%colors.length]}))}/></>}</ChartDataInspector>;
      case "radar":
        return <ChartDataInspector records={radar}>{active=><div className="flex justify-center"><RadarChart axes={radar.map(r=>r.label)} values={radar.map(r=>r.value)} size={height+40} activeIndex={active}/></div>}</ChartDataInspector>;
      case "heatmap":
        return <ChartDataInspector records={heat}>{active=><div className="overflow-x-auto p-1"><Heatmap values={heat.map(r=>r.value)} activeIndex={active}/></div>}</ChartDataInspector>;
      case "contributions":
        return (
          <div role="region" aria-label="贡献记录滚动区域" tabIndex={0} className="overflow-x-auto pb-1 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring">
            <Heatmap weeks={20} seed={11} />
          </div>
        );
      case "funnel":
        return (
          <>
            <FunnelChart
              height={height - 40}
              steps={[
                { label: "链接已打开", value: 197 },
                { label: "开始", value: 110 },
                { label: "已完成", value: 77 },
                { label: "已转换", value: 38 },
              ]}
            />
            <FunnelLegend
              items={[
                { name: "链接已打开", value: "197", color: "var(--color-lime-500)" },
                { name: "开始", value: "110", color: "var(--color-accent-500)" },
                { name: "已完成", value: "77", color: "var(--color-purple-500)" },
                { name: "已转换", value: "38", color: "var(--color-pink-500)" },
              ]}
            />
          </>
        );
      case "sankey":
        return (
          <SankeyChart
            height={height - 30}
            nodes={[
              { id: "a", label: "搜索", layer: 0, value: 50 },
              { id: "b", label: "社交", layer: 0, value: 30 },
              { id: "c", label: "首页", layer: 1, value: 45 },
              { id: "d", label: "详情", layer: 1, value: 35 },
              { id: "e", label: "下单", layer: 2, value: 40 },
              { id: "f", label: "流失", layer: 2, value: 40 },
            ]}
            links={[
              { from: "a", to: "c", value: 60 },
              { from: "a", to: "d", value: 40 },
              { from: "b", to: "c", value: 30 },
              { from: "b", to: "d", value: 30 },
              { from: "c", to: "e", value: 50 },
              { from: "c", to: "f", value: 40 },
              { from: "d", to: "e", value: 30 },
            ]}
          />
        );
      case "scatter":
        return <ChartDataInspector records={scatter}>{active=><ScatterChart points={scatter.map(r=>({x:r.x!,y:r.y!,color:r.color}))} color="var(--color-lime-500)" activeIndex={active} height={height-20}/>}</ChartDataInspector>;
      case "combo":
        return <ChartDataInspector records={bars.map((r,i)=>({...r,secondary:records?r.secondary??r.value:[24,38,32,52,44,66,58][i]}))}>{active=><ComboChart bars={bars.map(r=>r.value)} line={records?bars.map(r=>r.secondary??r.value):[24,38,32,52,44,66,58]} activeIndex={active} height={height-30}/>}</ChartDataInspector>;
      case "rings":
        return (
          <>
            <FunnelLegend
              items={[
                { name: "移动", value: "1,592 kcal", color: "var(--color-pink-400)" },
                { name: "锻炼", value: "1h 45m", color: "var(--color-lime-500)" },
                { name: "跑步", value: "5.2 km", color: "var(--color-accent-500)" },
              ]}
            />
            <div className="flex justify-center py-2">
              <ActivityRings
                size={Math.max(130, height - 40)}
                values={[
                  { value: 82, color: "var(--color-pink-400)" },
                  { value: 68, color: "var(--color-lime-500)" },
                  { value: 45, color: "var(--color-accent-500)" },
                ]}
              />
            </div>
          </>
        );
      case "active-days":
        return (
          <BarList
            items={[
              { label: "周二", value: 92 },
              { label: "周三", value: 88 },
              { label: "周四", value: 76 },
              { label: "周一", value: 64 },
              { label: "周五", value: 52 },
            ]}
          />
        );
      case "stage-bars":
        return (
          <div className="flex flex-col gap-1.5">
            {[
              { label: "需求", v: 92 },
              { label: "设计", v: 74 },
              { label: "开发", v: 58 },
              { label: "测试", v: 36 },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="w-8 shrink-0 text-[10px] text-text-tertiary">{s.label}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-background-secondary-default">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.v}%`,
                      background: `linear-gradient(90deg, var(--color-accent-${600 - i * 100}), var(--color-accent-${500 - i * 100}))`,
                    }}
                  />
                </div>
                <span className="w-6 shrink-0 text-end text-[10px] tabular-nums text-text-tertiary">{s.v}</span>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <Card title={title} subtitle={subtitle} value={total} delta={showPeriods?undefined:delta} trend={trend} className={className} controls={periodControls}>
      {body}
    </Card>
  );
}
