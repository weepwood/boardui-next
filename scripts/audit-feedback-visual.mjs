import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFileSync,writeFileSync,mkdirSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=resolve('out'),base='/boardui-next',dir=resolve(process.argv[2]??'acceptance/feedback-visual');
mkdirSync(dir,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.woff2':'font/woff2','.woff':'font/woff','.svg':'image/svg+xml','.png':'image/png'};
const server=createServer((req,res)=>{try{const u=new URL(req.url,'http://localhost');if(!u.pathname.startsWith(base+'/'))throw Error('base');let f=resolve(root,'.'+decodeURIComponent(u.pathname.slice(base.length)));if(!f.startsWith(root+'/')&&f!==root)throw Error('path');if(statSync(f).isDirectory())f=join(f,'index.html');res.writeHead(200,{'Content-Type':mime[extname(f)]??'application/octet-stream'});res.end(readFileSync(f))}catch{res.writeHead(404).end()}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port+base;
const slugs=['announcement','avatar','chip','notification','stat-cards','badge','progress','meter'];
const profiles=[{width:1440,height:1000},{width:390,height:844}];
const results=[];let browser;
const screenshot=async(locator,file)=>{const bytes=await locator.screenshot({path:join(dir,file),animations:'disabled',caret:'hide',scale:'css'});return {file,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)}};
try{
 browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 for(const theme of ['light','dark'])for(const viewport of profiles){
  const ctx=await browser.newContext({viewport,colorScheme:theme,reducedMotion:'reduce',deviceScaleFactor:1,locale:'zh-CN'});
  for(const slug of slugs){
   const p=await ctx.newPage(),row={slug,theme,viewport,browserVersion:browser.version()},errors=[];
   p.on('pageerror',e=>errors.push(e.message));
   try{
    assert.equal((await p.goto(origin+'/zh-hans/components/'+slug+'/',{waitUntil:'networkidle'}))?.status(),200);
    await p.evaluate(()=>document.fonts.ready);
    const panel=p.locator('#preview [data-preview-content]');
    await panel.waitFor();
    assert.equal(await p.locator('html').evaluate(e=>e.classList.contains('dark')),theme==='dark');
    row.layout=await panel.evaluate(e=>({width:e.clientWidth,height:e.clientHeight,scrollWidth:e.scrollWidth,documentWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth}));
    assert.ok(row.layout.width>0&&row.layout.height>0);
    assert.ok(row.layout.documentWidth<=row.layout.viewportWidth+1,'page overflow');
    assert.ok(row.layout.scrollWidth<=row.layout.width+1,'preview overflow');
    if(slug==='stat-cards'){
      const value=panel.getByText('¥128,430',{exact:true});
      const metrics=await value.evaluate(e=>{const range=document.createRange();range.selectNodeContents(e);return {lines:range.getClientRects().length,width:e.clientWidth}});
      assert.equal(metrics.lines,1,'currency value wraps');row.valueMetrics=metrics;
      const grid=panel.locator('.grid').first();
      const layout=await grid.evaluate(e=>({columns:getComputedStyle(e).gridTemplateColumns.split(' ').length,width:e.clientWidth}));
      assert.equal(layout.columns,layout.width>=760?4:layout.width>=376?2:1,'unbalanced card columns');row.statGrid=layout;
    }
    row.screenshots=[await screenshot(panel,theme+'-'+viewport.width+'-'+slug+'.png')];
    if(slug==='announcement'||slug==='notification'){
     const demo=p.getByTestId('dismiss-contract'),action=demo.getByRole('button',{name:slug==='announcement'?'查看设置':'查看详情'});
     await action.press('Enter');assert.equal(await demo.locator('output').textContent(),'1 / 0');
     row.screenshots.push(await screenshot(demo,theme+'-'+viewport.width+'-'+slug+'-action.png'));
    }else if(slug==='avatar'){
     const fallback=p.getByRole('img',{name:'回退头像'});await fallback.scrollIntoViewIfNeeded();await fallback.getByText('A',{exact:true}).waitFor();
     const sizes=p.locator('#sizes [data-preview-content]');await sizes.waitFor();row.screenshots.push(await screenshot(sizes,theme+'-'+viewport.width+'-'+slug+'-sizes.png'));
    }else if(slug==='chip'){
     const filter=p.locator('#filters [data-preview-content]'),button=filter.getByRole('button',{name:'收藏'});
     await button.press('Space');assert.equal(await button.getAttribute('aria-pressed'),'true');
     row.screenshots.push(await screenshot(filter,theme+'-'+viewport.width+'-'+slug+'-selected.png'));
    }else if(slug==='progress'){
     const sizes=p.locator('#sizes [data-preview-content]');await sizes.getByRole('progressbar',{name:'加载中'}).waitFor();
     row.screenshots.push(await screenshot(sizes,theme+'-'+viewport.width+'-'+slug+'-sizes.png'));
    }
    // Verify visible text and selected states with actual browser axe, no disable rules.
    await p.addScriptTag({path:resolve('node_modules/axe-core/axe.min.js')});
    row.violations=await p.evaluate(async()=> (await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})));
    assert.deepEqual(errors,[]);assert.deepEqual(row.violations,[]);
    row.status='passed';
   }catch(e){row.status='failed';row.error=e.message.slice(0,2000)}
   finally{row.errors=errors;results.push(row);console.log(JSON.stringify({slug,theme,width:viewport.width,status:row.status,error:row.error}));await p.close()}
  }
  await ctx.close();
 }
}finally{await browser?.close();await new Promise(r=>server.close(r));writeFileSync(join(dir,'report.json'),JSON.stringify({scope:'8 feedback and data-display routes, dual themes and viewports, actual initial/selected/action/fallback candidate screenshots; not upstream pixel parity or full manual acceptance',base:process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),results},null,2)+'\n')}
const failures=results.filter(r=>r.status!=='passed');
console.log(JSON.stringify({count:results.length,passed:results.length-failures.length,failures}));
if(results.length!==slugs.length*profiles.length*2||failures.length)process.exitCode=1;
