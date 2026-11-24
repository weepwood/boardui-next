"use client";
import { SegmentedControl } from "@/app/components/ui/SegmentedControl";
export function DemoNotice(){return <span className="rounded-md bg-background-tertiary-default px-2 py-1 text-caption-1-medium text-text-secondary">本地示例数据</span>}
export function TemplateSegments<T extends string>({values,value,onChange}:{values:readonly T[];value:T;onChange:(v:T)=>void}){return <SegmentedControl size="sm" options={values.map(v=>({id:v,label:v}))} value={value} onChange={v=>onChange(v as T)}/>;}
export function downloadCsv(name:string,rows:string[][]){
 const safe=(s:string)=>'"'+(/^[=+\-@\t\r]/.test(s)?"'"+s:s).replaceAll('"','""')+'"';
 const blob=new Blob(["\uFEFF"+rows.map(row=>row.map(safe).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
