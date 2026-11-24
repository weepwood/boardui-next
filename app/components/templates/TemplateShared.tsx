"use client";
import { SegmentedControl } from "@/app/components/ui/SegmentedControl";
export function DemoNotice(){return <span className="rounded-md bg-background-tertiary-default px-2 py-1 text-caption-1-medium text-text-secondary">本地示例数据</span>}
export function TemplateSegments<T extends string>({values,value,onChange}:{values:readonly T[];value:T;onChange:(v:T)=>void}){return <SegmentedControl size="sm" options={values.map(v=>({id:v,label:v}))} value={value} onChange={v=>onChange(v as T)}/>;}
export function downloadCsv(name:string,rows:string[][]){
 const safe=(s:string)=>'"'+(/^[=+\-@\t\r]/.test(s)?"'"+s:s).replaceAll('"','""')+'"';
 const blob=new Blob(["\uFEFF"+rows.map(row=>row.map(safe).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}

/** Shared analytics surface: retain BoardUI's flat grey card treatment. */
export const analyticsPanel="flex min-w-0 flex-col gap-3 rounded-2xl bg-background-secondary-default p-3 @lg:p-4";
export const analyticsGrid="grid min-w-0 grid-cols-1 gap-3 @sm:grid-cols-2 @3xl:grid-cols-4";
export function AnalyticsSectionHeading({title,description,children}:{title:string;description?:string;children?:React.ReactNode}){
 return <div className="flex min-w-0 flex-wrap items-center justify-between gap-2"><div className="min-w-0"><h4 className="text-body-medium text-text-primary">{title}</h4>{description&&<p className="mt-0.5 text-caption-1-regular text-text-secondary">{description}</p>}</div>{children}</div>
}
