import { chromium,firefox,webkit } from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/contrast');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/'))throw Error();if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const browserName=process.env.BROWSER||'chromium',browser=await ({chromium,firefox,webkit}[browserName]).launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const results=[];


try{
 for(const theme of ['light','dark']){
 const page=await browser.newPage({colorScheme:theme,viewport:{width:1440,height:1000}});
 await page.goto(origin+'/zh-hans/components/orders-chart-card/',{waitUntil:'networkidle'});
 const values=await page.evaluate(()=>{
   const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
   function color(token){ctx.clearRect(0,0,1,1);const e=document.createElement('span');e.style.color='var(--color-'+token+')';document.body.append(e);ctx.fillStyle=getComputedStyle(e).color;ctx.fillRect(0,0,1,1);e.remove();return [...ctx.getImageData(0,0,1,1).data].slice(0,3)}
   function lum(rgb){return rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0)}
   const pairs=[...['text-secondary','text-tertiary'].flatMap(t=>['background-full','background-primary-default','background-secondary-default'].map(b=>[t,b,4.5])),['chart-neutral','background-secondary-default',3]];
   return pairs.map(([fg,bg,target])=>{const f=color(fg),b=color(bg),l=[lum(f),lum(b)].sort((a,b)=>b-a);return {fg,bg,foreground:f,background:b,ratio:(l[0]+.05)/(l[1]+.05),target}});
 });
 results.push({theme,values});await page.close();
 }
}finally{await browser.close();server.close();writeFileSync(join(dir,'report.json'),JSON.stringify(results,null,2))}
console.log(JSON.stringify(results));
const failures=results.flatMap(r=>r.values.filter(v=>v.ratio<v.target).map(v=>({...v,theme:r.theme})));
assert.deepEqual(failures,[],JSON.stringify(failures));
