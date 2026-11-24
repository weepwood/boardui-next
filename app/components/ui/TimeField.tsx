"use client";
import { TimeField as RAC, DateInput, DateSegment, Label, Group } from "react-aria-components";
import { Time } from "@internationalized/date";
import { RiTimeLine } from "@remixicon/react";
import { fieldLabel,fieldState } from "@/packages/react/field-styles";
import { cx } from "@/packages/react/cx";
type Clock={hour:number;minute:number};
const convert=(v:Clock)=>new Time(Math.min(23,Math.max(0,v.hour)),Math.min(59,Math.max(0,v.minute)));
export function TimeField({label,value,defaultValue={hour:9,minute:0},onChange,className,isDisabled,isInvalid,isReadOnly}:{label?:string;value?:Clock;defaultValue?:Clock;onChange?:(v:Clock)=>void;className?:string;isDisabled?:boolean;isInvalid?:boolean;isReadOnly?:boolean}){
 return <RAC aria-label={label?undefined:"时间"} hourCycle={24} granularity="minute" value={value===undefined?undefined:convert(value)} defaultValue={value===undefined?convert(defaultValue):undefined} onChange={v=>{if(v)onChange?.({hour:v.hour,minute:v.minute})}} isDisabled={isDisabled} isInvalid={isInvalid} isReadOnly={isReadOnly} className={cx("flex w-fit flex-col gap-1",className)}>
 {label&&<Label className={fieldLabel}>{label}</Label>}<Group className={fieldState}><RiTimeLine className="size-5 shrink-0 text-foreground-icon-tertiary" aria-hidden/><DateInput className="flex items-center gap-0.5 text-body-medium tabular-nums">{segment=><DateSegment segment={segment} className="rounded-sm px-0.5 outline-none data-[focused]:bg-accent-600 data-[focused]:text-white data-[placeholder]:text-text-tertiary data-[disabled]:opacity-50"/>}</DateInput></Group></RAC>;
}
