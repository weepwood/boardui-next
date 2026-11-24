"use client";
import { Table as Core,TableHeader,TableColumn as Column,TableBody,TableRow as Row,TableCell as Cell,type TableProps } from "@/packages/react/table";
export type TableColumn={id:string;label:string;isRowHeader?:boolean;width?:string};
export interface BTableProps extends Omit<TableProps,"children">{columns:TableColumn[];rows:{id:string;cells:Record<string,React.ReactNode>}[]}
export function Table({columns,rows,className,...props}:BTableProps){
 return <Core {...props} aria-label={props["aria-label"]??"数据表格"} className={className} containerClassName="rounded-2xl border border-border-button-default">
 <TableHeader>{columns.map((c,i)=><Column key={c.id} id={c.id} isRowHeader={c.isRowHeader??i===0} style={c.width?{width:c.width}:undefined}>{c.label}</Column>)}</TableHeader>
 <TableBody renderEmptyState={()=> <div className="p-8 text-center text-text-tertiary">没有数据</div>}>{rows.map(r=><Row key={r.id} id={r.id}>{columns.map(c=><Cell key={c.id}>{r.cells[c.id]}</Cell>)}</Row>)}</TableBody></Core>;
}
