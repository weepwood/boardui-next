"use client";
import {useId,useState,type ReactNode} from "react";
export type ChartDatum={label:string;value:number;color?:string;x?:number;y?:number;secondary?:number};
export function ChartDataInspector({records,children,seriesLabels=["柱","线"]}:{records:ChartDatum[];seriesLabels?:[string,string];children:(active:number|null)=>ReactNode}){
 const id=useId(),[selected,setSelected]=useState<number|null>(null),[hovered,setHovered]=useState<number|null>(null);
 const index=hovered??selected;
 const active=index!==null&&index>=0&&index<records.length?index:null;
 const row=active===null?null:records[active];
 const targetIndex=(target:EventTarget|null)=>{const element=target instanceof Element?target.closest("[data-chart-index]"):null;const raw=element?.getAttribute("data-chart-index");const n=raw==null?NaN:Number(raw);return Number.isInteger(n)&&n>=0&&n<records.length?n:null};
 if(!records.length)return <div role="status" className="flex min-h-32 items-center justify-center text-body-2-regular text-text-secondary">暂无可展示数据</div>;
 return <div className="flex min-w-0 flex-col gap-2" data-chart-inspector>
  <div className="relative min-w-0" onPointerMove={e=>setHovered(targetIndex(e.target))} onPointerLeave={()=>setHovered(null)} onPointerDown={e=>{const n=targetIndex(e.target);if(n!==null)setSelected(n)}}>
   {children(active)}
   {row&&<div data-chart-tooltip role="status" className="pointer-events-none absolute end-1 top-1 z-10 max-w-[min(200px,100%)] rounded-xl border border-border-button-default bg-background-primary-default p-2.5 text-body-2-regular text-text-primary shadow-dropdown"><p className="font-medium">{row.label}</p><p className="tabular-nums">{row.x!==undefined&&row.y!==undefined?`X: ${row.x} · Y: ${row.y}`:row.secondary!==undefined?`${seriesLabels[0]}：${row.value.toLocaleString("en-US")} · ${seriesLabels[1]}：${row.secondary.toLocaleString("en-US")}`:row.value.toLocaleString("en-US")}</p></div>}
  </div>
  <div className="flex flex-wrap items-center justify-end gap-1 text-caption-2-regular text-text-secondary"><label htmlFor={id}>数据点</label><select id={id} aria-label="查看图表数据点" value={selected!==null&&selected<records.length?selected:""} onChange={e=>{setHovered(null);setSelected(e.target.value===""?null:Number(e.target.value))}} className="max-w-full rounded-md border border-border-button-default bg-background-primary-default px-1 py-0.5 text-text-primary focus-visible:outline-2 focus-visible:outline-border-focus-ring"><option value="">选择</option>{records.map((r,i)=><option key={i} value={i}>{r.label}</option>)}</select></div>
 </div>
}
