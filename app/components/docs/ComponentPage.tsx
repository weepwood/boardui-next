import { DocsLayout } from "./DocsLayout";
import { ApiReference,type ApiEntry } from "./ApiReference";
import { ComponentPreview } from "./ComponentPreview";
import type { Crumb } from "./Breadcrumbs";
import type { TocItem } from "./TableOfContents";

export type DemoSection = {
  id: string;
  title: string;
  description?: string;
  code?: string;
  minHeight?: number;
  demo: React.ReactNode;
};

/**
 * 组件文档页通用模板。
 * 结构：面包屑 → 标题 + 描述 → 预览 → 各演示区块 → 安装说明
 * 与原站组件页信息层级一致。
 */
export function ComponentPage({
  title,
  description,
  breadcrumbs,
  preview,
  previewCode,
  sections = [],
  install,api,slug,acceptance,
}: {
  title: string;
  description: string;
  breadcrumbs: Crumb[];
  preview: React.ReactNode;
  previewCode?: string;
  sections?: DemoSection[];
  install?: string;
  api?:ApiEntry[];
  slug?:string;
  acceptance?:React.ReactNode;
}) {
  const toc: TocItem[] = [
    { id: "preview", label: "预览" },
    ...(install ? [{ id: "installation", label: "安装" }] : []),
    ...sections.map((s) => ({ id: s.id, label: s.title })),
    ...(api?.length?[{id:"api",label:"组件 API"}]:[]),
    ...(slug?[{id:"acceptance-status",label:"验收状态"}]:[]),
  ];

  return (
    <DocsLayout breadcrumbs={breadcrumbs} toc={toc} header={
      <header className="flex flex-col gap-3">
        <h1 className="text-title-1-medium text-text-primary">{title}</h1>
        <p className="text-headline-regular text-text-secondary">{description}</p>
      </header>}>

      <div id="preview" className="scroll-mt-14 pt-4">
        <ComponentPreview code={previewCode} minHeight={327}>{preview}</ComponentPreview>
      </div>

      {install && (
        <section id="installation" className="docs-deferred-section flex scroll-mt-14 flex-col gap-2 pt-10">
          <h2 className="text-title-2-medium text-text-primary">本地构建与复用</h2>
          <p className="text-body-regular text-text-secondary">非官方预览包，尚未发布 npm 或安装 CLI。核心导出可用本地 tarball；其余组件保留在仓库应用源码中。详见安装指南。</p>
          <div className="overflow-hidden rounded-2lg border border-border-button-default bg-background-primary-default">
            <div className="flex items-center gap-2 border-b border-separator-border px-3 py-2">
              <span className="text-caption-1-medium text-text-tertiary">终端</span>
            </div>
            <pre tabIndex={0} dir="ltr" aria-label="代码示例" className="outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring overflow-x-auto p-3 font-mono text-body-2-regular text-text-primary">
              <code>{"git clone https://github.com/weepwood/boardui-next.git\ncd boardui-next\nnpm ci\nnpm run test:library"}</code>
            </pre>
          </div>
        </section>
      )}

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="docs-deferred-section flex scroll-mt-14 flex-col gap-2 pt-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-title-2-medium text-text-primary">{s.title}</h2>
            {s.description && (
              <p className="text-body-regular text-text-secondary">{s.description}</p>
            )}
          </div>
          <ComponentPreview code={s.code} minHeight={s.minHeight}>
            {s.demo}
          </ComponentPreview>
        </section>
      ))}
      {!!api?.length&&<ApiReference entries={api}/>}
      {acceptance}
    </DocsLayout>
  );
}

/** 生成组件页面包屑 */
export function componentCrumbs(title: string): Crumb[] {
  return [
    { label: "BoardUI", href: "/" },
    { label: "组件", href: "/zh-hans/components" },
    { label: title },
  ];
}
