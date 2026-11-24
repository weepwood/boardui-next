import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/loading-contracts');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error('base');let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/')&&f!==root)throw Error('path');if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const results=[];let browser;
try{
 browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 for(const theme of ['light','dark'])for(const direction of ['ltr','rtl'])for(const motion of ['no-preference','reduce']){
  const ctx=await browser.newContext({viewport:{width:theme==='light'?1440:390,height:theme==='light'?1000:844},colorScheme:theme,reducedMotion:motion});
  const page=await ctx.newPage(),row={theme,direction,motion},errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const suffix=direction==='rtl'?'?audit-direction=rtl':'';
  try{
   await page.goto(origin+'/zh-hans/components/progress/'+suffix,{waitUntil:'networkidle'});
   const demo=page.getByTestId('loading-contract'),bar=demo.getByRole('progressbar',{name:'动态进度'});
   await demo.scrollIntoViewIfNeeded();
   assert.equal(await demo.evaluate(e=>getComputedStyle(e).direction),direction);
   assert.equal(await bar.getAttribute('aria-valuenow'),null);
   const sweep=bar.locator('[data-progress-sweep]'),motionRoot=bar.locator('[data-progress-motion]');
   await page.waitForFunction(e=>e.dataset.motionActive==='true',await motionRoot.elementHandle());
   const style=await sweep.evaluate(e=>({name:getComputedStyle(e).animationName,state:getComputedStyle(e).animationPlayState}));
   assert.equal(style.name,motion==='reduce'?'none':direction==='rtl'?'bui-progress-sweep-rtl':'bui-progress-sweep');
   if(motion==='no-preference'){
    assert.equal(style.state,'running');
    await page.locator('h1').scrollIntoViewIfNeeded();
    await page.waitForFunction(e=>e.dataset.motionActive==='false',await motionRoot.elementHandle());
    assert.equal(await sweep.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
    await demo.scrollIntoViewIfNeeded();
    await page.waitForFunction(e=>e.dataset.motionActive==='true',await motionRoot.elementHandle());
   }else{
    const centered=await sweep.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect();return Math.abs((a.left+a.right-b.left-b.right)/2)<1});
    assert.ok(centered);
   }
   await demo.getByRole('button',{name:'切换等待'}).press('Space');
   await sweep.waitFor({state:'detached'});
   assert.equal(await bar.getAttribute('aria-valuenow'),'25');
   assert.equal(await bar.getAttribute('aria-valuemin'),'20');assert.equal(await bar.getAttribute('aria-valuemax'),'120');
   await demo.getByRole('button',{name:'更新进度'}).press('Enter');
   assert.equal(await bar.getAttribute('aria-valuenow'),'95');
   await page.waitForFunction(e=>{const track=e.firstElementChild,fill=track.firstElementChild;return Math.abs(fill.getBoundingClientRect().width/track.getBoundingClientRect().width-.75)<.01},await bar.elementHandle());
   const geo=await bar.evaluate(e=>{const t=e.firstElementChild.getBoundingClientRect(),f=e.firstElementChild.firstElementChild.getBoundingClientRect();return {height:t.height,start:getComputedStyle(e).direction==='rtl'?Math.abs(t.right-f.right):Math.abs(t.left-f.left)}});
   assert.equal(geo.height,6);assert.ok(geo.start<=1);
   await demo.getByRole('button',{name:'切换等待'}).press('Enter');await sweep.waitFor();assert.equal(await bar.getAttribute('aria-valuenow'),null);
   // The wait indicator must be removed on mode changes and newly mounted on return.
   await page.goto(origin+'/zh-hans/components/avatar/'+suffix,{waitUntil:'networkidle'});
   const av=page.getByTestId('avatar-contract'),avatar=av.getByRole('img',{name:'切换头像'});
   await av.scrollIntoViewIfNeeded();await avatar.getByText('A',{exact:true}).waitFor();
   for(let i=0;i<2;i++){
    await av.getByRole('button',{name:'有效图片'}).click();await page.waitForFunction(e=>e.querySelector('img')?.naturalWidth===24,await avatar.elementHandle());
    await av.getByRole('button',{name:'损坏图片'}).click();await avatar.getByText('A',{exact:true}).waitFor();assert.equal(await avatar.locator('img').count(),0);
   }
   await av.getByRole('button',{name:'检查引用'}).click();assert.equal(await av.locator('output').textContent(),'true');
   const size=await avatar.boundingBox();assert.equal(size.width,32);assert.equal(size.height,32);
   await page.goto(origin+'/zh-hans/components/spinner/'+suffix,{waitUntil:'networkidle'});
   const sp=page.getByTestId('spinner-contract');
   for(const [name,n] of [['正在同步',24],['正在读取',20]]){
    const s=sp.getByRole('progressbar',{name,exact:true});assert.equal(await s.getAttribute('aria-valuenow'),null);
    const svg=s.locator('svg');assert.equal(await svg.getAttribute('aria-hidden'),'true');assert.equal((await svg.boundingBox()).width,n);
   }
   await page.goto(origin+'/zh-hans/components/skeleton/'+suffix,{waitUntil:'networkidle'});
   const sk=page.getByTestId('skeleton-contract');await sk.scrollIntoViewIfNeeded();
   const shapes=await sk.locator('[data-skeleton]').evaluateAll(es=>es.map(e=>({radius:getComputedStyle(e).borderTopLeftRadius,w:e.clientWidth,h:e.clientHeight,hidden:e.getAttribute('aria-hidden'),animation:getComputedStyle(e,'::before').animationName})));
   assert.equal(shapes.length,5);assert.equal(shapes[1].radius,shapes[4].radius);
   assert.equal(new Set(shapes.slice(0,4).map(s=>s.radius)).size,4);
   assert.ok(shapes.every(s=>s.w===40&&s.h===40&&s.hidden==='true'));
   if(motion==='reduce')assert.ok(shapes.every(s=>s.animation==='none'));
   row.geometry=geo;row.shapes=shapes;assert.deepEqual(errors,[]);row.status='passed';
  }catch(e){row.status='failed';row.error=e.message.slice(0,1800)}
  finally{row.errors=errors;results.push(row);console.log(JSON.stringify(row));await ctx.close()}
 }
}finally{await browser?.close();await new Promise(r=>server.close(r));writeFileSync(join(dir,'report.json'),JSON.stringify({base:process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),scope:'Progress mode transition, normal/reduced motion lifecycle and logical fill; Avatar source retry/ref; Spinner names; Skeleton own prop variants',results},null,2)+'\n')}
assert.equal(results.length,8);assert.ok(results.every(r=>r.status==='passed'));
