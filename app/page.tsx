import Link from "next/link";
import { DocsLayout } from "./components/docs/DocsLayout";
import { Icon } from "./components/ui/Icon";
import { Button } from "./components/ui/Button";
import { Badge } from "./components/ui/Badge";
import { docMetas } from "@/lib/docs/meta";

const FEATURES = [
  {
    icon: "palette-line",
    title: "从原站精确抽取的设计令牌",
    desc: "374 个亮色 / 164 个暗色令牌、212 个排版令牌、45 个动画帧，全部程序化提取，非手抄。",
  },
  {
    icon: "hand-coin-line",
    title: "无障碍开箱可用",
    desc: "基于 React Aria Components，提供键盘导航、焦点管理与 ARIA 基础，仍需逐组件验证。",
  },
  {
    icon: "magic-line",
    title: "交互动效校准",
    desc: "缓动 cubic-bezier(0.22,1,0.36,1)，时长 150/200/300ms，按压 scale 0.98，待与原站逐项对比。",
  },
  {
    icon: "moon-line",
    title: "暗色模式零改动",
    desc: "语义令牌在 .dark 下覆盖，组件代码无需感知主题，切换由 View Transitions 呈现。",
  },
];

export default function HomePage() {
  const total = docMetas.length;

  return (
    <DocsLayout breadcrumbs={[{ label: "BoardUI" }, { label: "首页" }]}>
      {/* Hero */}
      <header className="flex flex-col gap-4 pt-4">
        <div className="flex items-center gap-2">
          <Badge variant="accent">开发中</Badge>
          <span className="text-caption-1-regular text-text-tertiary">
            {total} 个组件文档 · 待逐项验收
          </span>
        </div>
        <h1 className="text-large-title-medium text-text-primary">
          为 AI 原生产品打造的组件库
        </h1>
        <p className="max-w-2xl text-headline-medium text-text-secondary">
          可复制粘贴的组件集合。基于 React Aria 构建，以原版视觉与交互动效为基准，持续校准每一个组件。
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Link href="/zh-hans/components">
            <Button trailing={<Icon name="arrow-right-line" className="size-4" />}>
              浏览组件
            </Button>
          </Link>
          <Link href="/zh-hans/components/button">
            <Button variant="secondary">查看按钮示例</Button>
          </Link>
        </div>
      </header>

      {/* 特性 */}
      <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex flex-col gap-1.5 rounded-2lg border border-border-button-default bg-background-primary-default p-3"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-background-secondary-default text-foreground-icon-secondary">
              <Icon name={f.icon} className="size-4" />
            </span>
            <span className="text-body-medium text-text-primary">{f.title}</span>
            <span className="text-caption-1-regular text-text-secondary">{f.desc}</span>
          </div>
        ))}
      </section>

      {/* 组件入口 */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-title-3-semibold text-text-primary">组件</h2>
          <Link
            href="/zh-hans/components"
            className="text-caption-1-medium text-accent-600 hover:underline dark:text-accent-400"
          >
            查看全部
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {docMetas.slice(0, 12).map((m) => (
            <Link
              key={m.slug}
              href={`/zh-hans/components/${m.slug}`}
              className="group flex flex-col gap-0.5 rounded-xl border border-border-primary p-2.5 transition-colors duration-150 ease-out hover:bg-background-secondary-hover"
            >
              <span className="flex items-center justify-between gap-1">
                <span className="truncate text-body-2-medium text-text-primary">{m.title}</span>
                <Icon
                  name="arrow-right-s-line"
                  className="size-3.5 shrink-0 text-text-tertiary transition-transform duration-200 ease-bui group-hover:translate-x-0.5"
                />
              </span>
              <span className="line-clamp-2 text-[11px] leading-snug text-text-tertiary">
                {m.description}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 模板入口 */}
      <section className="flex flex-col gap-3">
        <h2 className="text-title-3-semibold text-text-primary">模板</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { href: "/zh-hans/templates/dashboard", title: "仪表盘", desc: "统计卡 · 面积图 · 热力图 · 数据表" },
            { href: "/zh-hans/templates/ai-chat", title: "AI 聊天", desc: "会话列表 · 消息流 · 复合输入区" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group flex flex-col gap-1 rounded-2lg border border-border-button-default bg-background-primary-default p-3 transition-[background-color,border-color] duration-150 ease-out hover:border-border-button-hover hover:bg-background-secondary-hover"
            >
              <span className="flex items-center justify-between">
                <span className="text-body-medium text-text-primary">{t.title}</span>
                <Icon
                  name="arrow-right-s-line"
                  className="size-4 text-text-tertiary transition-transform duration-200 ease-bui group-hover:translate-x-0.5"
                />
              </span>
              <span className="text-caption-1-regular text-text-tertiary">{t.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 规范入口 */}
      <section className="flex flex-col gap-3 pb-8">
        <h2 className="text-title-3-semibold text-text-primary">基础规范</h2>
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
