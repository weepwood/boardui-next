import { chromium } from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,readdirSync,statSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
const root=resolve('out'),base='/boardui-next',mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.txt':'text/plain'};
const server=createServer((req,res)=>{try{const p=new URL(req.url,'http://localhost').pathname;if(!p.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(p.slice(base.length)));if(!f.startsWith(root+'/')&&f!==root)throw Error();if(statSync(f).isDirectory())f=join(f,'index.html');const data=readFileSync(f);res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream'});res.end(data)}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(d,e.name)):[join(d,e.name)]);
const all=walk(root).filter(f=>f.endsWith('/index.html')).map(f=>f.slice(root.length,-10));
const routes=all.filter(r=>r==='/'||r==='/zh-hans/components/'||r.includes('/templates/')||/\/(button|input|select|tabs|modal|checkbox|switch|slider|dropdown|tooltip|command-palette|sidebar|composer|table|data-grid|date-picker|avatar|stat-cards)\/$/.test(r));
const dir=resolve(process.argv[2]??'acceptance/basic-visual');mkdirSync(dir,{recursive:true});
const b=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const result=[];
try{
 for(const theme of ["light","dark"]){
 const context=await b.newContext({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:"reduce"});
 for(const slug of ["button","icon-button","close-button","button-group","checkbox","radio","switch","input","textarea","select","tabs","segmented-control"]){
   const p=await context.newPage();
   const errors=[];p.on("pageerror",e=>errors.push(e.message));
   await p.goto("http://127.0.0.1:"+server.address().port+base+"/zh-hans/components/"+slug+"/",{waitUntil:"networkidle"});
   await p.evaluate(()=>document.fonts.ready);
   const metrics=await p.evaluate(()=>{
     const canvas=document.querySelector("#preview [role=tabpanel]");
     const rect=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(Math.round)};
     const items=[...canvas.querySelectorAll("button,input,textarea,[role=tab]")];
     return {canvas:rect(canvas),controls:items.map(el=>({text:el.textContent,aria:el.getAttribute("aria-label"),rect:rect(el),radius:getComputedStyle(el).borderRadius,font:getComputedStyle(el).fontSize})),overflow:document.documentElement.scrollWidth>innerWidth};
   });
   await p.screenshot({path:join(dir,theme+"-"+slug+".png")});
   result.push({slug,theme,...metrics,errors});await p.close();
 }
 await context.close();
 }
}finally{await b.close();server.close()}
writeFileSync(join(dir,"report.json"),JSON.stringify(result,null,2));
