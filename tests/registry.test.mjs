import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = p => readFileSync(new URL('../'+p,import.meta.url),'utf8');
const exists = p => existsSync(new URL('../'+p,import.meta.url));
const manifest = JSON.parse(read('reference/upstream-manifest.json'));
const metas = new Set([...read('lib/docs/meta.ts').matchAll(/slug:\s*"([^"]+)"/g)].map(m=>m[1]));
function routeExists(href) {
  const path = href.split('#')[0];
  if (path.startsWith('/zh-hans/components/') && metas.has(path.split('/').pop())) return true;
  if (['getting-started','installation','mcp','skill','rtl'].some(s=>path==='/zh-hans/'+s)) return exists('app/zh-hans/[guide]/page.tsx');
  return exists('app'+path+'/page.tsx');
}
test('导航链接均有对应页面',()=>{for(const m of read('lib/navigation.ts').matchAll(/href:\s*"([^"]+)"/g)) assert.ok(routeExists(m[1]),m[1]);});
test('上游固定版本、目录无重复、授权与验收状态有效',()=>{
  assert.match(manifest.upstream.commit,/^[a-f0-9]{40}$/);
  const keys=new Set();
  for(const e of [...manifest.components,...manifest.localOnly]){
    assert.ok(!keys.has(e.slug),e.slug);keys.add(e.slug);
    if(e.localRoute) assert.ok(routeExists(e.localRoute),e.localRoute);
    if(e.tier==='pro') assert.equal(e.sourcePolicy,'independent-or-authorized');
    for(const status of Object.values(e.verification)){
      assert.ok(['pending','passed','failed','not-applicable'].includes(status));
      if(status==='passed'||status==='not-applicable') assert.ok(e.evidence.length,e.slug);
    }
  }
});
