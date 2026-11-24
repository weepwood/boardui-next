"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";
import { Checkbox } from "./Checkbox";
import { Badge } from "./Badge";

export type Column = {
  id: string;
  label: string;
  align?: "start" | "end";
  sortable?: boolean;
  width?: string;
  sortValue?: (row:DataRow)=>string|number;
};

export type DataRow = {
  id: string;
  cells: Record<string, string | React.ReactNode>;
  badgeColumn?: string;
  badgeVariant?: Record<string, "success" | "warning" | "danger" | "neutral" | "accent">;
};

/**
 * 数据网格：紧凑行高 + 行内操作，适合后台批量处理。
 */
export function DataGrid({
  columns,
  rows,
  selectable = true,
  className,
  density="compact", selectedIds, onSelectionChange,
}: {
  columns: Column[];
  rows: DataRow[];
  selectable?: boolean;
  className?: string;
  density?:"compact"|"comfortable";
  selectedIds?:string[];
  onSelectionChange?:(ids:string[])=>void;
}) {
  const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" } | null>(null);
  const [inner, setInner] = useState<string[]>([]);
  const rowIds=new Set(rows.map(r=>r.id));
  const selected=(selectedIds??inner).filter(id=>rowIds.has(id));
  const setSelected=(next:string[]|((prev:string[])=>string[]))=>{const ids=typeof next==="function"?next(selected):next;const unique=[...new Set(ids)];if(selectedIds===undefined)setInner(unique);onSelectionChange?.(unique)};

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const accessor=columns.find(c=>c.id===sort.col)?.sortValue;
      const av=accessor?accessor(a):a.cells[sort.col]; const bv=accessor?accessor(b):b.cells[sort.col];
      const r=typeof av==="number"&&typeof bv==="number"?av-bv:String(typeof av==="object"?"":av??"").localeCompare(String(typeof bv==="object"?"":bv??""),"zh",{numeric:true});
      return sort.dir === "asc" ? r : -r;
    });
    return copy;
  }, [rows, sort, columns]);

  const allChecked = selected.length === rows.length && rows.length > 0;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2lg border border-border-button-default",
        "bg-background-primary-default",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table aria-label="数据表格" className={cn("bui-table",density==="compact"&&"bui-table-sm")}>
          <thead>
            <tr className="bg-background-secondary-default">
              {selectable && (
                <th scope="col" className="w-9 px-2 py-1.5">
                  <Checkbox
                    isSelected={allChecked}
                    isIndeterminate={selected.length > 0 && !allChecked}
                    onChange={(on) => setSelected(on ? rows.map((r) => r.id) : [])}
                    aria-label="全选"
                  />
                </th>
              )}
              {columns.map((c) => (
                <th
                  key={c.id}
                  style={c.width ? { width: c.width } : undefined}
                  scope="col" aria-sort={c.sortable?(sort?.col===c.id?(sort.dir==="asc"?"ascending":"descending"):"none"):undefined}
                  className={cn(
                    "px-2 py-1.5 text-caption-1-semibold font-medium text-text-secondary",
                    c.align === "end" ? "text-end" : "text-start"
                  )}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSort((prev) =>
                          prev?.col === c.id
                            ? { col: c.id, dir: prev.dir === "asc" ? "desc" : "asc" }
                            : { col: c.id, dir: "asc" }
                        )
                      }
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-0.5 hover:text-text-primary",
                        c.align === "end" && "flex-row-reverse"
                      )}
                    >
                      {c.label}
                      <Icon
                        name={
                          sort?.col === c.id && sort.dir === "desc"
                            ? "arrow-down-s-line"
                            : "arrow-up-s-line"
                        }
                        className={cn(
                          "size-3",
                          sort?.col === c.id ? "text-accent-500" : "opacity-40"
                        )}
                      />
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="py-10 text-center text-caption-1-regular text-text-tertiary"
                >
                  没有数据
                </td>
              </tr>
            ) : (
              sorted.map((r) => {
                const on = selected.includes(r.id);
                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-t border-border-primary transition-colors duration-150",
                      on ? "bg-background-secondary-hover" : "hover:bg-background-secondary-hover"
                    )}
                  >
                    {selectable && (
                      <td className="px-2 py-1.5">
                        <Checkbox
                          isSelected={on}
                          onChange={(v) =>
                            setSelected((prev) =>
                              v ? [...prev, r.id] : prev.filter((x) => x !== r.id)
                            )
                          }
                          aria-label={`选择第 ${r.id} 行`}
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td
                        key={c.id}
                        className={cn(
                          "px-2 py-1.5 text-text-primary",
                          c.align === "end" && "text-end tabular-nums"
                        )}
                      >
                        {c.id === r.badgeColumn && typeof r.cells[c.id] === "string" ? (
                          <Badge
                            variant={r.badgeVariant?.[String(r.cells[c.id])] ?? "neutral"}
                          >
                            {r.cells[c.id]}
                          </Badge>
                        ) : (
                          r.cells[c.id]
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectable && selected.length > 0 && (
        <div className="flex items-center gap-2 border-t border-border-primary bg-background-secondary-default px-3 py-1.5">
          <span className="text-caption-2-medium text-text-secondary">
            已选 {selected.length} 项
          </span>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="ms-auto cursor-pointer text-caption-1-medium text-text-tertiary hover:text-text-primary"
          >
            清除选择
          </button>
        </div>
      )}
    </div>
  );
}
