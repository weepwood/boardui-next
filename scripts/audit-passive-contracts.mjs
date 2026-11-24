import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/passive-contracts');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error('base');let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/')&&f!==root)throw Error('path');if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const results=[];let browser;
try{
 browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 for(const theme of ['light','dark'])for(const width of [1440,390])for(const direction of ['ltr','rtl']){
  const context=await browser.newContext({viewport:{width,height:width===1440?1000:844},colorScheme:theme,reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const suffix=direction==='rtl'?'?audit-direction=rtl':'';
  const row={theme,width,direction};
  try{
   await page.goto(origin+'/zh-hans/components/divider/'+suffix,{waitUntil:'networkidle'});
   const fixture=page.getByTestId('divider-contract');
   await fixture.waitFor();
   assert.equal(await fixture.evaluate(e=>getComputedStyle(e).direction),direction);
   const horizontal=fixture.getByRole('separator',{name:'水平分隔线'}),vertical=fixture.getByRole('separator',{name:'垂直分隔线'});
   assert.equal(await horizontal.getAttribute('id'),'horizontal-contract');
   assert.equal(await vertical.getAttribute('aria-orientation'),'vertical');
   const h=await horizontal.boundingBox(),v=await vertical.boundingBox();
   assert.ok(h.width>1&&h.height===1);assert.ok(v.height===32&&v.width===1);
   assert.equal(await fixture.getByRole('separator').count(),2);
   for(const e of [horizontal,vertical])assert.ok(await e.evaluate(el=>getComputedStyle(el).borderTopWidth==='0px'&&getComputedStyle(el).backgroundColor!=='rgba(0, 0, 0, 0)'));
   assert.equal(await fixture.getByTestId('decorative-divider').getAttribute('aria-hidden'),'true');
   assert.equal(await fixture.locator('hr, [role=separator]').evaluateAll(es=>es.every(e=>e.tabIndex<0)),true);
   await fixture.screenshot({path:join(dir,theme+'-'+width+'-'+direction+'-divider.png')});
   await page.goto(origin+'/zh-hans/components/meter/'+suffix,{waitUntil:'networkidle'});
   const demo=page.getByTestId('meter-contract'),meter=demo.getByRole('meter',{name:'动态容量'});
   assert.equal(await demo.evaluate(e=>getComputedStyle(e).direction),direction);
   assert.equal(await demo.locator('.meter-contract-root').count(),1);
   for(const [name,value,max] of [['动态容量',25,200],['负值',0,100],['超额',200,200],['无效值',0,100],['度量',42,100]]){
    const e=demo.getByRole('meter',{name,exact:true});assert.equal(await e.getAttribute('aria-valuenow'),String(value));assert.equal(await e.getAttribute('aria-valuemax'),String(max));assert.equal(await e.getAttribute('aria-valuemin'),'0');
   }
   const measure=async e=>await e.evaluate(el=>{const a=el.getBoundingClientRect(),b=el.firstElementChild.getBoundingClientRect();return {ratio:b.width/a.width,start:getComputedStyle(el).direction==='rtl'?Math.abs(a.right-b.right):Math.abs(a.left-b.left),gradient:getComputedStyle(el.firstElementChild).backgroundImage,transition:getComputedStyle(el.firstElementChild).transitionProperty}});
   for(const e of await demo.getByRole('meter').all()){
    const m=await measure(e);
    assert.ok(m.start<=1);assert.ok(m.gradient.includes(direction==='rtl'?'to left':'to right'),m.gradient);assert.equal(m.transition,'none');
   }
   await demo.getByRole('button',{name:'增加',exact:true}).press('Enter');
   assert.equal(await meter.getAttribute('aria-valuenow'),'175');
   await demo.getByRole('button',{name:'降低',exact:true}).press('Space');
   assert.equal(await meter.getAttribute('aria-valuenow'),'50');
   const m=await measure(meter);assert.ok(Math.abs(m.ratio-.25)<.01);
   assert.equal(await demo.getByRole('meter').evaluateAll(es=>es.every(e=>e.tabIndex<0)),true);
   await demo.screenshot({path:join(dir,theme+'-'+width+'-'+direction+'-meter.png')});
   assert.deepEqual(errors,[]);row.status='passed';row.geometry=m;
  }catch(e){row.status='failed';row.error=e.message}
  finally{results.push(row);console.log(JSON.stringify(row));await context.close()}
 }
}finally{await browser?.close();await new Promise(r=>server.close(r));writeFileSync(join(dir,'report.json'),JSON.stringify({base:process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),scope:'Divider orientation, decorative semantics, no native focus; Meter all own props, invalid boundaries, external controlled updates and logical fill, two themes/viewports/directions, reduced motion',results},null,2)+'\n')}
assert.equal(results.length,8);assert.ok(results.every(r=>r.status==='passed'));
