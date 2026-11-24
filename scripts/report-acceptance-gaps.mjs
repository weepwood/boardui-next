import {readFileSync,writeFileSync} from 'node:fs';
const manifest=JSON.parse(readFileSync('reference/upstream-manifest.json','utf8'));
const ledger=JSON.parse(readFileSync('reference/evidence/acceptance-observations.json','utf8'));
const dimensions=['visual','interaction','accessibility','api','rtl'];
const entries=[...manifest.components,...manifest.localOnly].map(e=>({slug:e.slug,route:e.localRoute,dimensions:Object.fromEntries(dimensions.map(d=>{
 const observations=ledger.observations.filter(o=>o.dimension===d&&o.components.includes(e.slug));
 return [d,{status:e.verification[d],partial:observations.filter(o=>o.result==='partial').map(o=>o.id),passed:observations.filter(o=>o.result==='passed'&&e.evidence.includes(o.id)).map(o=>o.id),failed:observations.filter(o=>o.result==='failed').map(o=>o.id)}];
}))}));
const counts=Object.fromEntries(dimensions.map(d=>[d,{missing:entries.filter(e=>!e.dimensions[d].partial.length&&!e.dimensions[d].passed.length&&!e.dimensions[d].failed.length).map(e=>e.slug),formal:entries.filter(e=>['passed','not-applicable'].includes(e.dimensions[d].status)).length,scoped:entries.filter(e=>e.dimensions[d].partial.length||e.dimensions[d].passed.length||e.dimensions[d].failed.length).length}]));
const result={total:entries.length,formalComplete:entries.filter(e=>dimensions.every(d=>['passed','not-applicable'].includes(e.dimensions[d].status))).length,counts,entries};
if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({total:result.total,formalComplete:result.formalComplete,counts},null,2));
