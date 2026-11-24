import Link from "next/link";
import { DocsLayout } from "./components/docs/DocsLayout";
import { Icon } from "./components/ui/Icon";
import { buttonStyles } from "@/packages/styles/button";

import { docMetas } from "@/lib/docs/meta";

export default function HomePage() {
  const total = docMetas.length;

  return (
    <DocsLayout variant="catalog" breadcrumbs={[{ label: "BoardUI" }, { label: "首页" }]}>
      {/* Hero */}
      <header className="flex max-w-[760px] flex-col gap-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-body-2-medium text-text-secondary">BoardUI Next</span><span aria-hidden className="h-1 w-1 rounded-full bg-separator-border"/>
          <span className="text-caption-1-regular text-text-tertiary">
            {total} 个组件文档 · 待逐项验收
          </span>
        </div>
        <h1 className="text-title-1-medium sm:text-large-title-medium text-text-primary text-balance">
          为 AI 原生产品打造的组件
        </h1>
        <p className="max-w-2xl text-headline-medium text-text-secondary">
          基于 React Aria 的组件、设计令牌与应用模板。参考 BoardUI 原版公开设计，持续完善本地实现。
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Link prefetch={false} href="/zh-hans/components" className={buttonStyles.base+" "+buttonStyles.size.medium+" "+buttonStyles.variant.primary}><span className="px-1">浏览组件</span><Icon name="arrow-right-line" className="size-5"/></Link>
          <Link prefetch={false} href="/zh-hans/components/button" className={buttonStyles.base+" "+buttonStyles.size.medium+" "+buttonStyles.variant.secondary}><span className="px-1">查看按钮示例</span></Link>
        </div>
      </header>

      {/* 组件入口 */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-title-2-medium text-text-primary">组件</h2>
          <Link
            href="/zh-hans/components"
            className="text-body-2-medium text-accent-600 hover:underline dark:text-accent-400"
          >
            查看全部
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {docMetas.slice(0, 12).map((m) => (
            <Link
              key={m.slug}
              href={`/zh-hans/components/${m.slug}`}
              data-home-card
              prefetch={false}
              className="docs-entry-card group flex min-h-[94px] min-w-0 flex-col gap-1.5 rounded-2xl bg-background-primary-default p-4"
            >
              <span className="flex items-center justify-between gap-1">
                <span className="truncate text-headline-medium text-text-primary">{m.title}</span>
                <Icon
                  name="arrow-right-s-line"
                  className="size-3.5 shrink-0 text-text-tertiary transition-transform duration-200 ease-bui group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                />
              </span>
              <span className="line-clamp-2 text-body-regular text-pretty text-text-secondary">
                {m.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 模板入口 */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between"><h2 className="text-title-2-medium text-text-primary">模板</h2><Link prefetch={false} href="/zh-hans/templates" className="text-body-2-medium text-accent-600 hover:underline dark:text-accent-400">查看全部</Link></div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { href: "/zh-hans/templates/dashboard", title: "仪表盘", desc: "统计卡 · 面积图 · 热力图 · 数据表" },
            { href: "/zh-hans/templates/ai-chat", title: "AI 聊天", desc: "会话列表 · 消息流 · 复合输入区" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              prefetch={false}
              className="docs-entry-card group flex flex-col gap-1.5 rounded-2xl bg-background-primary-default p-4"
            >
              <span className="flex items-center justify-between">
                <span className="text-body-medium text-text-primary">{t.title}</span>
                <Icon
                  name="arrow-right-s-line"
                  className="size-4 text-text-tertiary transition-transform duration-200 ease-bui group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                />
              </span>
              <span className="text-body-regular text-text-secondary">{t.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 规范入口 */}
      <section className="flex flex-col gap-3 pb-8">
        <h2 className="text-title-2-medium text-text-primary">基础规范</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/zh-hans/components/color", label: "颜色" },
            { href: "/zh-hans/components/typography", label: "字体排版" },
            { href: "/zh-hans/kitchen-sink", label: "基础组件实测" },
            { href: "/zh-hans/advanced", label: "复合组件实测" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-border-button-default px-3 py-1 text-caption-1-medium text-text-secondary transition-colors duration-150 hover:bg-background-secondary-hover hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </DocsLayout>
  );
}
