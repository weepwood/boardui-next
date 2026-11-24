import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
const gate=resolve('scripts/check-evidence.mjs');
test('not-applicable requires a source, linked record and explicit rationale',()=>{
 const dir=mkdtempSync(join(tmpdir(),'boardui-evidence-'));
 try{
  mkdirSync(join(dir,'reference/evidence'),{recursive:true});
  const record={id:'divider-interaction-na',dimension:'interaction',result:'not-applicable',scope:'Noninteractive default separator contract.',reason:'Static separator has no intrinsic interactive state or action.',components:['divider'],source:'reference/evidence/source.json'};
  const entry={slug:'divider',verification:{visual:'pending',interaction:'not-applicable',accessibility:'pending',api:'pending',rtl:'pending'},evidence:[record.id]};
  writeFileSync(join(dir,record.source),'{}');
  const run=(e,r)=>{writeFileSync(join(dir,'reference/upstream-manifest.json'),JSON.stringify({components:[e],localOnly:[]}));writeFileSync(join(dir,'reference/evidence/acceptance-observations.json'),JSON.stringify({schemaVersion:1,observations:r}));return spawnSync(process.execPath,[gate],{cwd:dir,encoding:'utf8'});};
  assert.equal(run(entry,[record]).status,0);
  assert.notEqual(run({...entry,evidence:[]},[record]).status,0);
  assert.notEqual(run(entry,[{...record,reason:undefined}]).status,0);
  assert.notEqual(run(entry,[{...record,result:'partial'}]).status,0);
  assert.notEqual(run(entry,[{...record,source:'missing.json'}]).status,0);
  assert.notEqual(run({...entry,verification:{...entry.verification,rtl:'passed'}},[record]).status,0);
 }finally{rmSync(dir,{recursive:true,force:true})}
});
