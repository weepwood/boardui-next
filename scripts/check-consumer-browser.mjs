import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { resolve, extname, sep } from "node:path";
import assert from "node:assert/strict";
const root=resolve("build/vite-consumer/dist");
const types={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".svg":"image/svg+xml"};
const server=createServer((req,res)=>{
  const pathname=new URL(req.url,"http://localhost").pathname;
  const file=resolve(root,"."+ (pathname==="/"?"/index.html":pathname));
  if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  try {const data=readFileSync(file);res.writeHead(200,{"Content-Type":types[extname(file)]??"application/octet-stream"});res.end(data);}
  catch {res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(0,"127.0.0.1",r));
let browser;
try{
 browser=await chromium.launch(process.env.BROWSER_EXECUTABLE?{executablePath:process.env.BROWSER_EXECUTABLE}:{});
 const page=await browser.newPage({viewport:{width:1100,height:800},reducedMotion:"reduce"});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:"+server.address().port);
 const field=page.getByRole("textbox",{name:"名称"});
 await field.fill("外部项目");await page.getByRole("button",{name:"保存"}).click();
 await page.locator("output").filter({hasText:"外部项目"}).waitFor();
 await page.getByRole("switch",{name:"深色主题"}).press("Space");
 await page.waitForFunction(()=>document.documentElement.classList.contains("dark"));
 await page.getByRole("switch",{name:"RTL"}).press("Space");
 await page.waitForFunction(()=>!!document.querySelector('[dir="rtl"] main'));
 assert.equal(await page.getByRole("progressbar",{name:"任务进度"}).getAttribute("aria-valuenow"),"60");
 const ids=await page.locator("linearGradient").evaluateAll(es=>es.map(e=>e.id));
 assert.ok(ids.length>=2);assert.equal(new Set(ids).size,ids.length);
 const group=page.getByRole("group",{name:"消费按钮组"}),toggle=group.getByRole("button",{name:"切换"});
 assert.equal((await group.boundingBox())?.height,32);
 assert.equal((await toggle.boundingBox())?.height,30);
 await toggle.press("Space");assert.equal(await toggle.getAttribute("aria-pressed"),"true");
 await toggle.press("Tab");assert.ok(await group.getByRole("button",{name:"更多"}).evaluate(e=>e===document.activeElement));
 for(const name of ["原生增加","ARIA 增加"]){
  const button=page.getByRole("button",{name,exact:true});
  const rect=await button.boundingBox();assert.equal(rect?.width,36);assert.equal(rect?.height,36);
  await button.press("Space");
 }
 const disabled=page.getByRole("button",{name:"禁用增加"});
 assert.equal(await disabled.isDisabled(),true);await disabled.evaluate(e=>e.click());
 assert.equal(await page.getByTestId("button-count").textContent(),"2");
 await page.getByRole("button",{name:"重置"}).press("Enter");
 assert.equal(await page.getByTestId("button-count").textContent(),"0");
 assert.deepEqual(errors,[]);
 console.log("Vite tarball consumer: controlled input, click, dark, RTL, progress, unique gradient IDs, button group inheritance, square icon buttons and keyboard/disabled behavior passed");
}finally{await browser?.close();await new Promise(r=>server.close(r));}
