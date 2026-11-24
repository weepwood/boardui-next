import type { Metadata } from "next";
import { DocsLayout } from "@/app/components/docs/DocsLayout";

export const metadata: Metadata = { title: "颜色" };

/** 从 CSS 变量读取实际值并展示（服务端渲染，颜色值直接内联） */
const PALETTES = [
  { name: "accent", label: "强调色", steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
  { name: "neutral", label: "中性色", steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
  { name: "red", label: "红色", steps: [100, 200, 300, 400, 500, 600, 700, 900, 950] },
  { name: "lime", label: "青柠", steps: [100, 200, 300, 400, 500, 600, 700, 800, 950] },
  { name: "amber", label: "琥珀", steps: [200, 300, 400, 500, 600, 800, 950] },
  { name: "blue", label: "蓝色", steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
  { name: "purple", label: "紫色", steps: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] },
];

const SEMANTIC = [
  { token: "background-full", label: "页面背景" },
  { token: "background-primary-default", label: "卡片背景" },
  { token: "background-secondary-default", label: "次级背景" },
  { token: "background-tertiary-default", label: "三级背景" },
  { token: "text-primary", label: "主文本" },
  { token: "text-secondary", label: "次文本" },
  { token: "text-tertiary", label: "弱文本" },
  { token: "border-primary", label: "主描边" },
  { token: "border-button-default", label: "按钮描边" },
  { token: "accent-500", label: "强调色 500" },
];

export default function ColorPage() {
  return (
    <DocsLayout
      breadcrumbs={[
        { label: "BoardUI", href: "/" },
        { label: "基础规范" },
        { label: "颜色" },
      ]}
      toc={[
        { id: "palette", label: "调色板" },
        { id: "semantic", label: "语义色" },
        { id: "usage", label: "使用方式" },
      ]}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-title-1-medium text-text-primary">颜色</h1>
        <p className="text-headline-medium text-text-secondary">
          全部颜色以 CSS 变量形式定义，亮色在 <code className="font-mono text-caption-1-medium">@theme</code>，
          暗色在 <code className="font-mono text-caption-1-medium">.dark</code> 覆盖同一变量，因此组件无需感知主题。
        </p>
      </header>

      <section id="palette" className="flex scroll-mt-14 flex-col gap-5">
        <h2 className="text-title-3-semibold text-text-primary">调色板</h2>
        {PALETTES.map((p) => (
          <div key={p.name} className="flex flex-col gap-2">
            <span className="text-body-2-medium text-text-primary">{p.label}</span>
            <div className="flex overflow-hidden rounded-lg">
              {p.steps.map((s) => (
                <div
                  key={s}
                  className="flex h-14 flex-1 items-end justify-center pb-1"
                  style={{ backgroundColor: `var(--color-${p.name}-${s})` }}
                  title={`--color-${p.name}-${s}`}
                >
                  <span className="text-[9px] font-medium text-white/80 mix-blend-difference">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section id="semantic" className="flex scroll-mt-14 flex-col gap-3">
        <h2 className="text-title-3-semibold text-text-primary">语义色</h2>
        <p className="text-body-regular text-text-secondary">
          组件只使用语义令牌，而非调色板直接取值。这样切换主题时无需改动任何组件代码。
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SEMANTIC.map((s) => (
            <div
              key={s.token}
              className="flex items-center gap-2 rounded-lg border border-border-primary p-2"
            >
              <span
                className="size-8 shrink-0 rounded-md border border-border-primary"
                style={{ backgroundColor: `var(--color-${s.token})` }}
              />
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-caption-1-medium text-text-primary">{s.label}</span>
                <span className="truncate font-mono text-[10px] text-text-tertiary">
                  --color-{s.token}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="usage" className="flex scroll-mt-14 flex-col gap-3">
        <h2 className="text-title-3-semibold text-text-primary">使用方式</h2>
        <div className="overflow-hidden rounded-2lg border border-border-button-default bg-background-primary-default">
          <pre className="overflow-x-auto p-3 font-mono text-body-2-regular text-text-primary">
            <code>{`/* Tailwind 工具类，自动生成 bg-* / text-* / border-* */
<div className="bg-background-primary-default text-text-primary border-border-primary" />

/* 或直接引用变量（图表、内联样式） */
style={{ stroke: "var(--color-accent-500)" }}`}</code>
          </pre>
        </div>
      </section>
    </DocsLayout>
  );
}
