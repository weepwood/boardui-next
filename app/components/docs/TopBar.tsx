"use client";

import Link from "next/link";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { ThemeToggle } from "./ThemeToggle";
import { Icon } from "../ui/Icon";
import { cn } from "@/lib/utils";

/** 顶栏图标按钮 */
function IconLink({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon: string;
  external?: boolean;
}) {
  const cls = cn(
    "hidden sm:inline-flex size-8 cursor-pointer items-center justify-center rounded-2lg",
    "text-foreground-icon-secondary transition-colors duration-150 ease-out",
    "hover:bg-background-secondary-hover hover:text-foreground-icon-primary active:bg-background-secondary-default",
    "outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className={cls}>
        <Icon name={icon} className="size-5" />
      </a>
    );
  }
  return (
    <Link href={href} aria-label={label} title={label} className={cls}>
      <Icon name={icon} className="size-5" />
    </Link>
  );
}

export function TopBar({ breadcrumbs }: { breadcrumbs: Crumb[] }) {
  return (
    <div className="flex min-w-0 w-full items-center justify-between gap-3">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex shrink-0 items-center gap-1">
        {/* 语言切换 */}
        <span
          className={cn(
            "hidden h-9 items-center gap-1.5 rounded-2lg px-2 md:inline-flex",
            "text-caption-1-medium text-text-secondary",
            "transition-colors duration-150 ease-out"
          )}
        >
          <Icon name="translate-2" className="size-4" />
          简体中文
        </span>

        <ThemeToggle />

        <IconLink
          href="https://github.com/BoardUI/boardui"
          label="GitHub 上的 BoardUI"
          icon="github-fill"
          external
        />
        <IconLink
          href="https://discord.gg/boardui"
          label="Discord 社区"
          icon="discord-fill"
          external
        />

        {/* Pro 按钮 */}
        <a href="https://www.boardui.com/" target="_blank" rel="noreferrer" aria-label="原版 BoardUI 官网" title="原版 BoardUI 官网（新窗口打开）"
          className={cn(
            "ms-1 hidden h-9 cursor-pointer sm:flex items-center gap-1 rounded-2lg px-2",
            "border border-border-button-default bg-background-primary-default",
            "text-caption-1-medium text-text-primary shadow-xs",
            "transition-colors duration-150 ease-out hover:bg-background-primary-hover hover:border-border-button-hover active:shadow-none outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          )}
        >
          <Icon name="arrow-right-up-line" className="size-4 text-foreground-icon-secondary" />
          <span className="shrink-0 px-1">原版官网</span>
        </a>
      </div>
    </div>
  );
}
