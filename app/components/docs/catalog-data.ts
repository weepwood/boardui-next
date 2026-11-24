import type { CatalogStatus } from "./CatalogCard";
import {navigation} from "@/lib/navigation";
import {docMetaMap} from "@/lib/docs/meta";
import manifest from "@/reference/upstream-manifest.json";
const categories=["基础组件","组合组件","图表","模板"];
const all= [...manifest.components,...manifest.localOnly];
const entries=new Map(all.filter(e=>e.localRoute).map(e=>[e.localRoute,e]));
const templateDescriptions:Record<string,string>={"ai-chat":"会话与消息输入","ai-image-generation":"图像参数与本地预览","ai-profile":"个人资料与作品","chat-starter":"建议与消息输入","finance":"财务趋势与交易记录","dashboard":"统计与订单管理","marketing":"活动与营销数据","medical-profile":"虚构医疗资料","multi-agent-chat":"智能体协作记录","project-board":"任务与看板","hr":"人员状态与团队","calendar":"月份与日程导航"};
const data=navigation.filter(g=>categories.includes(g.title)).map(g=>({title:g.title,items:g.items.map(i=>{
  const slug=i.href.split("/").pop()??"",template=g.title==="模板",meta=docMetaMap.get(slug),entry=entries.get(i.href);
  const exists=template?!!templateDescriptions[slug]:!!meta;
  const status:CatalogStatus=!exists?"missing":entry?.implementation==="ported-unverified"?"ported":i.isPro?"independent":"existing";
  return {...i,slug,template,status,description:template?templateDescriptions[slug]??"应用界面模板":meta?.description??"尚未实现"};
})}));
const templateGroups=data.filter(g=>g.title==="模板");
export type CatalogGroups=typeof data;
export function catalogGroups(templatesOnly=false):CatalogGroups{return templatesOnly?templateGroups:data;}
