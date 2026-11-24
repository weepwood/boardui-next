import { cn } from "@/lib/utils";

const sizes = {
  xs: "size-5 text-[10px]",
  sm: "size-6 text-[11px]",
  md: "size-9 text-[18px] font-semibold",
  lg: "size-10 text-body-medium",
  xl: "size-12 text-base",
} as const;

/**
 * 头像配色板：与原站一致，使用饱和背景 + 同色系深色文字。
 * 原站实现为 avatar-neutral-background（中性灰）与 accent 蓝两种，
 * 这里扩展为一组对比度良好的纯色，保证任意名字都能分辨。
 */
const PALETTE = [
  { bg: "var(--color-accent-100)", fg: "var(--color-accent-700)" },
  { bg: "var(--color-purple-100)", fg: "var(--color-purple-700)" },
  { bg: "var(--color-teal-200)", fg: "var(--color-teal-700)" },
  { bg: "var(--color-amber-200)", fg: "var(--color-amber-800)" },
  { bg: "var(--color-pink-100)", fg: "var(--color-pink-700)" },
  { bg: "var(--color-lime-100)", fg: "var(--color-lime-700)" },
];

function paletteOf(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 997;
  return PALETTE[h % PALETTE.length];
}

/**
 * 头像：有 src 显示图片，否则显示首字母 + 稳定配色。
 * 原站实测：md = 36×36，字号 18px/600，圆形，无描边。
 */
export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase();
  const p = paletteOf(name);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "select-none",
        sizes[size],
        className
      )}
      style={src ? undefined : { backgroundColor: p.bg, color: p.fg }}
      title={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
