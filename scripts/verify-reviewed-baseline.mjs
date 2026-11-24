import {readFileSync} from 'node:fs';
import {resolve,dirname,join} from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';

const review=JSON.parse(readFileSync(process.argv[2]??'reference/evidence/reviewed-initial-baseline-20261125.json','utf8'));
assert.equal(review.schemaVersion,1);
assert.equal(review.status,'reviewed-initial-regression-baseline');
assert.match(review.sourceCommit,/^[0-9a-f]{40}$/);
const manifestPath=resolve(review.candidateManifest);
const bytes=readFileSync(manifestPath);
assert.equal(createHash('sha256').update(bytes).digest('hex'),review.candidateManifestSha256);
const manifest=JSON.parse(bytes);
assert.equal(manifest.sha,review.sourceCommit);
execFileSync(process.execPath,['scripts/verify-visual-candidate.mjs',dirname(manifestPath)],{env:{...process.env,GITHUB_SHA:review.sourceCommit},stdio:'inherit'});
const key=row=>JSON.stringify([row.route,row.theme,row.viewport.width,row.viewport.height]);
const rows=new Map(manifest.rows.map(row=>[key(row),row]));
assert.equal(review.rows.length,rows.size);
for(const row of review.rows){
 const original=rows.get(key(row));assert.ok(original,'missing or duplicate reviewed screenshot');
 assert.equal(row.file,original.file);assert.equal(row.sha256,original.sha256);
 assert.equal(row.decision,'retain-for-regression');assert.ok(row.note.trim().length>0);
 rows.delete(key(row));
}
assert.equal(rows.size,0);
console.log('Reviewed initial regression baseline verified; not upstream parity or formal component approval.');
