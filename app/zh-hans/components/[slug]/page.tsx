import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { docMetas, docMetaMap } from "@/lib/docs/meta";
import apiReference from "@/lib/docs/api-reference.generated.json";
import { AcceptanceStatus } from "@/app/components/docs/AcceptanceStatus";
import type { ApiEntry } from "@/app/components/docs/ApiReference";
import { DocRenderer } from "../DocRenderer";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const meta = docMetaMap.get(slug);
  return { title: meta?.title ?? "组件" };
}

export function generateStaticParams() {
  return docMetas.map((m) => ({ slug: m.slug }));
}

export default async function ComponentDocPage({ params }: Params) {
  const { slug } = await params;
  if (!docMetaMap.has(slug)) notFound();
  return <DocRenderer slug={slug} api={(apiReference as Record<string,ApiEntry[]>)[slug]} acceptance={<AcceptanceStatus slug={slug}/>} />;
}
