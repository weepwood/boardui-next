import type { Metadata } from "next";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
import { DashboardTemplate } from "@/app/components/templates/DashboardTemplate";

export const metadata: Metadata = { title: "仪表盘模板" };

export default function DashboardTemplatePage() {
  return (
    <DocsLayout
      variant="catalog"
      breadcrumbs={[
        { label: "BoardUI", href: "/" },
        { label: "模板", href: "/zh-hans/templates" },
        { label: "仪表盘" },
      ]}
      toc={[
        { id: "preview", label: "预览" },
        { id: "notes", label: "实现说明" },
      ]}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-title-1-medium text-text-primary">仪表盘</h1>
        <p className="text-headline-regular text-text-secondary">
          完整的运营仪表盘：侧边导航、四张统计卡、收入趋势面积图、目标环形图、流量来源条形列表、活跃热力图与最近订单表格。
        </p>
      </header>

      <div id="preview" className="@container min-w-0 scroll-mt-14">
        <DashboardTemplate />
      </div>

      <section id="notes" className="flex scroll-mt-14 flex-col gap-3">
        <h2 className="text-title-3-semibold text-text-primary">实现说明</h2>
        <ul className="flex flex-col gap-1.5 text-body-regular text-text-secondary">
          <li>· 所有图表为手写 SVG，零第三方依赖，完全离线可用</li>
          <li>· 统计卡片的迷你趋势图复用面积图组件，仅改尺寸</li>
          <li>· 热力图使用稳定伪随机生成，刷新不变</li>
          <li>· 侧边导航与计数器的交互均为真实状态驱动</li>
          <li>· 暗色模式下全部图表自动适配语义色令牌</li>
        </ul>
      </section>
    </DocsLayout>
  );
}
