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
 const form=page.getByRole("form",{name:"独立表单"});
 await form.getByRole("textbox",{name:"联系邮箱"}).fill("demo@example.com");
 await form.getByRole("textbox",{name:"备注"}).fill("独立表单");
 await form.getByRole("checkbox",{name:"接受条款"}).press("Space");
 await form.getByRole("radio",{name:"方案 B"}).press("Space");
 assert.equal(await form.getByRole("radio",{name:"方案 B"}).isChecked(),true);
 await form.getByRole("button",{name:"地区"}).click();
 await page.getByRole("option",{name:"西区"}).click();
 await form.getByRole("button",{name:"提交独立表单"}).click();
 const data=JSON.parse(await page.getByTestId("form-result").textContent());
 for(const [k,v] of Object.entries({email:"demo@example.com",notes:"独立表单",accepted:"yes",plan:"b",region:"west"}))assert.equal(data[k],v,k);
 await page.getByRole("tab",{name:"详情"}).click();
 await page.getByRole("tabpanel",{name:"详情"}).getByText("详情内容").waitFor();
 await page.getByRole("button",{name:"切换分页数量"}).click();
 const nav=page.getByRole("navigation",{name:"分页"});
 await nav.getByText("1 / 20",{exact:true}).waitFor();
 assert.ok(await nav.evaluate(e=>e.scrollWidth<=e.clientWidth+1));
 await nav.getByRole("button",{name:"下一页"}).click();
 await nav.getByText("2 / 20",{exact:true}).waitFor();
 await page.getByRole("button",{name:"切换分页数量"}).click();
 await nav.waitFor({state:"hidden"});
 await page.getByRole("button",{name:"切换分页数量"}).click();
 await nav.getByText("1 / 20",{exact:true}).waitFor();
 const boundary=page.getByRole("region",{name:"组件边界"});
 const funnel=boundary.getByRole("img",{name:"转化漏斗"});
 assert.equal(await funnel.locator("path").count(),3);
 assert.ok(!(await funnel.evaluate(e=>e.outerHTML)).match(/NaN|Infinity/));
 assert.equal(await funnel.locator("text").evaluateAll(es=>es.map(e=>e.textContent).join(",")),"—,—,—");
 assert.equal(await page.getByTestId("empty-funnel").getByRole("status").textContent(),"暂无可展示数据");
 assert.equal(await boundary.getByRole("meter",{name:"无效容量"}).getAttribute("aria-valuenow"),"0");
 const meter=boundary.getByRole("meter",{name:"动态容量"});
 assert.equal(await meter.getAttribute("aria-valuemax"),"200");
 assert.equal(await meter.getAttribute("aria-valuenow"),"25");
 assert.equal(await boundary.locator(".consumer-meter").count(),1);
 assert.equal(await boundary.getByRole("meter",{name:"度量",exact:true}).getAttribute("aria-valuenow"),"42");
 await boundary.getByRole("button",{name:"增加容量"}).press("Enter");
 assert.equal(await meter.getAttribute("aria-valuenow"),"175");
 await boundary.getByRole("button",{name:"降低容量"}).press("Space");
 assert.equal(await meter.getAttribute("aria-valuenow"),"50");
 const geometry=await meter.evaluate(e=>{const a=e.getBoundingClientRect(),b=e.firstElementChild.getBoundingClientRect();return {ratio:b.width/a.width,right:Math.abs(a.right-b.right),gradient:getComputedStyle(e.firstElementChild).backgroundImage}});
 assert.ok(Math.abs(geometry.ratio-.25)<.01);assert.ok(geometry.right<=1);assert.ok(geometry.gradient.includes("to left"),geometry.gradient);
 for(const type of ["公告","通知"]){
  await boundary.getByRole("button",{name:"执行"+type}).press("Enter");
  const close=boundary.getByRole("button",{name:"关闭消费"+type});await close.press("Space");await close.waitFor({state:"hidden"});
 }
 await page.getByTestId("notice-count").getByText("2 / 2",{exact:true}).waitFor();
 assert.deepEqual(errors,[]);
 console.log("Vite tarball consumer: controlled input, click, dark, RTL, progress, unique gradient IDs, button group inheritance, square icon buttons keyboard/disabled behavior, native form submission, tabs, narrow pagination, funnel/meter boundaries and dismissal callbacks passed");
}finally{await browser?.close();await new Promise(r=>server.close(r));}
