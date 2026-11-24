"use client";

/**
 * 组件文档页客户端渲染器。
 * 服务端只负责路由与 metadata，实际内容（含交互演示）在此渲染。
 */
import type { ApiEntry } from "@/app/components/docs/ApiReference";
import { notFound } from "next/navigation";
import { ComponentPage, componentCrumbs } from "@/app/components/docs/ComponentPage";
import { docs } from "@/lib/docs/registry";
import { docMetaMap } from "@/lib/docs/meta";

export function DocRenderer({slug,api,acceptance}:{slug:string;api?:ApiEntry[];acceptance:React.ReactNode}) {
  const doc = docs[slug];
  const meta = docMetaMap.get(slug);

  if (!doc || !meta) {
    notFound();
  }

  return (
    <ComponentPage
      slug={slug}
      title={doc.title}
      description={doc.description}
      breadcrumbs={componentCrumbs(doc.title)}
      preview={doc.preview()}
      previewCode={doc.previewCode}
      install={doc.install}
      api={api}
      acceptance={acceptance}
      sections={doc.demos().map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        code: d.code,
        minHeight: d.minHeight,
        demo: d.node,
      }))}
    />
  );
}
