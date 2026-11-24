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
  // Linux headless Firefox reports no hover-capable pointer (Mozilla #2037020).
  // The CI desktop Firefox lane uses Xvfb, not a weaker hover assertion.
  browser=await ({chromium,firefox,webkit}[browserName]).launch({...(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{}),headless:process.env.BROWSER_HEADED!=='1'});
  if(full)mkdirSync('acceptance',{recursive:true});
  for(const theme of full||process.argv.includes('--both-themes')?['light','dark']:['light']){
    const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:'reduce'});
    const page=await context.newPage();
    page.setDefaultTimeout(10000);
    const failures=[];
    page.on('pageerror',e=>failures.push(e.message));
    page.on('response',r=>{if(r.url().startsWith(origin)&&r.status()>=400)failures.push(r.status()+' '+r.url());});
    for(const route of routes){
      failures.length=0;
      let stage="navigation";
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
              // Switching to code must preserve the live demo, not expose hidden inputs.
              const preview=navigationPage.locator('#preview');
              const email=preview.getByRole('textbox',{name:/电子邮箱/});
              await email.fill('preview@example.com');
              await preview.getByRole('tab',{name:'代码',exact:true}).click();
              assert.equal(await preview.getByRole('textbox',{name:/电子邮箱/}).count(),0);
              assert.equal(await preview.locator('[data-preview-content]').evaluate(e=>e.hidden&&e.inert),true);
              await preview.getByRole('tab',{name:'预览',exact:true}).click();
              assert.equal(await email.inputValue(),'preview@example.com');
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
          stage='button: table of contents navigation';
          const toc=page.getByRole('navigation',{name:'在此页面上'});
          stage='button: TOC API hash';
          await toc.getByRole('link',{name:'组件 API',exact:true}).click();
          await page.waitForFunction(()=>location.hash==='#api');
          stage='button: TOC API selection';
          await page.waitForFunction(()=>document.querySelector('nav[aria-label="在此页面上"] a[href="#api"]')?.getAttribute('aria-current')==='location');
          stage='button: TOC preview hash';
          await toc.getByRole('link',{name:'预览',exact:true}).click();
          await page.waitForFunction(()=>location.hash==='#preview');
          stage='button: TOC preview selection';
          await page.waitForFunction(()=>document.querySelector('nav[aria-label="在此页面上"] a[href="#preview"]')?.getAttribute('aria-current')==='location');
          const api=page.locator('#api');
          await api.getByRole('heading',{name:'组件 API'}).waitFor();
          assert.ok(await api.getByRole('table',{name:'Button 属性'}).count());
          stage='button: mobile navigation';
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
          stage='button: directional icon';
          const arrow=page.locator('#preview button').filter({hasText:'继续'}).locator('svg').first();
          assert.equal(await arrow.evaluate(e=>e.getAttribute('viewBox')),'0 0 24 24');
          assert.ok((await arrow.evaluate(e=>getComputedStyle(e).rotate))==='none');
          await arrow.evaluate(e=>e.closest('[dir]').dir='rtl');
          await page.waitForFunction(e=>getComputedStyle(e).rotate.includes('180deg'),await arrow.elementHandle());
          await arrow.evaluate(e=>e.closest('[dir]').dir='ltr');
          await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
          await page.waitForFunction(()=>window.scrollY===0);
          stage='button: desktop geometry';
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
          stage='button: preview tab indicator';
          await demo.getByRole('tab',{name:'预览'}).press('ArrowRight');
          assert.equal(await demo.getByRole('tab',{name:'代码'}).getAttribute('aria-selected'),'true');
          const indicator=demo.locator('[data-preview-indicator]');
          await page.waitForFunction(({a,b})=>Math.abs(a.getBoundingClientRect().left-b.getBoundingClientRect().left)<2,{a:await indicator.elementHandle(),b:await demo.getByRole('tab',{name:'代码'}).elementHandle()});
          await demo.getByRole('tab',{name:'代码'}).press('ArrowLeft');
          assert.equal(await demo.getByRole('tab',{name:'预览'}).getAttribute('aria-selected'),'true');
          const pressTarget=demo.getByRole('tabpanel').getByRole('button',{name:'开始使用',exact:true});
          const secondary=demo.getByRole('tabpanel').getByRole('button',{name:'继续',exact:true});
          stage='button: hover style';
          const pointer=await page.evaluate(()=>({hover:matchMedia('(hover: hover)').matches,fine:matchMedia('(pointer: fine)').matches}));
          assert.ok(pointer.hover,'desktop browser must advertise hover: '+JSON.stringify(pointer));
          await page.mouse.move(0,0);
          await page.waitForFunction(e=>!e.matches(':hover'),await secondary.elementHandle());
          const resting=await secondary.evaluate(e=>getComputedStyle(e).backgroundColor);
          await secondary.hover();
          await page.waitForFunction(({e,resting})=>getComputedStyle(e).backgroundColor!==resting,{e:await secondary.elementHandle(),resting});
          await page.mouse.move(0,0);
          stage='button: keyboard focus';
          await demo.getByRole('tab',{name:'预览'}).focus();
          const visited=[];
          for(let i=0;i<12;i++){
            await page.keyboard.press('Tab');
            visited.push(await page.evaluate(()=>({text:document.activeElement?.textContent?.trim().slice(0,60),role:document.activeElement?.getAttribute('role')})));
            if(await secondary.evaluate(e=>document.activeElement===e))break;
          }
          assert.ok(await secondary.evaluate(e=>document.activeElement===e&&e.matches(':focus-visible')),'keyboard focus path: '+JSON.stringify(visited));
          assert.ok(await secondary.evaluate(e=>getComputedStyle(e).boxShadow!=='none'));
          stage='button: disabled variants';
          const disabled=page.locator('#disabled [role=tabpanel]').getByRole('button');
          assert.equal(await disabled.count(),4);
          for(const b of await disabled.all())assert.ok(await b.isDisabled());

          stage='button: pressed transform';
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
          stage='rtl: initial direction and tabs';
          const lab=page.getByTestId('direction-lab');
          await lab.waitFor();
          assert.equal(await lab.getAttribute('dir'),'rtl');
          const next=lab.getByRole('button',{name:'下一步'});
          await page.waitForFunction(e=>getComputedStyle(e).rotate.includes('180deg'),await next.locator('svg').elementHandle());
          const tabs=lab.getByRole('tablist',{name:'方向选项卡'});
          const first=tabs.getByRole('tab',{name:'概览'}),second=tabs.getByRole('tab',{name:'活动'});
          await page.waitForFunction(({a,b})=>a.getBoundingClientRect().x>b.getBoundingClientRect().x,{a:await first.elementHandle(),b:await second.elementHandle()});
          await first.press('ArrowLeft');
          await page.waitForFunction(e=>e.getAttribute('aria-selected')==='true',await second.elementHandle());
          const aligned=async (indicator,selected)=>{await page.waitForFunction(({a,b})=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return Math.abs(x.left-y.left)<2&&Math.abs(x.width-y.width)<2},{a:await indicator.elementHandle(),b:await selected.elementHandle()})};
          await aligned(lab.locator('[data-tab-indicator]'),second);
          const segment=lab.getByRole('radio',{name:'周'});
          await segment.click();
          await aligned(lab.locator('[data-segment-indicator]'),segment);
          stage='rtl: slider and overlays';
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
          stage='rtl: preserve state on LTR switch';
          await page.getByRole('button',{name:'切换为 LTR'}).click();
          await page.waitForFunction(e=>e.getAttribute('dir')==='ltr',await lab.elementHandle());
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
        if(route==='/zh-hans/templates/dashboard/'||route==='/workspace/dashboard/'){
          const demo=page.locator('#preview');
          assert.ok(await demo.getByText('总收入',{exact:true}).evaluate(e=>e.getBoundingClientRect().top<document.querySelector('#preview').querySelector('h4').getBoundingClientRect().top));
          await demo.getByRole('button',{name:'下一批'}).click();await demo.getByText('赵六',{exact:true}).first().waitFor();
          await demo.getByRole('button',{name:'分析',exact:true}).click();
          await demo.getByRole('heading',{name:'分析',exact:true}).waitFor();
          await demo.getByRole('button',{name:'查看全部'}).click();
          assert.equal(await demo.locator('tbody tr').count(),4);
        }
        if(route==='/zh-hans/templates/ai-chat/'){
          const demo=page.locator('#preview');
          await demo.getByRole('textbox',{name:'消息'}).fill('模板测试');
          await demo.getByRole('button',{name:'发送',exact:true}).click();
          await demo.getByRole('log').getByText('本地示例：已收到消息。此模板未连接 AI 服务。').waitFor();
          await demo.getByRole('button',{name:'新建对话',exact:true}).click();
          assert.equal(await demo.getByRole('log').getByText('模板测试').count(),0);
          await demo.getByRole('button',{name:'数据看板搭建',exact:true}).click();
          await demo.getByRole('log').getByText('模板测试').waitFor();
          const mobile=await context.newPage();
          try{await mobile.setViewportSize({width:390,height:844});await mobile.goto(origin+route,{waitUntil:'networkidle'});const panel=mobile.locator('#preview');await panel.getByRole('button',{name:'新建对话',exact:true}).click();await panel.getByRole('combobox',{name:'切换会话'}).selectOption('1');await panel.getByRole('log').getByText('帮我用 BoardUI 搭一个数据看板').waitFor();}finally{await mobile.close()}

        }
        if(route==='/zh-hans/templates/finance/'||route==='/workspace/finance/'){
          const demo=page.locator('#preview');
          await demo.getByRole('radio',{name:'年',exact:true}).click();
          await demo.getByText('年度样本',{exact:true}).waitFor();
          assert.ok(await demo.getByText('固定年度指标 · 不随现金流样本切换',{exact:true}).count());
          await demo.getByRole('combobox',{name:'查看图表数据点'}).selectOption('0');
          await demo.locator('[data-chart-tooltip]').getByText('62',{exact:true}).waitFor();
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
          const cols=demo.locator('[data-board-column]');
          if(await cols.count()===4)assert.ok(await cols.evaluateAll(es=>es.every(e=>e.getBoundingClientRect().width>=196)));
          await demo.getByRole('button',{name:'新建任务'}).click();
          await demo.getByRole('textbox',{name:'任务标题'}).fill('模板测试任务');
          await demo.getByRole('button',{name:'添加',exact:true}).click();
          await demo.getByText('模板测试任务',{exact:true}).waitFor();
          await demo.getByRole('radio',{name:'列表',exact:true}).click();
          await demo.getByText('模板测试任务',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/templates/project-board/'||route==='/workspace/project-board/'){
          const demo=page.locator('#preview');
          await demo.getByRole('searchbox',{name:'搜索任务'}).fill('审计跟踪');
          await demo.getByText('记录智能体操作的审计跟踪',{exact:true}).waitFor();
          assert.equal(await demo.getByText('定义高架表面的语义变量',{exact:true}).count(),0);
          const edit=demo.getByRole('button',{name:'编辑任务 记录智能体操作的审计跟踪'});
          if(route.startsWith('/workspace/')){
            assert.equal(await page.locator('[data-workspace=project-board]').count(),1);
            assert.equal(await page.locator('nav[aria-label="元件库"]').count(),0);
          }
          // The documentation route has already switched to list view.
          const listEdit=demo.getByRole('button',{name:'记录智能体操作的审计跟踪',exact:true});
          const trigger=await edit.isVisible()?edit:listEdit;
          await trigger.click();const dialog=page.getByRole('dialog',{name:'编辑任务'});await dialog.waitFor();
          await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
          await page.waitForFunction(e=>document.activeElement===e,await trigger.elementHandle());
          await trigger.click();await dialog.getByRole('combobox',{name:'移动至'}).selectOption('done');
          await dialog.getByRole('button',{name:'保存任务'}).click();await dialog.waitFor({state:'hidden'});
          await demo.getByRole('radio',{name:'看板',exact:true}).click();
          await demo.locator('[data-board-column="done"]').getByText('记录智能体操作的审计跟踪',{exact:true}).waitFor();
          assert.equal(await demo.locator('[data-board-column="backlog"]').getByText('记录智能体操作的审计跟踪',{exact:true}).count(),0);
          await demo.getByRole('searchbox',{name:'搜索任务'}).fill('不存在的任务-验收');
          assert.equal(await demo.getByText('暂无匹配任务').count(),4);
        }
        if(route.startsWith('/workspace/')){
          assert.equal(await page.locator('[data-workspace]').count(),1);
          assert.equal(await page.locator('nav[aria-label="元件库"]').count(),0);
          assert.equal(await page.locator('nav[aria-label="工作区导航"] [aria-current=page]').count(),1);
          assert.ok(await page.getByRole('link',{name:'返回文档'}).count());
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
        }
        if(['/zh-hans/components/radar-chart-card/','/zh-hans/components/radial-chart-card/','/zh-hans/components/heatmap-chart-card/','/zh-hans/components/scatter-chart-card/','/zh-hans/components/combo-chart-card/'].includes(route)){
          const panel=page.locator('#preview [role=tabpanel]');
          const control=panel.getByRole('combobox',{name:'查看图表数据点'});
          await control.selectOption('0');await panel.locator('[data-chart-tooltip]').waitFor();
          const record=page.locator('#records [role=tabpanel]');
          await record.getByRole('radio',{name:'更新数据'}).click();
          await record.getByRole('combobox',{name:'查看图表数据点'}).selectOption('0');
          await record.locator('[data-chart-tooltip]').getByText(/65/).waitFor();
          await record.getByRole('radio',{name:'空数据'}).click();await record.getByText('暂无可展示数据').waitFor();
          await record.getByRole('radio',{name:'初始'}).click();
          const target=record.locator('[data-chart-index="0"]').first();
          await target.scrollIntoViewIfNeeded();
          // Data-point select is the reliable keyboard path; visible marks also receive pointer/touch.
          await record.getByRole('combobox',{name:'查看图表数据点'}).selectOption('0');
          await record.locator('[data-chart-tooltip]').getByText(/25/).waitFor();
          if(route.includes('combo-chart')){
            const bars=page.locator('#bars [role=tabpanel]');
            await bars.getByRole('combobox',{name:'查看图表数据点'}).selectOption('1');
            await bars.locator('[data-chart-tooltip]').getByText('45',{exact:true}).waitFor();
          }
        }
        if(route==='/zh-hans/components/carousel/'){
          const demo=page.locator('#preview'),next=demo.getByRole('button',{name:'下一张'}),prev=demo.getByRole('button',{name:'上一张'});
          assert.ok(await prev.isDisabled());await next.click();
          await page.waitForFunction(()=>document.querySelector('#preview button[aria-current=true]')?.getAttribute('aria-label')==='第 2 张');
          await demo.getByRole('button',{name:'第 3 张'}).click();
          await page.waitForFunction(()=>document.querySelector('#preview button[aria-current=true]')?.getAttribute('aria-label')==='第 3 张');
          assert.ok(await next.isDisabled());await prev.press('Enter');
          await page.waitForFunction(()=>document.querySelector('#preview button[aria-current=true]')?.getAttribute('aria-label')==='第 2 张');
        }
        if(route==='/zh-hans/components/auth-card/'){
          const demo=page.locator('#preview'),login=demo.getByRole('button',{name:'登录',exact:true});
          assert.ok(await login.isDisabled());
          await demo.getByRole('textbox',{name:'邮箱'}).fill('demo@example.com');
          await demo.getByLabel('密码',{exact:true}).fill('sample123');await login.click();
          await demo.getByText('本地表单校验通过，未连接认证服务').waitFor();
          assert.equal(await demo.getByLabel('密码',{exact:true}).inputValue(),'');
          await demo.getByRole('button',{name:/去注册/}).click();
          assert.ok(await demo.getByRole('button',{name:'注册',exact:true}).isDisabled());
          await demo.getByLabel('密码',{exact:true}).fill('sample123');
          await demo.getByRole('checkbox').press('Space');
          assert.ok(await demo.getByRole('button',{name:'注册',exact:true}).isEnabled());
        }
        if(route==='/zh-hans/components/questionnaire/'){
          const demo=page.locator('#preview');
          const next=demo.getByRole('button',{name:'下一题'});
          assert.ok(await next.isDisabled());
          await demo.getByRole('radio',{name:'AI 产品'}).press('Space');assert.ok(await demo.getByRole('radio',{name:'AI 产品'}).isChecked());await next.click();
          await demo.getByRole('checkbox',{name:'无障碍'}).press('Space');assert.ok(await demo.getByRole('checkbox',{name:'无障碍'}).isChecked());await next.click();
          const input=demo.getByRole('textbox',{name:'还有什么建议？'});
          await input.fill('   ');assert.ok(await demo.getByRole('button',{name:'提交'}).isDisabled());
          await input.fill('验收通过');await demo.getByRole('button',{name:'提交'}).click();await demo.getByText('感谢填写').waitFor();
        }
        if(route==='/zh-hans/components/task-list/'){
          const demo=page.locator('#preview'),check=demo.getByRole('checkbox',{name:'为模型选择器添加键盘导航'});
          await check.press('Space');assert.equal(await check.getAttribute('aria-checked'),'true');
          await demo.getByText('2 / 4 已完成').waitFor();
        }
        if(route==='/zh-hans/components/web-search/'){
          const demo=page.locator('#preview'),button=demo.getByRole('button',{name:/检索到 2 个来源/});
          assert.equal(await button.getAttribute('aria-expanded'),'false');
          assert.equal(await demo.getByRole('link').count(),0);await button.click();
          await demo.getByRole('link',{name:/React Aria 官方文档/}).waitFor();
          assert.ok((await demo.getByRole('link',{name:/React Aria 官方文档/}).getAttribute('href')).startsWith('https://'));
          await button.press('Enter');assert.equal(await button.getAttribute('aria-expanded'),'false');
        }
        if(route==='/zh-hans/components/tag-group/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'移除 React',exact:true}).click();
          await demo.getByText('React',{exact:true}).waitFor({state:'hidden'});
          await demo.getByRole('button',{name:'重置标签'}).click();await demo.getByText('React',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/components/social-button/'){
          const demo=page.locator('#preview');await demo.getByRole('button',{name:/GitHub/}).press('Enter');
          await demo.getByText('github · 本地演示，未连接认证').waitFor();
        }
        if(route==='/zh-hans/components/counter/'){
          const demo=page.locator('#preview'),minus=demo.getByRole('button',{name:'减少'});
          await minus.click();assert.ok(await minus.isDisabled());
          await demo.getByRole('button',{name:'增加'}).press('Enter');assert.ok(await minus.isEnabled());
        }
        if(route==='/zh-hans/components/toggle-button/'){
          const demo=page.locator('#preview');await demo.getByRole('radio',{name:'网格'}).press('Space');
          assert.equal(await demo.getByRole('radio',{name:'网格'}).getAttribute('aria-checked'),'true');
        }
        if(route==='/zh-hans/components/toast/'){
          await page.locator('#preview').getByRole('button',{name:'成功提示'}).click();await page.getByText('已保存',{exact:true}).waitFor();
          await page.getByRole('button',{name:'关闭消息'}).click();await page.getByText('已保存',{exact:true}).waitFor({state:'hidden'});
        }
        if(route==='/zh-hans/components/area-chart-card/'){
          const demo=page.locator('#preview'),point=demo.getByRole('combobox',{name:'查看图表数据点'});
          const chart=demo.getByRole('img',{name:/趋势图/});
          await chart.scrollIntoViewIfNeeded();
          const position=await chart.evaluate(svg=>{const p=new DOMPoint(37,40).matrixTransform(svg.getScreenCTM());return {x:p.x,y:p.y}});
          await page.mouse.move(position.x,position.y);
          await demo.locator('[data-chart-tooltip]').getByText('3,400',{exact:true}).waitFor();
          await page.mouse.move(0,0);await demo.locator('[data-chart-tooltip]').waitFor({state:'hidden'});
          await point.selectOption('0');await demo.locator('[data-chart-tooltip]').getByText('3,400',{exact:true}).waitFor();
          const later=await chart.evaluate(svg=>{const p=new DOMPoint(svg.viewBox.baseVal.width*.75,40).matrixTransform(svg.getScreenCTM());return {x:p.x,y:p.y}});
          await page.mouse.move(later.x,later.y);
          await page.mouse.move(0,0);
          assert.equal(await point.inputValue(),'0');
          await demo.locator('[data-chart-tooltip]').getByText('3,400',{exact:true}).waitFor();
          await page.setViewportSize({width:390,height:844});
          try{
            await page.waitForFunction(e=>Math.abs(e.viewBox.baseVal.width-e.clientWidth)<=1,await chart.elementHandle());
            assert.ok(await chart.locator('[data-chart-axis-label]').count()<8);
            assert.equal(await point.locator('option').count(),9);
          }finally{await page.setViewportSize({width:1440,height:1000});}

          if(process.env.CHART_SCREENSHOT)await page.screenshot({path:process.env.CHART_SCREENSHOT.replace('.png','-'+theme+'.png')});

          await demo.getByRole('button',{name:'有机',exact:true}).click();
          assert.equal(await demo.getByRole('button',{name:'有机',exact:true}).getAttribute('aria-pressed'),'false');
          for(const name of ['推荐','其他'])await demo.getByRole('button',{name,exact:true}).click();
          await demo.getByText('暂无可展示数据').waitFor();
          for(const name of ['有机','推荐','其他'])await demo.getByRole('button',{name,exact:true}).click();
          const dynamic=page.locator('#dynamic');
          await dynamic.getByRole('radio',{name:'更新数据'}).click();
          await dynamic.getByRole('combobox',{name:'查看图表数据点'}).selectOption('2');
          await dynamic.locator('[data-chart-tooltip]').getByText('36',{exact:true}).waitFor();
          await dynamic.getByRole('radio',{name:'空数据'}).click();await dynamic.getByText('暂无可展示数据').waitFor();
        }
        if(route==='/zh-hans/components/calendar/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'下个月'}).click();
          await demo.getByRole('heading',{name:'2026年9月'}).waitFor();
          await demo.getByText('0 个日程 · 示例',{exact:true}).waitFor();
          await demo.getByRole('button',{name:'上个月'}).click();
          await demo.getByRole('heading',{name:'2026年8月'}).waitFor();
          await demo.getByRole('button',{name:/2026年8月12日/}).click();
          await demo.getByText('季度规划',{exact:true}).last().waitFor();
          assert.equal(await demo.getByRole('button',{name:/2026年8月12日/}).getAttribute('aria-pressed'),'true');
          await demo.getByRole('button',{name:'今天',exact:true}).click();
          const month=await page.evaluate(()=>{const d=new Date();return d.getFullYear()+'年'+(d.getMonth()+1)+'月'});
          await demo.getByRole('heading',{name:month}).waitFor();
        }
        if(route==='/zh-hans/components/composer-panel/'){
          const demo=page.locator('#preview');
          const tab=demo.getByRole('tab',{name:'工具',exact:true});
          await tab.press('ArrowRight');
          await demo.getByRole('tabpanel',{name:'文件'}).getByText(/选择需要引用的附件/).waitFor();
          assert.equal(await demo.getByRole('tab',{name:'文件'}).getAttribute('aria-selected'),'true');
          await demo.getByRole('tab',{name:'提示词'}).click();
          await demo.getByRole('tabpanel',{name:'提示词'}).getByText(/选择预设工作流/).waitFor();
        }
        if(route==='/zh-hans/components/composer-attachments/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'移除 设计稿.pdf'}).click();
          await demo.getByText('设计稿.pdf',{exact:true}).waitFor({state:'hidden'});
          await demo.getByText('封面图.png',{exact:true}).waitFor();
        }
        if(route==='/zh-hans/components/notification-center/'){
          const demo=page.locator('#preview'),count=demo.getByRole('status',{name:'未读通知数量'});
          await count.waitFor({state:'attached'});
          assert.equal(await count.textContent(),'2');
          await demo.getByRole('radio',{name:'提及 1'}).click();
          await demo.getByRole('button',{name:'新评论，未读'}).waitFor();
          assert.equal(await demo.getByRole('button',{name:'构建已完成，未读'}).count(),0);
          await demo.getByRole('radio',{name:'全部 3'}).click();
          await demo.getByRole('button',{name:'构建已完成，未读'}).click();
          assert.equal(await count.textContent(),'1');
          await demo.getByRole('button',{name:'全部已读'}).click();
          assert.equal(await count.textContent(),'0');
          assert.ok(await demo.getByRole('button',{name:'全部已读'}).isDisabled());
          await demo.getByRole('button',{name:'添加示例通知'}).click();
          assert.equal(await count.textContent(),'1');
          await demo.getByRole('button',{name:'新通知 3，未读'}).waitFor();
        }
        if(route==='/zh-hans/components/agent-creator/'){
          const demo=page.locator('#preview'),name=demo.getByRole('textbox',{name:'名称',exact:true}),create=demo.getByRole('button',{name:'创建',exact:true});
          await name.fill('');assert.ok(await create.isDisabled());
          await name.fill('验收助手');
          await demo.getByRole('button',{name:/模型/}).click();
          await page.getByRole('option',{name:'深度推理'}).click();
          const temperature=demo.getByRole('slider',{name:'温度（越高越有创造性）'});
          await temperature.press('ArrowRight');
          await demo.getByRole('switch',{name:'流式输出'}).press('Space');
          await create.click();
          await demo.getByText(/上次创建：验收助手 \/ deep \/ 41 \/ 检索网页 \/ false/).waitFor();
        }
        if(['/zh-hans/components/area-chart-card/','/zh-hans/components/line-chart-card/','/zh-hans/components/earnings-chart-card/','/zh-hans/components/orders-chart-card/','/zh-hans/components/revenue-chart-card/'].includes(route)){
          const demo=page.locator('#preview'),svg=demo.getByRole('img',{name:/趋势图/});
          const axisCount=()=>svg.locator('text').filter({hasText:/^[1-8]月$/}).count();
          assert.equal(await axisCount(),8);
          if(route.includes('orders-chart')){
            assert.equal(await svg.locator('[data-series=current]').count(),8);
            assert.equal(await svg.locator('[data-series=previous]').count(),8);
            await demo.getByRole('combobox',{name:'查看图表数据点'}).selectOption('0');
            await demo.locator('[data-chart-tooltip]').getByText('今年：1,680 · 去年：1,510',{exact:true}).waitFor();
            assert.equal(await demo.locator('[data-orders-label]').textContent(),'1月');
            assert.equal(await demo.locator('[data-orders-value]').textContent(),'1,680');
            assert.equal(await demo.locator('[data-orders-previous]').textContent(),'去年同期 1,510');
            assert.equal(await demo.locator('[data-orders-delta]').textContent(),'+11.3%');
            await demo.getByRole('combobox',{name:'查看图表数据点'}).selectOption('');
            assert.equal(await demo.locator('[data-orders-value]').textContent(),'15,810');
            await svg.locator('[data-series=current]').first().hover();
            await demo.locator('[data-orders-value]').getByText('1,680',{exact:true}).waitFor();
            await page.mouse.move(0,0);
            await demo.locator('[data-orders-value]').getByText('15,810',{exact:true}).waitFor();
          }

          await demo.getByRole('radio',{name:'近4月'}).click();
          if(route.includes('orders-chart')){
            assert.equal(await demo.locator('[data-orders-label]').textContent(),'订单量');
            assert.equal(await demo.getByRole('combobox',{name:'查看图表数据点'}).inputValue(),'');
          }
          await page.waitForFunction(()=>document.querySelectorAll('#preview svg[role=img] text').length>0&&[...document.querySelectorAll('#preview svg[role=img] text')].filter(e=>/^[1-8]月$/.test(e.textContent)).length===4);
          assert.ok(!(await svg.locator('path').evaluateAll(es=>es.some(e=>/NaN|Infinity/.test(e.getAttribute('d')??'')))));
          if(route.includes('line-chart'))assert.equal(await svg.locator('path[fill^="url("]').count(),0);
          await demo.getByRole('radio',{name:'近8月'}).click();
          await page.waitForFunction(()=>[...document.querySelectorAll('#preview svg[role=img] text')].filter(e=>/^[1-8]月$/.test(e.textContent)).length===8);
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
        if(['/zh-hans/components/composer-loader/','/zh-hans/components/spinner/','/zh-hans/components/skeleton/'].includes(route)){
          const preview=page.locator('#preview');
          const isLoader=route.includes('composer-loader'),isSkeleton=route.includes('skeleton');
          const selector=isLoader?'.bui-composer-loader-rect':isSkeleton?'[data-skeleton]':'[data-spinner]';
          const target=preview.locator(selector).first();
          await page.emulateMedia({reducedMotion:'no-preference'});
          await preview.scrollIntoViewIfNeeded();
          await target.waitFor();
          const state=()=>target.evaluate((el,pseudo)=>getComputedStyle(el,pseudo?'::before':null).animationPlayState,isSkeleton);
          await page.waitForFunction(({selector,pseudo})=>getComputedStyle(document.querySelector('#preview '+selector),pseudo?'::before':null).animationPlayState==='running',{selector,pseudo:isSkeleton});
          await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
          // Short pages can end before their preview leaves the viewport. Add a
          // temporary spacer only in the test, not production content.
          await page.evaluate(()=>{const spacer=document.createElement('div');spacer.id='motion-test-spacer';spacer.style.height='2000px';document.body.append(spacer);window.scrollTo(0,document.documentElement.scrollHeight)});
          await page.waitForFunction(({selector,pseudo})=>getComputedStyle(document.querySelector('#preview '+selector),pseudo?'::before':null).animationPlayState==='paused',{selector,pseudo:isSkeleton});
          await preview.scrollIntoViewIfNeeded();
          await page.waitForFunction(({selector,pseudo})=>getComputedStyle(document.querySelector('#preview '+selector),pseudo?'::before':null).animationPlayState==='running',{selector,pseudo:isSkeleton});
          assert.equal(await state(),'running');
          await page.emulateMedia({reducedMotion:'reduce'});
          assert.equal(await target.evaluate((el,pseudo)=>getComputedStyle(el,pseudo?'::before':null).animationName,isSkeleton),'none');
          await page.evaluate(()=>document.getElementById('motion-test-spacer')?.remove());
        }
        if(route==='/zh-hans/components/agent-thinking/'){
          const preview=page.locator('#preview');
          assert.equal(await preview.getByRole('status').count(),4);
          await preview.scrollIntoViewIfNeeded();
          await page.waitForFunction(()=>document.querySelectorAll('#preview [data-motion-active="true"]').length===4);
          const elapsed=preview.getByRole('status').first().locator('span.tabular-nums');
          const time=async()=>parseFloat(await elapsed.textContent());
          const started=await time();
          await page.waitForFunction(t=>parseFloat(document.querySelector('#preview [role=status] .tabular-nums').textContent)>t,started);
          const before=await time();
          await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
          await page.waitForFunction(()=>document.querySelectorAll('#preview [data-motion-active="false"]').length===4);
          const stopped=await time();
          await page.waitForTimeout(350);
          assert.equal(await time(),stopped,'offscreen timer must stop updating');
          assert.ok(stopped>=before);
          await preview.scrollIntoViewIfNeeded();
          await page.waitForFunction(()=>document.querySelectorAll('#preview [data-motion-active="true"]').length===4);
          await page.waitForFunction(t=>parseFloat(document.querySelector('#preview [role=status] .tabular-nums').textContent)>=t+.2,stopped);
          // Reduced motion does not freeze elapsed time, but removes decorative animation.
          await page.emulateMedia({reducedMotion:'reduce'});
          assert.equal(await preview.locator('.bui-agent-thinking-label').first().evaluate(e=>getComputedStyle(e).animationName),'none');
        }
        if(route.includes('/components/')&&/\/(?:[^/]*chart-card|activity-rings-card|bar-list-card|contributions-card|most-active-days-card|sleep-score-card|stage-bars-card|steps-card)\/$/.test(route)){
          stage='chart: finite geometry and unique paint references';
          const panel=page.locator('#preview [role=tabpanel]');
          assert.equal(await panel.count(),1);
          const geometry=await panel.evaluate(el=>{
            const ids=[...el.querySelectorAll('svg [id]')].map(e=>e.id);
            const invalid=[...el.querySelectorAll('svg path,svg rect,svg circle,svg line,svg polyline,svg polygon')].some(e=>[...e.attributes].some(a=>['d','points','x','y','width','height','cx','cy','r','x1','x2','y1','y2'].includes(a.name)&&/NaN|Infinity/.test(a.value)));
            return {invalid,duplicate:ids.length!==new Set(ids).size,visible:el.getBoundingClientRect().width>0};
          });
          assert.deepEqual(geometry,{invalid:false,duplicate:false,visible:true});
        }
        if(route==='/zh-hans/components/bar-list-card/'){
          const demo=page.locator('#preview');
          await demo.getByRole('button',{name:'浏览器',exact:true}).click();
          await demo.getByText('铬镀',{exact:true}).waitFor();
          assert.equal(await demo.getByText('桌面',{exact:true}).count(),0);
        }
        if(route==='/zh-hans/components/agent-progress/'){
          assert.equal(await page.locator('#preview [aria-current=step]').count(),1);
        }
        if(route==='/zh-hans/components/table/'){
          const table=page.locator('#preview').getByRole('grid',{name:'成员列表'});
          assert.equal(await table.getByRole('row').count(),4);
          assert.ok(await table.locator('tbody tr').first().getByRole('rowheader').count());
          const demo=page.locator('#preview'),query=demo.getByRole('searchbox',{name:'搜索成员'});
          await query.fill('李四');
          await page.waitForFunction(()=>document.querySelectorAll('#preview tbody tr').length===1);
          assert.ok((await table.textContent()).includes('李四'));
          await query.fill('');
          await demo.getByRole('button',{name:/筛选成员状态/}).click();
          await page.getByRole('option',{name:'休假',exact:true}).click();
          await page.waitForFunction(()=>document.querySelector('#preview tbody')?.textContent.includes('王五'));
          assert.equal(await table.locator('tbody tr').count(),1);

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
          assert.ok(await dialog.evaluate(e=>(e.getAttribute('aria-describedby')||'').split(/\s+/).some(id=>document.getElementById(id)?.textContent.includes('他们会收到一封电子邮件'))),'dialog description must resolve to visible text');
          await dialog.getByRole('textbox',{name:'邮箱地址'}).fill('demo@example.com');
          for(let i=0;i<8;i++){await page.keyboard.press('Tab');assert.ok(await dialog.evaluate(e=>e.contains(document.activeElement)),'dialog forward focus containment');}
          for(let i=0;i<8;i++){await page.keyboard.press('Shift+Tab');assert.ok(await dialog.evaluate(e=>e.contains(document.activeElement)),'dialog backward focus containment');}

          await page.keyboard.press('Escape');
          await dialog.waitFor({state:'hidden'});
          await page.waitForFunction(e=>document.activeElement===e,await trigger.elementHandle());
          stage='modal: short viewport layout and dismissal';
          await page.setViewportSize({width:320,height:420});
          try{
            await trigger.click();await dialog.waitFor();
            assert.ok(await dialog.evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1}));
            assert.ok(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
            const footer=dialog.getByRole('button',{name:'发送邀请'});
            await footer.scrollIntoViewIfNeeded();
            await footer.click();
            await dialog.waitFor({state:'hidden'});
            await page.waitForFunction(e=>document.activeElement===e,await trigger.elementHandle());
          }finally{await page.setViewportSize({width:1440,height:1000});}
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
          stage='accordion: single expansion';
          const first=page.getByRole('button',{name:'第一项',exact:true});
          const second=page.getByRole('button',{name:'第二项',exact:true});
          await second.scrollIntoViewIfNeeded();
          await second.click();
          await page.waitForFunction(e=>e.getAttribute('aria-expanded')==='true',await second.elementHandle());
          assert.equal(await first.getAttribute('aria-expanded'),'false');
          assert.equal(await second.getAttribute('aria-expanded'),'true');
          assert.ok(await page.getByRole('button',{name:'禁用项'}).isDisabled());
          stage='collapsible: editable panel close';
          const more=page.getByRole('button',{name:'更多设置'});
          await more.click();await page.getByRole('textbox',{name:'折叠内输入框'}).fill('test');
          await more.click();await page.waitForFunction(e=>e.getAttribute('aria-expanded')==='false',await more.elementHandle());
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
          const selected=page.locator('#preview').getByRole('tab',{name:/帖子/});
          assert.ok(await selected.evaluate(e=>e.matches(':focus-visible')));
          assert.ok(await selected.evaluate(e=>getComputedStyle(e).boxShadow!=='none'));
        }
        if(route==='/zh-hans/components/segmented-control/'){
          const demo=page.locator('#preview');
          await demo.getByRole('radio',{name:'每月',exact:true}).click();
          assert.equal(await demo.getByRole('radio',{name:'每月',exact:true}).getAttribute('aria-checked'),'true');
        }
        if(route==='/zh-hans/components/select/'){
          const filter=page.locator('#preview').getByRole('button',{name:/按价格过滤/});
          await filter.click();
          const low=page.getByRole('option',{name:'100 元以内'});
          await low.hover();
          await page.waitForFunction(e=>e.hasAttribute('data-hovered')&&getComputedStyle(e).backgroundColor!=='rgba(0, 0, 0, 0)',await low.elementHandle());
          await low.click();
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
          const attach=page.locator('#preview').getByRole('button',{name:'添加到聊天'});
          await attach.press('Enter');
          const attachMenu=page.getByRole('menu',{name:'添加到聊天'});
          await attachMenu.getByRole('menuitem',{name:'添加文件'}).press('Enter');
          await page.locator('#preview').getByText('上次操作：文件').waitFor();
          await attachMenu.waitFor({state:'hidden'});

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
          const trigger=page.getByRole('button',{name:'打开浮层'}),dialog=page.getByRole('dialog',{name:'设置浮层'});
          await trigger.click();await dialog.waitFor();
          await dialog.getByRole('textbox',{name:'名称'}).fill('浮层验收');
          await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
          await page.waitForFunction(e=>document.activeElement===e,await trigger.elementHandle());
          await page.setViewportSize({width:320,height:420});
          try{
            await trigger.click();await dialog.waitFor();
            assert.ok(await dialog.evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight+1}));
            await dialog.getByRole('button',{name:'关闭'}).click();await dialog.waitFor({state:'hidden'});
            await page.waitForFunction(e=>document.activeElement===e,await trigger.elementHandle());
          }finally{await page.setViewportSize({width:1440,height:1000});}
        }
        if(route==='/zh-hans/components/input/'){
          stage='input: required and description';
          const demo=page.getByTestId('form-fields');
          const input=demo.getByRole('textbox',{name:'受控邮箱'});
          await input.fill('demo@example.com');
          const field=input.locator('xpath=ancestor::*[@data-focus-within][1]');
          assert.ok(await field.count());
          assert.ok(await field.evaluate(e=>getComputedStyle(e).boxShadow!=='none'));
          assert.equal(await input.inputValue(),'demo@example.com');
          assert.ok(await input.evaluate(e=>e.required || e.getAttribute('aria-required')==='true'),'required field semantics');
          await page.waitForFunction(el=>{const ids=el.getAttribute('aria-describedby')?.split(/\s+/)||[];return ids.some(id=>document.getElementById(id)?.textContent.includes('输入有效邮箱'))},await input.elementHandle());
          stage='textarea: auto-resize and shrink';
          const notes=demo.getByRole('textbox',{name:'受控备注'});
          await notes.scrollIntoViewIfNeeded();
          const before=await notes.evaluate(e=>parseFloat(getComputedStyle(e).lineHeight)*2);
          await notes.fill('one\ntwo\nthree\nfour\nfive\nsix');
          await page.waitForFunction(({el,height})=>el.getBoundingClientRect().height>=height*2,{el:await notes.elementHandle(),height:before});
          await notes.fill('');
          await page.waitForFunction(({el,height})=>Math.abs(el.getBoundingClientRect().height-height)<1,{el:await notes.elementHandle(),height:before});
          stage='textarea: container width change';
          const initialWidth=await demo.evaluate(el=>el.style.width);
          try{
            await demo.evaluate(el=>{el.style.width='340px'});
            await notes.fill('This is a long wrapping line of text that should grow taller on a narrow layout.');
            const wide=await notes.evaluate(el=>el.getBoundingClientRect().height);
            await demo.evaluate(el=>{el.style.width='150px'});
            await page.waitForFunction(({el,height})=>el.getBoundingClientRect().height>height,{el:await notes.elementHandle(),height:wide});
            await demo.evaluate(el=>{el.style.width='340px'});
            await page.waitForFunction(({el,height})=>Math.abs(el.getBoundingClientRect().height-height)<1,{el:await notes.elementHandle(),height:wide});
          }finally{await demo.evaluate((el,width)=>{el.style.width=width},initialWidth);await notes.fill('');}
          stage='input: controlled search';
          const search=demo.getByRole('searchbox',{name:'受控搜索'});
          await search.fill('board');
          await demo.getByRole('button',{name:'清除搜索'}).click();
          assert.equal(await search.inputValue(),'');
          assert.equal(await demo.locator('output').textContent(),'demo@example.com / 0 / ');
          assert.ok(await page.getByRole('textbox',{name:'禁用',exact:true}).isDisabled());
          assert.equal(await page.getByRole('textbox',{name:'错误',exact:true}).getAttribute('aria-invalid'),'true');
        }
        if(route==='/zh-hans/components/textarea/'){
          const main=page.locator('#preview').getByRole('textbox',{name:'发行说明'});
          assert.ok(await main.evaluate(e=>e.required||e.getAttribute('aria-required')==='true'));
          await main.fill('Markdown **文本**');assert.equal(await main.inputValue(),'Markdown **文本**');
          const demo=page.locator('#auto-resize').getByRole('textbox',{name:'自适应文本域'});
          await demo.scrollIntoViewIfNeeded();
          const baseHeight=await demo.evaluate(e=>e.getBoundingClientRect().height);
          await demo.fill('one\ntwo\nthree\nfour');
          await page.waitForFunction(({e,h})=>e.getBoundingClientRect().height>h,{e:await demo.elementHandle(),h:baseHeight});
          await demo.fill('');
          await page.waitForFunction(({e,h})=>Math.abs(e.getBoundingClientRect().height-h)<1,{e:await demo.elementHandle(),h:baseHeight});
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
        if(route==='/zh-hans/components/switch/'){
          const preview=page.locator('#preview');
          const switches=preview.getByRole('switch');
          assert.equal(await switches.count(),6);
          for(const name of ['胶囊大','胶囊中','胶囊小','矩形大','矩形中','矩形小']){
            const control=preview.getByRole('switch',{name,exact:true});
            assert.ok(await control.isChecked());
            await control.press('Space');assert.equal(await control.isChecked(),false);
            await control.press('Space');assert.ok(await control.isChecked());
          }
          for(const control of await page.locator('#disabled').getByRole('switch').all())assert.ok(await control.isDisabled());
        }
        if(route==='/zh-hans/components/radio/'){
          const preview=page.locator('#preview');
          const first=preview.getByRole('radio',{name:'按月计费'}),second=preview.getByRole('radio',{name:'按年计费'});
          assert.ok(await first.isChecked());await first.press('ArrowDown');
          assert.ok(await second.isChecked());assert.equal(await first.isChecked(),false);
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
          const preview=page.locator('#preview');
          for(const [name,size] of [['通知',36],['编辑',36],['更多',32],['删除',32]]){
            const box=await preview.getByRole('button',{name,exact:true}).boundingBox();
            assert.equal(box?.width,size);assert.equal(box?.height,size);
          }
        }
        if(route==='/zh-hans/components/close-button/'){
          for(const size of [16,20,24,32]){
            const box=await page.getByRole('button',{name:'关闭 '+size,exact:true}).boundingBox();
            assert.equal(box?.width,size);assert.equal(box?.height,size);
          }
        }
        stage="accessibility and page errors";
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
      }catch(e){errors.push(theme+' '+route+' ['+stage+']: '+e.message);report.push({theme,route,status:'failed',stage,error:e.message});}
    }
    await context.close();
  }
}finally{await browser?.close();await new Promise(r=>server.close(r));if(full){mkdirSync('acceptance',{recursive:true});writeFileSync('acceptance/report.json',JSON.stringify({sha:process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),browser:browserName,report,errors},null,2));}}
if(process.env.BROWSER_REPORT_PATH)writeFileSync(process.env.BROWSER_REPORT_PATH,JSON.stringify({browser:browserName,results:report,errors},null,2));
console.log('Checked '+report.length+' page/theme combinations');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
