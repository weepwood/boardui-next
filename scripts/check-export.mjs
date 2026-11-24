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

// A deterministic resource-size gate for every exported HTML page. Reuse
// compressed sizes across routes; shared chunks are counted once per page.
const gzipCache=new Map();
function scriptSize(url){
  assert.ok(url.startsWith(base+'/'),'unexpected script URL '+url);
  if(!gzipCache.has(url))gzipCache.set(url,gzipSync(readFileSync(join(root,decodeURIComponent(url.slice(base.length))))).length);
  return gzipCache.get(url);
}
const metrics=html.map(file=>{
  const source=readFileSync(file,'utf8');
  const scripts=new Set([...source.matchAll(/<script[^>]*\bsrc="([^"]+\.js)"/g)].map(m=>m[1]));
  assert.ok(scripts.size>0,'missing scripts: '+file);
  return {file,js:[...scripts].reduce((sum,url)=>sum+scriptSize(url),0),html:gzipSync(source).length};
});
const jsBudget=550*1024,htmlBudget=40*1024;
for(const row of metrics){
  assert.ok(row.js<=jsBudget,row.file+' initial JS '+row.js+' > '+jsBudget+' bytes');
  assert.ok(row.html<=htmlBudget,row.file+' HTML '+row.html+' > '+htmlBudget+' bytes');
}
const template=metrics.find(row=>row.file===join(root,'zh-hans/templates/index.html'));
assert.ok(template,'missing template catalog');
const templateBudget=350*1024;
assert.ok(template.js<=templateBudget,'Template catalog JS budget exceeded: '+template.js+' > '+templateBudget+' bytes');
console.log('Template catalog initial gzip JS budget: '+template.js+' / '+templateBudget+' bytes');
const peakJs=Math.max(...metrics.map(row=>row.js)),peakHtml=Math.max(...metrics.map(row=>row.html));
console.log('All '+metrics.length+' HTML pages: peak gzip JS '+peakJs+' / '+jsBudget+' bytes; peak gzip HTML '+peakHtml+' / '+htmlBudget+' bytes');
