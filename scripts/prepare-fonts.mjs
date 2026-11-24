import {readFileSync,writeFileSync,mkdirSync,readdirSync,rmSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import path from 'node:path';
import subsetFont from 'subset-font';
const root=process.cwd(),source=path.join(root,'node_modules/@fontsource-variable/noto-sans-sc');
const dir=path.join(root,'app/styles/.generated-fonts'),cssFile=path.join(dir,'noto.css');
function walk(d){return readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])}
// Static interface characters only. User-entered text retains the original
// full Fontsource font ranges, and the Latin subset remains unchanged.
const files=['app','lib','packages/react'].flatMap(d=>walk(d)).filter(f=>/\.(tsx?|json)$/.test(f)&&!f.includes('.generated-fonts'));
const points=new Set();
for(const f of files)for(const c of readFileSync(f,'utf8')){const cp=c.codePointAt(0);if(cp>=0x3000&&cp<=0xffff)points.add(cp)}
const input=readFileSync(path.join(source,'index.css'),'utf8');
const signature=createHash('sha256').update(input).update(JSON.stringify([...points].sort((a,b)=>a-b))).update(readFileSync('package-lock.json')).update(readFileSync('scripts/prepare-fonts.mjs')).digest('hex');
if(existsSync(cssFile)&&existsSync('public/font-license.txt')&&existsSync(path.join(dir,'signature'))&&readFileSync(path.join(dir,'signature'),'utf8')===signature){console.log('Font subsets current');process.exit(0)}
rmSync(dir,{recursive:true,force:true});mkdirSync(dir,{recursive:true});
const toRanges=values=>{const nums=[...values].sort((a,b)=>a-b),out=[];for(let i=0;i<nums.length;){const a=nums[i];let b=a;while(i+1<nums.length&&nums[i+1]===b+1){i++;b++;}out.push('U+'+a.toString(16)+(b>a?'-'+b.toString(16):''));i++;}return out.join(',')};
const css=[];let original=0,compact=0,count=0;
for(const match of input.matchAll(/@font-face\s*\{[^}]+\}/g)){
 const face=match[0],file=face.match(/url\(\.\/files\/([^)]*)\)/)?.[1],range=face.match(/unicode-range:\s*([^;]+);/)?.[1];
 if(!file||!range)throw Error('Unsupported fontsource CSS');
 const srcUrl='../../../node_modules/@fontsource-variable/noto-sans-sc/files/'+file;
 const originalFace=face.replace('./files/'+file,srcUrl);
 const all=new Set();
 for(const token of range.split(',')){const [a,b]=token.trim().replace(/^U\+/i,'').split('-').map(x=>parseInt(x,16));for(let cp=a;cp<=(b??a);cp++)all.add(cp)}
 const chosen=[...all].filter(cp=>points.has(cp));
 if(!chosen.length||chosen.length===all.size){css.push(originalFace);continue}
 const bytes=readFileSync(path.join(source,'files',file));
 const output=await subsetFont(bytes,String.fromCodePoint(...chosen),{targetFormat:'woff2'});
 if(output.length>=bytes.length*.85){css.push(originalFace);continue}
 const subsetName='ui-'+file;writeFileSync(path.join(dir,subsetName),output);
 const remainder=[...all].filter(cp=>!points.has(cp));
 css.push(originalFace.replace(range,toRanges(remainder)));
 css.push(face.replace('./files/'+file,'./'+subsetName).replace(range,toRanges(chosen)));
 original+=bytes.length;compact+=output.length;count++;
}
writeFileSync(cssFile,'/* Generated from the installed Noto Sans SC variable font; SIL OFL 1.1. See font-license.txt. */\n'+css.join('\n')+'\n');
writeFileSync(path.join(dir,'signature'),signature);
mkdirSync('public',{recursive:true});
writeFileSync('public/font-license.txt',readFileSync(path.join(source,'LICENSE')));
console.log(JSON.stringify({subsets:count,staticCharacters:points.size,original,compact}));
