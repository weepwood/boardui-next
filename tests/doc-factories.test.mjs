import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

test('文档演示在需要时创建，禁止恢复整个注册表的顶层 JSX 构造',()=>{
 const file='lib/docs/registry.tsx';
 const ast=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const registry=ast.statements.filter(ts.isVariableStatement).flatMap(s=>[...s.declarationList.declarations]).find(d=>d.name.getText(ast)==='docs')?.initializer;
 assert.ok(registry&&ts.isObjectLiteralExpression(registry));
 const slugs=new Set([...readFileSync('lib/docs/meta.ts','utf8').matchAll(/slug:\s*"([^"]+)"/g)].map(m=>m[1]));
 for(const entry of registry.properties){
  assert.ok(ts.isPropertyAssignment(entry)&&ts.isObjectLiteralExpression(entry.initializer));
  const slug=entry.name.text;assert.ok(slugs.delete(slug),slug);
  for(const key of ['preview','demos']){
   const prop=entry.initializer.properties.find(p=>p.name?.getText(ast)===key);
   assert.ok(prop&&ts.isPropertyAssignment(prop)&&ts.isArrowFunction(prop.initializer)&&prop.initializer.parameters.length===0,slug+' '+key+' must be lazy');
  }
 }
 assert.equal(slugs.size,0);
});
