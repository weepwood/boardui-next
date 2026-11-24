import {chromium,firefox,webkit} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.txt':'text/plain; charset=utf-8'};
const server=createServer((req,res)=>{try{
 const p=new URL(req.url,'http://localhost').pathname;
 if(!p.startsWith(base+'/'))throw Error();
 let f=resolve(root,'.'+decodeURIComponent(p.slice(base.length)));
 if(!f.startsWith(root+'/')&&f!==root)throw Error();
 if(statSync(f).isDirectory())f=join(f,'index.html');
 const data=readFileSync(f);res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream'});res.end(data);
}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const name=process.env.BROWSER??'chromium';
let browser;
try{
 browser=await {chromium,firefox,webkit}[name].launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/',{waitUntil:'networkidle'});
 const fonts=await page.evaluate(async()=>{
   await document.fonts.ready;
   const rules=[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules]}catch{return []}});
   const faces=rules.filter(r=>r.type===CSSRule.FONT_FACE_RULE&&r.style.getPropertyValue('font-family').includes('Noto Sans SC'));
   const subset=faces.find(r=>r.style.getPropertyValue('src').includes('ui-noto-sans-sc-'));
   if(!subset)throw Error('missing compact face');
   const file=subset.style.getPropertyValue('src').match(/ui-(noto-sans-sc-\d+-wght-normal)\./)?.[1];
   const original=faces.find(r=>!r.style.getPropertyValue('src').includes('ui-noto-sans-sc-')&&r.style.getPropertyValue('src').includes(file+'.'));
   if(!original)throw Error('missing original fallback');
   const codepoint=rule=>parseInt(rule.style.getPropertyValue('unicode-range').match(/U\+([0-9a-f]+)/i)[1],16);
   const common=String.fromCodePoint(codepoint(subset)),rare=String.fromCodePoint(codepoint(original));
   const source=rule=>rule.style.getPropertyValue('src');
   const baseUrl=[...document.styleSheets].find(s=>{try{return [...s.cssRules].includes(original)}catch{return false}})?.href;
   const abs=source(original).replace(/url\(["']?([^"')]+)["']?\)/g,(_,p)=>'url("'+new URL(p,baseUrl||location.href).href+'")');
   const baseline=await new FontFace('BoardUI Original Metric',abs,{weight:'100 900'}).load();
   document.fonts.add(baseline);
   const commonFaces=await document.fonts.load('400 24px "Noto Sans SC Variable"',common);
   const rareFaces=await document.fonts.load('400 24px "Noto Sans SC Variable"',rare);
   const c=document.createElement('canvas').getContext('2d');
   const differences=[400,700].map(w=>{
      c.font=w+' 24px "Noto Sans SC Variable"';const a=c.measureText(common).width;
      c.font=w+' 24px "BoardUI Original Metric"';return Math.abs(a-c.measureText(common).width);
   });
   return {common:commonFaces.length,rare:rareFaces.length,differences};
 });
 assert.ok(fonts.common>0&&fonts.rare>0,'compact and original font ranges load');
 assert.ok(fonts.differences.every(v=>v<.1),'variable font advance widths preserved');
 const nav=page.locator('aside nav[aria-label="元件库"]');
 await page.evaluate(()=>{window.__sidebarInstance=document.querySelector('aside')});
 let release;const gate=new Promise(r=>release=r);
 const pattern='**/zh-hans/components/input/index.txt*';
 await page.route(pattern,async route=>{await gate;await route.continue().catch(()=>{});});
 try{
   await nav.locator('[data-doc-path="/zh-hans/components/input"]').click();
   await page.locator('[data-navigation-pending]').waitFor({state:'visible'});
   await nav.locator('[data-doc-path="/zh-hans/components/select"]').click();
   await page.waitForURL(/\/components\/select\/?$/);
   await page.locator('main h1').waitFor();
   release();await page.waitForLoadState('networkidle');
   assert.match(page.url(),/\/components\/select\/?$/);
   assert.equal(await page.locator('[data-nav-pending]').count(),0);
   assert.equal(await page.locator('[data-doc-content]').getAttribute('aria-busy'),null);
   assert.equal(await nav.locator('[aria-current="page"]').count(),1);
   assert.ok(await page.evaluate(()=>window.__sidebarInstance===document.querySelector('aside')));
 }finally{release();await page.unroute(pattern)}
 assert.deepEqual(errors,[]);
 console.log(JSON.stringify({browser:name,fonts,navigation:'passed'}));
}finally{await browser?.close();await new Promise(r=>server.close(r))}
