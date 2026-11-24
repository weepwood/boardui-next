import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const src=ts.transpileModule(readFileSync('app/components/ui/chart-stacking.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {stackSeries}=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
test('前缀累加保持叠加基线、缺失值和总量',()=>{
 const series=[{data:[1,2,3]},{data:[-2]},{data:[5,0,8]}];
 assert.deepEqual(stackSeries(series,3),{baselines:[[0,0,0],[1,2,3],[-1,2,3]],total:[4,2,11]});
 assert.deepEqual(stackSeries([],2),{baselines:[],total:[0,0]});
});
test('32×1000 数据叠加路径保持结果，数据读取线性化',()=>{
 const series=Array.from({length:32},(_,i)=>({data:Array.from({length:1000},(_,j)=>(i+j)%97)}));
 const expected=series.map((_,si)=>series[0].data.map((__,i)=>series.slice(0,si).reduce((sum,s)=>sum+(s.data[i]??0),0)));
 let reads=0;
 const counted=series.map(s=>({data:new Proxy(s.data,{get(t,p,r){if(typeof p==='string'&&/^\d+$/.test(p))reads++;return Reflect.get(t,p,r)}})}));
 const actual=stackSeries(counted,1000);
 assert.deepEqual(actual.baselines,expected);
 assert.deepEqual(actual.total,series[0].data.map((_,i)=>series.reduce((sum,s)=>sum+s.data[i],0)));
 assert.equal(reads,32000);
 console.log(JSON.stringify({series:32,points:1000,previousBaselineReads:496000,previousTotalReads:32000,newCombinedReads:reads}));
});
