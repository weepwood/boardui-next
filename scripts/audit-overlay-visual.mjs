import { chromium,firefox,webkit } from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/overlay-visual');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/'))throw Error();if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const browserName=process.env.BROWSER||'chromium',browser=await ({chromium,firefox,webkit}[browserName]).launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const axePath=process.env.AXE_PATH??resolve('node_modules/axe-core/axe.min.js'),results=[];

try{
 for(const theme of ['light','dark'])for(const width of [1440,390,320]){
  const ctx=await browser.newContext({viewport:{width,height:width===1440?1000:width===320?420:844},colorScheme:theme,reducedMotion:'reduce'});
  for(const route of ['/zh-hans/components/modal/','/zh-hans/components/popover/','/zh-hans/components/select/','/zh-hans/components/dropdown/']){
    const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    try{
      assert.equal((await page.goto(origin+route,{waitUntil:'networkidle'}))?.status(),200);
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),theme==='dark');
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
      assert.equal(overflow,false);assert.deepEqual(errors,[]);
      const name=theme+'-'+width+'-'+route.replace(/[^a-z0-9-]/g,'_');
      await page.screenshot({path:join(dir,name+'.jpg'),type:'jpeg',quality:82});
      const config=route.includes('/modal/')?['打开弹窗','dialog','邀请团队成员']:route.includes('/popover/')?['打开浮层','dialog','设置浮层']:route.includes('/select/')?[/按价格过滤/,'listbox',undefined]:['添加到聊天','menu','添加到聊天'];
      const trigger=page.locator('#preview').getByRole('button',{name:config[0]});
      await trigger.click();
      const panel=page.getByRole(config[1],config[2]?{name:config[2]}:{});
      await panel.waitFor();
      assert.ok(await panel.evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=-1&&r.top>=-1&&r.right<=innerWidth+1&&r.bottom<=innerHeight+1}));
      await page.screenshot({path:join(dir,name+'open.jpg'),type:'jpeg',quality:82});
      await page.keyboard.press('Escape');await panel.waitFor({state:'hidden'});
      await page.waitForFunction(e=>document.activeElement===e,await trigger.elementHandle());
      results.push({theme,width,route,status:'passed'});
    }catch(e){results.push({theme,width,route,status:'failed',error:e.message})}finally{await page.close()}
  }await ctx.close();
 }
}finally{await browser.close();server.close();writeFileSync(join(dir,'report.json'),JSON.stringify(results,null,2))}
console.log(JSON.stringify({count:results.length,failures:results.filter(r=>r.status!=='passed')}));
if(results.some(r=>r.status!=='passed'))process.exitCode=1;
