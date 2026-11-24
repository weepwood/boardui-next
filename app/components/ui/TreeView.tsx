"use client";
import { TreeView as Core,TreeViewItem } from "@/packages/react/tree-view";
import { resolveIcon } from "@/packages/react/svg-icon";
import type { Key } from "react-aria-components";
export type TreeNode={id:string;label:string;icon?:string;children?:TreeNode[]};
function branches(nodes:TreeNode[]):string[]{return nodes.flatMap(n=>n.children?.length?[n.id,...branches(n.children)]:[])}
function render(nodes:TreeNode[]):React.ReactNode{return nodes.map(n=><TreeViewItem key={n.id} id={n.id} label={n.label} icon={n.icon?resolveIcon(n.icon):undefined}>{n.children&&render(n.children)}</TreeViewItem>)}
export function TreeView({nodes,defaultSelected,className,selected,onSelect}:{nodes:TreeNode[];defaultSelected?:string;className?:string;selected?:string;onSelect?:(id:string)=>void}){
 return <Core aria-label="树形导航" className={className} defaultExpandedKeys={branches(nodes)} selectedKeys={selected===undefined?undefined:[selected]} defaultSelectedKeys={selected===undefined?[defaultSelected??nodes[0]?.id].filter((x):x is string=>!!x):undefined} onSelectionChange={keys=>{if(keys!=="all"){const id=[...keys][0] as Key|undefined;if(id!==undefined)onSelect?.(String(id))}}}>{render(nodes)}</Core>;
}
