"use client";

/**
 * 图表核心组件集。
 *
 * 复刻原站 recharts 的视觉结构：
 *   - Y 轴刻度标签（12px，text-tertiary），左侧留 36px
 *   - X 轴月份标签（13px），底部留 30px
 *   - 横向虚线网格（4 条）
 *   - 多条曲线，每条带独立渐变填充
 *   - 底部图例（带圆点的卡片）
 *
 * 实现上用手写 SVG，但严格按 recharts 的布局比例，保证视觉一致。
 */

import {useId} from "react";
import {stackSeries} from "./chart-stacking";
const PAD = { left: 36, right: 8, top: 9, bottom: 30 };

export type Series = {
  name: string;
  data: number[];
  color: string;
};

/** 取一个能被 (ticks-1) 整除的整齐上限 */
function niceMax(values: number[], ticks = 4) {
  const max = values.reduce((max,value)=>Math.max(max,value),1);
  const seg = ticks - 1;
  const raw = max / seg;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  const step = n <= 1 ? 1 : n <= 1.5 ? 1.5 : n <= 2 ? 2 : n <= 3 ? 3 : n <= 5 ? 5 : 10;
  return step * mag * seg;
}

function fmt(v: number) {
  if (v >= 1000) return `${+(v / 1000).toFixed(1)}K`;
  return String(Math.round(v));
}

/**
 * 通用折线/面积图。
 * @param stacked 是否叠加（原站「访客」图表是叠加面积）
 */
export function ChartArea({
  series,
  labels,
  height = 196,
  yTicks = 4,
  fillOpacity = 0.14,
  showGrid = true,
  showAxis = true,
  smooth = true,
}: {
  series: Series[];
  labels: string[];
  height?: number;
  yTicks?: number;
  fillOpacity?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  smooth?: boolean;
}) {
  const uid=useId().replace(/[^a-zA-Z0-9_-]/g,"");
  const W = 544;
  const H = height;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  // 计算 Y 轴最大值（取所有系列之和，模拟叠加）
  const {baselines:cumulative,total:sums}=stackSeries(series,labels.length);
  const max = niceMax(sums, yTicks);

  const xAt = (i: number) =>
    labels.length <= 1 ? PAD.left : PAD.left + (i / (labels.length - 1)) * innerW;
  const yAt = (v: number) => PAD.top + innerH - (v / max) * innerH;

  // 生成路径（可平滑）
  const buildLine = (data: number[], cumulative: number[]) => {
    const pts = data.map((v, i) => [xAt(i), yAt((cumulative[i]??0) + v)] as const);
    if (!smooth || pts.length < 3) {
      return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    }
    // Catmull-Rom 转贝塞尔，得到平滑曲线
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height }}
      role="img"
      aria-label={`${series.map((s) => s.name).join("、")}趋势图`}
    >
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`grad-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
          </linearGradient>
        ))}
      </defs>

      {/* 网格线 */}
      {showGrid &&
        Array.from({ length: yTicks }).map((_, i) => {
          const y = PAD.top + (i / (yTicks - 1)) * innerH;
          return (
            <line
              key={i}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y}
              y2={y}
              stroke="var(--color-separator-border)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          );
        })}

      {/* Y 轴刻度 */}
      {showAxis &&
        Array.from({ length: yTicks }).map((_, i) => {
          const y = PAD.top + (i / (yTicks - 1)) * innerH;
          const v = max - (i / (yTicks - 1)) * max;
          return (
            <text
              key={i}
              x={PAD.left - 6}
              y={y + 3}
              textAnchor="end"
              fontSize="12"
              fill="var(--color-text-tertiary)"
            >
              {fmt(v)}
            </text>
          );
        })}

      {/* 面积 + 曲线（从最上层往下画，保证下层可见） */}
      {series
        .map((s, i) => ({ s, i }))
        .reverse()
        .map(({ s, i }) => {
          const line = buildLine(s.data, cumulative[i]);
          const first = xAt(0);
          const lastX = xAt(labels.length - 1);
          const area = `${line} L${lastX.toFixed(1)},${yAt(cumulative[i][labels.length - 1] ?? 0).toFixed(1)} L${first.toFixed(1)},${yAt(cumulative[i][0] ?? 0).toFixed(1)} Z`;
          return (
            <g key={s.name}>
              <path d={area} fill={`url(#grad-${uid}-${i})`} />
              <path
                d={line}
                fill="none"
                stroke={s.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

      {/* X 轴标签 */}
      {showAxis &&
        labels.map((l, i) => (
          <text
            key={l + i}
            x={xAt(i)}
            y={H - 10}
            textAnchor="middle"
            fontSize="13"
            fill="var(--color-text-tertiary)"
          >
            {l}
          </text>
        ))}
    </svg>
  );
}

/**
 * 图例卡片（实测原站）：181×57、10px 圆角、白底、padding 8px 10px
 * 色点为 12px 圆角 4px 的方块（非圆形）
 */
export function ChartLegend({
  items,
}: {
  items: { name: string; value: string; color: string }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((it) => (
        <div
          key={it.name}
          className="flex min-w-0 flex-col items-start gap-px rounded-2lg bg-background-primary-default px-2.5 py-2"
        >
          <span className="flex min-w-0 max-w-full items-center gap-1.5">
            <span
              className="size-3 shrink-0 rounded-[4px]"
              style={{ backgroundColor: it.color }}
            />
            <span className="truncate text-caption-1-regular text-text-secondary">
              {it.name}
            </span>
          </span>
          <span className="text-body-medium tabular-nums text-text-primary">{it.value}</span>
        </div>
      ))}
    </div>
  );
}
