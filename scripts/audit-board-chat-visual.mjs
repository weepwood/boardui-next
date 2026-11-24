import { chromium,firefox,webkit } from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/board-chat-visual');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/'))throw Error();if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const browserName=process.env.BROWSER||'chromium',browser=await ({chromium,firefox,webkit}[browserName]).launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const axePath=process.env.AXE_PATH??resolve('node_modules/axe-core/axe.min.js'),results=[];

try{
 for(const theme of ['light','dark'])for(const width of [1440,390]){
  const ctx=await browser.newContext({viewport:{width,height:width===1440?1000:844},colorScheme:theme,reducedMotion:'reduce'});
  for(const route of ['/zh-hans/templates/project-board/','/zh-hans/templates/ai-chat/','/workspace/project-board/','/workspace/ai-chat/']){
    const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    try{
      assert.equal((await page.goto(origin+route,{waitUntil:'networkidle'}))?.status(),200);
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),theme==='dark');
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
      assert.equal(overflow,false);assert.deepEqual(errors,[]);
      const name=theme+'-'+width+'-'+route.replace(/[^a-z0-9-]/g,'_');
      await page.screenshot({path:join(dir,name+'.jpg'),type:'jpeg',quality:82});
      const demo=page.locator('#preview');
      if(route.includes('project-board')){
        await demo.getByRole('searchbox',{name:'搜索任务'}).fill('审计跟踪');
        await demo.getByRole('button',{name:'编辑任务 记录智能体操作的审计跟踪'}).click();
        const dialog=page.getByRole('dialog',{name:'编辑任务'});
        await dialog.waitFor();
        await page.screenshot({path:join(dir,name+'edit.jpg'),type:'jpeg',quality:82});
        await dialog.getByRole('combobox',{name:'移动至'}).selectOption('done');
        await dialog.getByRole('button',{name:'保存任务'}).click();
        await demo.locator('[data-board-column="done"]').getByText('记录智能体操作的审计跟踪',{exact:true}).waitFor();
        await demo.getByRole('button',{name:'清除筛选'}).click();
      }else{
        const field=demo.getByRole('textbox',{name:'消息'});
        await field.fill('第一行草稿\n第二行草稿');
        if(width===390){
          await demo.getByRole('combobox',{name:'切换会话'}).selectOption('2');
          await field.fill('另一段草稿');
          await demo.getByRole('combobox',{name:'切换会话'}).selectOption('1');
        }else{
          await demo.getByRole('button',{name:'表单校验方案',exact:true}).click();
          await field.fill('另一段草稿');
          await demo.getByRole('button',{name:'数据看板搭建',exact:true}).click();
        }
        assert.equal(await field.inputValue(),'第一行草稿\n第二行草稿');
        await demo.getByRole('button',{name:'发送',exact:true}).click();
        await demo.getByRole('log').getByText('第一行草稿 第二行草稿',{exact:true}).waitFor();
        await page.screenshot({path:join(dir,name+'sent.jpg'),type:'jpeg',quality:82});
      }
      results.push({theme,width,route,status:'passed'});
    }catch(e){results.push({theme,width,route,status:'failed',error:e.message})}finally{await page.close()}
  }await ctx.close();
 }
}finally{await browser.close();server.close();writeFileSync(join(dir,'report.json'),JSON.stringify(results,null,2))}
console.log(JSON.stringify({count:results.length,failures:results.filter(r=>r.status!=='passed')}));
if(results.some(r=>r.status!=='passed'))process.exitCode=1;
