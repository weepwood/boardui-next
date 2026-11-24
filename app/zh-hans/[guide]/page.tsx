import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
const guides = {
  "getting-started": ["开始使用", "本项目是非官方 BoardUI 衍生工程，当前组件仍在逐项验收。"],
  installation: ["安装", "当前从仓库根目录执行 npm ci、npm run dev；独立组件包和安装 CLI 尚未发布。"],
  mcp: ["MCP 服务器", "BoardUI Next 尚未提供 MCP 服务器。原版服务请参考 boardui.com/mcp。"],
  skill: ["智能体技能", "开发规范见仓库 AGENTS.md；组件复刻状态见 reference/upstream-manifest.json。"],
  rtl: ["RTL 支持", "当前尚未完成全站 RTL 验收，方向感知、键盘导航和浮层方向将在后续组件迁移中验证。"],
} as const;
export function generateStaticParams() { return Object.keys(guides).map(guide => ({guide})); }
export default async function Guide({params}: {params: Promise<{guide: string}>}) {
  const {guide} = await params;
  if (!Object.hasOwn(guides, guide)) notFound();
  const [title, description] = guides[guide as keyof typeof guides];
  return <DocsLayout breadcrumbs={[{label:"BoardUI Next", href:"/"},{label:title}]}><h1 className="text-title-1-medium">{title}</h1><p className="text-body-medium text-text-secondary">{description}</p><Link className="text-accent-500" href="/zh-hans/components">浏览组件</Link></DocsLayout>;
}
