import Link from "next/link";
import { notFound } from "next/navigation";
import { AcceptanceOverview } from "@/app/components/docs/AcceptanceStatus";
import { DirectionLab } from "@/app/components/docs/DirectionLab";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
const guides = {
  "getting-started": ["开始使用", "本项目是非官方 BoardUI 衍生工程，当前组件仍在逐项验收。"],
  installation: ["安装", "支持本地构建 React ESM、类型声明及 CSS；npm 和 CLI 尚未公开发布。"],
  mcp: ["MCP 服务器", "BoardUI Next 尚未提供 MCP 服务器。原版服务请参考 boardui.com/mcp。"],
  skill: ["智能体技能", "开发规范见仓库 AGENTS.md；组件复刻状态见 reference/upstream-manifest.json。"],
  rtl: ["RTL 支持", "DirectionProvider 提供语言与方向上下文。以下为真实交互实验室，覆盖代表组件，不代表全站 RTL 已验收。"],
} as const;
export function generateStaticParams() { return Object.keys(guides).map(guide => ({guide})); }
export default async function Guide({params}: {params: Promise<{guide: string}>}) {
  const {guide} = await params;
  if (!Object.hasOwn(guides, guide)) notFound();
  const [title, description] = guides[guide as keyof typeof guides];
  return <DocsLayout breadcrumbs={[{label:"BoardUI Next", href:"/"},{label:title}]}><h1 className="text-title-1-medium">{title}</h1><p className="text-body-medium text-text-secondary">{description}</p>{guide==="installation"&&<section className="flex flex-col gap-3"><h2 className="text-title-2-medium">构建并安装预览包</h2><pre tabIndex={0} dir="ltr" aria-label="代码示例" className="outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring overflow-x-auto rounded-2lg bg-background-secondary-default p-4 font-mono text-body-2-regular">{"npm ci\nnpm run test:library\n# 在目标项目中：\nnpm install /绝对路径/boardui-next/build/library-consumer/weepwood-boardui-next-0.1.0.tgz"}</pre><h2 className="text-title-2-medium">使用</h2><pre tabIndex={0} dir="ltr" aria-label="代码示例" className="outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring overflow-x-auto rounded-2lg bg-background-secondary-default p-4 font-mono text-body-2-regular">{'import "@weepwood/boardui-next/styles.css";\nimport { Button, Input } from "@weepwood/boardui-next";\n// <Button>开始使用</Button>'}</pre><p className="text-body-regular text-text-secondary">React 19；静态 CSS 自带工具类与主题令牌，字体由消费应用提供。也可在 Tailwind v4 项目使用 tailwind.css。仅 packages/react 的导出包含在预览包内。独立 Vite 示例：执行 npm run test:library、npm run test:consumer，再进入 build/vite-consumer 运行 npm run dev。</p></section>}{guide==="rtl"&&<DirectionLab/>}{guide==="skill"&&<AcceptanceOverview/>}<Link prefetch={false} className="text-accent-500" href="/zh-hans/components">浏览组件</Link></DocsLayout>;
}
