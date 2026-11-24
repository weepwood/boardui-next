import ts from "typescript";
import {readFileSync,writeFileSync} from "node:fs";
import path from "node:path";
const root=process.cwd(),entry=path.join(root,"packages/react/index.ts");
const raw=ts.readConfigFile("packages/tsconfig.build.json",ts.sys.readFile);
const parsed=ts.parseJsonConfigFileContent(raw.config,ts.sys,path.join(root,"packages"));
const program=ts.createProgram(parsed.fileNames,parsed.options);
const checker=program.getTypeChecker(),source=program.getSourceFile(entry);
const publicModule=checker.getSymbolAtLocation(source);
const groups={button:["Button","ButtonLink","AriaButton"],"icon-button":["IconButton","IconLinkButton"],"button-group":["ButtonGroup","ButtonGroupItem"],"close-button":["CloseButton"],checkbox:["Checkbox"],radio:["Radio","RadioGroup"],switch:["Switch"],input:["Input","InputBase","TextField"],textarea:["Textarea","TextareaBase"],tabs:["Tabs","TabList","Tab","TabPanel"],"segmented-control":["SegmentedControl","SegmentedControlItem"],select:["Select","SelectItem"],dropdown:["Dropdown","DropdownTrigger","DropdownPopover","DropdownGroup","DropdownItem"],tooltip:["Tooltip","TooltipTrigger"],notification:["Notification","NotificationViewport"],announcement:["Announcement"],"date-picker":["DatePicker"],slider:["Slider","RangeSlider"],"input-otp":["InputOtp"],avatar:["Avatar"],badge:["Badge"],chip:["Chip"],pagination:["Pagination"],table:["Table","TableHeader","TableColumn","TableBody","TableRow","TableCell"],"tree-view":["TreeView","TreeViewItem"],breadcrumb:["Breadcrumb","BreadcrumbItem"],"agent-thinking":["AgentThinking"],"composer-loader":["ComposerLoader"],composer:["AgentComposer"],"agent-progress":["AgentProgress"],progress:["Progress"],meter:["Meter"],"stat-cards":["StatCard"],"area-chart-card":["AreaChart"],"line-chart-card":["LineChart"],"bar-chart-card":["BarChart"],"radar-chart":["RadarChart"],"radial-chart":["RadialChart"],"funnel-chart":["FunnelChart","FunnelLegend"]};
const common=new Set(["value","defaultValue","onChange","onClick","onPress","isSelected","defaultSelected","selectedKey","defaultSelectedKey","selectedKeys","defaultSelectedKeys","onSelectionChange","isDisabled","disabled","isReadOnly","isInvalid","isRequired","isOpen","defaultOpen","onOpenChange","children","className","ref","id","name","type","aria-label","aria-labelledby","aria-describedby","href","minValue","maxValue","step","orientation","selectionMode"]);
const exports=checker.getExportsOfModule(publicModule);
const api={};
for(const [slug,names] of Object.entries(groups)){
 api[slug]=[];
 for(const name of names){
   const exp=exports.find(x=>x.name===name);if(!exp)throw Error("missing export "+name);
   const sym=(exp.flags&ts.SymbolFlags.Alias)?checker.getAliasedSymbol(exp):exp;
   const decl=sym.valueDeclaration??sym.declarations?.[0];
   const sig=checker.getSignaturesOfType(checker.getTypeOfSymbolAtLocation(sym,decl),ts.SignatureKind.Call)[0];
   const param=sig?.getParameters()[0];if(!param)continue;
   const type=checker.getTypeOfSymbolAtLocation(param,decl);
   const props=checker.getPropertiesOfType(type).filter(p=>common.has(p.name)||p.declarations?.some(d=>d.getSourceFile().fileName.startsWith(path.join(root,"packages"))));
   const rows=props.map(p=>{
     const loc=p.valueDeclaration??p.declarations?.[0]??decl;
     const pt=checker.getTypeOfSymbolAtLocation(p,loc);
     return {name:p.name,type:checker.typeToString(pt,loc,ts.TypeFormatFlags.NoTruncation).replace(/ \| undefined$/,"").replace(/import\(".*?\/node_modules\/([^"]+)"\)/g,'import("$1")'),optional:!!(p.flags&ts.SymbolFlags.Optional),description:ts.displayPartsToString(p.getDocumentationComment(checker))};
   }).sort((a,b)=>Number(a.optional)-Number(b.optional)||a.name.localeCompare(b.name));
   api[slug].push({name,source:decl.getSourceFile().fileName.startsWith(path.join(root,"packages"))?path.relative(root,decl.getSourceFile().fileName):"packages/react/index.ts",props:rows});
 }
}
const out=JSON.stringify(api,null,2)+"\n",file="lib/docs/api-reference.generated.json";
if(process.argv.includes("--check")){if(readFileSync(file,"utf8")!==out)throw Error("API reference out of date: npm run docs:api");}
else writeFileSync(file,out);
console.log(Object.keys(api).length+" component API groups; "+Object.values(api).flat().length+" callable exports");
