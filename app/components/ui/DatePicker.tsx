"use client";
import { DatePicker as Core } from "@/packages/react/date-picker";
import { toCalendarDate,fromCalendarDate } from "@/packages/react/date-adapter";
export function DatePicker({label,value,defaultValue,onChange,placeholder="选择日期",className,isDisabled,minValue,maxValue}:{label?:string;value?:Date;defaultValue?:Date;onChange?:(date:Date)=>void;placeholder?:string;className?:string;isDisabled?:boolean;minValue?:Date;maxValue?:Date}){
 return <div className={"flex w-fit max-w-full flex-col gap-1 "+(className??"")}>{label&&<span className="text-body-medium text-text-primary">{label}</span>}<Core aria-label={label??placeholder} placeholder={placeholder} value={value===undefined?undefined:toCalendarDate(value)} defaultValue={toCalendarDate(defaultValue)} minValue={toCalendarDate(minValue)??undefined} maxValue={toCalendarDate(maxValue)??undefined} isDisabled={isDisabled} onChange={d=>{if(d)onChange?.(fromCalendarDate(d))}}/></div>;
}
