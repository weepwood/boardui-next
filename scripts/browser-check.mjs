import { chromium,firefox,webkit } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const full=process.argv.includes('--full');
const root=resolve('out'),base='/boardui-next',browserName=process.env.BROWSER||'chromium';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    if(!url.pathname.startsWith(base+'/')){res.writeHead(404).end();return;}
    let f=resolve(root,'.'+decodeURIComponent(url.pathname.slice(base.length)));
    if(!f.startsWith(root+'/')&&f!==root){res.writeHead(403).end();return;}
    if(existsSync(f)&&statSync(f).isDirectory())f=join(f,'index.html');
    if(!existsSync(f)){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':mime[extname(f)]||'application/octet-stream'});res.end(readFileSync(f));
  }catch{res.writeHead(500).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);}
const routes=full?walk(root).filter(f=>f.endsWith('/index.html')).map(f=>f.slice(root.length,-'index.html'.length)):['/','/zh-hans/components/','/zh-hans/components/button/','/zh-hans/components/select/','/zh-hans/components/modal/','/zh-hans/templates/dashboard/'];
if(!full)for(const route of JSON.parse(process.env.TARGET_ROUTES||'[]'))if(!routes.includes(route))routes.push(route);
const report=[],errors=[];
let browser;
try{
  browser=await ({chromium,firefox,webkit}[browserName]).launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
  if(full)mkdirSync('acceptance',{recursive:true});
  for(const theme of full?['light','dark']:['light']){
    const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:'reduce'});
    const page=await context.newPage();
    page.setDefaultTimeout(10000);
    const failures=[];
    page.on('pageerror',e=>failures.push(e.message));
    page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)failures.push(r.status()+' '+r.url());});
    for(const route of routes){
      failures.length=0;
      try{
        const response=await page.goto(origin+route,{waitUntil:'networkidle',timeout:20000});
        assert.equal(response?.status(),200);
        await page.locator('main').waitFor({state:'visible',timeout:10000});
        await page.evaluate(()=>document.fonts.ready);
        assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),theme==='dark');
        if(route==='/'){
          const cards=page.locator('[data-home-card]');
          assert.equal(await cards.count(),12);
          const colorMatches=await cards.first().evaluate(e=>{const sample=document.createElement('span');sample.style.color='var(--color-border-button-default)';e.append(sample);const expected=getComputedStyle(sample).color;sample.remove();const style=getComputedStyle(e);return {actual:style.borderTopColor,expected,text:style.color,width:style.borderTopWidth}});
          assert.equal(colorMatches.actual,colorMatches.expected);
          assert.notEqual(colorMatches.actual,colorMatches.text);
          assert.equal(colorMatches.width,'1px');
          assert.equal(await page.locator('main a button').count(),0);

          await page.getByRole('button',{name:theme==='light'?'切换到暗色模式':'切换到亮色模式'}).click();
          await page.waitForFunction(d=>document.documentElement.classList.contains('dark')===d,theme==='light');
          await page.getByRole('button',{name:theme==='light'?'切换到亮色模式':'切换到暗色模式'}).click();
          await page.waitForFunction(d=>document.documentElement.classList.contains('dark')===d,theme==='dark');
        }
        if(route==='/'){
          const navigationPage=await context.newPage();
          try{
            await navigationPage.goto(origin+'/',{waitUntil:'networkidle'});
            const nav=navigationPage.locator('aside nav[aria-label="元件库"]');
            const group=nav.getByRole('button',{name:'图表',exact:true});
            await group.click();
            assert.equal(await group.getAttribute('aria-expanded'),'false');
            await navigationPage.evaluate(()=>{window.__sidebarInstance=document.querySelector('aside')});
            let release;
            const gate=new Promise(r=>{release=r});
            const pattern='**/zh-hans/components/input/index.txt*';
            await navigationPage.route(pattern,async r=>{await gate;await r.continue()});
            try{
              const input=nav.locator('a[data-doc-path="/zh-hans/components/input"]');
              await input.click();
              await navigationPage.locator('[data-nav-pending="true"]').waitFor();
              assert.equal(await navigationPage.locator('[data-nav-pending="true"]').count(),1);
              await navigationPage.locator('[data-navigation-pending]').waitFor({state:'visible'});
              assert.ok((await navigationPage.locator('[data-navigation-pending]').textContent()).includes('输入框'));
              release();
              await navigationPage.waitForURL(/\/components\/input\/?$/);
              await navigationPage.locator('main h1').waitFor();
              assert.equal(await navigationPage.locator('[data-nav-pending]').count(),0);
              assert.equal(await group.getAttribute('aria-expanded'),'false');
              assert.ok(await navigationPage.evaluate(()=>window.__sidebarInstance===document.querySelector('aside')));
            }finally{release();await navigationPage.unroute(pattern);}
            await nav.locator('a[data-doc-path="/zh-hans/components/select"]').click();
            await navigationPage.waitForURL(/\/components\/select\/?$/);
            await navigationPage.locator('main h1').waitFor();
            assert.ok(await navigationPage.evaluate(()=>window.__sidebarInstance===document.querySelector('aside')));
            await navigationPage.goBack({waitUntil:'networkidle'});
            await navigationPage.waitForURL(/\/components\/input\/?$/);
            assert.equal(await nav.locator('[aria-current="page"]').count(),1);
            assert.equal(await group.getAttribute('aria-expanded'),'false');
            assert.ok(await navigationPage.evaluate(()=>window.__sidebarInstance===document.querySelector('aside')));
            // A late response from an earlier click must never replace the last destination.
            let releaseLate;
            const lateGate=new Promise(r=>{releaseLate=r});
            const latePattern='**/zh-hans/components/textarea/index.txt*';
            await navigationPage.route(latePattern,async r=>{await lateGate;await r.continue().catch(()=>{});});
            try{
              await nav.locator('a[data-doc-path="/zh-hans/components/textarea"]').click();
              await navigationPage.locator('[data-navigation-pending]').waitFor({state:'visible'});
              assert.ok(await navigationPage.locator('[data-doc-route]').evaluate(e=>e.inert));
              await nav.locator('a[data-doc-path="/zh-hans/components/combobox"]').click();
              await navigationPage.waitForURL(/\/components\/combobox\/?$/);
              await navigationPage.locator('main h1').waitFor();
              const heading=await navigationPage.locator('main h1').textContent();
              releaseLate();
              await navigationPage.waitForLoadState('networkidle');
              assert.match(navigationPage.url(),/\/components\/combobox\/?$/);
              assert.equal(await navigationPage.locator('main h1').textContent(),heading);
              assert.equal(await navigationPage.locator('[data-nav-pending]').count(),0);
              assert.equal(await navigationPage.locator('[data-doc-content]').getAttribute('aria-busy'),null);
              assert.equal(await navigationPage.locator('[data-doc-route]').evaluate(e=>e.inert),false);
              assert.equal(await nav.locator('[aria-current="page"]').count(),1);
            }finally{releaseLate();await navigationPage.unroute(latePattern);}
          }finally{await navigationPage.close();}
        }
        if(route==='/zh-hans/components/'){
          const nav=page.locator('aside nav[aria-label="元件库"]');
          const selected=nav.locator('[data-nav-selected="true"]');
          await selected.getByText('组件',{exact:true}).waitFor();
          assert.equal(await selected.count(),1);
          await nav.getByRole('link',{name:'模板',exact:true}).click();
          await page.waitForURL(/\/zh-hans\/templates\/?$/);
          await nav.locator('[data-nav-selected="true"]').getByText('模板',{exact:true}).waitFor();
          assert.equal(await nav.locator('[aria-current="page"]').count(),1);
          assert.equal(await page.locator('[data-catalog-slug]').count(),12);
          await page.goBack({waitUntil:'networkidle'});
          await nav.locator('[data-nav-selected="true"]').getByText('组件',{exact:true}).waitFor();
          assert.equal(await nav.locator('[aria-current="page"]').count(),1);

          const card=page.locator('main article').first();
          const rect=await card.boundingBox();
          assert.equal(rect?.width,304);assert.equal(rect?.height,299);
          assert.equal(await card.evaluate(e=>getComputedStyle(e).borderRadius),'28px');
          assert.equal(await card.locator(':scope > div').first().evaluate(e=>e.getBoundingClientRect().height),197);
          await card.locator('[data-live-preview]').waitFor();
          await page.waitForFunction(()=>[...document.querySelectorAll('[data-card-caption]')].every(e=>e.getBoundingClientRect().bottom<=e.closest('article').getBoundingClientRect().bottom+1));
          const search=page.getByRole('textbox',{name:'搜索组件目录'});
          await search.fill('date-picker');
          await page.waitForFunction(()=>document.querySelectorAll('[data-catalog-slug]').length===1);
          assert.equal(await page.locator('[data-catalog-slug]').getAttribute('data-catalog-slug'),'date-picker');
          await search.fill('');
          await page.getByRole('group',{name:'组件分类'}).getByRole('button',{name:'模板',exact:true}).click();
          await page.waitForFunction(()=>document.querySelectorAll('[data-catalog-slug]').length===12);
          await page.getByRole('group',{name:'组件分类'}).getByRole('button',{name:'全部',exact:true}).click();
          await page.getByLabel('实现状态',{exact:true}).selectOption('ported');
          await page.waitForFunction(()=>[...document.querySelectorAll('[data-catalog-status]')].length>0&&[...document.querySelectorAll('[data-catalog-status]')].every(e=>e.dataset.catalogStatus==='ported'));
          await page.getByLabel('实现状态',{exact:true}).selectOption('all');
          await page.getByRole('button',{name:'快速搜索'}).click();
          const dialog=page.getByRole('dialog',{name:'搜索文档'});
          await dialog.getByRole('combobox',{name:'搜索文档'}).fill('date-picker');
          await dialog.getByRole('option',{name:/日期选择/}).waitFor();
          await page.keyboard.press('Escape');
          await dialog.waitFor({state:'hidden'});
          const catalogPage=await context.newPage();
          try{
            await catalogPage.addInitScript(()=>{
              const Native=window.IntersectionObserver;
              window.__catalogIO={created:0,active:0};
              window.IntersectionObserver=class extends Native{
                constructor(callback,options){
                  super(callback,options);
                  this.catalog=options?.rootMargin==="240px 0px";
                  this.targets=new Set();
                  if(this.catalog)window.__catalogIO.created++;
                }
                observe(el){if(this.catalog&&!this.targets.has(el)){this.targets.add(el);window.__catalogIO.active++;}super.observe(el);}
                unobserve(el){if(this.catalog&&this.targets.delete(el))window.__catalogIO.active--;super.unobserve(el);}
                disconnect(){if(this.catalog){window.__catalogIO.active-=this.targets.size;this.targets.clear();}super.disconnect();}
              };
            });
            await catalogPage.goto(origin+'/zh-hans/components/',{waitUntil:'networkidle'});
            await catalogPage.locator('[data-live-preview]').first().waitFor();
            assert.equal(await catalogPage.evaluate(()=>window.__catalogIO.created),1);
            const catalogSearch=catalogPage.getByRole('textbox',{name:'搜索组件目录'});
            await catalogSearch.fill('date-picker');
            await catalogPage.waitForFunction(()=>document.querySelectorAll('[data-catalog-slug]').length===1);
            await catalogSearch.fill('');
            await catalogPage.waitForFunction(()=>document.querySelectorAll('[data-catalog-slug]').length>90);
            assert.ok(await catalogPage.evaluate(()=>window.__catalogIO.created<=2));
            await catalogPage.locator('aside nav [data-doc-path="/zh-hans/components/button"]').click();
            await catalogPage.waitForURL(/\/components\/button\/?$/);
            await catalogPage.waitForFunction(()=>window.__catalogIO.active===0);
          }finally{await catalogPage.close();}

        }
        assert.deepEqual(await page.locator('[data-icon-fallback="true"]').evaluateAll(es=>es.map(e=>e.getAttribute('data-icon'))),[],'unknown SVG name on '+route);
        if(route==='/zh-hans/components/button/'){
          const api=page.locator('#api');
          await api.getByRole('heading',{name:'组件 API'}).waitFor();
          assert.ok(await api.getByRole('table',{name:'Button 属性'}).count());
          const mobile=await context.newPage();
          try{
            await mobile.setViewportSize({width:390,height:844});
            await mobile.goto(origin+route,{waitUntil:'networkidle'});
            assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile horizontal overflow');
            const trigger=mobile.getByRole('button',{name:'打开文档导航'});
            await trigger.click();
            const navigation=mobile.getByRole('dialog',{name:'文档导航'});
            await navigation.waitFor();
            await mobile.keyboard.press('Escape');
            await navigation.waitFor({state:'hidden'});
            await trigger.click();
            await navigation.getByRole('link',{name:'输入框',exact:true}).click();
            await mobile.waitForURL(/components\/input\/?$/);
            await navigation.waitFor({state:'hidden'});
          }finally{await mobile.close();}

          const svg=page.locator('main svg[data-icon]');
          assert.ok(await svg.count()>0,'shared SVG icons rendered');
          assert.equal(await page.locator('i[class*="ri-"]').count(),0,'no icon font elements');
          assert.equal(await page.locator('[data-icon-fallback="true"]').count(),0,'no unknown icon on button page');
          const arrow=page.locator('#preview button').filter({hasText:'继续'}).locator('svg').first();
          assert.equal(await arrow.evaluate(e=>e.getAttribute('viewBox')),'0 0 24 24');
          assert.ok((await arrow.evaluate(e=>getComputedStyle(e).rotate))==='none');
          await arrow.evaluate(e=>e.closest('[dir]').dir='rtl');
          await page.waitForFunction(e=>getComputedStyle(e).rotate.includes('180deg'),await arrow.elementHandle());
          await arrow.evaluate(e=>e.closest('[dir]').dir='ltr');
          const geometry=await page.evaluate(()=>{const r=s=>{const e=document.querySelector(s);const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height].map(Math.round)};return {main:r('main'),heading:r('main h1'),sidebar:r('aside'),toc:r('main+aside'),canvas:r('#preview > div > div:last-child'),shadow:getComputedStyle(document.documentElement).getPropertyValue('--shadow-sidebar').trim(),font:document.fonts.check('14px "Noto Sans SC Variable"','按钮')}});
          const near=(actual,expected,tolerance=12)=>assert.ok(actual.every((n,i)=>Math.abs(n-expected[i])<=tolerance), JSON.stringify({actual,expected,tolerance}));
          near(geometry.main.slice(0,3),[324,40,808]);
          near(geometry.heading.slice(0,2),[324,108]);
          assert.deepEqual(geometry.sidebar,[12,12,260,976]);
          near(geometry.toc.slice(0,3),[1180,40,220]);
          assert.ok(geometry.canvas[3]>=327);
          assert.ok(geometry.shadow,'runtime sidebar elevation token');
          assert.ok(geometry.font,'self-hosted Chinese font');
          const demo=page.locator('#preview');
          const buttons=demo.getByRole('tabpanel').getByRole('button');
          assert.equal(await buttons.count(),4);
          for(const button of await buttons.all())assert.equal((await button.boundingBox())?.height,36);
          await demo.getByRole('tab',{name:'预览'}).press('ArrowRight');
          assert.equal(await demo.getByRole('tab',{name:'代码'}).getAttribute('aria-selected'),'true');
          const indicator=demo.locator('[data-preview-indicator]');
          await page.waitForFunction(({a,b})=>Math.abs(a.getBoundingClientRect().left-b.getBoundingClientRect().left)<2,{a:await indicator.elementHandle(),b:await demo.getByRole('tab',{name:'代码'}).elementHandle()});
          await demo.getByRole('tab',{name:'代码'}).press('ArrowLeft');
          assert.equal(await demo.getByRole('tab',{name:'预览'}).getAttribute('aria-selected'),'true');
          const pressTarget=demo.getByRole('tabpanel').getByRole('button',{name:'开始使用',exact:true});
          await page.emulateMedia({reducedMotion:'no-preference'});
          await pressTarget.scrollIntoViewIfNeeded();
          const box=await pressTarget.boundingBox();
          assert.ok(box);
          await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
          await page.mouse.down();
          try {
            await page.waitForFunction(e=>{const t=getComputedStyle(e).transform;return t!=='none'&&Math.abs(new DOMMatrix(t).a-0.98)<0.005},await pressTarget.elementHandle(),{timeout:4000});
          } finally {await page.mouse.up();}
          await page.waitForFunction(e=>{const t=getComputedStyle(e).transform;return t==='none'||Math.abs(new DOMMatrix(t).a-1)<0.005},await pressTarget.elementHandle(),{timeout:4000});
          await page.emulateMedia({reducedMotion:'reduce'});
          const link=page.getByRole('link',{name:'查看组件',exact:true});
          await link.waitFor({state:'visible'});
          assert.ok((await link.getAttribute('href')).startsWith(base+'/'));
        }
        if(route==='/zh-hans/templates/'){
          assert.equal(await page.locator('main [data-catalog-slug]').count(),12);
          const selected=page.locator('aside nav[aria-label="元件库"] [aria-current="page"]');
          assert.equal(await selected.count(),1);
          assert.equal((await selected.textContent()).trim(),'模板');
        }
        if(route==='/zh-hans/rtl/'){
          const lab=page.getByTestId('direction-lab');
          await lab.waitFor();
          assert.equal(await lab.getAttribute('dir'),'rtl');
          const next=lab.getByRole('button',{name:'下一步'});
          await page.waitForFunction(e=>getComputedStyle(e).rotate.includes('180deg'),await next.locator('svg').elementHandle());
          const tabs=lab.getByRole('tablist',{name:'方向选项卡'});
          const first=tabs.getByRole('tab',{name:'概览'}),second=tabs.getByRole('tab',{name:'活动'});
          assert.ok((await first.boundingBox()).x>(await second.boundingBox()).x);
          await first.press('ArrowLeft');
          await page.waitForFunction(e=>e.getAttribute('aria-selected')==='true',await second.elementHandle());
          const aligned=async (indicator,selected)=>{await page.waitForFunction(({a,b})=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return Math.abs(x.left-y.left)<2&&Math.abs(x.width-y.width)<2},{a:await indicator.elementHandle(),b:await selected.elementHandle()})};
          await aligned(lab.locator('[data-tab-indicator]'),second);
          const segment=lab.getByRole('radio',{name:'周'});
          await segment.click();
          await aligned(lab.locator('[data-segment-indicator]'),segment);
          const slider=lab.getByRole('slider',{name:'方向音量'});
          await slider.press('ArrowLeft');
          await page.waitForFunction(e=>Number(e.getAttribute('aria-valuenow')??e.value)>40,await slider.elementHandle());
          const select=lab.getByRole('button',{name:/地区/});
          await select.click();
          await page.getByRole('option',{name:'欧洲',exact:true}).click();
          await page.waitForFunction(e=>e.textContent.includes('欧洲'),await select.elementHandle());
          await lab.getByRole('button',{name:'操作菜单'}).click();
          const dialog=page.getByRole('dialog',{name:'方向操作'});
          await dialog.getByRole('button',{name:'编辑'}).click();
          await page.keyboard.press('Escape');
          await dialog.waitFor({state:'hidden'});
          assert.equal(await lab.getByRole('textbox',{name:'电子邮箱'}).evaluate(e=>getComputedStyle(e).direction),'ltr');
          await lab.getByRole('radio',{name:'A',exact:true}).press('ArrowLeft');
          await page.waitForFunction(e=>e.textContent.includes(' / b / '),await lab.getByTestId('direction-state').elementHandle());
          await lab.getByRole('button',{name:'下一页'}).click();
          await page.waitForFunction(e=>e.textContent.includes(' / 3 / '),await lab.getByTestId('direction-state').elementHandle());
          const state=await lab.getByTestId('direction-state').textContent();
          await page.getByRole('button',{name:'切换为 LTR'}).click();
          assert.equal(await lab.getAttribute('dir'),'ltr');
          assert.equal(await lab.getByTestId('direction-state').textContent(),state);
          await aligned(lab.locator('[data-tab-indicator]'),second);
          await aligned(lab.locator('[data-segment-indicator]'),segment);
          await page.waitForFunction(e=>getComputedStyle(e).rotate==='none',await next.locator('svg').elementHandle());
        }
        if(route==='/zh-hans/templates/marketing/'){
          const demo=page.locator('#preview');
          await demo.getByRole('radio',{name:'已结束',exact:true}).click();
          await page.waitForFunction(()=>document.querySelectorAll('#preview tbody tr').length===2);
          assert.ok((await demo.locator('tbody').textContent()).includes('邮件唤醒计划'));
        }
        if(route==='/zh-hans/templates/ai-image-generation/'){
          const demo=page.locator('#preview');
          await demo.getByRole('textbox',{name:'提示词'}).fill('本地预览测试');
          await demo.getByRole('button',{name:'更新本地预览'}).click();
          await demo.getByText(/本地预览测试 ·/).waitFor();
          await demo.getByRole('button',{name:'放大 方案 1'}).click();
          await demo.getByRole('button',{name:'关闭放大预览'}).click();
        }
        if(route==='/zh-hans/templates/ai-profile/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'关注',exact:true}).click();
          await demo.getByText('1,201',{exact:true}).waitFor();
          await demo.getByRole('tab',{name:'作品'}).click();
          await demo.getByText('仪表盘套件',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/templates/medical-profile/'){
          await page.locator('#preview').getByText(/虚构医疗资料/).waitFor();
          assert.ok((await page.locator('#preview button:disabled').count())>=2);
        }
        if(route==='/zh-hans/templates/multi-agent-chat/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:/安全智能体/}).click();
          await demo.getByText('生成审计报告',{exact:false}).waitFor();
          await demo.getByRole('textbox',{name:'消息'}).fill('本地指令');
          await demo.getByRole('button',{name:'发送',exact:true}).click();
          await demo.getByText('本地记录：本地指令',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/templates/chat-starter/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:/写一段代码/}).click();
          assert.equal(await demo.getByRole('textbox',{name:'消息'}).inputValue(),'写一段代码');
          await demo.getByRole('button',{name:'发送',exact:true}).click();
          await demo.getByText('本地记录：写一段代码',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/templates/dashboard/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'分析',exact:true}).click();
          await demo.getByRole('heading',{name:'分析',exact:true}).waitFor();
          await demo.getByRole('button',{name:'查看全部'}).click();
          assert.equal(await demo.locator('tbody tr').count(),4);
        }
        if(route==='/zh-hans/templates/ai-chat/'){
          const demo=page.locator('#preview');
          await demo.getByRole('textbox',{name:'消息'}).fill('模板测试');
          await demo.getByRole('button',{name:'发送',exact:true}).click();
          await demo.getByText('本地示例：已收到消息。此模板未连接 AI 服务。',{exact:true}).waitFor();
          await demo.getByRole('button',{name:'新建对话'}).click();
          assert.equal(await demo.getByText('模板测试',{exact:true}).count(),0);
        }
        if(route==='/zh-hans/templates/finance/'){
          const demo=page.locator('#preview');
          await demo.getByRole('radio',{name:'年',exact:true}).click();
          await demo.getByText('年度样本',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/templates/hr/'){
          const demo=page.locator('#preview');
          await demo.getByRole('radio',{name:'休假',exact:true}).click();
          const members=demo.locator('.divide-y > div');
          await page.waitForFunction(()=>document.querySelectorAll('#preview .divide-y > div').length===1);
          assert.ok((await members.first().textContent()).includes('赵六'));
        }
        if(route==='/zh-hans/templates/calendar/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'下个月'}).click();
          await demo.getByRole('heading',{name:'2026年9月'}).waitFor();
          await demo.getByRole('button',{name:'上个月'}).click();
          await demo.getByRole('heading',{name:'2026年8月'}).waitFor();
        }
        if(route==='/zh-hans/templates/project-board/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'新建任务'}).click();
          await demo.getByRole('textbox',{name:'任务标题'}).fill('模板测试任务');
          await demo.getByRole('button',{name:'添加',exact:true}).click();
          await demo.getByText('模板测试任务',{exact:true}).waitFor();
          await demo.getByRole('radio',{name:'列表',exact:true}).click();
          await demo.getByText('模板测试任务',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/components/sidebar/'){
          const side=page.locator('#preview').getByRole('complementary',{name:'应用侧边栏'});
          const icon=side.getByRole('button',{name:'概览'}).locator('svg');
          const offset=await icon.evaluate(e=>e.getBoundingClientRect().x-e.closest('aside').getBoundingClientRect().x);
          await side.getByRole('button',{name:'收起侧边栏'}).click();
          await page.waitForFunction(e=>Math.abs(e.getBoundingClientRect().width-60)<1,await side.elementHandle());
          assert.ok(Math.abs(await icon.evaluate(e=>e.getBoundingClientRect().x-e.closest('aside').getBoundingClientRect().x)-offset)<2);
          await side.getByRole('button',{name:'文档',exact:true}).click();
          await side.getByRole('button',{name:'按钮',exact:true}).click();
          assert.equal(await side.getByRole('button',{name:'按钮',exact:true}).getAttribute('aria-current'),'page');
        }
        if(route==='/zh-hans/components/command-palette/'){
          const trigger=page.getByRole('button',{name:'打开命令面板'});
          await trigger.click();
          const dialog=page.getByRole('dialog',{name:'命令面板'});
          const input=dialog.getByRole('combobox',{name:'搜索命令'});
          const enabled=dialog.locator('[role="option"][aria-disabled="false"]');
          await enabled.first().waitFor();
          const firstId=await enabled.first().getAttribute('id');
          const lastId=await enabled.last().getAttribute('id');
          await input.press('ArrowUp');
          assert.equal(await input.getAttribute('aria-activedescendant'),lastId);
          await input.press('ArrowDown');
          assert.equal(await input.getAttribute('aria-activedescendant'),firstId);
          await input.fill('不存在的匹配项XYZ');
          assert.equal(await dialog.getByRole('option').count(),0);
          assert.equal(await input.getAttribute('aria-activedescendant'),null);
          await input.fill('设置');await input.press('Enter');
          await dialog.waitFor({state:'hidden'});
          await page.getByText('上次执行：打开设置',{exact:true}).waitFor();
          await page.waitForFunction(e=>document.activeElement===e,await trigger.elementHandle());
        }
        if(route==='/zh-hans/components/context-menu/'){
          const target=page.getByLabel('右键菜单区域');
          await target.press('Shift+F10');
          const menu=page.getByRole('menu',{name:'快捷操作'});
          await menu.waitFor();
          await menu.getByRole('menuitem',{name:/复制/}).press('ArrowDown');
          await menu.getByRole('menuitem',{name:/粘贴/}).press('Enter');
          await menu.waitFor({state:'hidden'});
          await page.getByText('上次操作：粘贴',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/components/composer/'){
          const demo=page.locator('#preview'),field=demo.getByRole('textbox',{name:'消息'});
          assert.ok(await demo.getByRole('button',{name:'发送',exact:true}).isDisabled());
          await field.fill('测试消息');await field.press('Shift+Enter');assert.ok((await field.inputValue()).includes('\n'));
          await field.press('Enter');await demo.getByText('已发送：测试消息',{exact:false}).waitFor();
          assert.equal(await field.inputValue(),'');
          const toolbar=page.getByRole('toolbar',{name:'编辑工具栏'});
          await toolbar.getByRole('button',{name:'撤销'}).press('ArrowRight');
          await toolbar.getByRole('button',{name:'重做'}).press('Enter');
          await page.getByText('操作：重做',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/components/breadcrumb/'){
          assert.equal(await page.locator('#preview [aria-current=page]').textContent(),'面包屑导航');
        }
        if(route==='/zh-hans/components/agent-thinking/'){
          assert.equal(await page.locator('#preview').getByRole('status').count(),4);
        }
        if(route==='/zh-hans/components/agent-progress/'){
          assert.equal(await page.locator('#preview [aria-current=step]').count(),1);
        }
        if(route==='/zh-hans/components/table/'){
          const table=page.locator('#preview').getByRole('grid',{name:'成员列表'});
          assert.equal(await table.getByRole('row').count(),4);
          assert.ok(await table.locator('tbody tr').first().getByRole('rowheader').count());
        }
        if(route==='/zh-hans/components/data-grid/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'数量'}).click();
          assert.ok((await demo.locator('tbody tr').first().textContent()).includes('IT-002'));
          await demo.getByRole('checkbox',{name:'全选'}).press('Space');
          await demo.getByText('已选 3 项').waitFor();
          await demo.getByRole('button',{name:'清除选择'}).click();
          assert.ok(!(await demo.getByRole('checkbox',{name:'全选'}).isChecked()));
        }
        if(route==='/zh-hans/components/data-table/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'金额'}).click();
          assert.ok((await demo.locator('tbody tr').first().textContent()).includes('李四'));
        }
        if(route==='/zh-hans/components/pagination/'){
          const nav=page.locator('#preview').getByRole('navigation',{name:'分页'});
          await nav.getByRole('button',{name:'下一页'}).click();
          assert.equal(await nav.locator('[aria-current=page]').textContent(),'4');
        }
        if(route==='/zh-hans/components/tree-view/'){
          const tree=page.locator('#preview').getByRole('treegrid',{name:'树形导航'});
          const branch=tree.getByRole('row',{name:/src/});
          await branch.press('ArrowLeft');
          assert.equal(await branch.getAttribute('aria-expanded'),'false');
          await branch.press('ArrowRight');
          assert.equal(await branch.getAttribute('aria-expanded'),'true');
          await tree.getByRole('row',{name:/utils.ts/}).click();
          assert.equal(await tree.getByRole('row',{name:/utils.ts/}).getAttribute('aria-selected'),'true');
        }
        if(route==='/zh-hans/components/file-upload/'){
          const demo=page.locator('#preview');
          const input=demo.locator('input[type=file]');
          await input.setInputFiles({name:'bad.exe',mimeType:'application/octet-stream',buffer:Buffer.from('x')});
          await demo.getByRole('alert').waitFor();
          await input.setInputFiles({name:'sample.pdf',mimeType:'application/pdf',buffer:Buffer.from('sample')});
          await demo.getByText('sample.pdf',{exact:true}).waitFor();
          await demo.getByRole('button',{name:'移除 sample.pdf'}).click();
          await demo.getByText('sample.pdf',{exact:true}).waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/avatar/'){
          await page.waitForFunction(()=>document.querySelector('[aria-label="回退头像"]')?.textContent==='A');
        }
        if(route==='/zh-hans/components/chip/'){
          const filters=page.locator('#filters');
          const btn=filters.locator('button[aria-pressed]').first();
          const prev=await btn.getAttribute('aria-pressed');
          await btn.click();
          assert.notEqual(await btn.getAttribute('aria-pressed'),prev);
        }
        if(route==='/zh-hans/components/progress/'){
          assert.equal(await page.getByRole('progressbar',{name:'任务进度'}).getAttribute('aria-valuenow'),'45');
        }
        if(route==='/zh-hans/components/meter/'){
          assert.equal(await page.getByRole('meter',{name:'存储空间'}).getAttribute('aria-valuenow'),'68');
        }
        if(route==='/zh-hans/components/date-picker/'){
          const trigger=page.locator('#preview').getByRole('button',{name:'开始日期'});
          const committed=page.getByTestId('date-committed');
          assert.equal(await committed.textContent(),'2026-11-24');
          await trigger.click();
          const dialog=page.getByRole('dialog',{name:'开始日期'});
          await dialog.waitFor();
          const date=dialog.getByRole('textbox',{name:'日期'});
          await date.fill('25/11/2026');await date.press('Tab');
          await dialog.getByRole('button',{name:'取消'}).click();
          await dialog.waitFor({state:'hidden'});
          assert.equal(await committed.textContent(),'2026-11-24');
          await trigger.click();await dialog.waitFor();
          await date.fill('25/11/2026');await date.press('Tab');
          await dialog.getByRole('button',{name:'应用'}).click();
          await dialog.waitFor({state:'hidden'});
          assert.equal(await committed.textContent(),'2026-11-25');
        }
        if(route==='/zh-hans/components/date-calendar/'){
          const calendar=page.locator('#preview');
          const grid=calendar.getByRole('grid');
          await grid.waitFor();
          await calendar.getByRole('button',{name:'下个月'}).click();
          assert.ok((await grid.getAttribute('aria-label')||await grid.textContent()).length>0);
          await calendar.getByRole('button',{name:'上个月'}).click();
          await grid.getByRole('button').filter({hasText:/^25$/}).first().click();
          assert.ok((await calendar.textContent()).includes('2026-11-25'));
        }
        if(route==='/zh-hans/components/time-field/'){
          const segment=page.locator('#preview').getByRole('spinbutton').first();
          await segment.press('ArrowUp');
          await page.waitForFunction(()=>document.querySelector('#preview')?.textContent.includes('10:30'));
        }
        if(route==='/zh-hans/components/number-field/'){
          const field=page.locator('#preview').getByRole('textbox',{name:'数量'});
          await field.press('ArrowUp');
          assert.equal(await field.inputValue(),'4');
        }
        if(route==='/zh-hans/components/slider/'){
          const thumb=page.locator('#preview').getByRole('slider');
          await thumb.press('ArrowRight');
          assert.equal(await thumb.inputValue(),'61');
          assert.equal(await page.getByRole('slider',{name:'最低值'}).inputValue(),'20');
          assert.equal(await page.getByRole('slider',{name:'最高值'}).inputValue(),'80');
        }
        if(route==='/zh-hans/components/input-otp/'){
          const demo=page.locator('#preview');
          const first=demo.getByRole('textbox',{name:'第 1 位',exact:true});
          await first.fill('123456');
          await page.waitForFunction(()=>document.querySelector('#preview').textContent.includes('已输入 6 / 6'));
          assert.equal(await demo.getByRole('textbox',{name:'第 6 位',exact:true}).inputValue(),'6');
        }
        if(route==='/zh-hans/components/color-picker/'){
          const field=page.locator('#preview').getByRole('textbox',{name:'主题色'});
          const output=page.getByTestId('color-committed');
          await field.fill('abc');
          assert.equal(await output.textContent(),'#3080ff');
          await field.fill('123456');
          assert.equal(await output.textContent(),'#123456');
          await page.locator('#preview').getByRole('button',{name:'#fb2c36'}).click();
          assert.equal(await output.textContent(),'#fb2c36');
        }
        if(route==='/zh-hans/components/token-input/'){
          const field=page.locator('#preview').getByRole('textbox',{name:'收件人'});
          await field.fill('invalid');await field.press('Enter');
          assert.equal(await field.getAttribute('aria-invalid'),'true');
          await field.fill('test@example.com');await field.press('Enter');
          const remove=page.locator('#preview').getByRole('button',{name:'移除 test@example.com'});
          await remove.click();await remove.waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/modal/'){
          const trigger=page.getByRole('button',{name:'打开弹窗'});
          await trigger.click();
          const dialog=page.getByRole('dialog',{name:'邀请团队成员'});
          await dialog.waitFor();
          await dialog.getByRole('textbox',{name:'邮箱地址'}).fill('demo@example.com');
          await page.keyboard.press('Escape');
          await dialog.waitFor({state:'hidden'});
          await page.waitForFunction(e=>document.activeElement===e,await trigger.elementHandle());
        }
        if(route==='/zh-hans/components/settings-modal/'){
          const trigger=page.locator('#preview').getByRole('button',{name:'打开设置'});
          await trigger.click();
          const dialog=page.getByRole('dialog',{name:'设置',exact:true});
          await dialog.waitFor();
          await dialog.getByRole('button',{name:'外观',exact:true}).click();
          assert.equal(await dialog.getByRole('button',{name:'外观',exact:true}).getAttribute('aria-pressed'),'true');
          assert.equal(await dialog.getByRole('button',{name:'通用',exact:true}).getAttribute('aria-pressed'),'false');
          await page.keyboard.press('Escape');
          await dialog.waitFor({state:'hidden'});
          await page.waitForFunction(e=>document.activeElement===e,await trigger.elementHandle());
          await page.setViewportSize({width:390,height:844});
          try{
            await trigger.click();
            await dialog.waitFor();
            assert.ok(await dialog.evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}));
            await dialog.getByRole('button',{name:'关闭',exact:true}).click();
            await dialog.waitFor({state:'hidden'});
          }finally{await page.setViewportSize({width:1440,height:1000});}
        }
        if(route==='/zh-hans/components/drawer/'){
          await page.getByRole('button',{name:'打开抽屉'}).click();
          const dialog=page.getByRole('dialog',{name:'项目设置'});
          await dialog.waitFor();
          await dialog.getByRole('button',{name:'关闭',exact:true}).click();
          await dialog.waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/accordion/'){
          const first=page.getByRole('button',{name:'第一项',exact:true});
          const second=page.getByRole('button',{name:'第二项',exact:true});
          await second.click();
          assert.equal(await first.getAttribute('aria-expanded'),'false');
          assert.equal(await second.getAttribute('aria-expanded'),'true');
          assert.ok(await page.getByRole('button',{name:'禁用项'}).isDisabled());
          const more=page.getByRole('button',{name:'更多设置'});
          await more.click();await page.getByRole('textbox',{name:'折叠内输入框'}).fill('test');
          await more.click();assert.equal(await more.getAttribute('aria-expanded'),'false');
        }
        if(route==='/zh-hans/components/notification/'){
          await page.getByRole('button',{name:'关闭示例通知'}).click();
          await page.getByText('任务已完成',{exact:true}).waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/announcement/'){
          await page.getByRole('button',{name:'关闭示例公告'}).click();
          await page.getByText('完善工作区',{exact:true}).waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/tabs/'){
          const tab=page.locator('#preview').getByRole('tab',{name:/横幅/});
          await tab.press('ArrowRight');
          assert.equal(await page.locator('#preview').getByRole('tab',{name:/帖子/}).getAttribute('aria-selected'),'true');
        }
        if(route==='/zh-hans/components/segmented-control/'){
          const demo=page.locator('#preview');
          await demo.getByRole('radio',{name:'月',exact:true}).click();
          assert.equal(await demo.getByRole('radio',{name:'月',exact:true}).getAttribute('aria-checked'),'true');
        }
        if(route==='/zh-hans/components/select/'){
          const filter=page.locator('#preview').getByRole('button',{name:/按价格过滤/});
          await filter.click();await page.getByRole('option',{name:'100 元以内'}).click();
          assert.ok((await filter.textContent()).includes('100 元以内'));
          const trigger=page.locator('#framework').getByRole('button',{name:/框架/});
          await trigger.click();
          await page.getByRole('option',{name:'Vue',exact:true}).click();
          assert.ok((await trigger.textContent()).includes('Vue'));
          await trigger.click();
          await page.keyboard.press('Escape');
          await page.getByRole('listbox').waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/combobox/'){
          const field=page.locator('#preview').getByRole('combobox',{name:'城市'});
          await field.fill('北京');
          await page.getByRole('option',{name:'北京',exact:true}).waitFor();
          assert.equal(await page.getByRole('option',{name:'上海',exact:true}).count(),0);
          await page.getByRole('option',{name:'北京',exact:true}).click();
          assert.equal(await field.inputValue(),'北京');
        }
        if(route==='/zh-hans/components/dropdown/'){
          const trigger=page.getByRole('button',{name:'打开分组菜单'});
          await trigger.scrollIntoViewIfNeeded();
          await trigger.press('Enter');
          const dialog=page.getByRole('dialog',{name:'分组操作'});
          await dialog.waitFor();
          await dialog.getByRole('button',{name:'编辑',exact:true}).click();
          assert.ok((await page.locator('main output').allTextContents()).includes('编辑'));
          await page.getByRole('dialog',{name:'分组操作'}).waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/tooltip/'){
          const trigger=page.getByRole('button',{name:'悬停查看提示'});
          await trigger.scrollIntoViewIfNeeded();
          await page.mouse.move(0,0);
          await trigger.hover();
          await page.getByRole('tooltip').waitFor({state:'visible'});
          await page.mouse.move(0,0);
          await page.getByRole('tooltip').waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/popover/'){
          await page.getByRole('button',{name:'打开浮层'}).click();
          await page.getByRole('dialog',{name:'设置浮层'}).waitFor({state:'visible'});
          await page.keyboard.press('Escape');
          await page.getByRole('dialog',{name:'设置浮层'}).waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/input/'){
          const demo=page.getByTestId('form-fields');
          const input=demo.getByRole('textbox',{name:'受控邮箱'});
          await input.fill('demo@example.com');
          assert.equal(await input.inputValue(),'demo@example.com');
          assert.ok(await input.evaluate(e=>e.required || e.getAttribute('aria-required')==='true'),'required field semantics');
          await page.waitForFunction(el=>{const ids=el.getAttribute('aria-describedby')?.split(/\s+/)||[];return ids.some(id=>document.getElementById(id)?.textContent.includes('输入有效邮箱'))},await input.elementHandle());
          const notes=demo.getByRole('textbox',{name:'受控备注'});
          const before=await notes.evaluate(e=>parseFloat(getComputedStyle(e).lineHeight)*2);
          await notes.fill('one\ntwo\nthree\nfour\nfive\nsix');
          await page.waitForFunction(({el,height})=>el.getBoundingClientRect().height>=height*2,{el:await notes.elementHandle(),height:before});
          await notes.fill('');
          await page.waitForFunction(({el,height})=>Math.abs(el.getBoundingClientRect().height-height)<1,{el:await notes.elementHandle(),height:before});
          const search=demo.getByRole('searchbox',{name:'受控搜索'});
          await search.fill('board');
          await demo.getByRole('button',{name:'清除搜索'}).click();
          assert.equal(await search.inputValue(),'');
          assert.equal(await demo.locator('output').textContent(),'demo@example.com / 0 / ');
          assert.ok(await page.getByRole('textbox',{name:'禁用',exact:true}).isDisabled());
          assert.equal(await page.getByRole('textbox',{name:'错误',exact:true}).getAttribute('aria-invalid'),'true');
        }
        if(route==='/zh-hans/components/search-field/'){
          const search=page.getByRole('searchbox',{name:'搜索组件…'});
          await search.fill('demo');
          const clear=page.locator('#preview').getByRole('button',{name:'清除搜索'});
          await clear.waitFor({state:'visible'});
          await clear.click();
          assert.equal(await search.inputValue(),'');
          assert.ok(await clear.isHidden());
        }
        if(route==='/zh-hans/components/checkbox/'){
          const demo=page.getByTestId('controlled-selection');
          if(await demo.count()){
            const checkbox=demo.getByRole('checkbox',{name:'受控复选框'});
            const toggle=demo.getByRole('switch',{name:'受控开关'});
            const radioA=demo.getByRole('radio',{name:'选项 A'});
            const radioB=demo.getByRole('radio',{name:'选项 B'});
            await checkbox.press('Space');
            await toggle.press('Space');
            await radioA.press('ArrowDown');
            await page.waitForFunction(()=>document.querySelector('[data-testid="controlled-selection"] output')?.textContent==='true / true / b');
            assert.ok(await checkbox.isChecked(),'controlled checkbox');
            assert.ok(await toggle.isChecked(),'controlled switch');
            assert.ok(await radioB.isChecked(),'radio keyboard selection');
            await checkbox.press('Space');
            await toggle.press('Space');
            await radioB.press('ArrowUp');
            await page.waitForFunction(()=>document.querySelector('[data-testid="controlled-selection"] output')?.textContent==='false / false / a');
          }
        }
        if(route==='/zh-hans/components/button-group/'){
          const demo=page.getByTestId('button-family');
          await demo.waitFor({state:'visible'});
          await demo.getByRole('button',{name:'中',exact:true}).press('Space');
          await demo.getByRole('button',{name:'增加计数'}).press('Enter');
          assert.equal(await demo.locator('output').textContent(),'center / 1');
          assert.equal(await demo.getByRole('button',{name:'中',exact:true}).getAttribute('aria-pressed'),'true');
          await demo.getByRole('button',{name:'重置计数'}).click();
          assert.equal(await demo.locator('output').textContent(),'center / 0');
        }
        if(route==='/zh-hans/components/icon-button/'){
          const box=await page.getByRole('button',{name:'新建',exact:true}).boundingBox();
          assert.equal(box?.width,36);assert.equal(box?.height,36);
        }
        if(route==='/zh-hans/components/close-button/'){
          for(const size of [16,20,24,32]){
            const box=await page.getByRole('button',{name:'关闭 '+size,exact:true}).boundingBox();
            assert.equal(box?.width,size);assert.equal(box?.height,size);
          }
        }
        let violations=[];
        if(full){
          // Assert selected tab-panel references after the actual DOM has settled.
          await page.waitForFunction(()=>[...document.querySelectorAll('[role=tab][aria-selected=true][aria-controls]')].every(t=>!!document.getElementById(t.getAttribute('aria-controls'))));
          await page.addScriptTag({path:resolve('node_modules/axe-core/axe.min.js')});
          violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,targets:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
          await page.screenshot({path:'acceptance/'+theme+'-'+(route.replace(/[^a-z0-9-]/g,'_')||'home')+'.png',animations:'disabled'});
          if(violations.length)errors.push(theme+' '+route+' accessibility: '+violations.map(v=>v.id).join(', '));
        }
        if(failures.length)throw Error(failures.join('; '));
        report.push({theme,route,violations,status:'checked'});
      }catch(e){errors.push(theme+' '+route+': '+e.message);report.push({theme,route,status:'failed',error:e.message});}
    }
    await context.close();
  }
}finally{await browser?.close();await new Promise(r=>server.close(r));if(full){mkdirSync('acceptance',{recursive:true});writeFileSync('acceptance/report.json',JSON.stringify({sha:process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),browser:browserName,report,errors},null,2));}}
console.log('Checked '+report.length+' page/theme combinations');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
