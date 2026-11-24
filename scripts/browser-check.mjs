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
        if(route==='/zh-hans/components/button/'){
          const link=page.getByRole('link',{name:'查看组件',exact:true});
          await link.waitFor({state:'visible'});
          assert.ok((await link.getAttribute('href')).startsWith(base+'/'));
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
