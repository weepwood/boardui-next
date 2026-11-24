"use client";
import {useMemo} from "react";
import {useRouter} from "next/navigation";
import {navigation} from "@/lib/navigation";
import {CommandPalette,type CommandItem} from "../ui/CommandPalette";
export function CommandSearch({open,onClose}:{open:boolean;onClose:()=>void}){
 const router=useRouter();
 const items=useMemo<CommandItem[]>(()=>navigation.flatMap(g=>g.items.map(i=>({id:i.href,label:i.label,group:g.title,icon:"file-text-line",keywords:[i.href],onSelect:()=>router.push(i.href)}))),[router]);
 return <CommandPalette open={open} onClose={onClose} items={items} dialogLabel="搜索文档" inputLabel="搜索文档" placeholder="搜索组件、文档…"/>;
}
