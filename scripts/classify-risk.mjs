import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync, existsSync } from 'node:fs';
const {BASE_SHA,HEAD_SHA,FORCE_RISK,GITHUB_OUTPUT}=process.env;
const files=BASE_SHA&&HEAD_SHA?execFileSync('git',['diff','--name-only',BASE_SHA+'...'+HEAD_SHA],{encoding:'utf8'}).trim().split('\n').filter(Boolean):[];
const risky=files.filter(p=>/^(\.github\/|packages\/|scripts\/|tests\/|reference\/|lib\/(navigation|utils|docs\/meta)|app\/(globals\.css|styles\/|layout\.tsx|components\/(docs\/|ThemeProvider|ui\/(Button|IconButton|CloseButton|Checkbox|Radio|Switch|Select|Combobox|Dialog|Drawer|Popover|Menu|Tooltip|TreeView|Slider|DatePicker|DataGrid|DataTable|FileUpload|InputOtp|CommandPalette)))|next\.config|package(-lock)?\.json|tsconfig\.json)/.test(p));
const known=new Set([...readFileSync('lib/docs/meta.ts','utf8').matchAll(/slug:\s*"([^"]+)"/g)].map(m=>m[1]));
const kebab=s=>s.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();
const aliases={menu:'dropdown',dialog:'modal','app-sidebar':'sidebar'};
const routes=new Set();
if(files.some(p=>/^(packages\/react\/(avatar|badge|chip|status-dot|pagination|table|tree-view|progress-styles)|app\/components\/ui\/(Avatar|Badge|Chip|Pagination|Table|DataGrid|DataTable|TreeView|FileUpload|Progress|Meter))/.test(p)))for(const slug of ["avatar","badge","chip","pagination","table","data-grid","data-table","tree-view","file-upload","progress","meter","notification"])if(known.has(slug))routes.add("/zh-hans/components/"+slug+"/");
if(files.some(p=>/^(packages\/react\/(date-picker|calendar-shared|date-adapter|field-styles|slider|input-otp)|app\/components\/ui\/(DatePicker|DateCalendar|TimeField|NumberField|Slider|InputOtp|ColorPicker|TokenInput))/.test(p)))for(const slug of ["date-picker","date-calendar","time-field","number-field","slider","input-otp","color-picker","token-input"])if(known.has(slug))routes.add("/zh-hans/components/"+slug+"/");
if(files.some(p=>/^(packages\/react\/(announcement|notification|overlay-styles)|app\/components\/ui\/(Dialog|Drawer|Accordion|Collapsible|Toast|Notification|Announcement))/.test(p)))for(const slug of ["modal","drawer","accordion","toast","notification","announcement"])if(known.has(slug))routes.add("/zh-hans/components/"+slug+"/");
if(files.some(p=>/^(packages\/react\/(tabs|segmented-control|select|dropdown|menu-styles|tooltip|direction|chevrons)|app\/components\/ui\/(Tabs|SegmentedControl|Select|Combobox|Menu|Tooltip|Popover))/.test(p)))for(const slug of ['tabs','segmented-control','select','combobox','dropdown','tooltip','popover'])if(known.has(slug))routes.add('/zh-hans/components/'+slug+'/');
if(files.some(p=>/^(packages\/react\/(svg-icon|icon-registry|directional-icon)|app\/components\/ui\/Icon\.tsx)/.test(p))) for(const slug of ['button','icon-button','button-group','close-button','checkbox','radio','switch','input','date-calendar'])if(known.has(slug))routes.add('/zh-hans/components/'+slug+'/');
for(const p of files){const core=p.match(/^packages\/react\/([^/]+)\.tsx$/);if(core&&known.has(core[1]))routes.add('/zh-hans/components/'+core[1]+'/');}
for(const p of files){
  const ui=p.match(/^app\/components\/ui\/([^/]+)\.tsx$/);
  if(ui){const slug=aliases[kebab(ui[1])]||kebab(ui[1]);if(known.has(slug)) routes.add('/zh-hans/components/'+slug+'/');}
  const tpl=p.match(/^app\/components\/templates\/([^/]+)Template\.tsx$/);
  if(tpl&&existsSync('app/zh-hans/templates/'+kebab(tpl[1])+'/page.tsx'))routes.add('/zh-hans/templates/'+kebab(tpl[1])+'/');
}
const risk=FORCE_RISK==='true'||!BASE_SHA||!HEAD_SHA||risky.length>0;
console.log(JSON.stringify({risk,files:risky},null,2));
if(GITHUB_OUTPUT) appendFileSync(GITHUB_OUTPUT,'risk='+risk+'\n'+'routes='+JSON.stringify([...routes])+'\n');
