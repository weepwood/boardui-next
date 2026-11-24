import {readFileSync} from 'node:fs';
import {resolve,join,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {routes,profiles,themes} from './visual-candidate-scope.mjs';
const dir=resolve(process.argv[2]??'acceptance/visual-candidate');
const m=JSON.parse(readFileSync(join(dir,'manifest.json'),'utf8'));
const sha=process.env.GITHUB_SHA??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
assert.equal(m.schemaVersion,1);assert.equal(m.sha,sha);assert.equal(m.status,'candidate-unreviewed');
assert.ok(m.browserVersion&&m.platform&&m.arch);
assert.equal(m.browser,'chromium');assert.deepEqual(m.themes,themes);assert.deepEqual(m.profiles,profiles);assert.deepEqual(m.routes,routes);
const key=(theme,viewport,route)=>JSON.stringify([theme,viewport.width,viewport.height,route]);
const expected=new Set(m.themes.flatMap(t=>m.profiles.flatMap(p=>m.routes.map(r=>key(t,p,r)))));
assert.ok(expected.size>0);
assert.equal(m.rows.length,expected.size);
const files=new Set();
for(const row of m.rows){
 assert.ok(expected.delete(key(row.theme,row.viewport,row.route)),'unknown or duplicate screenshot');
 assert.equal(row.status,'captured');
 assert.equal(row.file,basename(row.file));assert.ok(!files.has(row.file));files.add(row.file);
 const bytes=readFileSync(join(dir,row.file));assert.equal(bytes.length,row.bytes);assert.equal(bytes.subarray(0,8).toString("hex"),"89504e470d0a1a0a");
 assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);
 assert.equal(bytes.readUInt32BE(16),row.viewport.width);assert.equal(bytes.readUInt32BE(20),row.viewport.height);
}
assert.equal(expected.size,0);
console.log('Verified '+files.size+' candidate screenshot identities, dimensions and SHA-256 hashes; no visual approval implied.');
