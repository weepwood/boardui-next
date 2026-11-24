"use client";
import { Slider as Core, type SliderProps } from "@/packages/react/slider";
export interface BSliderProps extends SliderProps {showValue?:boolean}
export function Slider({showValue=true,showTooltip,...props}:BSliderProps){return <Core {...props} showTooltip={showTooltip??showValue} thumbLabel={props.thumbLabel??(typeof props.label==="string"?props.label:"数值")} className={["w-full",props.className].filter(Boolean).join(" ")}/>;}
export { RangeSlider } from "@/packages/react/slider";
