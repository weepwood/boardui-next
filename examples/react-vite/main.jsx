import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import "@weepwood/boardui-next/styles.css";
import {Button,Input,Switch,DirectionProvider,StatCard,AreaChart,Progress,ButtonGroup,ButtonGroupItem,IconButton,CloseButton,AriaButton} from "@weepwood/boardui-next";

const Glyph=({className,...props})=><svg viewBox="0 0 20 20" className={className} {...props}><path d="M5 10h10m-5-5v10" stroke="currentColor" fill="none"/></svg>;
function App(){
 const [count,setCount]=useState(0),[pressed,setPressed]=useState(false);
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
 <StatCard label="示例收入" value="¥2,400" spark={[2,4,3,6]}/>
 <AreaChart data={[4,7,-1,5]}/><Progress aria-label="任务进度" value={60}/>
 </main></DirectionProvider>;
}
createRoot(document.getElementById("root")).render(<App/>);
