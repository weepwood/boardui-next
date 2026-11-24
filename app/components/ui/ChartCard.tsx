"use client";

import {useState} from "react";
import {SegmentedControl} from "./SegmentedControl";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { ChartArea, ChartLegend, type Series } from "./ChartArea";
import { BarList, RadarChart, Heatmap, FunnelChart, FunnelLegend } from "./Chart";
import { RadialRings } from "./RadialRings";
import { BarListCard } from "./BarListCard";
import { SankeyChart, ScatterChart, ComboChart } from "./ChartExtra";
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
  title, subtitle, value, delta, trend = "up", children, className, controls,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  children: React.ReactNode;
  controls?: React.ReactNode;
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
      <div className="flex flex-col gap-1">
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
      </div>
      {children}
    </div>
  );
}

/**
 * 通用图表卡片：20 种图表类型。
 * 折线/面积类使用 ChartArea（含网格、双轴、图例），其余复用基础图表。
 */
export function ChartCard({ kind, height = 196, periodFilter=false, ...rest }: ChartCardProps) {
  const { title, subtitle, value, delta, trend, className } = rest;
  void rest.icon;
  const [period,setPeriod]=useState("8");
  const showPeriods=periodFilter&&["area","line","earnings","orders","revenue"].includes(kind);
  const range=showPeriods?Number(period):8;
  const months=MONTHS.slice(-range);
  const windowSeries=(series:Series[])=>series.map(s=>({...s,data:s.data.slice(-range)}));
  const format=(n:number)=>n.toLocaleString("en-US");
  const displayLegend=showPeriods?windowSeries(AREA_SERIES).map(s=>({name:s.name,color:s.color,value:format(s.data.reduce((a,b)=>a+b,0))})):LEGEND;
  const total=showPeriods&&["area","line"].includes(kind)?format(windowSeries(AREA_SERIES).reduce((sum,s)=>sum+s.data.reduce((a,b)=>a+b,0),0)):value;

  const body = (() => {
    switch (kind) {
      case "area":
        return (
          <>
            <ChartArea series={windowSeries(AREA_SERIES)} labels={months} height={height} />
            <ChartLegend items={displayLegend} />
          </>
        );
      case "line":
        return (
          <>
            <ChartArea series={windowSeries(AREA_SERIES)} labels={months} height={height} stacked={false} showFill={false} />
            <ChartLegend items={displayLegend} />
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
      case "orders":
        return (
          <ChartArea
            series={windowSeries([{ name: "订单", data: [24, 38, 31, 52, 44, 66, 58, 72].map((v) => v * 40), color: "var(--color-amber-500)" }])}
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
        return <BarList items={[{ label: "一", value: 42 }, { label: "二", value: 58 }, { label: "三", value: 36 }, { label: "四", value: 64 }, { label: "五", value: 48 }]} />;
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
        return (
          <>
            <div className="flex justify-center py-2">
              <RadialRings items={RADIAL_ITEMS} size={Math.max(140, height - 40)} />
            </div>
            <FunnelLegend items={RADIAL_ITEMS.map((r) => ({ name: r.name, value: String(r.value), color: r.color }))} />
          </>
        );
      case "radar":
        return (
          <div className="flex justify-center">
            <RadarChart axes={["速度", "体积", "复用", "文档", "无障碍"]} values={[85, 62, 78, 90, 72]} size={height + 40} />
          </div>
        );
      case "heatmap":
        return (
          <div className="overflow-x-auto pb-1">
            <Heatmap weeks={16} />
          </div>
        );
      case "contributions":
        return (
          <div className="overflow-x-auto pb-1">
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
        return (
          <ScatterChart
            height={height - 20}
            color="var(--color-lime-500)"
            points={[
              { x: 12, y: 24 }, { x: 18, y: 32 }, { x: 24, y: 28 }, { x: 30, y: 44 },
              { x: 38, y: 40 }, { x: 44, y: 52 }, { x: 52, y: 48 }, { x: 58, y: 62 },
              { x: 65, y: 56 }, { x: 72, y: 70 }, { x: 80, y: 66 }, { x: 88, y: 78 },
            ]}
          />
        );
      case "combo":
        return <ComboChart bars={[42, 58, 36, 64, 48, 72, 55]} line={[24, 38, 32, 52, 44, 66, 58]} height={height - 30} />;
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
    <Card title={title} subtitle={subtitle} value={total} delta={showPeriods?undefined:delta} trend={trend} className={className} controls={showPeriods?<SegmentedControl value={period} onChange={setPeriod} size="sm" options={[{id:"4",label:"近4月"},{id:"8",label:"近8月"}]}/>:undefined}>
      {body}
    </Card>
  );
}
