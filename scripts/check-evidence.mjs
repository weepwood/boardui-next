import {readFileSync,existsSync} from "node:fs";
import {resolve,relative,isAbsolute} from "node:path";
import assert from "node:assert/strict";
const manifest=JSON.parse(readFileSync("reference/upstream-manifest.json","utf8"));
const ledger=JSON.parse(readFileSync("reference/evidence/acceptance-observations.json","utf8"));
assert.equal(ledger.schemaVersion,1);
const entries=[...manifest.components,...manifest.localOnly];
const slugs=new Set(entries.map(e=>e.slug)),ids=new Set();
const dimensions=["visual","interaction","accessibility","api","rtl"];
for(const row of ledger.observations){
 assert.match(row.id,/^[a-z0-9-]+$/);
 assert.ok(!ids.has(row.id),row.id);ids.add(row.id);
 assert.ok(dimensions.includes(row.dimension),row.id);
 assert.ok(["partial","passed","failed","not-applicable"].includes(row.result),row.id);
 assert.ok(row.scope.trim().length>=20,row.id);
 if(row.result==="not-applicable")assert.ok(typeof row.reason==="string"&&row.reason.trim().length>=20,row.id+" lacks applicability rationale");
 assert.ok(!isAbsolute(row.source)&&!relative(process.cwd(),resolve(row.source)).startsWith("..")&&existsSync(row.source),row.source);
 assert.ok(row.components.length&&new Set(row.components).size===row.components.length,row.id);
 for(const slug of row.components)assert.ok(slugs.has(slug),slug);
}
// Explicit full-pass evidence is required for newly accepted dimensions.
// Partial evidence never unlocks the release gate.
for(const entry of entries)for(const dim of dimensions){
 assert.ok(["pending","passed","failed","not-applicable"].includes(entry.verification[dim]),entry.slug+" invalid "+dim+" state");
 if(["passed","not-applicable"].includes(entry.verification[dim])){
  assert.ok(ledger.observations.some(row=>row.result===entry.verification[dim]&&row.dimension===dim&&row.components.includes(entry.slug)&&entry.evidence.includes(row.id)),entry.slug+" lacks complete "+dim+" evidence");
 }
}
console.log("Acceptance ledger: "+ledger.observations.length+" observations; "+new Set(ledger.observations.flatMap(o=>o.components)).size+" components with scoped evidence; "+entries.length+" total entries.");
