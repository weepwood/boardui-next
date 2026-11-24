"use client";
import {useId,useState,type ReactNode} from "react";
import {chartTooltip,chartControlRow,chartControl} from "./ChartInspectionStyles";
export type ChartDatum={label:string;value:number;color?:string;x?:number;y?:number;secondary?:number};
export function ChartDataInspector({records,children,seriesLabels=["柱","线"],renderSummary,resetKey=""}:{records:ChartDatum[];seriesLabels?:[string,string];renderSummary?:(row:ChartDatum|null)=>ReactNode;resetKey?:string;children:(active:number|null)=>ReactNode}){
 const id=useId(),[selected,setSelected]=useState<number|null>(null),[hovered,setHovered]=useState<number|null>(null);
 const [previousKey,setPreviousKey]=useState(resetKey);
 // Reset the inspected record on range changes without remounting the range controls.
 if(previousKey!==resetKey){setPreviousKey(resetKey);setSelected(null);setHovered(null);}
 const index=hovered??selected;
 const active=index!==null&&index>=0&&index<records.length?index:null;
 const row=active===null?null:records[active];
 const committed=selected!==null?records[selected]:undefined;
 const describe=(datum:ChartDatum)=>datum.x!==undefined&&datum.y!==undefined?`X: ${datum.x} · Y: ${datum.y}`:datum.secondary!==undefined?`${seriesLabels[0]}：${datum.value.toLocaleString("en-US")} · ${seriesLabels[1]}：${datum.secondary.toLocaleString("en-US")}`:datum.value.toLocaleString("en-US");
 const targetIndex=(target:EventTarget|null)=>{const element=target instanceof Element?target.closest("[data-chart-index]"):null;const raw=element?.getAttribute("data-chart-index");const n=raw==null?NaN:Number(raw);return Number.isInteger(n)&&n>=0&&n<records.length?n:null};
 if(!records.length)return <div className="flex min-w-0 flex-col gap-3">{renderSummary?.(null)}<div role="status" className="flex min-h-32 items-center justify-center text-body-2-regular text-text-secondary">暂无可展示数据</div></div>;
 return <div className="flex min-w-0 flex-col gap-2" data-chart-inspector>
  {renderSummary?.(row)}
  <span data-chart-announcement className="sr-only" aria-live="polite" aria-atomic="true">{committed?`${committed.label}：${describe(committed)}`:""}</span>
  <div className="relative min-w-0" onPointerMove={e=>{if(e.pointerType!=="touch")setHovered(targetIndex(e.target))}} onPointerLeave={()=>setHovered(null)} onPointerDown={e=>{const n=targetIndex(e.target);if(n!==null){setSelected(n);setHovered(null)}}} onPointerCancel={()=>setHovered(null)}>
   {children(active)}
   {row&&<div data-chart-tooltip aria-hidden="true" className={chartTooltip} style={active!==null&&active<records.length/2?{insetInlineEnd:4}:{insetInlineStart:4}}><p className="font-medium">{row.label}</p><p className="tabular-nums">{describe(row)}</p></div>}
  </div>
  <div className={chartControlRow}><label htmlFor={id}>数据点</label><select id={id} aria-label="查看图表数据点" value={selected!==null&&selected<records.length?selected:""} onChange={e=>{setHovered(null);setSelected(e.target.value===""?null:Number(e.target.value))}} className={chartControl}><option value="">选择</option>{records.map((r,i)=><option key={i} value={i}>{r.label}</option>)}</select></div>
 </div>
}
