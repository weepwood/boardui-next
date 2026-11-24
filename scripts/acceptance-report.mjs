import {readdirSync,readFileSync,writeFileSync,mkdirSync,appendFileSync} from "node:fs";
import {join,resolve} from "node:path";
import {execFileSync} from "node:child_process";
const sha=process.env.GITHUB_SHA??execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim();
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(d,e.name)):[join(d,e.name)]);
if(process.argv.includes("--routes")){
 const root=resolve("out"),routes=walk(root).filter(f=>f.endsWith("/index.html")).map(f=>f.slice(root.length,-"index.html".length)).sort();
 mkdirSync("acceptance",{recursive:true});writeFileSync("acceptance/expected-routes.json",JSON.stringify({sha,routes,themes:["light","dark"]},null,2));
 console.log("Expected routes:",routes.length);process.exit(0);
}
const dir=process.argv[2]??"acceptance/reports";
const expected=JSON.parse(readFileSync(join(dir,"acceptance-routes/expected-routes.json"),"utf8"));
if(expected.sha!==sha)throw Error("Route manifest commit mismatch");
const keys=new Set(expected.themes.flatMap(t=>expected.routes.map(r=>t+" "+r)));
const lines=["# 完整浏览器验收","", "提交：`"+sha+"`","","| 浏览器 | 通过 | 失败 | 缺失 |","|---|---:|---:|---:|"], failures=[];
let ok=true;
const results=[];
for(const browser of ["chromium","firefox","webkit"]){
 let pass=0,failed=0,missing=keys.size;
 try{
  const data=JSON.parse(readFileSync(join(dir,"acceptance-report-"+browser,"report.json"),"utf8"));
  if(data.sha!==sha||data.browser!==browser)throw Error("报告身份不匹配");
  const seen=new Set();
  for(const row of data.report){
   const key=row.theme+" "+row.route;
   if(!keys.has(key)||seen.has(key))throw Error("重复或未知页面："+key);
   seen.add(key);
   if(row.status==="checked"&&Array.isArray(row.violations)&&!row.violations.length)pass++;
   else{failed++;failures.push({browser,...row});}
  }
  missing=keys.size-seen.size;
  if(data.errors.length||missing||failed)ok=false;
 }catch(e){ok=false;failures.push({browser,error:e.message});}
 results.push({browser,pass,failed,missing});
 lines.push("| "+browser+" | "+pass+" | "+failed+" | "+missing+" |");
}
lines.push("","自动化页面检查不是原版设计、交互、API、RTL 的逐组件人工验收。");
const markdown=lines.join("\n")+"\n";
console.log(markdown);
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,markdown);
mkdirSync("acceptance",{recursive:true});
writeFileSync("acceptance/summary.json",JSON.stringify({sha,expectedPerBrowser:keys.size,results,failures},null,2));
if(!ok)process.exitCode=1;
