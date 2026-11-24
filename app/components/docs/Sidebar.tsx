"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "../ui/Icon";
import { CommandSearch } from "./CommandSearch";

/** 新徽标：原站 bg-badge-new-background px-1 py-px rounded-sm */
function NewBadge() {
  return (
    <span className="inline-flex items-center rounded-sm bg-badge-new-background px-1 py-px text-[10px] font-medium leading-[1.5] text-accent-600 dark:text-accent-300">
      全新
    </span>
  );
}

/** Pro 徽标 */
function ProBadge() {
  return (
    <span className="inline-flex items-center rounded-sm bg-[linear-gradient(135deg,#a855f7,#6366f1)] px-1 py-px text-[10px] font-bold leading-[1.5] text-white">
      Pro
    </span>
  );
}

/**
 * 树状导引线：原站结构
 * 竖线 + 右下弯角（SVG 路径 M0.5 0 Q0.5 5 5.5 5 H11.5）
 */
function TreeGuide({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 start-[12.5px] w-3 text-foreground-icon-secondary"
    >
      <span className="absolute top-0 start-0 -bottom-0.5 w-px bg-current opacity-40" />
      <svg
        width="12"
        height="6"
        viewBox="0 0 12 6"
        fill="none"
        className="absolute top-1/2 start-0 -translate-y-[5px] rtl:-scale-x-100"
      >
        <path
          d="M0.5 0 Q0.5 5 5.5 5 H11.5"
          stroke="currentColor"
          strokeWidth="1"
          opacity={active ? 1 : 0.4}
        />
      </svg>
    </span>
  );
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname.replace(/\/$/, "") === item.href.split("#")[0].replace(/\/$/, "");

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-2 rounded-md py-1.5 pe-2.5 ps-8",
        "text-body-medium transition-colors duration-150 ease-out",
        active
          ? "bg-background-secondary-hover font-medium text-text-primary"
          : "text-text-secondary hover:bg-background-secondary-hover hover:text-text-primary"
      )}
    >
      <TreeGuide active={active} />
      <span className="truncate">{item.label}</span>
      {(item.isNew || item.isPro) && (
        <span className="ms-auto flex shrink-0 items-center gap-1">
          {item.isNew && <NewBadge />}
          {item.isPro && <ProBadge />}
        </span>
      )}
    </Link>
  );
}

/** 可折叠分组：grid-template-rows 动画，与原站一致 */
function NavGroupSection({
  title,
  items,
  defaultOpen = true,
}: {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 pt-2 pb-1",
          "text-caption-1-semibold tracking-wide text-text-tertiary uppercase",
          "transition-colors duration-150 ease-out hover:bg-background-secondary-hover",
          "outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        )}
      >
        <span className="-translate-y-px">{title}</span>
        <Icon
          name="arrow-down-s-line"
          className={cn(
            "size-3.5 transition-transform duration-200 ease-bui",
            !open && "-rotate-90"
          )}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-in-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <div className="relative flex flex-col gap-0.5">
            {items.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const total = navigation.reduce((n, g) => n + g.items.length, 0);
  const [searchOpen, setSearchOpen] = useState(false);

  // ⌘K / Ctrl+K 唤起搜索
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
    <aside
      className={cn(
        "sticky top-3 m-3 hidden h-[calc(100vh-24px)] w-[260px] shrink-0",
        "flex-col gap-3 overflow-hidden rounded-3xl border border-border-button-white",
        "bg-background-secondary-default p-3 shadow-sidebar lg:flex"
      )}
    >
      {/* 品牌 */}
      <Link href="/" className="flex w-full items-center gap-2 px-1">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-text-primary text-[13px] font-bold text-background-full">
          B
        </span>
        <span className="text-title-3-semibold text-text-primary">BoardUI</span>
      </Link>

      {/* 快速搜索 */}
      <button
        type="button"
        aria-label="快速搜索"
        onClick={() => setSearchOpen(true)}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2 rounded-full",
          "bg-background-tertiary-default px-3 py-1.5 text-start",
          "transition-colors duration-150 ease-out hover:bg-background-tertiary-hover"
        )}
      >
        <span className="flex flex-1 items-center gap-2">
          <Icon
            name="search-line"
            className="size-5 shrink-0 text-foreground-icon-secondary"
          />
          <span className="text-body-medium text-text-secondary">快速搜索</span>
        </span>
        <kbd
          className={cn(
            "inline-flex items-center justify-center rounded-full px-1.5 py-0.5",
            "bg-kbd-subtle-background text-[11px] font-medium text-kbd-foreground"
          )}
        >
          ⌘K
        </kbd>
      </button>

      {/* 导航树 */}
      <nav
        aria-label="元件库"
        className={cn(
          "-mr-1 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pe-1",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        <p className="sr-only" aria-live="polite">
          显示 <span className="contents">{total}</span> 项
        </p>
        {navigation.map((group) => (
          <NavGroupSection key={group.title} title={group.title} items={group.items} />
        ))}
      </nav>
    </aside>
    <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
