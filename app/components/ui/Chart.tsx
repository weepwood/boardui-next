"use client";

/**
 * 轻量 SVG 图表组件集。
 * 手写 SVG 路径，零依赖，完全离线，且便于精确控制视觉细节。
 */

/** 通用绘图区尺寸 */
const W = 100;
const H = 40;

function buildPath(values: number[], closed = false): string {
  if (!values.length) return "";
  const max = Math.max(...values, 1);
  const step = W / Math.max(values.length - 1, 1);
  const pts = values.map((v, i) => {
    const x = i * step;
    const y = H - (v / max) * H;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const line = `M${pts.join(" L")}`;
  return closed ? `${line} L${W},${H} L0,${H} Z` : line;
}

/** 面积图 */
export function AreaChart({
  data,
  height = 120,
  stroke = "var(--color-accent-500)",
  gradientId = "area-grad",
}: {
  data: number[];
  height?: number;
  stroke?: string;
  gradientId?: string;
}) {
  const d = buildPath(data, true);
  const line = buildPath(data);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ height, width: "100%" }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{ strokeWidth: 2 }}
      />
    </svg>
  );
}

/** 折线图（可多条） */
export function LineChart({
  series,
  height = 120,
}: {
  series: { data: number[]; color: string }[];
  height?: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ height, width: "100%" }}
      aria-hidden="true"
    >
      {series.map((s, i) => (
        <path
          key={i}
          d={buildPath(s.data)}
          fill="none"
          stroke={s.color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** 柱状图 */
export function BarChart({
  data,
  height = 120,
  color = "var(--color-accent-500)",
}: {
  data: number[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data, 1);
  const gap = 8;
  const bw = (W - gap * (data.length - 1)) / data.length;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ height, width: "100%" }}
      aria-hidden="true"
    >
      {data.map((v, i) => {
        const h = (v / max) * H;
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={H - h}
            width={bw}
            height={h}
            rx="0.6"
            fill={color}
          />
        );
      })}
    </svg>
  );
}

/** 水平条形列表 */
export function BarList({
  items,
}: {
  items: { label: string; value: number; color?: string }[];
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex w-full flex-col gap-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className="w-20 shrink-0 truncate text-caption-1-regular text-text-secondary">
            {it.label}
          </span>
          <div className="h-5 flex-1 overflow-hidden rounded bg-background-secondary-default">
            <div
              className="h-full rounded bg-accent-500/80"
              style={{ width: `${(it.value / max) * 100}%`, backgroundColor: it.color }}
            />
          </div>
          <span className="w-8 shrink-0 text-end text-caption-1-medium tabular-nums text-text-primary">
            {it.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** 环形进度 */
export function RadialChart({
  value,
  size = 96,
  label,
  color = "var(--color-accent-500)",
}: {
  value: number;
  size?: number;
  label?: string;
  color?: string;
}) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" className="size-full -rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" stroke="var(--color-background-tertiary-default)" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          className="transition-[stroke-dasharray] duration-700 ease-bui"
        />
      </svg>
      <span className="absolute text-caption-1-semibold tabular-nums text-text-primary">
        {label ?? `${pct}%`}
      </span>
    </div>
  );
}

/** 雷达图：含轴线、同心网格、轴标签（复刻原站 6 轴结构） */
export function RadarChart({
  axes,
  values,
  size = 200,
}: {
  axes: string[];
  values: number[];
  size?: number;
}) {
  const n = axes.length;
  const cx = 50;
  const cy = 50;
  const R = 32;
  const point = (i: number, ratio: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(angle) * R * ratio, cy + Math.sin(angle) * R * ratio];
  };
  const polygon = values
    .map((v, i) => point(i, v / 100).map((x) => x.toFixed(2)).join(","))
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" style={{ width: size, height: size }} aria-hidden="true">
      {/* 同心网格 */}
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <polygon
          key={ratio}
          points={axes
            .map((_, i) => point(i, ratio).map((x) => x.toFixed(2)).join(","))
            .join(" ")}
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="0.4"
        />
      ))}
      {/* 轴线 */}
      {axes.map((_, i) => {
        const [x, y] = point(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--color-border-primary)"
            strokeWidth="0.4"
          />
        );
      })}
      {/* 数据区域 */}
      <polygon
        points={polygon}
        fill="var(--color-accent-500)"
        fillOpacity="0.22"
        stroke="var(--color-accent-500)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* 数据点 */}
      {values.map((v, i) => {
        const [x, y] = point(i, v / 100);
        return <circle key={i} cx={x} cy={y} r="1.1" fill="var(--color-accent-500)" />;
      })}
      {/* 轴标签 */}
      {axes.map((label, i) => {
        const [x, y] = point(i, 1.18);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="4.2"
            fill="var(--color-text-tertiary)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/** 热力图 */
export function Heatmap({
  weeks = 20,
  seed = 7,
}: {
  weeks?: number;
  seed?: number;
}) {
  const levels = ["bg-background-tertiary-default", "bg-lime-200", "bg-lime-300", "bg-lime-500", "bg-lime-700"];
  const cells = Array.from({ length: weeks * 7 }, (_, i) => {
    const v = Math.abs(Math.sin((i + seed) * 1.7)) * 5;
    return levels[Math.min(4, Math.floor(v))];
  });
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: weeks }).map((_, w) => (
        <div key={w} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }).map((_, d) => (
            <span
              key={d}
              className={`size-2.5 rounded-[2px] ${cells[w * 7 + d]}`}
              title={`第 ${w + 1} 周 第 ${d + 1} 天`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * 漏斗图：水平流向（严格复刻原站结构）
 *
 * 结构：4 段梯形从左向右依次相连，每段由前一段的右侧高度平滑过渡到自身高度
 *   - 颜色：绿 → 蓝 → 紫 → 粉
 *   - 每段中间有一个白底胶囊标签，显示相对首层的百分比
 *   - 段与段之间无缝连接（曲线过渡），不是分离的块
 */
export function FunnelChart({
  steps,
  height = 150,
}: {
  steps: { label: string; value: number }[];
  height?: number;
}) {
  const n = steps.length;
  const max = steps[0]?.value ?? 1;

  const VW = 400;
  const VH = 100;
  const PAD_X = 2;
  const PAD_Y = 4;
  const segW = (VW - PAD_X * 2) / n;
  const maxH = VH - PAD_Y * 2;

  const colors = [
    "var(--color-lime-500)",
    "var(--color-accent-500)",
    "var(--color-purple-500)",
    "var(--color-pink-500)",
  ];

  // 每段高度：严格按数值比例，但保底 26%（避免末段过薄无法容纳胶囊）
  const hs = steps.map((s) => Math.max(maxH * 0.26, (s.value / max) * maxH));

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
      aria-label="转化漏斗"
      role="img"
    >
      {steps.map((s, i) => {
        const x1 = PAD_X + i * segW;
        const x2 = x1 + segW;
        const h1 = hs[i];
        const h2 = hs[i + 1] ?? h1;
        const cy = VH / 2;
        const y1a = cy - h1 / 2;
        const y1b = cy + h1 / 2;
        const y2a = cy - h2 / 2;
        const y2b = cy + h2 / 2;
        // 曲线控制点：上下各偏移段宽的 45%
        const c = segW * 0.45;

        return (
          <path
            key={s.label}
            d={[
              `M${x1.toFixed(2)},${y1a.toFixed(2)}`,
              // 上边：从 (x1,y1a) 平滑过渡到 (x2,y2a)
              `C${(x1 + c).toFixed(2)},${y1a.toFixed(2)} ${(x2 - c).toFixed(2)},${y2a.toFixed(2)} ${x2.toFixed(2)},${y2a.toFixed(2)}`,
              `L${x2.toFixed(2)},${y2b.toFixed(2)}`,
              // 下边：从 (x2,y2b) 平滑回到 (x1,y1b)
              `C${(x2 - c).toFixed(2)},${y2b.toFixed(2)} ${(x1 + c).toFixed(2)},${y1b.toFixed(2)} ${x1.toFixed(2)},${y1b.toFixed(2)}`,
              "Z",
            ].join(" ")}
            fill={colors[i % colors.length]}
          />
        );
      })}

      {/* 百分比胶囊：白底 + 细描边，居中于每段 */}
      {steps.map((s, i) => {
        const cx = PAD_X + i * segW + segW / 2;
        const pct = Math.round((s.value / max) * 100);
        const label = `${pct}%`;
        const w = label.length * 6.4 + 12;
        return (
          <g key={`l-${s.label}`}>
            <rect
              x={cx - w / 2}
              y={VH / 2 - 7}
              width={w}
              height="14"
              rx="7"
              fill="white"
              stroke="var(--color-border-primary)"
              strokeWidth="0.25"
            />
            <text
              x={cx}
              y={VH / 2 + 0.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7"
              fontWeight="500"
              fill="var(--color-text-primary)"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** 漏斗图下方的图例卡：色点 + 名称 + 数值（列数随条目数自适应，单行铺满） */
export function FunnelLegend({
  items,
}: {
  items: { name: string; value: string; color: string }[];
}) {
  const cols = Math.min(items.length, 5);
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {items.map((it) => (
        <div
          key={it.name}
          className="flex min-w-0 flex-col gap-0.5 rounded-2lg bg-background-primary-default px-2.5 py-2"
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <span
              className="size-2.5 shrink-0 rounded-[3px]"
              style={{ backgroundColor: it.color }}
            />
            <span className="truncate text-caption-1-regular text-text-secondary">{it.name}</span>
          </span>
          <span className="text-body-medium tabular-nums text-text-primary">{it.value}</span>
        </div>
      ))}
    </div>
  );
}
