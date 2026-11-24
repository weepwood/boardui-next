import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import "@weepwood/boardui-next/styles.css";
import {Button,Input,Switch,DirectionProvider,StatCard,AreaChart,Progress,ButtonGroup,ButtonGroupItem,IconButton,CloseButton,AriaButton,Checkbox,Radio,RadioGroup,Textarea,Select,SelectItem,Tabs,TabList,Tab,TabPanel,Pagination,FunnelChart,Meter,Notification,Announcement} from "@weepwood/boardui-next";

const Glyph=({className,...props})=><svg viewBox="0 0 20 20" className={className} {...props}><path d="M5 10h10m-5-5v10" stroke="currentColor" fill="none"/></svg>;
function App(){
 const [count,setCount]=useState(0),[pressed,setPressed]=useState(false);
 const [formResult,setFormResult]=useState(""),[pages,setPages]=useState(1),[page,setPage]=useState(1);
 const [actionCount,setActionCount]=useState(0),[dismissCount,setDismissCount]=useState(0);
 const [dark,setDark]=useState(false),[rtl,setRtl]=useState(false),[name,setName]=useState("示例项目"),[saved,setSaved]=useState("");
 return <DirectionProvider locale={rtl?"ar":"zh-CN"}><main style={{maxWidth:680,margin:"auto",padding:24,display:"grid",gap:16}}>
 <h1 className="text-title-1-medium text-text-primary">BoardUI Next</h1>
 <p className="text-body-regular text-text-secondary">从本地 tarball 安装的独立 React 应用</p>
 <Switch isSelected={dark} onChange={v=>{setDark(v);document.documentElement.classList.toggle("dark",v)}}>深色主题</Switch>
 <Switch isSelected={rtl} onChange={setRtl}>RTL</Switch>
 <Input label="名称" value={name} onChange={setName}/>
 <Button onClick={()=>setSaved(name)}>保存</Button>
 <output aria-live="polite">{saved}</output>
 <ButtonGroup size="small" aria-label="消费按钮组"><ButtonGroupItem selected={pressed} onClick={()=>setPressed(v=>!v)}>切换</ButtonGroupItem><ButtonGroupItem disabled>不可用</ButtonGroupItem><ButtonGroupItem iconOnly leadingIcon={Glyph} aria-label="更多"/></ButtonGroup>
 <div className="flex items-center gap-3"><Button iconOnly variant="secondary" leadingIcon={Glyph} aria-label="原生增加" onClick={()=>setCount(n=>n+1)}/><AriaButton iconOnly variant="secondary" leadingIcon={Glyph} aria-label="ARIA 增加" onPress={()=>setCount(n=>n+1)}/><IconButton icon={Glyph} aria-label="禁用增加" disabled onClick={()=>setCount(n=>n+100)}/><CloseButton aria-label="重置" onClick={()=>setCount(0)}/><output data-testid="button-count">{count}</output></div>
 <form aria-label="独立表单" onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);setFormResult(JSON.stringify(Object.fromEntries(data)))}}>
 <Input label="联系邮箱" name="email" type="email" isRequired/>
 <Textarea label="备注" name="notes" rows={2}/>
 <Checkbox name="accepted" value="yes">接受条款</Checkbox>
 <RadioGroup aria-label="方案" name="plan" defaultValue="a"><Radio value="a">方案 A</Radio><Radio value="b">方案 B</Radio></RadioGroup>
 <Select aria-label="地区" name="region" defaultSelectedKey="east"><SelectItem id="east">东区</SelectItem><SelectItem id="west">西区</SelectItem></Select>
 <Button type="submit">提交独立表单</Button><output data-testid="form-result">{formResult}</output>
 </form>
 <Tabs defaultSelectedKey="a"><TabList aria-label="消费标签"><Tab id="a">概览</Tab><Tab id="b">详情</Tab></TabList><TabPanel id="a">概览内容</TabPanel><TabPanel id="b">详情内容</TabPanel></Tabs>
 <div style={{width:220}}><Button onClick={()=>{setPages(v=>v===1?20:1);setPage(1)}}>切换分页数量</Button><Pagination page={page} totalPages={pages} onChange={setPage}/></div>
 <section aria-label="组件边界">
 <FunnelChart steps={[{label:"零基线",value:0},{label:"无效值",value:NaN},{label:"后续",value:8}]}/>
 <div data-testid="empty-funnel"><FunnelChart steps={[]}/></div>
 <Meter label="无效容量" value={Infinity} max={0}/>
 <Announcement title="消费公告" actionLabel="执行公告" onAction={()=>setActionCount(v=>v+1)} dismissible closeLabel="关闭消费公告" onClose={()=>setDismissCount(v=>v+1)}/>
 <Notification title="消费通知" actions={[{label:"执行通知",onClick:()=>setActionCount(v=>v+1)}]} closeLabel="关闭消费通知" onDismiss={()=>setDismissCount(v=>v+1)}/>
 <output data-testid="notice-count">{actionCount} / {dismissCount}</output>
 </section>
 <StatCard label="示例收入" value="¥2,400" spark={[2,4,3,6]}/>
 <AreaChart data={[4,7,-1,5]}/><Progress aria-label="任务进度" value={60}/>
 </main></DirectionProvider>;
}
createRoot(document.getElementById("root")).render(<App/>);
