import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
const base='/boardui-next';
const root='out';
assert.ok(existsSync(join(root,'index.html')),'missing static index');
function walk(dir) {return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);}
const html=walk(root).filter(p=>p.endsWith('.html'));
const missing=new Set();
for(const f of html) {
  for(const m of readFileSync(f,'utf8').matchAll(/(?:href|src)="([^"]+)"/g)){
    const path=m[1].split(/[?#]/)[0];
    if(!path.startsWith('/')||path.startsWith('//'))continue;
    if(!path.startsWith(base+'/')&&path!==base){missing.add(f+': unprefixed '+path);continue;}
    const target=join(root,decodeURIComponent(path.slice(base.length)));
    if(!existsSync(target)&&!existsSync(target+'.html')&&!existsSync(join(target,'index.html')))missing.add(f+': '+path);
  }
}
assert.equal(missing.size,0,[...missing].slice(0,30).join('\n'));
console.log('Static export: '+html.length+' HTML pages checked');

// Template-only catalog must not pull the heavy interactive demo registry.
// Budget includes unique script src resources referenced by the static HTML,
// including polyfills; this is a conservative build-time gzip estimate.
const templateHtml=readFileSync(join(root,'zh-hans/templates/index.html'),'utf8');
const templateScripts=new Set([...templateHtml.matchAll(/<script[^>]*\bsrc="([^"]+\.js)"/g)].map(m=>m[1]));
assert.ok(templateScripts.size>0,'missing template scripts');
const scriptBytes=[...templateScripts].reduce((sum,url)=>{
  assert.ok(url.startsWith(base+'/'),'unexpected script URL '+url);
  return sum+gzipSync(readFileSync(join(root,decodeURIComponent(url.slice(base.length))))).length;
},0);
const budget=350*1024;
assert.ok(scriptBytes<=budget,'Template catalog JS budget exceeded: '+scriptBytes+' > '+budget+' bytes');
console.log('Template catalog initial gzip JS budget: '+scriptBytes+' / '+budget+' bytes');
