"use client";
import { Breadcrumb as Core,BreadcrumbItem } from "@/packages/react/breadcrumb";
export type CrumbItem={id:string;label:string;href?:string;onClick?:()=>void};
export function Breadcrumb({items,className}:{items:CrumbItem[];className?:string}){
 return <Core className={className}>{items.map((item,i)=><BreadcrumbItem key={item.id} href={item.href} onClick={item.onClick} current={i===items.length-1}>{item.label}</BreadcrumbItem>)}</Core>;
}
