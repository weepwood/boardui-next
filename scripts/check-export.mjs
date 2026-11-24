import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
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
