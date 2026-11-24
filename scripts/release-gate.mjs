import { readFileSync } from 'node:fs';
import './check-evidence.mjs';
const manifest=JSON.parse(readFileSync('reference/upstream-manifest.json','utf8'));
const pending=[...manifest.components,...manifest.localOnly].filter(e=>!e.evidence.length||Object.values(e.verification).some(s=>!['passed','not-applicable'].includes(s)));
if(pending.length){console.error('正式发布尚未通过逐组件验收：'+pending.map(e=>e.slug).join(', '));process.exitCode=1;}
else console.log('Component acceptance evidence gate passed');
