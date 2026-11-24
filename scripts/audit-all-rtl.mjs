import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/all-rtl');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error('base');let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/')&&f!==root)throw Error('path');if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const m=JSON.parse(readFileSync('reference/upstream-manifest.json','utf8'));
const entries=[...m.components,...m.localOnly];
const routes=entries.map(e=>({slug:e.slug,route:e.localRoute.replace(/\/$/,'')+'/'}));
const profiles=[{theme:'light',width:1440,height:1000},{theme:'dark',width:390,height:844}];
const sample=new Set(['button','input','select','data-grid','area-chart-card','project-board','ai-chat','finance-dashboard','home-dashboard','tree-view']);
const axePath=resolve('node_modules/axe-core/axe.min.js');
const results=[];let browser;
try{
 browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 for(const profile of profiles){
  const ctx=await browser.newContext({viewport:{width:profile.width,height:profile.height},colorScheme:profile.theme,reducedMotion:'reduce'});
  async function run(entry){
   const page=await ctx.newPage(),errors=[],row={...entry,...profile};
   page.on('pageerror',e=>errors.push(e.message));
   try{
    assert.equal((await page.goto(origin+entry.route+'?audit-direction=rtl',{waitUntil:'networkidle'}))?.status(),200);
    await page.locator('[data-audit-direction=rtl]').waitFor({state:'attached'});
    await page.evaluate(()=>document.fonts.ready);
    const preview=page.locator(['color','typography'].includes(entry.slug)?'main':'#preview');
    await preview.waitFor();
    const geometry=await preview.evaluate(e=>({documentDirection:document.documentElement.dir,previewDirection:getComputedStyle(e).direction,overflow:document.documentElement.scrollWidth>innerWidth+1,previewWidth:e.getBoundingClientRect().width}));
    Object.assign(row,geometry);
    assert.equal(geometry.documentDirection,'rtl');assert.equal(geometry.previewDirection,'rtl');
    assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),profile.theme==='dark');
    assert.ok(geometry.previewWidth>0);assert.equal(geometry.overflow,false);
    if(entry.slug==='color'){const swatches=await page.locator('#palette [title^="--color-"]').evaluateAll(es=>es.map(e=>({token:e.title,background:getComputedStyle(e).backgroundColor})));assert.equal(swatches.length,69);assert.ok(swatches.every(s=>s.background!=='rgba(0, 0, 0, 0)'),JSON.stringify(swatches.filter(s=>s.background==='rgba(0, 0, 0, 0)')));row.swatches=swatches.length;}
    await page.addScriptTag({path:axePath});
    row.violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
    assert.deepEqual(row.violations,[]);assert.deepEqual(errors,[]);
    row.status='passed';
   }catch(e){row.status='failed';row.error=e.message.slice(0,1500)}
   finally{
    if(sample.has(entry.slug)||row.status==='failed')try{const file=profile.theme+'-'+profile.width+'-'+entry.slug.replace(':','-')+'.png';await page.screenshot({path:join(dir,file),animations:'disabled',timeout:5000});row.file=file}catch{}
    row.errors=errors;results.push(row);console.log(JSON.stringify({slug:row.slug,theme:row.theme,status:row.status,error:row.error}));await page.close();
   }
  }
  for(let i=0;i<routes.length;i+=4)await Promise.all(routes.slice(i,i+4).map(run));
  await ctx.close();
 }
}finally{await browser?.close();await new Promise(r=>server.close(r));writeFileSync(join(dir,'report.json'),JSON.stringify({base:process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),scope:'explicit RTL audit mode, initial-state layout and axe; not full keyboard, translation or manual screen-reader acceptance',profiles,results},null,2)+'\n')}
const failures=results.filter(r=>r.status!=='passed');
console.log(JSON.stringify({count:results.length,passed:results.length-failures.length,failures:failures.map(r=>({slug:r.slug,theme:r.theme,width:r.width,error:r.error}))}));
if(results.length!==routes.length*profiles.length||failures.length)process.exitCode=1;
