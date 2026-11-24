import { chromium } from 'playwright';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';

// Initial-state screenshot candidates only. Never auto-approve visual parity.
const root=resolve('out'),base='/boardui-next';
const dir=resolve(process.argv[2]??'acceptance/visual-candidate');
import {routes,profiles,themes} from "./visual-candidate-scope.mjs";
const sha=process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png'};
mkdirSync(dir,{recursive:true});
const server=createServer((req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost');
  if(!u.pathname.startsWith(base+'/'))throw Error('base');
  let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));
  if(!f.startsWith(root+'/')&&f!==root)throw Error('path');
  if(statSync(f).isDirectory())f=join(f,'index.html');
  res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f));
 }catch{res.writeHead(404).end()}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
let browser;
const report={schemaVersion:1,sha,status:'candidate-unreviewed',browser:'chromium',browserVersion:null,platform:process.platform,arch:process.arch,profiles,themes,routes,rows:[]};
try{
 browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 report.browserVersion=browser.version();
 for(const theme of report.themes)for(const profile of profiles){
  const ctx=await browser.newContext({viewport:profile,colorScheme:theme,reducedMotion:'reduce',deviceScaleFactor:1,locale:'zh-CN',timezoneId:'Asia/Shanghai'});
  for(const route of routes){
   const row={theme,viewport:profile,route};const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   try{
    assert.equal((await page.goto(origin+route,{waitUntil:'networkidle'}))?.status(),200);
    await page.locator('main').waitFor();await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('dark')),theme==='dark');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal page overflow');
    assert.deepEqual(errors,[]);
    // Initial state, no clicks, input or menu actions before capture.
    const file=theme+'-'+profile.width+'-'+(route.replace(/[^a-z0-9-]/g,'_')||'home')+'.png';
    const bytes=await page.screenshot({path:join(dir,file),animations:'disabled',caret:'hide',scale:'css'});
    Object.assign(row,{status:'captured',file,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
   }catch(e){Object.assign(row,{status:'failed',error:e.message})}finally{report.rows.push(row);await page.close()}
  }await ctx.close();
 }
}finally{await browser?.close();await new Promise(r=>server.close(r));writeFileSync(join(dir,'manifest.json'),JSON.stringify(report,null,2)+'\n')}
const expected=routes.length*profiles.length*report.themes.length;
assert.equal(report.rows.length,expected);
assert.ok(report.rows.every(r=>r.status==='captured'),JSON.stringify(report.rows.filter(r=>r.status!=='captured')));
console.log('Captured '+expected+' initial-state screenshot candidates (not approved).');
