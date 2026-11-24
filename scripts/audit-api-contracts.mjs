import ts from 'typescript';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,relative,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const root=process.cwd();
const manifest=JSON.parse(readFileSync('reference/upstream-manifest.json','utf8'));
const docs=JSON.parse(readFileSync('lib/docs/api-reference.generated.json','utf8'));
const entries=[...manifest.components,...manifest.localOnly];
const config=ts.readConfigFile('tsconfig.json',ts.sys.readFile);
const parsed=ts.parseJsonConfigFileContent(config.config,ts.sys,root);
const program=ts.createProgram(parsed.fileNames,parsed.options),checker=program.getTypeChecker();
const moduleExports=file=>{const source=program.getSourceFile(resolve(file));assert.ok(source,file);return checker.getExportsOfModule(checker.getSymbolAtLocation(source))};
const all=moduleExports('packages/react/index.ts');
const unalias=s=>s.flags&ts.SymbolFlags.Alias?checker.getAliasedSymbol(s):s;
const values=all.filter(s=>unalias(s).flags&ts.SymbolFlags.Value).map(s=>s.name).sort();
const packed=await import(pathToFileURL(resolve('build/library-consumer/node_modules/@weepwood/boardui-next/esm/react/index.js')).href);
assert.deepEqual(Object.keys(packed).sort(),values,'packed runtime export mismatch');
const documented=new Set(Object.values(docs).flat().map(e=>e.name));
for(const n of documented)assert.ok(values.includes(n),n);
const appNames={
 carousel:'Carousel',divider:'Divider','file-upload':'FileUpload','link-button':'LinkButton','social-button':'SocialButton','composer-panel':'ComposerPanel','composer-attachments':'ComposerAttachments','auth-card':'AuthCard','web-search':'WebSearch','task-list':'TaskList','agent-limits-card':'AgentLimitsCard',questionnaire:'Questionnaire','agent-creator':'AgentCreator',calendar:'CalendarCard','data-grid':'DataGrid','data-table':'DataTable','notification-center':'NotificationCenter','settings-modal':'SettingsModal',sidebar:'AppSidebar','search-field':'SearchField',spinner:'Spinner',skeleton:'Skeleton',accordion:'Accordion','toggle-button':'ToggleButton','tag-group':'TagGroup',modal:'ModalDialog',popover:'Popover',counter:'Counter',toast:'ToastProvider',drawer:'Drawer','number-field':'NumberField',combobox:'Combobox','time-field':'TimeField','context-menu':'ContextMenu','date-calendar':'DateCalendar','color-picker':'ColorPicker','token-input':'TokenInput','command-palette':'CommandPalette'
};
const templates={'chat-starter':'ChatStarterTemplate','multi-agent-chat':'MultiAgentChatTemplate','ai-chat':'ChatTemplate','ai-image-generation':'AiImageTemplate','ai-profile':'AiProfileTemplate','finance-dashboard':'FinanceTemplate','home-dashboard':'DashboardTemplate','marketing-dashboard':'MarketingTemplate','medical-profile':'MedicalProfileTemplate','project-board':'ProjectBoardTemplate','template:calendar':'CalendarTemplate','template:hr':'HrTemplate'};
function contract(file,name){
 const exp=moduleExports(file).find(s=>s.name===name);assert.ok(exp,file+':'+name);
 const s=unalias(exp),decl=s.valueDeclaration??s.declarations?.[0];
 const sig=checker.getSignaturesOfType(checker.getTypeOfSymbolAtLocation(s,decl),ts.SignatureKind.Call)[0];assert.ok(sig,file+':'+name);
 const param=sig.getParameters()[0];
 const props=param?checker.getPropertiesOfType(checker.getTypeOfSymbolAtLocation(param,decl)).map(p=>{
 const loc=p.valueDeclaration??p.declarations?.[0]??decl;
 return {name:p.name,optional:!!(p.flags&ts.SymbolFlags.Optional),type:checker.typeToString(checker.getTypeOfSymbolAtLocation(p,loc),loc,ts.TypeFormatFlags.NoTruncation).replaceAll(root+'/','')};
 }).sort((a,b)=>a.name.localeCompare(b.name)):[];
 return {name,source:relative(root,decl.getSourceFile().fileName),props};
}
const rows=entries.map(e=>{
 const slug=e.slug,publicApi=(docs[slug]??[]).map(x=>contract('packages/react/index.ts',x.name));
 let internalApi=[],kind='package';
 if(templates[slug]){const n=templates[slug];internalApi=[contract('app/components/templates/'+n+'.tsx',n)];kind='application-template'}
 else if(slug==='color'||slug==='typography'){
  const file='app/zh-hans/components/'+slug+'/page.tsx';
  internalApi=[contract(file,'default')];kind='design-guide';
 }else if(slug.endsWith('-card')&&/chart|rings|contributions|active-days|stage-bars|steps|sleep-score|bar-list/.test(slug)){
  internalApi=[contract('app/components/ui/ChartCard.tsx','ChartCard')];kind=publicApi.length?'package-and-application':'application';
 }else if(appNames[slug]){
  const n=appNames[slug],file=n==='ModalDialog'?'Dialog':n==='ToastProvider'?'Toast':n;
  internalApi=[contract('app/components/ui/'+file+'.tsx',n)];kind='application';
 }
 assert.ok(publicApi.length||internalApi.length,'unmapped '+slug);
 return {slug,route:e.localRoute,kind,publicApi,internalApi};
});
const contracts={};
const ref=c=>{const key=c.source+':'+c.name;contracts[key]??=c;return key};
const routeContracts=rows.map(r=>({...r,publicApi:r.publicApi.map(ref),internalApi:r.internalApi.map(ref)}));
const report={scope:'TypeScript source signatures, documented package exports and actual tarball runtime export identity; not complete behavior or upstream API parity',runtimeExports:values,documentedExports:[...documented].sort(),rows:routeContracts,contracts,limitations:['Application and template contracts are repository-local, not npm exports','Design guides expose pages, not reusable component props','Generated inventory does not verify every property behavior or parity with upstream']};
const file=process.argv[2]??'acceptance/api-contracts.json';mkdirSync(dirname(file),{recursive:true});writeFileSync(file,JSON.stringify(report,null,2)+'\n');
console.log('API inventory: '+rows.length+' routes, '+values.length+' packed runtime exports, '+documented.size+' documented exports; '+rows.filter(r=>r.internalApi.length).length+' application/guide contracts.');
