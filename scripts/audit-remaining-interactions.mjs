import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/remaining-interactions');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error('base');let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/')&&f!==root)throw Error('path');if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const routes='color typography announcement avatar chip divider link-button notification agent-limits-card stat-cards activity-rings-card contributions-card funnel-chart-card most-active-days-card sankey-chart-card sleep-score-card stage-bars-card steps-card badge progress meter'.split(' ');
const results=[];let browser;
const checkText=async(scope,values)=>{for(const v of values)await scope.getByText(v,{exact:true}).first().waitFor()};
const finiteSvg=async scope=>{assert.ok(await scope.locator('svg').count());assert.ok(await scope.locator('svg').evaluateAll(es=>es.every(e=>!/(?:NaN|Infinity)/.test(e.outerHTML))))};
try{
 browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 for(const theme of ['light','dark']){
  const ctx=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  async function run(slug){
   const page=await ctx.newPage(),row={slug,theme,mode:'passive-presentation'},errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   try{
    assert.equal((await page.goto(origin+'/zh-hans/components/'+slug+'/',{waitUntil:'networkidle'}))?.status(),200);
    const preview=page.locator('#preview'),panel=preview.locator('[data-preview-content]');
    if(slug==='color'){
     const colors=await page.locator('#palette [title^="--color-"]').evaluateAll(es=>es.map(e=>getComputedStyle(e).backgroundColor));assert.equal(colors.length,69);assert.ok(colors.every(v=>v!=='rgba(0, 0, 0, 0)'));row.assertion='69 resolved colors';
    }else if(slug==='typography'){
     await page.locator('main h1').getByText('字体排版',{exact:true}).waitFor();assert.ok(await page.locator('main pre').count());row.assertion='typography guide and code';
    }else if(slug==='announcement'||slug==='notification'){
     row.mode='interaction';const demo=page.getByTestId('dismiss-contract'),action=demo.getByRole('button',{name:slug==='announcement'?'查看设置':'查看详情',exact:true}),close=demo.getByRole('button',{name:slug==='announcement'?'关闭示例公告':'关闭示例通知'});
     await demo.scrollIntoViewIfNeeded();await action.press('Enter');assert.equal(await demo.locator('output').textContent(),'1 / 0');
     await close.press('Space');await close.waitFor({state:'hidden'});await demo.locator('output').getByText('1 / 1',{exact:true}).waitFor();
     await demo.getByRole('button',{name:'重置示例'}).click();await close.waitFor();row.assertion='action callback, dismiss callback, remount';
    }else if(slug==='avatar'){
     row.mode='state-fallback';const avatar=page.getByRole('img',{name:'回退头像'});await avatar.scrollIntoViewIfNeeded();await avatar.getByText('A',{exact:true}).waitFor();assert.equal(await avatar.locator('img').count(),0);row.assertion='broken image fallback';
    }else if(slug==='chip'){
     row.mode='interaction';const filter=page.locator('#filters'),chip=filter.getByRole('button',{name:'收藏',exact:true});assert.equal(await chip.getAttribute('aria-pressed'),'false');await chip.press('Space');assert.equal(await chip.getAttribute('aria-pressed'),'true');await chip.press('Enter');assert.equal(await chip.getAttribute('aria-pressed'),'false');row.assertion='keyboard toggles';
    }else if(slug==='link-button'){
     row.mode='interaction';const link=panel.getByRole('link',{name:'浏览全部组件'});assert.ok((await link.getAttribute('href')).includes('/zh-hans/components'));await link.press('Enter');await page.waitForURL(/\/zh-hans\/components\/?$/);row.assertion='keyboard navigation';
    }else if(slug==='divider'){
     await panel.getByRole('separator').waitFor();row.assertion='separator semantics';
    }else if(slug==='badge'){
     await checkText(panel,['默认','全新','成功','警告','错误','Pro']);row.assertion='six status labels';
    }else if(slug==='progress'){
     const bar=panel.getByRole('progressbar',{name:'任务进度'});assert.equal(await bar.getAttribute('aria-valuenow'),'45');const busy=page.getByRole('progressbar',{name:'加载中'});assert.equal(await busy.getAttribute('aria-valuenow'),null);row.assertion='determinate/indeterminate semantics';
    }else if(slug==='meter'){
     for(const [name,value] of [['存储空间','68'],['CPU','81'],['磁盘','93']])assert.equal(await panel.getByRole('meter',{name}).getAttribute('aria-valuenow'),value);row.assertion='bounded meter values';
    }else if(slug==='agent-limits-card'){
     row.mode='state-boundary';for(const [name,value] of [['消息数','82'],['Token','93'],['文件上传','24']])assert.equal(await panel.getByRole('meter',{name}).getAttribute('aria-valuenow'),value);
     const edge=page.locator('#limits-edge');for(const [name,value] of [['未知额度','0'],['负数用量','0'],['超过额度','100']])assert.equal(await edge.getByRole('meter',{name}).getAttribute('aria-valuenow'),value);assert.equal(await edge.getByRole('meter',{name:'未知额度'}).getAttribute('aria-valuetext'),'额度未知');row.assertion='normal, zero-max, negative and over-limit';
    }else if(slug==='stat-cards'){await checkText(panel,['总收入','¥128,430','订单数','1,284','活跃用户','8,621','转化率','3.84%']);row.assertion='four data cards';}
    else if(slug==='activity-rings-card'){await checkText(panel,['移动','锻炼','跑步']);assert.equal(await panel.locator('svg circle').count(),6);await finiteSvg(panel);row.assertion='three labelled rings';}
    else if(slug==='contributions-card'){row.mode='interaction';const grid=panel.getByRole('region',{name:'贡献记录滚动区域'});assert.equal(await grid.locator('[data-chart-index]').count(),140);await grid.focus();assert.ok(await grid.evaluate(e=>e===document.activeElement));row.assertion='140 cells and keyboard scroll entry';}
    else if(slug==='funnel-chart-card'){await panel.getByRole('img',{name:'转化漏斗'}).waitFor();await checkText(panel,['链接已打开','开始','已完成','已转换']);await finiteSvg(panel);row.assertion='four funnel stages';}
    else if(slug==='most-active-days-card'){await checkText(panel,['周二','周三','周四','周一','周五']);row.assertion='five weekday labels';}
    else if(slug==='sankey-chart-card'){const svg=panel.locator('svg[role=img]');assert.ok((await svg.getAttribute('aria-label')).includes('搜索至首页 60'));assert.equal(await svg.locator('path').count(),7);await finiteSvg(panel);row.assertion='seven flows and accessible description';}
    else if(slug==='stage-bars-card'){await checkText(panel,['需求','设计','开发','测试','92','74','58','36']);row.assertion='four stage values';}
    else if(slug==='sleep-score-card'||slug==='steps-card'){
     row.mode='interaction';const select=panel.getByRole('combobox',{name:'查看图表数据点'});await select.selectOption('0');const announcement=panel.locator('[data-chart-announcement]');assert.ok((await announcement.textContent()).includes(slug==='sleep-score-card'?'372':'4,200'));await select.selectOption('');assert.equal(await announcement.textContent(),'');row.assertion='data selection and clear';
    }else throw Error('unmapped route');
    assert.deepEqual(errors,[]);row.status='passed';
   }catch(e){row.status='failed';row.error=e.message.slice(0,1500)}
   finally{row.errors=errors;results.push(row);console.log(JSON.stringify(row));await page.close()}
  }
  for(let i=0;i<routes.length;i+=3)await Promise.all(routes.slice(i,i+3).map(run));
  await ctx.close();
 }
}finally{await browser?.close();await new Promise(r=>server.close(r));writeFileSync(join(dir,'report.json'),JSON.stringify({scope:'21 previously uncovered routes: real interaction/state assertions where applicable; passive display assertions are not interactive behavior',results},null,2)+'\n')}
assert.equal(results.length,routes.length*2);
const failures=results.filter(r=>r.status!=='passed');console.log(JSON.stringify({count:results.length,passed:results.length-failures.length,failures}));
if(failures.length)process.exitCode=1;
