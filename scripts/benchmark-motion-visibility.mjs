import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,statSync,writeFileSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import {gzipSync} from 'node:zlib';
const root=resolve('out'),base='/boardui-next',mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.txt':'text/plain'};
const server=createServer((req,res)=>{try{const p=new URL(req.url,'http://localhost').pathname;if(!p.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(p.slice(base.length)));if(statSync(f).isDirectory())f=join(f,'index.html');let data=readFileSync(f);const compressed=/\.(html|js|css|txt)$/.test(f)&&/gzip/.test(req.headers['accept-encoding']??'');if(compressed)data=gzipSync(data);res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream','Cache-Control':'no-store',...(compressed?{'Content-Encoding':'gzip'}:{})});res.end(data)}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const b=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const page=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
try {
 await page.addInitScript(()=>{const native=window.setInterval;window.__ticks={80:0,100:0};window.setInterval=function(fn,delay,...args){if(typeof fn==='function'&&(delay===80||delay===100))return native.call(window,(...a)=>{window.__ticks[delay]++;fn(...a)},delay,...args);return native.call(window,fn,delay,...args)}});
 await page.goto('http://127.0.0.1:'+server.address().port+base+'/zh-hans/components/agent-thinking/',{waitUntil:'networkidle'});
 const preview=page.locator('#preview');await preview.scrollIntoViewIfNeeded();await page.waitForTimeout(250);
 const sample=async(label)=>{const start=await page.evaluate(()=>({...window.__ticks}));await page.waitForTimeout(1200);const end=await page.evaluate(()=>({...window.__ticks}));return {label,dots:end[80]-start[80],timers:end[100]-start[100]}};
 const before=await sample('visible');
 await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(400);
 const off=await preview.evaluate(e=>e.getBoundingClientRect().bottom<0);if(!off)throw Error('preview not offscreen');
 const hidden=await sample('offscreen');await preview.scrollIntoViewIfNeeded();await page.waitForTimeout(300);const resumed=await sample('resumed');
 console.log(JSON.stringify([before,hidden,resumed]));writeFileSync(process.argv[2]??'benchmark-motion-visibility.json',JSON.stringify([before,hidden,resumed],null,2));
}finally{await page.close();await b.close();server.close()}
