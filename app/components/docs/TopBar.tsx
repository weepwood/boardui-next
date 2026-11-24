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
    "hover:bg-background-secondary-hover hover:text-foreground-icon-primary"
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={cls}>
        <Icon name={icon} className="size-5" />
      </a>
    );
  }
  return (
    <Link href={href} aria-label={label} className={cls}>
      <Icon name={icon} className="size-5" />
    </Link>
  );
}

export function TopBar({ breadcrumbs }: { breadcrumbs: Crumb[] }) {
  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex shrink-0 items-center gap-1">
        {/* 语言切换 */}
        <span
          className={cn(
            "hidden h-8 items-center gap-1.5 rounded-2lg px-2 sm:inline-flex",
            "text-caption-1-medium text-text-secondary",
            "transition-colors duration-150 ease-out hover:bg-background-secondary-hover"
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
        <a href="https://www.boardui.com/" target="_blank" rel="noreferrer" aria-label="原版 BoardUI 官网"
          className={cn(
            "ms-1 flex h-8 cursor-pointer items-center gap-1 rounded-2lg px-2",
            "border border-border-button-default bg-background-primary-default",
            "text-caption-1-medium text-text-primary shadow-xs",
            "transition-colors duration-150 ease-out hover:bg-background-primary-hover"
          )}
        >
          <Icon name="vip-crown-2-line" className="size-4 text-amber-500" />
          <span className="shrink-0 px-1">原版官网</span>
        </a>
      </div>
    </div>
  );
}
