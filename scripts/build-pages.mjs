import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, ['node_modules/next/dist/bin/next','build'], {
  stdio:'inherit', env:{...process.env,PAGES_EXPORT:'1',PAGES_BASE_PATH:'/boardui-next'}
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
