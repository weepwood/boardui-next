import { cn } from "@/lib/utils";

type IconProps = {
  name: string;
  className?: string;
  size?: number;
};

/**
 * Remix Icon 封装。
 * 原站使用 remixicon 字体图标，`class="remixicon size-4"` 等。
 * 用 <i> + 字体实现，与字体图标渲染完全一致。
 */
export function Icon({ name, className, size }: IconProps) {
  return (
    <i
      aria-hidden="true"
      className={cn("ri-" + name, "inline-block shrink-0 leading-none", className)}
      style={size ? { fontSize: size } : undefined}
    />
  );
}
