"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export type TreeNode = {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
};

function Node({
  node,
  depth,
  selected,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!node.children?.length;
  const isSelected = selected === node.id;

  return (
    <div className="flex flex-col">
      <div
        role="treeitem"
        aria-selected={isSelected}
        aria-expanded={hasChildren ? open : undefined}
        tabIndex={0}
        onClick={() => onSelect(node.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(node.id);
          }
        }}
        style={{ paddingInlineStart: 8 + depth * 14 }}
        className={cn(
          "flex cursor-pointer items-center gap-1.5 rounded-md py-1 pe-2",
          "text-body-2-medium transition-colors duration-150 ease-out",
          "outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
          isSelected
            ? "bg-background-secondary-hover text-text-primary"
            : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary"
        )}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            aria-label={open ? "折叠" : "展开"}
            className="flex size-4 shrink-0 cursor-pointer items-center justify-center text-text-tertiary"
          >
            <Icon
              name="arrow-right-s-line"
              className={cn(
                "size-3.5 transition-transform duration-200 ease-bui",
                open && "rotate-90"
              )}
            />
          </button>
        ) : (
          <span className="size-4 shrink-0" />
        )}
        {node.icon && (
          <Icon name={node.icon} className="size-4 shrink-0 text-foreground-icon-secondary" />
        )}
        <span className="truncate">{node.label}</span>
      </div>

      {hasChildren && (
        <div
          className="grid transition-[grid-template-rows,opacity] duration-250 ease-in-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
        >
          <div className="overflow-hidden">
            {node.children!.map((c) => (
              <Node key={c.id} node={c} depth={depth + 1} selected={selected} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** 树形视图：可展开层级结构 */
export function TreeView({
  nodes,
  defaultSelected,
  className,
}: {
  nodes: TreeNode[];
  defaultSelected?: string;
  className?: string;
}) {
  const [selected, setSelected] = useState(defaultSelected ?? nodes[0]?.id ?? "");
  return (
    <div role="tree" aria-label="树形导航" className={cn("flex flex-col gap-0.5", className)}>
      {nodes.map((n) => (
        <Node key={n.id} node={n} depth={0} selected={selected} onSelect={setSelected} />
      ))}
    </div>
  );
}
