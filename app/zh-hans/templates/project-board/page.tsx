import Link from "next/link";
import type { Metadata } from "next";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
import { ProjectBoardTemplate } from "@/app/components/templates/ProjectBoardTemplate";

export const metadata: Metadata = { title: "项目看板模板" };

export default function Page() {
  return (
    <DocsLayout
      variant="catalog"
      breadcrumbs={[
        { label: "BoardUI", href: "/" },
        { label: "模板", href: "/zh-hans/templates" },
        { label: "项目看板" },
      ]}
      toc={[
        { id: "preview", label: "预览" },
        { id: "notes", label: "实现说明" },
      ]}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-title-1-medium text-text-primary">项目看板</h1>
        <p className="text-headline-regular text-text-secondary">
          四列看板 + 任务卡 + 成员头像堆叠，支持看板/列表双视图切换。
        </p>
      </header>

      <Link href="/workspace/project-board/" className="self-start rounded-2lg border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium text-text-primary hover:bg-background-primary-hover">打开独立工作区</Link>
      <div id="preview" className="@container min-w-0 scroll-mt-14">
        <ProjectBoardTemplate />
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
