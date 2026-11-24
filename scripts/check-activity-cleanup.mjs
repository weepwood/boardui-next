import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,statSync,writeFileSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
const root=resolve('out'),base='/boardui-next',mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.txt':'text/plain'};
const server=createServer((req,res)=>{try{const p=new URL(req.url,'http://localhost').pathname;if(!p.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(p.slice(base.length)));if(statSync(f).isDirectory())f=join(f,'index.html');const data=readFileSync(f);res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream','Cache-Control':f.includes('/_next/static/')?'public,max-age=31536000,immutable':'public,max-age=60'});res.end(data)}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const b=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const page=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
const origin='http://127.0.0.1:'+server.address().port+base;
try{
 await page.addInitScript(()=>{
   window.__activityTargets={intersection:new Set(),resize:new Set()};
   for(const [name,kind] of [['IntersectionObserver','intersection'],['ResizeObserver','resize']]){
    const Native=window[name],all=window.__activityTargets[kind];
    window[name]=class extends Native{
     constructor(...args){super(...args);this.tracked=new Set()}
     observe(target,...args){if(target.hasAttribute('data-motion-active')){this.tracked.add(target);all.add(target)}return super.observe(target,...args)}
     unobserve(target){this.tracked.delete(target);all.delete(target);return super.unobserve(target)}
     disconnect(){for(const target of this.tracked)all.delete(target);this.tracked.clear();return super.disconnect()}
    }
   }
 });
 await page.goto(origin+'/zh-hans/components/button/',{waitUntil:'networkidle'});
 const counts=()=>page.evaluate(()=>Object.fromEntries(Object.entries(window.__activityTargets).map(([k,v])=>[k,v.size])));
 const rows=[];
 for(let i=0;i<3;i++){
   await page.locator('aside nav [data-doc-path="/zh-hans/components/composer-loader"]').click();
   await page.waitForURL(/components\/composer-loader\/?$/);
   await page.waitForFunction(()=>window.__activityTargets.intersection.size>=4&&window.__activityTargets.resize.size>=2);
   rows.push({cycle:i+1,phase:'mounted',...await counts()});
   await page.locator('aside nav [data-doc-path="/zh-hans/components/button"]').click();
   await page.waitForURL(/components\/button\/?$/);
   await page.waitForFunction(()=>Object.values(window.__activityTargets).every(s=>s.size===0));
   rows.push({cycle:i+1,phase:'released',...await counts()});
 }
 console.log(JSON.stringify(rows));writeFileSync(process.argv[2]??'activity-cleanup.json',JSON.stringify(rows,null,2));
}finally{await page.close();await b.close();server.close()}
