"use client";

import {
  Table as RACTable,
  TableHeader,
  TableBody,
  Column,
  Row,
  Cell,
  type TableProps,
} from "react-aria-components";
import { cn } from "@/lib/utils";

export type TableColumn = { id: string; label: string; isRowHeader?: boolean; width?: string };

export interface BTableProps extends Omit<TableProps, "className" | "children"> {
  columns: TableColumn[];
  rows: { id: string; cells: Record<string, React.ReactNode> }[];
  className?: string;
}

/**
 * 表格：斑马纹行、悬停高亮、表头灰底。
 */
export function Table({ columns, rows, className, ...props }: BTableProps) {
  return (
    <RACTable
      {...props}
      className={cn(
        "w-full overflow-hidden rounded-2lg border border-border-button-default text-body-2-regular",
        className
      )}
    >
      <TableHeader>
        {columns.map((c) => (
          <Column
            key={c.id}
            id={c.id}
            isRowHeader={c.isRowHeader}
            style={c.width ? { width: c.width } : undefined}
            className={cn(
              "bg-neutral-100 px-3 py-[10px] text-start dark:bg-neutral-900",
              "text-caption-1-semibold text-text-secondary",
              "outline-none"
            )}
          >
            {c.label}
          </Column>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <Row
            key={r.id}
            className={cn(
              "outline-none transition-colors duration-150",
              "hovered:bg-background-secondary-hover",
              "selected:bg-badge-new-background",
              "[&>td]:border-t [&>td]:border-border-primary"
            )}
          >
            {columns.map((c) => (
              <Cell key={c.id} className="px-3 py-[10px] text-text-primary">
                {r.cells[c.id]}
              </Cell>
            ))}
          </Row>
        ))}
      </TableBody>
    </RACTable>
  );
}
