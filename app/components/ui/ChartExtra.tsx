"use client";

/**
 * 扩展图表：桑基图、散点图、组合图。
 * 与 Chart.tsx 一致，全部手写 SVG，零依赖。
 */

const W = 100;
const H = 40;

/** 桑基图：左中右三层 + 流量带 */
export function SankeyChart({
  nodes,
  links,
  height = 160,
}: {
  nodes: { id: string; label: string; layer: 0 | 1 | 2; value: number }[];
  links: { from: string; to: string; value: number }[];
  height?: number;
}) {
  const layers=[0,1,2] as const,layerX={0:5,1:50,2:95};
  const colors=["var(--color-emerald-500)","var(--color-accent-500)","var(--color-purple-500)","var(--color-lime-500)"];
  const byId=new Map(nodes.map(n=>[n.id,n]));
  const valid=links.filter(l=>byId.has(l.from)&&byId.has(l.to)&&byId.get(l.from)!.layer<byId.get(l.to)!.layer&&Number.isFinite(l.value)&&l.value>0);
  const incoming=new Map<string,number>(),outgoing=new Map<string,number>();
  valid.forEach(l=>{incoming.set(l.to,(incoming.get(l.to)??0)+l.value);outgoing.set(l.from,(outgoing.get(l.from)??0)+l.value)});
  const weights=new Map(nodes.map(n=>[n.id,Math.max(Number.isFinite(n.value)?n.value:0,incoming.get(n.id)??0,outgoing.get(n.id)??0,0)]));
  const groups=layers.map(layer=>nodes.filter(n=>n.layer===layer&&weights.get(n.id)!>0));
  const gap=2;
  const scale=Math.min(...groups.filter(g=>g.length).map(g=>Math.max(1,H-6-gap*(g.length-1))/g.reduce((n,v)=>n+weights.get(v.id)!,0)));
  if(!valid.length||!Number.isFinite(scale))return <div role="status" className="flex items-center justify-center text-body-2-regular text-text-secondary" style={{height}}>暂无流向数据</div>;
  const pos=new Map<string,{y:number;h:number}>();
  for(const g of groups){let y=3;for(const n of g){const h=weights.get(n.id)!*scale;pos.set(n.id,{y,h});y+=h+gap}}
  const usedOut=new Map<string,number>(),usedIn=new Map<string,number>();
  const bands=valid.map(l=>{const a=pos.get(l.from)!,b=pos.get(l.to)!,h=l.value*scale;
   const y1=a.y+(usedOut.get(l.from)??0),y2=b.y+(usedIn.get(l.to)??0);
   usedOut.set(l.from,y1-a.y+h);usedIn.set(l.to,y2-b.y+h);
   const x1=layerX[byId.get(l.from)!.layer]+1,x2=layerX[byId.get(l.to)!.layer]-1,m=(x1+x2)/2;
   return {...l,d:`M${x1},${y1} C${m},${y1} ${m},${y2} ${x2},${y2} L${x2},${y2+h} C${m},${y2+h} ${m},${y1+h} ${x1},${y1+h} Z`};
  });
  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{height,width:"100%"}} role="img" aria-label={valid.map(l=>byId.get(l.from)!.label+"至"+byId.get(l.to)!.label+" "+l.value).join("；")}>
   {bands.map((b,i)=><path key={i} d={b.d} fill={colors[nodes.findIndex(n=>n.id===b.from)%colors.length]} fillOpacity=".35"><title>{byId.get(b.from)!.label+" → "+byId.get(b.to)!.label+"："+b.value}</title></path>)}
   {nodes.map((n,i)=>{const p=pos.get(n.id);return p&&<rect key={n.id} x={layerX[n.layer]-1} y={p.y} width="2" height={p.h} rx=".4" fill={colors[i%colors.length]}><title>{n.label+"："+weights.get(n.id)}</title></rect>})}
  </svg>;
}

/** 散点图：含 XY 轴刻度与网格线 */
export function ScatterChart({
  points,
  height = 140,
  color = "var(--color-accent-500)",
  xLabels,
  yLabels,
}: {
  points: { x: number; y: number }[];
  height?: number;
  color?: string;
  xLabels?: string[];
  yLabels?: string[];
}) {
  const PADL = 30, PADB = 22, PADT = 6, PADR = 6;
  const W = 100, H = 40;
  const iw = W - PADL - PADR;
  const ih = H - PADT - PADB;
  const maxX = Math.max(...points.map((p) => p.x), 1);
  const maxY = Math.max(...points.map((p) => p.y), 1);
  const xAt = (v: number) => PADL + (v / maxX) * iw;
  const yAt = (v: number) => PADT + ih - (v / maxY) * ih;

  const xTicks = xLabels ?? ["0", "25", "50", "75", "100"];
  const yTicks = yLabels ?? ["0", "25", "50", "75", "100"];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} aria-hidden="true">
      {/* 横向网格 */}
      {yTicks.map((_, i) => {
        const y = PADT + (i / (yTicks.length - 1)) * ih;
        return (
          <line key={i} x1={PADL} x2={W - PADR} y1={y} y2={y}
            stroke="var(--color-separator-border)" strokeWidth="0.15" strokeDasharray="0.6 0.6" />
        );
      })}
      {/* 纵向网格 */}
      {xTicks.map((_, i) => {
        const x = PADL + (i / (xTicks.length - 1)) * iw;
        return (
          <line key={i} x1={x} x2={x} y1={PADT} y2={PADT + ih}
            stroke="var(--color-separator-border)" strokeWidth="0.15" strokeDasharray="0.6 0.6" />
        );
      })}
      {/* Y 轴刻度 */}
      {yTicks.map((t, i) => {
        const y = PADT + (i / (yTicks.length - 1)) * ih;
        return (
          <text key={i} x={PADL - 1.5} y={y + 1} textAnchor="end" fontSize="2.4" fill="var(--color-text-tertiary)">
            {t}
          </text>
        );
      })}
      {/* X 轴刻度 */}
      {xTicks.map((t, i) => {
        const x = PADL + (i / (xTicks.length - 1)) * iw;
        return (
          <text key={i} x={x} y={H - 4} textAnchor="middle" fontSize="2.4" fill="var(--color-text-tertiary)">
            {t}
          </text>
        );
      })}
      {/* 数据点 */}
      {points.map((p, i) => (
        <circle key={i} cx={xAt(p.x)} cy={yAt(p.y)} r="0.9" fill={color} fillOpacity="0.75" />
      ))}
    </svg>
  );
}

/** 组合图：柱 + 折线（双 Y 轴） */
export function ComboChart({
  bars,
  line,
  height = 140,
}: {
  bars: number[];
  line: number[];
  height?: number;
}) {
  const maxBar = Math.max(...bars, 1);
  const maxLine = Math.max(...line, 1);
  const gap = 8;
  const bw = (W - gap * (bars.length - 1)) / bars.length;
  const linePath = line
    .map((v, i) => {
      const x = i * ((W - bw) / Math.max(line.length - 1, 1)) + bw / 2;
      const y = H - (v / maxLine) * (H - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ height, width: "100%" }}
      aria-hidden="true"
    >
      {bars.map((v, i) => {
        const h = (v / maxBar) * (H - 6);
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={H - h}
            width={bw}
            height={h}
            rx="0.5"
            fill="var(--color-accent-500)"
            fillOpacity="0.25"
          />
        );
      })}
      <path
        d={linePath}
        fill="none"
        stroke="var(--color-purple-500)"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
