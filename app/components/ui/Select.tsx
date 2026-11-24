"use client";
import { useId } from "react";
import type { SelectProps as RACSelectProps } from "react-aria-components";
import { Select as CoreSelect, SelectItem } from "@/packages/react/select";
import { Icon } from "./Icon";
export type SelectOption={id:string;label:string;icon?:string};
export interface BSelectProps extends Omit<RACSelectProps<object>,"className"|"children"> {label?:string;placeholder?:string;options:SelectOption[];className?:string;}
export function Select({label,placeholder="请选择…",options,className,...props}:BSelectProps){
 const id=useId();
 return <div className={"flex w-full flex-col gap-1 "+(className??"")}>
 {label&&<span id={id} className="text-body-medium text-text-primary">{label}</span>}
 <CoreSelect {...props} aria-label={props["aria-label"]??(!label?placeholder:undefined)} aria-labelledby={props["aria-labelledby"]??(label?id:undefined)} placeholder={placeholder} triggerClassName="min-h-9 py-1.5" popoverClassName="z-50 min-w-[var(--trigger-width)]">
 {options.map(o=><SelectItem key={o.id} id={o.id} textValue={o.label}>{o.icon&&<Icon name={o.icon} className="size-5 shrink-0"/>}<span className="truncate">{o.label}</span></SelectItem>)}
 </CoreSelect></div>;
}
