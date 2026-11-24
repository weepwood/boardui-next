"use client";
import { Avatar as Core } from "@/packages/react/avatar";
export function Avatar({name,src,size="md",className}:{name:string;src?:string;size?:"xs"|"sm"|"md"|"lg"|"xl";className?:string}){
 const colors=["neutral","blue","lime","pink"] as const;let hash=0;for(const c of name)hash=(hash*31+c.codePointAt(0)!)%997;
 return <Core size={size==="xl"||size==="lg"||size==="md"?"lg":size} color={colors[hash%colors.length]} src={src} alt={name} initials={Array.from(name.trim())[0]?.toUpperCase()??"?"} aria-label={name} title={name} className={[size==="xl"?"size-12":size==="lg"?"size-10":undefined,className].filter(Boolean).join(" ")}/>;
}
