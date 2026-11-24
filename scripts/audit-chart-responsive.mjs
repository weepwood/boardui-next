import { chromium,firefox,webkit } from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/chart-responsive');
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
  for(const route of ['/zh-hans/components/area-chart-card/','/zh-hans/components/line-chart-card/','/workspace/dashboard/','/workspace/finance/']){
    const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    try{
      assert.equal((await page.goto(origin+route,{waitUntil:'networkidle'}))?.status(),200);
      await page.evaluate(()=>document.fonts.ready);
      assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),theme==='dark');
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
      assert.equal(overflow,false);assert.deepEqual(errors,[]);
      const name=theme+'-'+width+'-'+route.replace(/[^a-z0-9-]/g,'_');
      await page.screenshot({path:join(dir,name+'.jpg'),type:'jpeg',quality:82});
      const area=page.locator('#preview [data-chart-area]').first();
      if(await area.count()){
        const svg=area.locator('svg');
        await page.waitForFunction(e=>Math.abs(e.viewBox.baseVal.width-e.clientWidth)<=1,await svg.elementHandle());
        const select=area.getByRole('combobox',{name:'查看图表数据点'});
        await select.selectOption('0');
        await area.locator('[data-chart-tooltip]').waitFor();
        await page.mouse.move(0,0);
        assert.equal(await select.inputValue(),'0');
        assert.ok(await area.locator('[data-chart-tooltip]').isVisible());
        const labels=await svg.locator('[data-chart-axis-label]').count();
        const options=await select.locator('option').count()-1;
        assert.ok(labels<=options&&labels>=2);
        if(width===390&&options>=8)assert.ok(labels<options);
        const spacing=await svg.locator('[data-chart-axis-label]').evaluateAll(nodes=>nodes.slice(1).map((e,i)=>e.getBoundingClientRect().left-nodes[i].getBoundingClientRect().right));
        assert.ok(spacing.every(gap=>gap>=0),JSON.stringify(spacing));
        await page.screenshot({path:join(dir,name+'selected.jpg'),type:'jpeg',quality:82});
      }
      results.push({theme,width,route,status:'passed'});
    }catch(e){results.push({theme,width,route,status:'failed',error:e.message})}finally{await page.close()}
  }await ctx.close();
 }
}finally{await browser.close();server.close();writeFileSync(join(dir,'report.json'),JSON.stringify(results,null,2))}
console.log(JSON.stringify({count:results.length,failures:results.filter(r=>r.status!=='passed')}));
if(results.some(r=>r.status!=='passed'))process.exitCode=1;
