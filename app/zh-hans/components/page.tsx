import Link from "next/link";
import type { Metadata } from "next";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
import { navigation } from "@/lib/navigation";
import { docMetaMap } from "@/lib/docs/meta";
import { cn } from "@/lib/utils";
import { Icon } from "@/app/components/ui/Icon";

/** 已实现的模板页 */
const TEMPLATE_SLUGS: string[] = [
  "ai-chat",
  "ai-image-generation",
  "ai-profile",
  "calendar",
  "chat-starter",
  "dashboard",
  "finance",
  "hr",
  "marketing",
  "medical-profile",
  "multi-agent-chat",
  "project-board",
];

export const metadata: Metadata = { title: "组件" };

/** 组件总览页：按分组列出全部组件 */
export default function ComponentsIndexPage() {
  const groups = navigation.filter((g) =>
    ["基础组件", "组合组件", "图表", "模板"].includes(g.title)
  );

  const toc = groups.map((g) => ({
    id: g.title,
    label: g.title,
  }));

  return (
    <DocsLayout
      breadcrumbs={[
        { label: "BoardUI", href: "/" },
        { label: "组件" },
      ]}
      toc={toc}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-title-1-medium text-text-primary">组件</h1>
        <p className="text-headline-medium text-text-secondary">
          基于 React Aria 的组件演示集合。视觉、交互与无障碍一致性正在逐项验收。
        </p>
      </header>

      {groups.map((group) => (
        <section
          key={group.title}
          id={group.title}
          className="flex scroll-mt-14 flex-col gap-3"
        >
          <div className="flex items-baseline justify-between">
            <h2 className="text-title-3-semibold text-text-primary">{group.title}</h2>
            <span className="text-caption-1-regular text-text-tertiary">
              {group.items.length} 个
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {group.items.map((item) => {
              const slug = item.href.split("/").pop() ?? "";
              // 模板分组看模板清单，其余看组件元数据（服务端可读）
              const hasDoc =
                group.title === "模板"
                  ? TEMPLATE_SLUGS.includes(slug)
                  : docMetaMap.has(slug);
              const Card = (
                <div
                  className={cn(
                    "group flex h-full items-start gap-3 rounded-2lg border border-border-button-default",
                    "bg-background-primary-default p-3",
                    "transition-[background-color,border-color] duration-150 ease-out",
                    hasDoc
                      ? "cursor-pointer hover:border-border-button-hover hover:bg-background-secondary-hover"
                      : "opacity-60"
                  )}
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-secondary-default text-foreground-icon-secondary">
                    <Icon name={hasDoc ? "checkbox-blank-circle-line" : "time-line"} className="size-4" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-body-medium text-text-primary">
                        {item.label}
                      </span>
                      {item.isNew && (
                        <span className="rounded-sm bg-badge-new-background px-1 text-[10px] font-medium text-accent-600 dark:text-accent-300">
                          全新
                        </span>
                      )}
                      {item.isPro && (
                        <span className="rounded-sm bg-[linear-gradient(135deg,#a855f7,#6366f1)] px-1 text-[10px] font-bold text-white">
                          Pro
                        </span>
                      )}
                    </div>
                    <span className="truncate text-caption-2-regular text-text-tertiary">
                      {hasDoc ? "已有演示 · 待验收" : "待实现"}
                    </span>
                  </div>
                  {hasDoc && (
                    <Icon
                      name="arrow-right-s-line"
                      className="mt-1 size-4 shrink-0 text-text-tertiary transition-transform duration-200 ease-bui group-hover:translate-x-0.5"
                    />
                  )}
                </div>
              );

              const target =
                group.title === "模板"
                  ? `/zh-hans/templates/${slug}`
                  : item.href;

              return hasDoc ? (
                <Link key={item.href} href={target}>
                  {Card}
                </Link>
              ) : (
                <div key={item.href}>{Card}</div>
              );
            })}
          </div>
        </section>
      ))}
    </DocsLayout>
  );
}
