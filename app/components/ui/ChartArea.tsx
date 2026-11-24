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

import {useId,useState,useRef} from "react";
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
  const seg = Math.max(1,ticks - 1);
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
  stacked = true,
  showFill = true,
}: {
  series: Series[];
  labels: string[];
  height?: number;
  yTicks?: number;
  fillOpacity?: number;
  showGrid?: boolean;
  showAxis?: boolean;
  smooth?: boolean;
  stacked?: boolean;
  showFill?: boolean;
}) {
  const uid=useId().replace(/[^a-zA-Z0-9_-]/g,"");
  const svgRef=useRef<SVGSVGElement>(null);
  const [activeIndex,setActiveIndex]=useState<number|null>(null);
  const point=activeIndex===null?null:Math.max(0,Math.min(activeIndex,labels.length-1));
  const valid=labels.length>0&&series.some(s=>s.data.slice(0,labels.length).some(Number.isFinite));
  const W = 544;
  const H = Math.max(80,Number.isFinite(height)?height:196);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  // 计算 Y 轴最大值（取所有系列之和，模拟叠加）
  const normalized=series.map(s=>({...s,data:labels.map((_,i)=>Number.isFinite(s.data[i])?s.data[i]:0)}));
  const stack=stacked?stackSeries(normalized,labels.length):null;
  const cumulative=stack?.baselines??normalized.map(()=>labels.map(()=>0));
  const domainRows=stack?[stack.total,...stack.baselines]:normalized.map(s=>s.data);
  const ticks=Math.max(2,Math.min(20,Math.trunc(yTicks)||4));
  const peak=domainRows.reduce((hi,row)=>row.reduce((n,v)=>Math.max(n,v),hi),1);
  const max=niceMax([peak],ticks);
  const min=domainRows.reduce((lo,row)=>row.reduce((n,v)=>Math.min(n,v),lo),0);

  const xAt = (i: number) =>
    labels.length <= 1 ? PAD.left : PAD.left + (i / (labels.length - 1)) * innerW;
  const yAt = (v: number) => PAD.top + innerH - ((v-min) / (max-min)) * innerH;

  // 生成路径（可平滑）
  const buildLine = (pts: (readonly [number,number])[]) => {
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

  if(!valid)return <div role="status" className="flex min-w-0 items-center justify-center rounded-xl text-body-2-regular text-text-secondary" style={{height:H}}>暂无可展示数据</div>;
  const onPointer=(event:React.PointerEvent<SVGSVGElement>)=>{
    const svg=svgRef.current, matrix=svg?.getScreenCTM();
    if(!svg||!matrix)return;
    const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    if(p.x<PAD.left||p.x>W-PAD.right||p.y<PAD.top||p.y>H-PAD.bottom){setActiveIndex(null);return}
    setActiveIndex(Math.round((p.x-PAD.left)/innerW*(labels.length-1)));
  };
  return (
    <div className="relative min-w-0" onMouseLeave={()=>setActiveIndex(null)}>
    <svg ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height:H }}
      onPointerMove={onPointer} onPointerDown={onPointer}
      onPointerLeave={()=>setActiveIndex(null)}
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
        Array.from({ length: ticks }).map((_, i) => {
          const y = PAD.top + (i / (ticks - 1)) * innerH;
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
        Array.from({ length: ticks }).map((_, i) => {
          const y = PAD.top + (i / (ticks - 1)) * innerH;
          const v = max - (i / (ticks - 1)) * (max-min);
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
      {normalized
        .map((s, i) => ({ s, i }))
        .reverse()
        .map(({ s, i }) => {
          if(!labels.length)return null;
          const upper=s.data.map((v,k)=>[xAt(k),yAt(cumulative[i][k]+v)] as const);
          const lower=cumulative[i].map((v,k)=>[xAt(k),yAt(v)] as const).reverse();
          const line=buildLine(upper);
          const area=line+" "+buildLine(lower).replace(/^M/,"L")+" Z";
          return (
            <g key={i}>
              {showFill&&<path d={area} fill={`url(#grad-${uid}-${i})`} />}
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

      {point!==null&&<g pointerEvents="none" aria-hidden="true"><line x1={xAt(point)} x2={xAt(point)} y1={PAD.top} y2={H-PAD.bottom} stroke="var(--color-text-tertiary)" strokeDasharray="3 3"/>{normalized.map((s,i)=><circle key={i} cx={xAt(point)} cy={yAt(cumulative[i][point]+s.data[point])} r={4} stroke="var(--color-background-primary-default)" strokeWidth={2} fill={s.color}/>)}</g>}
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
    <div className="flex items-center justify-end gap-1 text-caption-2-regular text-text-secondary">
      <label htmlFor={uid+"-point"}>数据点</label><select id={uid+"-point"} aria-label="查看图表数据点" value={point??""} onChange={e=>setActiveIndex(e.target.value===""?null:Number(e.target.value))} className="max-w-full rounded-md border border-border-button-default bg-background-primary-default px-1 py-0.5 text-text-primary focus-visible:outline-2 focus-visible:outline-border-focus-ring"><option value="">选择</option>{labels.map((label,i)=><option key={i} value={i}>{label||String(i+1)}</option>)}</select>
    </div>
    {point!==null&&<div role="status" data-chart-tooltip className="pointer-events-none absolute top-2 z-10 max-w-[min(180px,100%)] rounded-xl border border-border-button-default bg-background-primary-default p-2.5 text-body-2-regular text-text-primary shadow-dropdown" style={point<labels.length/2?{insetInlineEnd:4}:{insetInlineStart:4}}><p className="mb-1 font-medium">{labels[point]||String(point+1)}</p>{normalized.map((s,i)=><div key={i} className="flex items-center justify-between gap-3"><span className="flex min-w-0 items-center gap-1"><span className="size-2 shrink-0 rounded-sm" style={{backgroundColor:s.color}}/>{s.name}</span><span className="tabular-nums">{Number.isFinite(series[i].data[point])?s.data[point].toLocaleString("en-US"):"—"}</span></div>)}</div>}
    </div>
  );
}

/**
 * 图例卡片（实测原站）：181×57、10px 圆角、白底、padding 8px 10px
 * 色点为 12px 圆角 4px 的方块（非圆形）
 */
export function ChartLegend({
  items,hidden=[],onToggle,
}: {
  items: { name: string; value: string; color: string }[];
  hidden?:string[];onToggle?:(name:string)=>void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((it) => {const Tag=onToggle?"button":"div";return (
        <Tag
          key={it.name}
          {...(onToggle?{type:"button" as const,"aria-label":it.name,"aria-pressed":!hidden.includes(it.name),onClick:()=>onToggle(it.name)}:{})}
          className={"flex min-w-0 flex-col items-start gap-px rounded-2lg bg-background-primary-default px-2.5 py-2 "+(onToggle?"cursor-pointer text-start hover:bg-background-primary-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring ":"")+(hidden.includes(it.name)?"opacity-60":"")}
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
        </Tag>
      )})}
    </div>
  );
}
