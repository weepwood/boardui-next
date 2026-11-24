"use client";
import { Pagination as Core } from "@/packages/react/pagination";
export function Pagination({page,total,onChange,className}:{page:number;total:number;onChange?:(p:number)=>void;className?:string}){
 return <Core page={Math.min(Math.max(1,Math.trunc(page)||1),Math.max(1,Math.trunc(total)||1))} totalPages={Math.max(0,Math.trunc(total)||0)} onChange={p=>onChange?.(p)} className={className}/>;
}
