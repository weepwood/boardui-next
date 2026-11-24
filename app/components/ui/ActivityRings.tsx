"use client";

/**
 * 活动圆环（严格复刻原站 activity-rings-card）
 *
 * 结构：
 *   - 3 环同心，环宽约 8.5%，环间距约 2.5%
 *   - 底轨为同色 12% 透明度（不是灰色），与外环同色系呼应
 *   - 前景弧从 12 点顺时针，端点圆头
 */
export function ActivityRings({
  values,
  size = 160,
}: {
  values: { value: number; color: string }[];
  size?: number;
}) {
  const VB = 100;
  const cx = VB / 2;
  const cy = VB / 2;
  const ringW = 8.6;
  const gap = 1.8;
  // 最外圈半径：留出环宽的一半，避免出界
  const outerR = VB / 2 - ringW / 2 - 1;

  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} style={{ width: size, height: size }} aria-hidden="true">
      {values.map((v, i) => {
        const r = outerR - i * (ringW + gap);
        const c = 2 * Math.PI * r;
        const ratio = Math.min(100, Math.max(0, v.value)) / 100;
        return (
          <g key={i}>
            {/* 底轨：同色淡底 */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={v.color}
              strokeOpacity="0.16"
              strokeWidth={ringW}
            />
            {/* 前景弧：-90° 起点，顺时针 */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={v.color}
              strokeWidth={ringW}
              strokeLinecap="round"
              strokeDasharray={`${(ratio * c).toFixed(2)} ${c.toFixed(2)}`}
              transform={`rotate(-90 ${cx} ${cy})`}
              style={{ transition: "stroke-dasharray 700ms cubic-bezier(0.22,1,0.36,1)" }}
            />
          </g>
        );
      })}
    </svg>
  );
}
