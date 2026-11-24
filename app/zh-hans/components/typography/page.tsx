import type { Metadata } from "next";
import { DocsLayout } from "@/app/components/docs/DocsLayout";

export const metadata: Metadata = { title: "字体排版" };

const SCALE = [
  { token: "large-title", label: "大标题", size: "64px", sample: "BoardUI" },
  { token: "display-1", label: "展示 1", size: "48px", sample: "设计系统" },
  { token: "display-2", label: "展示 2", size: "40px", sample: "组件库" },
  { token: "title-1", label: "标题 1", size: "24px", sample: "快速开始" },
  { token: "title-2", label: "标题 2", size: "20px", sample: "安装指南" },
  { token: "title-3", label: "标题 3", size: "18px", sample: "基础组件" },
  { token: "headline", label: "小标题", size: "16px", sample: "语义化颜色令牌" },
  { token: "body", label: "正文", size: "14px", sample: "所有组件都支持键盘操作与屏幕阅读器。" },
  { token: "body-2", label: "正文 2", size: "13px", sample: "用于次级信息与紧凑布局。" },
  { token: "caption-1", label: "说明 1", size: "12px", sample: "更新于 2026 年 11 月" },
  { token: "caption-2", label: "说明 2", size: "11px", sample: "共 39 个组件" },
];

const WEIGHTS = [
  { name: "regular", label: "常规 400" },
  { name: "medium", label: "中等 500" },
  { name: "semibold", label: "半粗 600" },
  { name: "bold", label: "粗体 700" },
];

export default function TypographyPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { label: "BoardUI", href: "/" },
        { label: "基础规范" },
        { label: "字体排版" },
      ]}
      toc={[
        { id: "scale", label: "字号阶梯" },
        { id: "weights", label: "字重" },
        { id: "usage", label: "使用方式" },
      ]}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-title-1-medium text-text-primary">字体排版</h1>
        <p className="text-headline-medium text-text-secondary">
          212 个排版令牌，由字号、行高、字重、字距四要素组成复合类。
          命名规则：<code className="font-mono text-caption-1-medium">text-{"{层级}"}-{"{字重}"}</code>。
        </p>
      </header>

      <section id="scale" className="flex scroll-mt-14 flex-col gap-4">
        <h2 className="text-title-3-semibold text-text-primary">字号阶梯</h2>
        {SCALE.map((s) => (
          <div
            key={s.token}
            className="flex flex-col gap-1.5 border-b border-separator-border pb-4 last:border-0"
          >
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-caption-1-medium text-text-tertiary">
                text-{s.token}-medium
              </span>
              <span className="text-caption-2-regular text-text-tertiary">
                {s.label} · {s.size}
              </span>
            </div>
            <p className={`text-${s.token}-medium text-text-primary`}>{s.sample}</p>
          </div>
        ))}
      </section>

      <section id="weights" className="flex scroll-mt-14 flex-col gap-3">
        <h2 className="text-title-3-semibold text-text-primary">字重</h2>
        <div className="flex flex-col gap-2">
          {WEIGHTS.map((w) => (
            <div key={w.name} className="flex items-baseline justify-between gap-3">
              <span className="text-title-3-semibold text-text-primary">
                BoardUI 组件库 {w.label}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-text-tertiary">
                text-title-3-{w.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="usage" className="flex scroll-mt-14 flex-col gap-3">
        <h2 className="text-title-3-semibold text-text-primary">使用方式</h2>
        <div className="overflow-hidden rounded-2lg border border-border-button-default bg-background-primary-default">
          <pre tabIndex={0} dir="ltr" aria-label="代码示例" className="outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring overflow-x-auto p-3 font-mono text-body-2-regular text-text-primary">
            <code>{`/* 一个类同时设定字号、行高、字重、字距 */
<h1 className="text-title-1-medium">标题</h1>
<p className="text-body-regular">正文</p>
<span className="text-caption-1-semibold">标注</span>

/* 需要覆盖单项时用 Tailwind 的独立工具类 */
<p className="text-body-medium font-bold">加粗正文</p>`}</code>
          </pre>
        </div>
      </section>
    </DocsLayout>
  );
}
