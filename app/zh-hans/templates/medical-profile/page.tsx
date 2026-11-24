import type { Metadata } from "next";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
import { MedicalProfileTemplate } from "@/app/components/templates/MedicalProfileTemplate";

export const metadata: Metadata = { title: "医疗档案模板" };

export default function Page() {
  return (
    <DocsLayout
      variant="catalog"
      breadcrumbs={[
        { label: "BoardUI", href: "/" },
        { label: "模板", href: "/zh-hans/templates" },
        { label: "医疗档案" },
      ]}
      toc={[
        { id: "preview", label: "预览" },
        { id: "notes", label: "实现说明" },
      ]}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-title-1-medium text-text-primary">医疗档案</h1>
        <p className="text-headline-regular text-text-secondary">
          患者概览、生命体征、活动圆环、用药与就诊时间线。
        </p>
      </header>

      <div id="preview" className="@container min-w-0 scroll-mt-14">
        <MedicalProfileTemplate />
      </div>

      <section id="notes" className="flex scroll-mt-14 flex-col gap-3">
        <h2 className="text-title-3-semibold text-text-primary">实现说明</h2>
        <ul className="flex flex-col gap-1.5 text-body-regular text-text-secondary">
          <li>· 全部使用 BoardUI 组件与语义令牌拼装，无第三方 UI 依赖</li>
          <li>· 图表为手写 SVG，可离线运行</li>
          <li>· 交互状态（筛选、切换、加载）均为真实 state 驱动</li>
          <li>· 暗色模式下自动适配</li>
        </ul>
      </section>
    </DocsLayout>
  );
}
