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
try{
 for(let i=0;i<3;i++){
 const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const c=await p.context().newCDPSession(p);await c.send('Emulation.setCPUThrottlingRate',{rate:4});await c.send('Performance.enable');
 const origin='http://127.0.0.1:'+server.address().port+base;
 await p.goto(origin+'/',{waitUntil:'networkidle'});
 const t=performance.now();await p.getByRole('button',{name:'快速搜索'}).click();const dialog=p.getByRole('dialog',{name:'搜索文档'});await dialog.waitFor();
 const input=dialog.getByRole('combobox',{name:'搜索文档'});await input.waitFor();
 const open=Math.round(performance.now()-t),count=await dialog.getByRole('option').count();
 // Settle modal before measuring the actual keyboard workload.
 await p.waitForTimeout(120);
 const before=(await c.send('Performance.getMetrics')).metrics;
 const t2=performance.now();
 for(let k=0;k<20;k++)await input.press('ArrowDown');
 await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 const elapsed=Math.round(performance.now()-t2),after=(await c.send('Performance.getMetrics')).metrics;
 const get=(a,n)=>a.find(m=>m.name===n)?.value??0;
 const typing=[];
 for(const q of ['date-picker','button','select','not-a-match','']){
  const start=performance.now();await input.fill(q);await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  typing.push({q,ms:Math.round(performance.now()-start),results:await dialog.getByRole('option').count()});
 }
 rows.push({open,count,arrows:elapsed,scriptMs:Math.round(1000*(get(after,'ScriptDuration')-get(before,'ScriptDuration'))),typing});
 await p.close();
 }
}finally{await b.close();server.close()}
writeFileSync(process.argv[2]??'search-performance.json',JSON.stringify(rows,null,2));console.log(JSON.stringify(rows));
