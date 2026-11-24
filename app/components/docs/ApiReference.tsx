export type ApiEntry={name:string;source:string;props:{name:string;type:string;optional:boolean;description:string}[]};
export function ApiReference({entries}:{entries:ApiEntry[]}){
  return <section id="api" className="docs-deferred-section flex scroll-mt-14 flex-col gap-3 pt-10">
    <h2 className="text-title-2-medium text-text-primary">组件 API</h2>
    <p className="text-body-regular text-text-secondary">从独立包 TypeScript 源码生成。列出本地属性及常用继承属性；完整签名以类型声明为准。应用演示中的兼容接口可能不同。</p>
    {entries.map(entry=><details key={entry.name} className="group overflow-hidden rounded-2xl border border-border-component-detail-container bg-background-primary-default" open={entry===entries[0]}>
      <summary className="flex min-w-0 cursor-pointer list-none items-center gap-2 px-4 py-3 text-body-medium text-text-primary transition-colors hover:bg-background-primary-hover focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-border-focus-ring [&::-webkit-details-marker]:hidden"><svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="size-4 shrink-0 text-text-secondary transition-transform group-open:rotate-90 rtl:rotate-180 rtl:group-open:rotate-90 motion-reduce:transition-none"><path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg><code className="min-w-0 [overflow-wrap:anywhere]">{entry.name}</code><span className="ms-auto shrink-0 text-caption-1-regular tabular-nums text-text-secondary">{entry.props.length} 项</span></summary>
      <div className="flex min-w-0 flex-col gap-2 px-4 pb-4">
        <pre className="overflow-x-auto rounded-lg bg-background-secondary-default p-3 font-mono text-body-2-regular text-text-primary" tabIndex={0} aria-label="导入示例">{'import { '+entry.name+' } from "@weepwood/boardui-next";'}</pre>
        <a href={"https://github.com/weepwood/boardui-next/blob/main/"+entry.source} className="text-body-2-regular text-accent-600 dark:text-accent-300 hover:underline" target="_blank" rel="noreferrer">查看类型源码</a>
        <div className="min-w-0 overflow-x-auto rounded-lg border border-separator-border" tabIndex={0} role="region" aria-label={entry.name+" 属性表"}><table className="bui-table bui-table-sm min-w-[420px]" aria-label={entry.name+" 属性"}><thead><tr><th scope="col">属性</th><th scope="col">类型</th><th scope="col">必填</th></tr></thead><tbody>
          {entry.props.map(p=><tr key={p.name}><th scope="row" className="align-top"><code className="font-mono text-body-2-regular">{p.name}</code></th><td className="max-w-[400px] align-top"><code className="whitespace-pre-wrap [overflow-wrap:anywhere] font-mono text-caption-1-regular">{p.type}</code>{p.description&&<p className="mt-1 whitespace-pre-wrap break-words text-caption-1-regular text-text-secondary">{p.description}</p>}</td><td className="whitespace-nowrap align-top"><span className={p.optional?"text-text-secondary":"font-medium text-text-primary"}>{p.optional?"否":"是"}</span></td></tr>)}
        </tbody></table></div>
      </div>
    </details>)}
  </section>;
}
