"use client";

/**
 * 扩展图表：桑基图、散点图、组合图。
 * 与 Chart.tsx 一致，全部手写 SVG，零依赖。
 */

const W = 100;
const H = 40;

/** 桑基图：左中右三层 + 流量带 */
export function SankeyChart({
  nodes,
  links,
  height = 160,
}: {
  nodes: { id: string; label: string; layer: 0 | 1 | 2; value: number }[];
  links: { from: string; to: string; value: number }[];
  height?: number;
}) {
  const layers=[0,1,2] as const,layerX={0:5,1:50,2:95};
  const colors=["var(--color-emerald-500)","var(--color-accent-500)","var(--color-purple-500)","var(--color-lime-500)"];
  const byId=new Map(nodes.map(n=>[n.id,n]));
  const valid=links.filter(l=>byId.has(l.from)&&byId.has(l.to)&&byId.get(l.from)!.layer<byId.get(l.to)!.layer&&Number.isFinite(l.value)&&l.value>0);
  const incoming=new Map<string,number>(),outgoing=new Map<string,number>();
  valid.forEach(l=>{incoming.set(l.to,(incoming.get(l.to)??0)+l.value);outgoing.set(l.from,(outgoing.get(l.from)??0)+l.value)});
  const weights=new Map(nodes.map(n=>[n.id,Math.max(Number.isFinite(n.value)?n.value:0,incoming.get(n.id)??0,outgoing.get(n.id)??0,0)]));
  const groups=layers.map(layer=>nodes.filter(n=>n.layer===layer&&weights.get(n.id)!>0));
  const gap=2;
  const scale=Math.min(...groups.filter(g=>g.length).map(g=>Math.max(1,H-6-gap*(g.length-1))/g.reduce((n,v)=>n+weights.get(v.id)!,0)));
  if(!valid.length||!Number.isFinite(scale))return <div role="status" className="flex items-center justify-center text-body-2-regular text-text-secondary" style={{height}}>暂无流向数据</div>;
  const pos=new Map<string,{y:number;h:number}>();
  for(const g of groups){let y=3;for(const n of g){const h=weights.get(n.id)!*scale;pos.set(n.id,{y,h});y+=h+gap}}
  const usedOut=new Map<string,number>(),usedIn=new Map<string,number>();
  const bands=valid.map(l=>{const a=pos.get(l.from)!,b=pos.get(l.to)!,h=l.value*scale;
   const y1=a.y+(usedOut.get(l.from)??0),y2=b.y+(usedIn.get(l.to)??0);
   usedOut.set(l.from,y1-a.y+h);usedIn.set(l.to,y2-b.y+h);
   const x1=layerX[byId.get(l.from)!.layer]+1,x2=layerX[byId.get(l.to)!.layer]-1,m=(x1+x2)/2;
   return {...l,d:`M${x1},${y1} C${m},${y1} ${m},${y2} ${x2},${y2} L${x2},${y2+h} C${m},${y2+h} ${m},${y1+h} ${x1},${y1+h} Z`};
  });
  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{height,width:"100%"}} role="img" aria-label={valid.map(l=>byId.get(l.from)!.label+"至"+byId.get(l.to)!.label+" "+l.value).join("；")}>
   {bands.map((b,i)=><path key={i} d={b.d} fill={colors[nodes.findIndex(n=>n.id===b.from)%colors.length]} fillOpacity=".35"><title>{byId.get(b.from)!.label+" → "+byId.get(b.to)!.label+"："+b.value}</title></path>)}
   {nodes.map((n,i)=>{const p=pos.get(n.id);return p&&<rect key={n.id} x={layerX[n.layer]-1} y={p.y} width="2" height={p.h} rx=".4" fill={colors[i%colors.length]}><title>{n.label+"："+weights.get(n.id)}</title></rect>})}
  </svg>;
}

/** 散点图：含 XY 轴刻度与网格线 */
export function ScatterChart({points,height=140,color="var(--color-accent-500)",activeIndex}:{
 points:{x:number;y:number;color?:string}[];height?:number;color?:string;activeIndex?:number|null;
}){
 const W=400,H=160,L=36,R=12,T=10,B=25;
 const finite=points.map((p,i)=>({...p,i})).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
 const extent=(values:number[])=>{const lo=values.reduce((n,v)=>Math.min(n,v),0),hi=values.reduce((n,v)=>Math.max(n,v),1);return [lo,hi] as const};
 const [minX,maxX]=extent(finite.map(p=>p.x)),[minY,maxY]=extent(finite.map(p=>p.y));
 const xAt=(v:number)=>L+(v-minX)/(maxX-minX)*(W-L-R),yAt=(v:number)=>H-B-(v-minY)/(maxY-minY)*(H-T-B);
 const ticks=Array.from({length:5},(_,i)=>i/4),fmt=(v:number)=>Number(v.toPrecision(4)).toString();
 return <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{height}} aria-hidden="true">
 {ticks.map((r,i)=>{const x=xAt(minX+r*(maxX-minX)),y=yAt(minY+r*(maxY-minY));return <g key={i}><path d={`M${L},${y} H${W-R} M${x},${T} V${H-B}`} stroke="var(--color-separator-border)" strokeDasharray="3 3" fill="none"/><text x={L-5} y={y+3} textAnchor="end" fontSize="10" fill="var(--color-text-secondary)">{fmt(minY+r*(maxY-minY))}</text><text x={x} y={H-7} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">{fmt(minX+r*(maxX-minX))}</text></g>})}
 {finite.map(p=><circle key={p.i} data-chart-index={p.i} cx={xAt(p.x)} cy={yAt(p.y)} r={activeIndex===p.i?6:4} fill={p.color??color} fillOpacity={activeIndex==null||activeIndex===p.i ? .85 : .35}/>)}
 </svg>
}
/** 组合图：柱 + 折线（双 Y 轴） */
export function ComboChart({bars,line,height=140,activeIndex}:{bars:number[];line:number[];height?:number;activeIndex?:number|null}){
 const valid=(v:number)=>Number.isFinite(v)?v:0;
 const domain=(v:number[])=>[v.reduce((n,x)=>Math.min(n,valid(x)),0),v.reduce((n,x)=>Math.max(n,valid(x)),1)] as const;
 const [lo,hi]=domain(bars),[ll,lh]=domain(line),y=(v:number)=>H-2-(valid(v)-lo)/(hi-lo)*(H-4),yl=(v:number)=>H-2-(valid(v)-ll)/(lh-ll)*(H-4);
 const step=W/Math.max(1,bars.length,line.length),bw=step*.68;
 const baseline=y(0),linePath=line.map((v,i)=>`${i?"L":"M"}${(i+.5)*step},${yl(v)}`).join(" ");
 return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{height,width:"100%"}} aria-hidden="true">
 {bars.map((v,i)=><rect key={i} data-chart-index={i} x={(i+.5)*step-bw/2} y={Math.min(baseline,y(v))} width={bw} height={Math.abs(y(v)-baseline)} rx=".5" fill="var(--color-accent-500)" fillOpacity={activeIndex===i ? .9 : .35}/>)}
 <path d={linePath} fill="none" stroke="var(--color-purple-500)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" pointerEvents="none"/>
 </svg>
}

/** Independently rendered monthly grouped bars, following the public OrdersChartCard comparison structure. */
export function OrdersBars({rows,height=160,activeIndex}:{rows:{label:string;value:number;secondary?:number}[];height?:number;activeIndex?:number|null}){
 const W=420,H=160,L=32,R=8,T=8,B=24,span=W-L-R,step=span/Math.max(1,rows.length),bw=step*.29;
 const max=rows.reduce((n,r)=>Math.max(n,r.value,r.secondary??0),1)*1.1,y=(v:number)=>H-B-v/max*(H-B-T);
 return <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="订单趋势图" className="w-full" style={{height}}>
 {Array.from({length:4},(_,i)=>i/3).map((r,i)=><g key={i}><line x1={L} x2={W-R} y1={y(r*max)} y2={y(r*max)} stroke="var(--color-separator-border)" strokeDasharray="3 3"/><text x={L-4} y={y(r*max)+3} textAnchor="end" fontSize="10" fill="var(--color-text-secondary)">{Math.round(r*max).toLocaleString("en-US")}</text></g>)}
 {rows.map((r,i)=>{const x=L+i*step+(step-bw*2-2)/2;return <g key={i} data-chart-index={i}><rect x={L+i*step} y={T} width={step} height={H-B-T} fill="var(--color-background-tertiary-default)" opacity={activeIndex===i ? .6 : 0}/><rect data-series="previous" x={x} y={y(r.secondary??0)} width={bw} height={H-B-y(r.secondary??0)} rx="2" fill="var(--color-chart-neutral)"/><rect data-series="current" x={x+bw+2} y={y(r.value)} width={bw} height={H-B-y(r.value)} rx="2" fill="var(--color-chart-9-active)"/><text x={L+(i+.5)*step} y={H-6} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">{r.label}</text></g>})}
 </svg>
}
