"use client";

/**
 * 多圈径向图（严格复刻原站 radial-chart-card 结构）
 *
 * 结构：
 *   - 5 条同心圆弧，由内向外半径递增，每圈代表一个分类
 *   - 底层为浅灰完整圆环（背景轨道）
 *   - 前景弧从 12 点方向顺时针绘制，长度按占比
 *   - 每圈端点带一个圆头（strokeLinecap round）
 */
export function RadialRings({
  items,activeIndex,
  size = 200,
}: {
  items: { name: string; value: number; color: string }[];
  activeIndex?:number|null;
  size?: number;
}) {
  const n = items.length;
  const max = items.reduce((n,i)=>Number.isFinite(i.value)?Math.max(n,i.value):n,1);
  const VB = 200;
  const cx = VB / 2;
  const cy = VB / 2;

  // 半径：最外圈给到 82，向内每圈缩 12
  const outerR = 82;
  const step = Math.min(11,70/Math.max(1,n));
  const ringW = Math.min(8,step*.72);

  const C = 2 * Math.PI;

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      style={{ width: size,maxWidth:"100%",height:"auto",aspectRatio:"1" }}
      aria-hidden="true"
    >
      {items.map((it, i) => {
        // i=0 画最外圈，依次向内
        const r = outerR - i * step;
        const ratio = Number.isFinite(it.value)?Math.max(0,Math.min(1,it.value/max)):0;
        return (
          <g key={i} data-chart-index={i} opacity={activeIndex==null||activeIndex===i?1:.4}>
            {/* 背景轨道：完整圆环，浅灰 */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="var(--color-background-tertiary-default)"
              strokeWidth={ringW}
            />
            {/* 前景弧：从 12 点顺时针，长度按占比 */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={it.color}
              strokeWidth={ringW}
              strokeLinecap="round"
              strokeDasharray={`${(ratio * C * r).toFixed(2)} ${(C * r).toFixed(2)}`}
              // 12 点方向为起点，顺时针为正
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          </g>
        );
      })}
    </svg>
  );
}
