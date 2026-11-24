import { chromium,firefox,webkit } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';
import assert from 'node:assert/strict';
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
  browser=await ({chromium,firefox,webkit}[browserName]).launch();
  if(full)mkdirSync('acceptance',{recursive:true});
  for(const theme of full?['light','dark']:['light']){
    const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:theme,reducedMotion:'reduce'});
    const page=await context.newPage();
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
          await page.getByRole('button',{name:theme==='light'?'切换到暗色模式':'切换到亮色模式'}).click();
          await page.waitForFunction(d=>document.documentElement.classList.contains('dark')===d,theme==='light');
          await page.getByRole('button',{name:theme==='light'?'切换到亮色模式':'切换到暗色模式'}).click();
          await page.waitForFunction(d=>document.documentElement.classList.contains('dark')===d,theme==='dark');
        }
        if(route==='/zh-hans/components/'){
          const card=page.locator('main article').first();
          const rect=await card.boundingBox();
          assert.equal(rect?.width,304);assert.equal(rect?.height,299);
          assert.equal(await card.evaluate(e=>getComputedStyle(e).borderRadius),'28px');
          assert.equal(await card.locator(':scope > div').first().evaluate(e=>e.getBoundingClientRect().height),197);
        }
        assert.deepEqual(await page.locator('[data-icon-fallback="true"]').evaluateAll(es=>es.map(e=>e.getAttribute('data-icon'))),[],'unknown SVG name on '+route);
        if(route==='/zh-hans/components/button/'){
          const svg=page.locator('main svg[data-icon]');
          assert.ok(await svg.count()>0,'shared SVG icons rendered');
          assert.equal(await page.locator('i[class*="ri-"]').count(),0,'no icon font elements');
          assert.equal(await page.locator('[data-icon-fallback="true"]').count(),0,'no unknown icon on button page');
          const arrow=page.locator('#preview button').filter({hasText:'继续'}).locator('svg').first();
          assert.equal(await arrow.evaluate(e=>e.getAttribute('viewBox')),'0 0 24 24');
          assert.ok((await arrow.evaluate(e=>getComputedStyle(e).rotate))==='none');
          await arrow.evaluate(e=>e.closest('[dir]').dir='rtl');
          assert.ok((await arrow.evaluate(e=>getComputedStyle(e).rotate)).includes('180deg'));
          await arrow.evaluate(e=>e.closest('[dir]').dir='ltr');
          const geometry=await page.evaluate(()=>{const r=s=>{const e=document.querySelector(s);const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height].map(Math.round)};return {main:r('main'),heading:r('main h1'),sidebar:r('aside'),toc:r('main+aside'),canvas:r('#preview > div > div:last-child'),shadow:getComputedStyle(document.documentElement).getPropertyValue('--shadow-sidebar').trim(),font:document.fonts.check('14px "Noto Sans SC Variable"','按钮')}});
          const near=(actual,expected,tolerance=12)=>assert.ok(actual.every((n,i)=>Math.abs(n-expected[i])<=tolerance), JSON.stringify({actual,expected,tolerance}));
          near(geometry.main.slice(0,3),[324,40,808]);
          near(geometry.heading.slice(0,2),[324,108]);
          assert.deepEqual(geometry.sidebar,[12,12,260,976]);
          assert.deepEqual(geometry.toc.slice(0,3),[1180,40,220]);
          assert.ok(geometry.canvas[3]>=327);
          assert.ok(geometry.shadow,'runtime sidebar elevation token');
          assert.ok(geometry.font,'self-hosted Chinese font');
          const demo=page.locator('#preview');
          const buttons=demo.getByRole('tabpanel').getByRole('button');
          assert.equal(await buttons.count(),4);
          for(const button of await buttons.all())assert.equal((await button.boundingBox())?.height,36);
          await demo.getByRole('tab',{name:'预览'}).press('ArrowRight');
          assert.equal(await demo.getByRole('tab',{name:'代码'}).getAttribute('aria-selected'),'true');
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
        if(route==='/zh-hans/components/modal/'){
          const trigger=page.getByRole('button',{name:'打开弹窗'});
          await trigger.click();
          const dialog=page.getByRole('dialog',{name:'邀请团队成员'});
          await dialog.waitFor();
          await dialog.getByRole('textbox',{name:'邮箱地址'}).fill('demo@example.com');
          await page.keyboard.press('Escape');
          await dialog.waitFor({state:'hidden'});
          assert.ok(await trigger.evaluate(e=>document.activeElement===e));
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
          const trigger=page.locator('#preview').getByRole('button',{name:/框架/});
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
          await page.getByRole('dialog',{name:'分组操作'}).getByRole('button',{name:'编辑',exact:true}).click();
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
          assert.ok(await input.getAttribute('aria-describedby'));
          const notes=demo.getByRole('textbox',{name:'受控备注'});
          const before=(await notes.boundingBox()).height;
          await notes.fill('one\ntwo\nthree\nfour\nfive\nsix');
          await page.waitForFunction(({el,height})=>el.getBoundingClientRect().height>height,{el:await notes.elementHandle(),height:before});
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
          await page.addScriptTag({path:resolve('node_modules/axe-core/axe.min.js')});
          violations=await page.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length})));
          await page.screenshot({path:'acceptance/'+theme+'-'+(route.replace(/[^a-z0-9-]/g,'_')||'home')+'.png',animations:'disabled'});
          if(violations.length)errors.push(theme+' '+route+' accessibility: '+violations.map(v=>v.id).join(', '));
        }
        if(failures.length)throw Error(failures.join('; '));
        report.push({theme,route,violations,status:'checked'});
      }catch(e){errors.push(theme+' '+route+': '+e.message);report.push({theme,route,status:'failed',error:e.message});}
    }
    await context.close();
  }
}finally{await browser?.close();await new Promise(r=>server.close(r));if(full){mkdirSync('acceptance',{recursive:true});writeFileSync('acceptance/report.json',JSON.stringify({browser:browserName,report,errors},null,2));}}
console.log('Checked '+report.length+' page/theme combinations');
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
