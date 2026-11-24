import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync,statSync,writeFileSync } from 'node:fs';
import { resolve,join,extname } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.woff2':'font/woff2','.svg':'image/svg+xml'};
const server=createServer((req,res)=>{try{const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith(base+'/'))throw Error('prefix');let f=resolve(root,'.'+decodeURIComponent(url.pathname.slice(base.length)));if(!f.startsWith(root+'/')&&f!==root)throw Error('path');if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream','Cache-Control':f.includes('/_next/static/')?'public,max-age=31536000,immutable':'public,max-age=60'});res.end(readFileSync(f));}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const results=[];let browser;
try{
 browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const cdp=await page.context().newCDPSession(page);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/zh-hans/components/button/',{waitUntil:'networkidle'});
 const sidebar=page.locator('aside nav[aria-label="元件库"]');
 await page.evaluate(()=>{window.__originalSidebar=document.querySelector('aside');window.__tasks=[];new PerformanceObserver(l=>window.__tasks.push(...l.getEntries().map(e=>e.duration))).observe({type:'longtask'});});
 const slugs=['composer-loader','data-grid','agent-thinking','select','button'];
 async function sample(cycle){
   await cdp.send('HeapProfiler.collectGarbage');
   const heap=await cdp.send('Runtime.getHeapUsage');
   const dom=await cdp.send('Memory.getDOMCounters');
   const tasks=await page.evaluate(()=>{const a=window.__tasks.splice(0);return {count:a.length,ms:Math.round(a.reduce((x,y)=>x+y,0))}});
   results.push({cycle,heapBytes:heap.usedSize,documents:dom.documents,nodes:dom.nodes,eventListeners:dom.jsEventListeners,longTasks:tasks.count,longTaskMs:tasks.ms});
 }
 for(let cycle=1;cycle<=6;cycle++){
   for(const slug of slugs){
     await sidebar.locator('[data-doc-path="/zh-hans/components/'+slug+'"]').click();
     await page.waitForURL(new RegExp('/components/'+slug+'/?$'));
     await page.locator('main h1').waitFor();
     await page.waitForFunction(()=>!document.querySelector('[data-doc-content]').hasAttribute('aria-busy'));
     assert.ok(await page.evaluate(()=>window.__originalSidebar===document.querySelector('aside')));
   }
   await page.waitForLoadState('networkidle');await sample(cycle);
 }
 assert.deepEqual(errors,[]);
 const warmed=results.slice(2);
 // Diagnostic rather than a fragile absolute memory gate. The repeated
 // navigation sequence intentionally warms the Next.js route cache.
 const range=key=>Math.max(...warmed.map(r=>r[key]))-Math.min(...warmed.map(r=>r[key]));
 const report={environment:'Chromium CDP, same context, six cycles of five routes; forced GC at button page, warm cache; not a heap-retainer analysis',results,warmRange:{heapBytes:range('heapBytes'),nodes:range('nodes'),eventListeners:range('eventListeners')},errors};
 writeFileSync(process.argv[2]??'runtime-lifecycle.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));
}finally{await browser?.close();await new Promise(r=>server.close(r))}
