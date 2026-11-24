import React, {useState} from "react";
import {createRoot} from "react-dom/client";
import "@weepwood/boardui-next/styles.css";
import {Button,Input,Switch,DirectionProvider,StatCard,AreaChart,Progress} from "@weepwood/boardui-next";

function App(){
 const [dark,setDark]=useState(false),[rtl,setRtl]=useState(false),[name,setName]=useState("示例项目"),[saved,setSaved]=useState("");
 return <DirectionProvider locale={rtl?"ar":"zh-CN"}><main style={{maxWidth:680,margin:"auto",padding:24,display:"grid",gap:16}}>
 <h1 className="text-title-1-medium text-text-primary">BoardUI Next</h1>
 <p className="text-body-regular text-text-secondary">从本地 tarball 安装的独立 React 应用</p>
 <Switch isSelected={dark} onChange={v=>{setDark(v);document.documentElement.classList.toggle("dark",v)}}>深色主题</Switch>
 <Switch isSelected={rtl} onChange={setRtl}>RTL</Switch>
 <Input label="名称" value={name} onChange={setName}/>
 <Button onClick={()=>setSaved(name)}>保存</Button>
 <output aria-live="polite">{saved}</output>
 <StatCard label="示例收入" value="¥2,400" spark={[2,4,3,6]}/>
 <AreaChart data={[4,7,-1,5]}/><Progress aria-label="任务进度" value={60}/>
 </main></DirectionProvider>;
}
createRoot(document.getElementById("root")).render(<App/>);
