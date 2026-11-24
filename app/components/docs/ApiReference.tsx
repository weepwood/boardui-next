export type ApiEntry={name:string;source:string;props:{name:string;type:string;optional:boolean;description:string}[]};
export function ApiReference({entries}:{entries:ApiEntry[]}){
  return <section id="api" className="docs-deferred-section flex scroll-mt-14 flex-col gap-3 pt-10">
    <h2 className="text-title-2-medium text-text-primary">组件 API</h2>
    <p className="text-body-regular text-text-secondary">从独立包 TypeScript 源码生成。列出本地属性及常用继承属性；完整签名以类型声明为准。应用演示中的兼容接口可能不同。</p>
    {entries.map(entry=><details key={entry.name} className="rounded-2xl border border-border-component-detail-container bg-background-primary-default" open={entry===entries[0]}>
      <summary className="cursor-pointer px-4 py-3 text-body-medium text-text-primary"><code>{entry.name}</code><span className="ms-2 text-caption-1-regular text-text-tertiary">{entry.props.length} 项</span></summary>
      <div className="flex min-w-0 flex-col gap-2 px-4 pb-4">
        <pre className="overflow-x-auto rounded-lg bg-background-secondary-default p-3 font-mono text-body-2-regular text-text-primary">{'import { '+entry.name+' } from "@weepwood/boardui-next";'}</pre>
        <a href={"https://github.com/weepwood/boardui-next/blob/main/"+entry.source} className="text-body-2-regular text-accent-600 dark:text-accent-300 hover:underline" target="_blank" rel="noreferrer">查看类型源码</a>
        <div className="overflow-x-auto"><table className="bui-table bui-table-sm min-w-[460px]" aria-label={entry.name+" 属性"}><thead><tr><th scope="col">属性</th><th scope="col">类型</th><th scope="col">必填</th></tr></thead><tbody>
          {entry.props.map(p=><tr key={p.name}><th scope="row" className="align-top"><code className="font-mono text-body-2-regular">{p.name}</code></th><td className="max-w-[400px] align-top"><code className="whitespace-pre-wrap break-all font-mono text-caption-1-regular">{p.type}</code>{p.description&&<p className="mt-1 whitespace-pre-wrap break-words text-caption-1-regular text-text-secondary">{p.description}</p>}</td><td className="align-top">{p.optional?"否":"是"}</td></tr>)}
        </tbody></table></div>
      </div>
    </details>)}
  </section>;
}
