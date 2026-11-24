"use client";
import { Calendar } from "react-aria-components";
import { today,getLocalTimeZone } from "@internationalized/date";
import { MonthPanel } from "@/packages/react/calendar-shared";
import { toCalendarDate,fromCalendarDate } from "@/packages/react/date-adapter";
import { Button } from "@/packages/react/button";
import { useState } from "react";
import { cx } from "@/packages/react/cx";
export function DateCalendar({value,onChange,disablePast,className}:{value?:Date;onChange?:(d:Date|undefined)=>void;disablePast?:boolean;className?:string}){
 const [inner,setInner]=useState<ReturnType<typeof toCalendarDate>>(null);
 const selected=value===undefined?inner:toCalendarDate(value);
 const now=today(getLocalTimeZone());
 return <Calendar aria-label="日期日历" value={selected} minValue={disablePast?now:undefined} onChange={d=>{if(value===undefined)setInner(d);onChange?.(fromCalendarDate(d))}} className={cx("max-w-full overflow-auto rounded-3xl bg-background-secondary-default p-2 shadow-dropdown",className)}><MonthPanel offset={0} showPrev showNext/><div className="flex justify-between px-2 pt-2"><Button size="small" variant="ghost" onClick={()=>{if(value===undefined)setInner(null);onChange?.(undefined)}}>清除</Button><Button size="small" variant="secondary" onClick={()=>{if(value===undefined)setInner(now);onChange?.(fromCalendarDate(now))}}>今天</Button></div></Calendar>;
}
export function formatDate(d?:Date){return d&&Number.isFinite(d.getTime())?`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`:"";}
