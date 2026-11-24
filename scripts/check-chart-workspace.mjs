import { chromium,firefox,webkit } from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/chart-workspace');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/'))throw Error();if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const browserName=process.env.BROWSER||'chromium',browser=await ({chromium,firefox,webkit}[browserName]).launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const axePath=process.env.AXE_PATH??resolve('node_modules/axe-core/axe.min.js'),results=[];
async function audit(page,scope){
 await page.addScriptTag({path:axePath});
 return page.evaluate(async selector=>{const a=await window.axe.run(selector?document.querySelector(selector):document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return a.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))},scope);
}
async function check(ctx,theme,route,name,fn){
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));const result={theme,route,name,browser:browserName};
 try{
  assert.equal((await page.goto(origin+route,{waitUntil:'networkidle'}))?.status(),200);
  assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),theme==='dark');
  result.details=await fn(page);assert.deepEqual(errors,[]);
  result.status='passed';
 }catch(e){result.status='failed';result.error=e.message;result.errors=errors}
 finally{results.push(result);await page.close()}
}
try{
 for(const theme of ['light','dark']){
 const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:browserName!=='firefox',hasTouch:true,colorScheme:theme,reducedMotion:'reduce'});
 for(const slug of ['radar','radial','heatmap','scatter','combo']){
  await check(ctx,theme,'/zh-hans/components/'+slug+'-chart-card/','触摸数据点、动态值、可访问状态',async page=>{
   const panel=page.locator('#preview [role=tabpanel]'),mark=panel.locator('[data-chart-index="0"]').first();
   await mark.scrollIntoViewIfNeeded();
   // SVG groups have full-box bounds; target an actual visible stroke rather than the empty center.
   if(slug==='radial'){
    const circle=mark.locator('circle').last();
    const xy=await circle.evaluate(e=>{const matrix=e.getScreenCTM(),c=new DOMPoint(Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))-Number(e.getAttribute('r'))).matrixTransform(matrix);return {x:c.x,y:c.y}});
    await page.touchscreen.tap(xy.x,xy.y);
   }else if(slug==='radar'){
    await panel.locator('circle[data-chart-index="0"]').tap();
   }else await mark.tap();
   await panel.locator('[data-chart-tooltip]').waitFor();
   const initial=await panel.locator('[data-chart-tooltip]').textContent();
   const select=panel.getByRole('combobox',{name:'查看图表数据点'});
   assert.equal(await select.inputValue(),'0');
   const violations=await audit(page,'#preview');assert.deepEqual(violations,[]);
   await page.screenshot({path:join(dir,theme+'-'+slug+'-touch.png')});
   return {initial,violations,aria:await select.ariaSnapshot()};
  });
 }
 await check(ctx,theme,'/workspace/project-board/','独立看板移动端表单与打开弹窗 axe',async page=>{
   const demo=page.locator('#preview');await demo.getByRole('searchbox',{name:'搜索任务'}).fill('审计跟踪');
   const trigger=demo.getByRole('button',{name:'编辑任务 记录智能体操作的审计跟踪'});
   await trigger.tap();const dialog=page.getByRole('dialog',{name:'编辑任务'});await dialog.waitFor();
   const violations=await audit(page,null);assert.deepEqual(violations,[]);
   const aria=await dialog.ariaSnapshot();
   assert.ok(aria.includes('移动至'));
   await page.screenshot({path:join(dir,theme+'-board-dialog.png')});
   await dialog.getByRole('combobox',{name:'移动至'}).selectOption('done');await dialog.getByRole('button',{name:'保存任务'}).tap();
   await dialog.waitFor({state:'hidden'});
   await demo.locator('[data-board-column="done"]').getByText('记录智能体操作的审计跟踪',{exact:true}).waitFor();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   return {violations,aria};
 });
 await check(ctx,theme,'/workspace/ai-chat/','移动端会话操作',async page=>{
   const demo=page.locator('#preview');await demo.getByRole('button',{name:'新建对话',exact:true}).tap();
   await demo.getByRole('textbox',{name:'消息'}).fill('触摸验收');await demo.getByRole('button',{name:'发送'}).tap();
   await demo.getByRole('log').getByText('触摸验收').waitFor();
   await demo.getByRole('combobox',{name:'切换会话'}).selectOption('1');
   await demo.getByRole('log').getByText('帮我用 BoardUI 搭一个数据看板').waitFor();
   const violations=await audit(page,null);assert.deepEqual(violations,[]);
   await page.screenshot({path:join(dir,theme+'-chat.png')});return {violations};
 });
 await ctx.close();
 }
}finally{await browser.close();server.close();writeFileSync(join(dir,'report.json'),JSON.stringify({browser:browserName,results},null,2))}
console.log(JSON.stringify({browser:browserName,count:results.length,failures:results.filter(r=>r.status!=='passed')},null,2));
if(results.some(r=>r.status!=='passed'))process.exitCode=1;
