import manifest from "@/reference/upstream-manifest.json";
import ledger from "@/reference/evidence/acceptance-observations.json";
const entries=[...manifest.components,...manifest.localOnly];
const dims=[["visual","视觉"],["interaction","交互"],["accessibility","无障碍"],["api","API"],["rtl","RTL"]] as const;
const labels:Record<string,string>={passed:"通过",failed:"待修复",pending:"待验收","not-applicable":"不适用"};
export function AcceptanceStatus({slug}:{slug:string}){
 const entry=entries.find(e=>e.slug===slug);
 if(!entry)return null;
 const observations=ledger.observations.filter(o=>o.components.includes(slug));
 return <section id="acceptance-status" className="flex min-w-0 flex-col gap-3 pt-10 scroll-mt-14">
 <h2 className="text-title-2-medium text-text-primary">实现与验收状态</h2>
 <p className="text-body-regular text-text-secondary">{entry.implementation==="ported-unverified"?"固定上游公开源码移植":"tier" in entry&&entry.tier==="pro"?"独立实现，非原版 Pro 源码":"本地实现"}；下列状态仅用于正式验收，不代表所有功能不可用。</p>
 <dl className="grid grid-cols-2 gap-2 sm:grid-cols-5">{dims.map(([key,label])=>{const state=entry.verification[key],sample=observations.some(o=>o.dimension===key);return <div key={key} className="rounded-xl border border-border-component-detail-container p-3"><dt className="text-caption-1-medium text-text-secondary">{label}</dt><dd className="mt-1 text-body-2-medium text-text-primary">{state==="pending"&&sample?"已有抽样证据":labels[state]??state}</dd></div>})}</dl>
 {!!observations.length&&<details className="rounded-2xl border border-border-component-detail-container p-3"><summary className="cursor-pointer text-body-medium">查看证据范围（{observations.length}）</summary>{observations.map(o=><div key={o.id} className="mt-3 flex flex-col gap-1"><p className="text-body-2-regular text-text-secondary">{o.scope}</p><a href={"https://github.com/weepwood/boardui-next/blob/main/"+o.source} target="_blank" rel="noreferrer" className="break-all text-body-2-medium text-accent-600 dark:text-accent-300 hover:underline">查看证据来源</a></div>)}</details>}
 </section>;
}
export function AcceptanceOverview(){
 const observations=ledger.observations;
 const sampled=new Set(observations.flatMap(o=>o.components));
 const verified=entries.filter(e=>Object.values(e.verification).every(v=>v==="passed"||v==="not-applicable")&&e.evidence.length>0);
 return <section className="flex flex-col gap-4"><h2 className="text-title-2-medium">验收进度</h2><div className="grid grid-cols-1 gap-2 sm:grid-cols-3">{[{label:"清单条目",n:entries.length},{label:"已有抽样证据",n:sampled.size},{label:"完整验收通过",n:verified.length}].map(x=><div key={x.label} className="rounded-2xl border border-border-component-detail-container p-4"><p className="text-body-2-medium text-text-secondary">{x.label}</p><p className="mt-1 text-title-1-medium tabular-nums">{x.n}</p></div>)}</div><p className="text-body-regular text-text-secondary">抽样证据与完整验收独立计数；构建、自动化测试和公开源码迁移不自动通过所有维度。</p><div className="overflow-x-auto"><table className="bui-table bui-table-sm" aria-label="验收维度"><thead><tr><th scope="col">维度</th><th scope="col">抽样覆盖</th><th scope="col">完整通过</th></tr></thead><tbody>{dims.map(([key,label])=><tr key={key}><th scope="row">{label}</th><td>{new Set(observations.filter(o=>o.dimension===key).flatMap(o=>o.components)).size}</td><td>{entries.filter(e=>e.verification[key]==="passed").length}</td></tr>)}</tbody></table></div></section>
}
