"use client";
import { Switch as CoreSwitch, type SwitchProps } from "@/packages/react/switch";
export interface BSwitchProps extends Omit<SwitchProps,"shape"> {shape?: "pill"|"rect"|"rectangle"}
export function Switch({shape="pill",...props}:BSwitchProps){return <CoreSwitch {...props} shape={shape==="rect"?"rectangle":shape}/>;}
