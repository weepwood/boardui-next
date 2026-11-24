"use client";

import {
  Separator as RACSeparator,
  type SeparatorProps,
} from "react-aria-components";
import { createElement, type AriaAttributes } from "react";
import { cn } from "@/lib/utils";

/** 分隔线：支持水平 / 垂直 */
export function Divider({
  orientation = "horizontal",
  className,
  "aria-hidden": hidden,
  render,
  ...props
}: Omit<SeparatorProps, "className"> & { className?: string; "aria-hidden"?: AriaAttributes["aria-hidden"] }) {
  const element=props.elementType??"hr";
  const tag=element==="hr"&&orientation==="vertical"?"div":element;
  return (
    <RACSeparator
      {...props}
      orientation={orientation}
      render={hidden===undefined?render:(domProps,state)=>{
        const forwarded={...domProps,"aria-hidden":hidden};
        return render?render(forwarded,state):createElement(tag,forwarded);
      }}
      className={cn(
        "shrink-0 border-0 bg-separator-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  );
}
