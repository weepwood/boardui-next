"use client";
import {useDeferredValue,useMemo,useState} from "react";
import {CatalogCard,type CatalogCardProps} from "./CatalogCard";
import type {ComponentType} from "react";
import {SvgIcon} from "@/packages/react/svg-icon";
import type {CatalogGroups} from "./catalog-data";
const categories=["基础组件","组合组件","图表","模板"];
export function ComponentCatalog({templatesOnly=false,available,Card=CatalogCard}:{templatesOnly?:boolean;available:CatalogGroups;Card?:ComponentType<CatalogCardProps>}){
 const [query,setQuery]=useState(""),[category,setCategory]=useState("全部"),[status,setStatus]=useState("all");
 const search=useDeferredValue(query.trim().toLowerCase());
 const groups=useMemo(()=>available.filter(g=>category==="全部"||g.title===category).map(g=>({...g,items:g.items.filter(i=>(status==="all"||i.status===status)&&[i.label,i.slug,i.description,g.title].join(" ").toLowerCase().includes(search))})).filter(g=>g.items.length),[available,category,status,search]);
 const total=available.reduce((n,g)=>n+g.items.length,0), count=groups.reduce((n,g)=>n+g.items.length,0);
 return <>
 <div className="docs-catalog-toolbar flex min-w-0 flex-col gap-3">
  <div className="flex flex-wrap items-center gap-2">
   <label className="docs-search-field flex h-10 min-w-[180px] flex-1 items-center gap-2 rounded-2lg px-3"><SvgIcon name="search-line" className="size-5 text-foreground-icon-secondary"/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="搜索组件目录" placeholder="搜索组件名称、英文名或描述" className="w-full min-w-0 bg-transparent text-body-regular outline-none focus-visible:outline-none"/>{query&&<button type="button" aria-label="清空组件搜索" onClick={()=>setQuery("")} className="rounded-md p-1 hover:bg-background-secondary-hover"><SvgIcon name="close-line"/></button>}</label>
   <label className="flex items-center gap-2 text-body-2-medium text-text-secondary">实现状态<select aria-label="实现状态" value={status} onChange={e=>setStatus(e.target.value)} className="h-10 rounded-2lg border border-border-button-default bg-background-primary-default px-3 text-body-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"><option value="all">全部</option><option value="ported">原版公开源码</option><option value="independent">独立实现</option><option value="existing">其他本地实现</option><option value="missing">待实现</option></select></label>
  </div>
  <div role="group" aria-label="组件分类" className="flex flex-wrap items-center gap-1 border-b border-separator-border pb-3">{(templatesOnly?["全部"]:["全部",...categories]).map(c=><button type="button" key={c} aria-pressed={category===c} onClick={()=>setCategory(c)} className={"rounded-lg px-3 py-1.5 text-body-medium transition-colors motion-reduce:transition-none "+(category===c?"bg-background-secondary-hover text-text-primary":"text-text-secondary hover:bg-background-primary-hover")}>{c}</button>)}<span role="status" className="ms-auto text-body-2-regular text-text-secondary">{count} / {total} 项</span></div>
 </div>
 {groups.length===0?<div className="rounded-3xl border border-border-component-detail-container p-12 text-center text-text-secondary">没有匹配的组件。<button type="button" onClick={()=>{setQuery("");setCategory("全部");setStatus("all")}} className="ms-2 underline">重置筛选</button></div>:groups.map(g=><section key={g.title} id={g.title==="模板"?"templates":g.title} className="flex scroll-mt-10 flex-col gap-4"><h2 className="flex items-baseline gap-2 text-title-2-medium text-text-primary">{g.title}<span className="text-body-regular text-text-secondary">{g.items.length}</span></h2><div className="grid w-full grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-[repeat(3,minmax(0,304px))]">{g.items.map(i=><Card key={i.href} title={i.label} {...i}/>)}</div></section>)}
 </>;
}
