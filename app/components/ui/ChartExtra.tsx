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
  const layers = [0, 1, 2] as const;
  const layerX = { 0: 6, 1: 50, 2: 94 };
  const colors = [
    "var(--color-accent-500)",
    "var(--color-purple-500)",
    "var(--color-lime-500)",
    "var(--color-amber-500)",
    "var(--color-teal-500)",
    "var(--color-pink-500)",
  ];

  // 计算每个节点的纵向位置
  const nodeById=new Map(nodes.map(n=>[n.id,n]));
  const pos = new Map<string, { y: number; h: number }>();
  layers.forEach((l) => {
    const inLayer = nodes.filter((n) => n.layer === l);
    const total = inLayer.reduce((s, n) => s + n.value, 0) || 1;
    let cursor = 3;
    inLayer.forEach((n) => {
      const h = (n.value / total) * (H - 6);
      pos.set(n.id, { y: cursor, h });
      cursor += h + 2;
    });
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ height, width: "100%" }}
      aria-hidden="true"
    >
      {links.map((lk, i) => {
        const a = pos.get(lk.from);
        const b = pos.get(lk.to);
        if (!a || !b) return null;
        const fromNode = nodeById.get(lk.from)!;
        const toNode = nodeById.get(lk.to)!;
        const x1 = layerX[fromNode.layer];
        const x2 = layerX[toNode.layer];
        const y1 = a.y + a.h / 2;
        const y2 = b.y + b.h / 2;
        const mx = (x1 + x2) / 2;
        return (
          <path
            key={i}
            d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
            fill="none"
            stroke={colors[i % colors.length]}
            strokeWidth={Math.max(1.2, (lk.value / 100) * 3)}
            strokeOpacity="0.35"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
      {nodes.map((n, i) => {
        const p = pos.get(n.id)!;
        return (
          <rect
            key={n.id}
            x={layerX[n.layer] - 1.5}
            y={p.y}
            width="3"
            height={p.h}
            rx="0.6"
            fill={colors[i % colors.length]}
          />
        );
      })}
    </svg>
  );
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
