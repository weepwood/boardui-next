import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { TableOfContents, type TocItem } from "./TableOfContents";
import type { Crumb } from "./Breadcrumbs";

/**
 * 文档页布局（与原站一致）：
 *   aside 260px sticky  |  main max-w-900px  |  aside 220px TOC
 * 外层：flex min-h-screen w-full
 */
export function DocsLayout({
  breadcrumbs,
  toc = [],
  children,
}: {
  breadcrumbs: Crumb[];
  toc?: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background-full">
      <Sidebar />

      <div className="flex min-w-0 flex-1 gap-8 px-6 py-4">
        <main className="flex w-full min-w-0 flex-col gap-3 max-w-[900px]">
          <div className="flex flex-col gap-8">
            <TopBar breadcrumbs={breadcrumbs} />
            {children}
          </div>
        </main>

        <TableOfContents items={toc} />
      </div>
    </div>
  );
}
