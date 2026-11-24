import { cx } from "./cx";
import { iconRegistry, type IconName } from "./icon-registry";
import { directionalIconClass } from "./directional-icon";
export type { IconName };
export interface SvgIconProps {
  name: string;
  className?: string;
  size?: number;
  /** Override automatic navigation mirroring for physical directions. */
  mirror?: boolean;
}
export function resolveIcon(name: string) {
  return Object.prototype.hasOwnProperty.call(iconRegistry,name) ? iconRegistry[name as IconName] : iconRegistry["question-line"];
}
/** Decorative icon; the surrounding interactive control provides its accessible name. */
export function SvgIcon({name,className,size,mirror}: SvgIconProps) {
  const Glyph=resolveIcon(name);
  const direction=mirror===false?undefined:mirror===true?"rtl:rotate-180":directionalIconClass(Glyph);
  return <Glyph aria-hidden="true" focusable="false" data-icon={name}
    data-icon-fallback={Object.prototype.hasOwnProperty.call(iconRegistry,name)?undefined:"true"}
    className={cx("inline-block shrink-0 size-4",direction,className)}
    style={size===undefined?undefined:{width:size,height:size}}/>;
}
