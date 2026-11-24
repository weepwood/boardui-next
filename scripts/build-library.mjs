import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, copyFileSync } from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
const root=process.cwd(), dir=path.join(root,'build/boardui-next');
rmSync(dir,{recursive:true,force:true});mkdirSync(dir,{recursive:true});
execFileSync(process.execPath,['node_modules/typescript/bin/tsc','-p','packages/tsconfig.build.json'],{stdio:'inherit'});
function walk(d){return readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])}
for(const f of walk(path.join(dir,'esm')).filter(f=>f.endsWith('.js')||f.endsWith('.d.ts'))){
 let s=readFileSync(f,'utf8').replace(/(from\s+["']|import\s*\(\s*["'])(\.{1,2}\/[^"']+)(["'])/g,(_,a,b,c)=>a+(b.endsWith('.js')?b:b+'.js')+c);
 if(f.endsWith('/react/index.js')&&!s.startsWith('"use client"'))s='"use client";\n'+s;
 writeFileSync(f,s);
}
const app=JSON.parse(readFileSync('package.json','utf8'));
const deps=Object.fromEntries(['@internationalized/date','@remixicon/react','motion','react-aria-components','tailwind-merge'].map(n=>[n,app.dependencies[n]]));
const pkg={name:'@weepwood/boardui-next',version:app.version,type:'module',license:'MIT',description:'Unofficial BoardUI-derived React component preview',exports:{'.':{types:'./esm/react/index.d.ts',import:'./esm/react/index.js'},'./styles.css':'./styles.css','./tailwind.css':'./tailwind.css'},types:'./esm/react/index.d.ts',sideEffects:['**/*.css'],files:['esm','styles.css','tailwind.css','LICENSE','README.md'],peerDependencies:{react:'^19.0.0','react-dom':'^19.0.0'},dependencies:deps,repository:{type:'git',url:'https://github.com/weepwood/boardui-next.git'}};
writeFileSync(path.join(dir,'package.json'),JSON.stringify(pkg,null,2)+'\n');
copyFileSync('LICENSE',path.join(dir,'LICENSE'));copyFileSync('packages/README.md',path.join(dir,'README.md'));
// Flatten local CSS imports, omit bundled fonts so consuming apps choose their own.
const raw=readFileSync('app/globals.css','utf8').replace(/^@import "([^"]+)";\s*$/gm,(_,f)=>f.includes('.generated-fonts/')?'':f.startsWith('.')?readFileSync(path.resolve(root,'app',f),'utf8'):'');
const source='@source "./esm";\n'+raw;
writeFileSync(path.join(dir,'tailwind.css'),source);
const result=await postcss([tailwind({base:root,optimize:true})]).process('@import "tailwindcss" source(none);\n'+source,{from:path.join(dir,'tailwind.css'),to:path.join(dir,'styles.css')});
writeFileSync(path.join(dir,'styles.css'),result.css);
console.log('Library built:',dir,'CSS bytes:',Buffer.byteLength(result.css));
