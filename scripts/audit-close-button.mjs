import { chromium,firefox,webkit } from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,statSync,mkdirSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/close-button');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error();let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/'))throw Error();if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const browserName=process.env.BROWSER||'chromium',browser=await ({chromium,firefox,webkit}[browserName]).launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
const axePath=process.env.AXE_PATH??resolve('node_modules/axe-core/axe.min.js'),results=[];


try{
 for(const theme of ['light','dark'])for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:width===1440?1000:844},colorScheme:theme,reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const direction of ['ltr','rtl']){
    const row={theme,width,direction};
    try{
      await page.goto(origin+'/zh-hans/components/close-button/',{waitUntil:'networkidle'});
      const demo=page.getByTestId('close-button-states');
      await demo.scrollIntoViewIfNeeded();
      const toggle=demo.getByRole('checkbox',{name:'RTL'}),close=demo.getByRole('button',{name:'关闭可用',exact:true}),disabled=demo.getByRole('button',{name:'关闭禁用',exact:true});
      if(direction==='rtl')await toggle.check();
      await close.press('Tab');await page.keyboard.press('Shift+Tab');
      assert.ok(await close.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')));
      assert.equal(await disabled.evaluate(e=>getComputedStyle(e).cursor),'not-allowed');
      await page.addScriptTag({path:axePath});
      const violations=await page.evaluate(async()=> (await window.axe.run('[data-testid="close-button-states"]',{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})));
      assert.deepEqual(violations,[]);assert.deepEqual(errors,[]);
      const file=theme+'-'+width+'-'+direction+'.png';
      await demo.screenshot({path:join(dir,file),animations:'disabled'});
      row.status='passed';row.file=file;
    }catch(e){row.status='failed';row.error=e.message}finally{results.push(row)}
  }
  await context.close();
 }
}finally{await browser.close();server.close();writeFileSync(join(dir,'report.json'),JSON.stringify(results,null,2))}
console.log(JSON.stringify({count:results.length,failures:results.filter(r=>r.status!=='passed')}));
if(results.some(r=>r.status!=='passed'))process.exitCode=1;
