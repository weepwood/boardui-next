import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/component-matrix');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/'))throw Error();if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const manifest=JSON.parse(readFileSync('reference/upstream-manifest.json','utf8'));
const selected=new Set('dropdown popover tooltip modal drawer context-menu accordion breadcrumb pagination sidebar date-picker date-calendar calendar slider number-field time-field color-picker input-otp table data-table data-grid tree-view file-upload composer composer-panel composer-attachments composer-loader agent-thinking agent-creator agent-progress agent-limits-card command-palette notification-center'.split(' '));
const routes=[...manifest.components,...manifest.localOnly].filter(e=>selected.has(e.slug)||e.localRoute.includes('/templates/')||e.slug.endsWith('-card')&&/chart|rings|contributions|active-days|stage-bars|steps|sleep-score|bar-list/.test(e.slug)).filter(e=>!process.argv.includes("--templates-only")||e.localRoute.includes("/templates/"));
const browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const report=[];
async function capture(context,e,kind,theme){
 const p=await context.newPage();const errors=[];p.on('pageerror',err=>errors.push(err.message));
 const url=kind==='local'?'http://127.0.0.1:'+server.address().port+base+e.localRoute+'/':'https://www.boardui.com'+e.localRoute;
 const row={slug:e.slug,route:e.localRoute,kind,theme,sourcePolicy:e.sourcePolicy??'local-extension'};
 try{
  const response=await p.goto(url,{waitUntil:'domcontentloaded',timeout:18000});
  row.http=response?.status();row.finalUrl=p.url();
  if(kind==="upstream"&&e.localRoute.includes("/templates/"))await p.locator("body").waitFor({timeout:6000});else await p.locator('main h1').first().waitFor({timeout:6000});
  await p.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,1800))]));
  if(kind==='local')await p.waitForLoadState('networkidle',{timeout:10000});
  else if(e.localRoute.includes('/templates/'))await p.waitForLoadState('networkidle',{timeout:5000}).catch(()=>{});
  Object.assign(row,await p.evaluate(()=>{
    const rect=e=>{const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height].map(Math.round)};
    const main=document.querySelector('main')??document.body;
    const canvas=document.querySelector('#preview [role=tabpanel]')??[...main.querySelectorAll('div')].find(e=>{const b=e.getBoundingClientRect(),s=getComputedStyle(e);return b.width>=600&&b.height>=250&&s.borderRadius==='24px'&&s.borderTopWidth==='1px'});
    const controls=[...(canvas??main).querySelectorAll('button,input,textarea,[role=tab],[role=combobox]')??[]].slice(0,20).map(e=>({role:e.getAttribute('role')??e.tagName.toLowerCase(),label:(e.getAttribute('aria-label')??e.textContent??'').trim().slice(0,80),rect:rect(e),radius:getComputedStyle(e).borderRadius}));
    return {title:main.querySelector('h1')?.textContent??document.title,canvas:canvas?rect(canvas):null,controls,overflow:document.documentElement.scrollWidth>innerWidth,svgCount:(canvas??main).querySelectorAll('svg').length};
  }));
  await p.screenshot({path:join(dir,kind+'-'+theme+'-'+e.slug.replace(':','-')+'.png'),timeout:10000});
 }catch(err){row.error=String(err.message).slice(0,400)}finally{row.errors=errors;report.push(row);await p.close()}
}
try{
 if(!process.argv.includes('--upstream-only'))for(const theme of ['light','dark']){
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  for(let i=0;i<routes.length;i+=4)await Promise.all(routes.slice(i,i+4).map(e=>capture(ctx,e,'local',theme)));
  await ctx.close();
 }
 if(!process.argv.includes("--local-only")){
 const ctx=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:'light',reducedMotion:'reduce'});
 const originals=routes.filter(e=>e.tier);
 for(let i=0;i<originals.length;i+=5)await Promise.all(originals.slice(i,i+5).map(e=>capture(ctx,e,'upstream','light')));
 await ctx.close();
 }
}finally{await browser.close();server.close();writeFileSync(join(dir,'report.json'),JSON.stringify(report,null,2))}
console.log(JSON.stringify({routes:routes.length,local:report.filter(r=>r.kind==='local').length,upstream:report.filter(r=>r.kind==='upstream').length,issues:report.filter(r=>r.error||r.errors.length||r.overflow||!r.canvas).map(r=>({slug:r.slug,kind:r.kind,theme:r.theme,error:r.error,errors:r.errors,overflow:r.overflow,canvas:r.canvas}))}));

if(report.some(r=>r.kind==="local"&&(r.http!==200||r.error||r.errors.length||r.overflow||!r.canvas)))process.exitCode=1;
