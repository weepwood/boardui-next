import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
const files=execFileSync("git",["ls-files","app","packages","lib"],{encoding:"utf8"}).trim().split("\n");
const css=files.filter(p=>p.endsWith(".css")).map(p=>readFileSync(p,"utf8")).join("\n");
const colors=new Set([...css.matchAll(/--color-([\w-]+)\s*:/g)].map(m=>m[1]));
const utilities=new Set([...css.matchAll(/@utility\s+([\w-]+)/g)].map(m=>m[1]));
const bad=[];
for(const file of files.filter(p=>/\.tsx?$/.test(p))){
 const source=readFileSync(file,"utf8");
 // Static semantic color utilities in quoted class strings, not arbitrary
 // Tailwind color palettes or text-size utilities.
 const lines=source.split("\n");
 for(const [i,line] of lines.entries()){
   if(/^\s*(?:\/\/|\*|\/\*)/.test(line))continue;
   for(const m of line.matchAll(/(?<![\w-])(?:bg|border|text|ring|divide|from|to|fill|stroke)-((?:border|background|text|foreground|separator|badge|accent|button|control|segmented|kbd|tab|chart|notification|input|status|surface)-[\w-]+)/g)){
     if(file==="app/zh-hans/components/color/page.tsx"&&colors.has(m[0]))continue;
     if(!colors.has(m[1])&&!utilities.has(m[0]))bad.push(file+":"+(i+1)+" "+m[0]);
   }
 }
}
assert.deepEqual(bad,[],bad.join("\n"));
console.log("Static semantic color utilities resolve to declared tokens or utilities.");
