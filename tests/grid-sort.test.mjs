import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const source=ts.transpileModule(readFileSync('app/components/ui/grid-sort.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {sortGridRows}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('数值、自然排序与稳定顺序',()=>{
 const rows=[{id:'a',v:20},{id:'b',v:2},{id:'c',v:2}];
 assert.deepEqual(sortGridRows(rows,r=>r.v,'asc').map(r=>r.id),['b','c','a']);
 assert.deepEqual(sortGridRows(rows,r=>r.v,'desc').map(r=>r.id),['a','b','c']);
 assert.deepEqual(sortGridRows(['任务10','任务2','任务1'],v=>v,'asc'),['任务1','任务2','任务10']);
 assert.deepEqual(rows.map(r=>r.id),['a','b','c']);
});
test('千行排序只执行一次每行的取值操作',()=>{
 const rows=Array.from({length:1000},(_,i)=>({v:(i*137)%1000}));let oldCalls=0,newCalls=0;
 const before=[...rows].sort((a,b)=>{oldCalls+=2;return a.v-b.v});
 const after=sortGridRows(rows,r=>{newCalls++;return r.v},'asc');
 assert.deepEqual(after,before);assert.equal(newCalls,rows.length);assert.ok(oldCalls>newCalls*5);
 console.log(JSON.stringify({rows:rows.length,previousAccessorCalls:oldCalls,optimizedAccessorCalls:newCalls}));
});
