import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,statSync,writeFileSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
const root=resolve('out'),base='/boardui-next',mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.txt':'text/plain'};
const server=createServer((req,res)=>{try{const p=new URL(req.url,'http://localhost').pathname;if(!p.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(p.slice(base.length)));if(statSync(f).isDirectory())f=join(f,'index.html');const data=readFileSync(f);res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream','Cache-Control':f.includes('/_next/static/')?'public,max-age=31536000,immutable':'public,max-age=60'});res.end(data)}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const b=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const rows=[];
try{for(const profile of ['local','throttled']){
 const page=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 if(profile==='throttled'){const c=await page.context().newCDPSession(page);await c.send('Network.enable');await c.send('Network.emulateNetworkConditions',{offline:false,latency:120,downloadThroughput:750000,uploadThroughput:250000});await c.send('Emulation.setCPUThrottlingRate',{rate:4});}
 const origin='http://127.0.0.1:'+server.address().port+base;
 await page.goto(origin+'/',{waitUntil:'networkidle'});
 await page.evaluate(()=>{window.__long=[];new PerformanceObserver(l=>window.__long.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});window.__oldSidebar=document.querySelector('aside');});
 for(const path of ['/zh-hans/components/button','/zh-hans/components/input','/zh-hans/components/select','/zh-hans/components/data-grid','/zh-hans/templates/dashboard','/zh-hans/components/button']){
 const link=page.locator('aside nav a[href="'+base+path+'/"],aside nav a[href="'+base+path+'"]').first();
 await link.scrollIntoViewIfNeeded();
 await link.hover();
 await page.waitForTimeout(180);
 const start=await page.evaluate(()=>{performance.clearResourceTimings();window.__long=[];return performance.now()});
 await link.click();
 await page.waitForURL(url=>url.pathname.replace(/\/$/,'')===base+path);
 await page.waitForFunction(p=>document.querySelector('aside nav [aria-current=page]')?.getAttribute('href')?.replace(/\/$/,'')===p,base+path);
 await page.locator('main h1').waitFor();
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const m=await page.evaluate(start=>({ms:Math.round(performance.now()-start),sidebarSame:window.__oldSidebar===document.querySelector('aside'),requests:performance.getEntriesByType('resource').filter(e=>e.startTime>=start).map(e=>({name:e.name.split('/').pop().split('?')[0],ms:Math.round(e.duration),bytes:e.transferSize})),longTasks:window.__long?.length??0}),start);
 rows.push({profile,path,...m});console.log(JSON.stringify(rows.at(-1)));
 }
 await page.close();
}}finally{await b.close();server.close()}
writeFileSync(process.argv[2]??'navigation-performance.json',JSON.stringify(rows,null,2));
