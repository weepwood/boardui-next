import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
const {BASE_SHA,HEAD_SHA,FORCE_RISK,GITHUB_OUTPUT}=process.env;
const files=BASE_SHA&&HEAD_SHA?execFileSync('git',['diff','--name-only',BASE_SHA+'...'+HEAD_SHA],{encoding:'utf8'}).trim().split('\n').filter(Boolean):[];
const risky=files.filter(p=>/^(\.github\/|packages\/|scripts\/|tests\/|reference\/|lib\/(navigation|utils|docs\/meta)|app\/(globals\.css|styles\/|layout\.tsx|components\/(docs\/|ThemeProvider|ui\/(Button|Checkbox|Radio|Switch|Select|Combobox|Dialog|Drawer|Popover|Menu|Tooltip|TreeView|Slider|DatePicker|DataGrid|DataTable|FileUpload|InputOtp|CommandPalette)))|next\.config|package(-lock)?\.json|tsconfig\.json)/.test(p));
const risk=FORCE_RISK==='true'||!BASE_SHA||!HEAD_SHA||risky.length>0;
console.log(JSON.stringify({risk,files:risky},null,2));
if(GITHUB_OUTPUT) appendFileSync(GITHUB_OUTPUT,'risk='+risk+'\n');
