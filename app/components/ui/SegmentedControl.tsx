"use client";
import { SegmentedControl as Core, SegmentedControlItem } from "@/packages/react/segmented-control";
import { Icon } from "./Icon";
export type SegmentOption={id:string;label:string;icon?:string};
export function SegmentedControl({options,value,defaultValue,onChange,size="md",className}:{options:SegmentOption[];value?:string;defaultValue?:string;onChange?:(id:string)=>void;size?:"sm"|"md";className?:string}){
 if(!options.length)return null;
 return <Core aria-label="选项" selectedKeys={value===undefined?undefined:[value]} defaultSelectedKeys={value===undefined?[defaultValue??options[0].id]:undefined} onSelectionChange={keys=>{const key=[...keys][0];if(key!==undefined)onChange?.(String(key));}} className={className}>
 {options.map(o=><SegmentedControlItem key={o.id} id={o.id} className={size==="sm"?"h-6 gap-1.5 text-caption-1-medium":"gap-1.5"}>{o.icon&&<Icon name={o.icon} className="size-3.5"/>}{o.label}</SegmentedControlItem>)}
 </Core>;
}
