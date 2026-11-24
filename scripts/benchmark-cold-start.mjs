import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,statSync,writeFileSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import {gzipSync} from 'node:zlib';
const root=resolve('out'),base='/boardui-next',mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.txt':'text/plain'};
const server=createServer((req,res)=>{try{const p=new URL(req.url,'http://localhost').pathname;if(!p.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(p.slice(base.length)));if(statSync(f).isDirectory())f=join(f,'index.html');let data=readFileSync(f);const compressed=/\.(html|js|css|txt)$/.test(f)&&/gzip/.test(req.headers['accept-encoding']??'');if(compressed)data=gzipSync(data);res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream','Cache-Control':'no-store',...(compressed?{'Content-Encoding':'gzip'}:{})});res.end(data)}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const b=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const rows=[];
try{for(const path of ['/','/zh-hans/components/button/','/zh-hans/components/data-grid/','/zh-hans/components/']){
 const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const c=await p.context().newCDPSession(p);await c.send('Network.enable');await c.send('Network.emulateNetworkConditions',{offline:false,latency:120,downloadThroughput:750000,uploadThroughput:250000});await c.send('Emulation.setCPUThrottlingRate',{rate:4});
 await p.addInitScript(()=>{window.__tasks=[];new PerformanceObserver(l=>window.__tasks.push(...l.getEntries().map(e=>e.duration))).observe({type:'longtask',buffered:true})});
 await p.goto('http://127.0.0.1:'+server.address().port+base+path,{waitUntil:'networkidle',timeout:60000});await p.evaluate(()=>document.fonts.ready);
 const r=await p.evaluate(()=>{const entries=performance.getEntriesByType('resource');const stats={};for(const e of entries){const kind=e.name.includes('.woff2')?'font':e.name.includes('.js')?'js':e.name.includes('.css')?'css':'other';const s=stats[kind]??={count:0,encoded:0,decoded:0};s.count++;s.encoded+=e.encodedBodySize;s.decoded+=e.decodedBodySize;}const nav=performance.getEntriesByType('navigation')[0];return {stats,htmlEncoded:nav.encodedBodySize,domContentLoaded:Math.round(nav.domContentLoadedEventEnd),longTasks:window.__tasks.length,longTaskMs:Math.round(window.__tasks.reduce((a,b)=>a+b,0)),fcp:Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime??0),fontFiles:entries.filter(e=>e.name.includes('.woff2')).map(e=>({name:e.name.split('/').pop(),bytes:e.encodedBodySize}))}});
 rows.push({path,...r});console.log(JSON.stringify(rows.at(-1)));await p.close();
}}finally{await b.close();server.close()}
writeFileSync(process.argv[2]??'cold-start-profile.json',JSON.stringify(rows,null,2));
