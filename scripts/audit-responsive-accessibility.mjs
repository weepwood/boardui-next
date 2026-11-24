import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,statSync,readdirSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/responsive');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/')&&f!==root)throw Error();if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(d,e.name)):[join(d,e.name)]);
const allRoutes=walk(root).filter(f=>f.endsWith('/index.html')).map(f=>f.slice(root.length,-'index.html'.length));
const routes=process.env.AUDIT_ROUTES?JSON.parse(process.env.AUDIT_ROUTES):allRoutes;
if(!routes.length||routes.some(r=>!allRoutes.includes(r)))throw Error('Invalid audit routes');
const manifest=JSON.parse(readFileSync('reference/upstream-manifest.json','utf8'));
const missing=new Set('color typography carousel divider link-button social-button auth-card web-search task-list questionnaire settings-modal search-field spinner skeleton toggle-button tag-group counter toast combobox token-input'.split(' '));
const extra=[...manifest.components,...manifest.localOnly].filter(e=>missing.has(e.slug));
const profiles=[{width:390,height:844,deviceScaleFactor:2},{width:320,height:720,deviceScaleFactor:1},{width:2560,height:1440,deviceScaleFactor:1}];
const browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const results=[];
const axePath=process.env.AXE_PATH??resolve('node_modules/axe-core/axe.min.js');
async function run(ctx,route,theme,profile,axe,upstream=false){
 const p=await ctx.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const row={route,theme,profile,axe,upstream};
 try{
  row.http=(await p.goto((upstream?'https://www.boardui.com':origin)+route,{waitUntil:'domcontentloaded',timeout:20000}))?.status();
  await p.locator('body').waitFor();
  await p.evaluate(()=>document.fonts.ready);
  if(!upstream)await p.waitForLoadState('networkidle',{timeout:15000});
  Object.assign(row,await p.evaluate(()=>{
   const root=document.documentElement,main=document.querySelector('main'),preview=document.querySelector('#preview'),r=e=>{const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height].map(Math.round)};
   return {title:document.title,width:root.scrollWidth,viewport:innerWidth,main:main?r(main):null,preview:preview?r(preview):null,dpr:devicePixelRatio,overflow:root.scrollWidth>innerWidth+1};
  }));
  if(axe){await p.waitForFunction(()=>[...document.querySelectorAll('[role=tab][aria-selected=true][aria-controls]')].every(t=>!!document.getElementById(t.getAttribute("aria-controls"))),{},{timeout:10000});await p.addScriptTag({path:axePath});row.violations=await p.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))}
  if(upstream||extra.some(e=>route===e.localRoute+'/')||route.includes('/templates/')&&route!='/zh-hans/templates/')await p.screenshot({path:join(dir,(upstream?'original':theme)+'-'+profile.width+'-'+route.replace(/[^a-z0-9-]/g,'_')+'.png'),timeout:10000});
 }catch(e){row.error=e.message.slice(0,500)}finally{row.errors=errors;results.push(row);await p.close()}
}
try{
 if(!process.argv.includes('--upstream-only')){
 for(const theme of ['light','dark']){
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  for(let i=0;i<routes.length;i+=5)await Promise.all(routes.slice(i,i+5).map(r=>run(ctx,r,theme,{width:1440,height:1000,deviceScaleFactor:1},true)));
  await ctx.close();
 }
 for(const profile of profiles){
  const ctx=await browser.newContext({viewport:{width:profile.width,height:profile.height},deviceScaleFactor:profile.deviceScaleFactor,colorScheme:'light',reducedMotion:'reduce'});
  const subset=profile.width===390?routes:routes.filter(r=>r.includes('/templates/')||extra.some(e=>r===e.localRoute+'/')||['/','/zh-hans/components/','/zh-hans/rtl/','/zh-hans/components/data-grid/','/zh-hans/components/area-chart-card/','/zh-hans/components/input-otp/'].includes(r));
  for(let i=0;i<subset.length;i+=5)await Promise.all(subset.slice(i,i+5).map(r=>run(ctx,r,'light',profile,false)));
  await ctx.close();
 }
 }
 if(!process.argv.includes('--local-only')){
 const profile={width:1440,height:1000,deviceScaleFactor:1};
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:'light',reducedMotion:'reduce'});
 const originals=extra.filter(e=>e.sourcePolicy!=='review-required').map(e=>e.localRoute+'/');
 for(let i=0;i<originals.length;i+=4)await Promise.all(originals.slice(i,i+4).map(r=>run(ctx,r,'light',profile,false,true)));
 await ctx.close();
 }
}finally{await browser.close();server.close();writeFileSync(join(dir,'report.json'),JSON.stringify(results,null,2))}
console.log(JSON.stringify({count:results.length,issues:results.filter(r=>r.http!==200||r.error||r.errors.length||r.overflow||r.violations?.length).map(r=>({route:r.route,theme:r.theme,width:r.profile.width,overflow:r.overflow,error:r.error,errors:r.errors,violations:r.violations?.map(v=>[v.id,v.nodes.length])}))}));
if(results.some(r=>!r.upstream&&(r.http!==200||r.error||r.errors.length||r.overflow||r.violations?.length)))process.exitCode=1;
