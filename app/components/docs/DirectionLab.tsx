"use client";
import {useState} from "react";
import {RiArrowRightLine} from "@remixicon/react";
import {DirectionProvider,Button,Input,Tabs,TabList,Tab,TabPanel,SegmentedControl,SegmentedControlItem,Select,SelectItem,Slider,Pagination,Breadcrumb,BreadcrumbItem,Dropdown,DropdownTrigger,DropdownPopover,DropdownItem,Radio,RadioGroup} from "@/packages/react";

export function DirectionLab(){
 const [rtl,setRtl]=useState(true),[tab,setTab]=useState("first"),[segment,setSegment]=useState("first"),[page,setPage]=useState(2),[volume,setVolume]=useState(40),[selection,setSelection]=useState("a"),[action,setAction]=useState(""),[radio,setRadio]=useState("a");
 return <section className="flex min-w-0 flex-col gap-4" aria-label="方向交互实验室">
 <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-title-2-medium">方向交互实验室</h2><Button variant="secondary" aria-pressed={rtl} onClick={()=>setRtl(v=>!v)}>切换为 {rtl?"LTR":"RTL"}</Button></div>
 <p className="text-body-regular text-text-secondary">使用真实组件验证镜像图标、方向键、浮层、数值及逻辑布局；切换方向时保留所有受控状态。</p>
 <DirectionProvider locale={rtl?"ar":"zh-CN"} data-testid="direction-lab" className="flex min-w-0 flex-col gap-5 rounded-3xl border border-border-component-detail-container bg-background-primary-default p-4 sm:p-6">
 <div className="flex flex-wrap items-center justify-between gap-3"><Breadcrumb aria-label="示例路径"><BreadcrumbItem>首页</BreadcrumbItem><BreadcrumbItem current>设置</BreadcrumbItem></Breadcrumb><Button trailingIcon={RiArrowRightLine}>下一步</Button></div>
 <Tabs selectedKey={tab} onSelectionChange={k=>setTab(String(k))}><TabList aria-label="方向选项卡"><Tab id="first">概览</Tab><Tab id="second">活动</Tab><Tab id="third">设置</Tab></TabList>{["first","second","third"].map((id,i)=><TabPanel id={id} key={id}><p className="text-body-regular">当前面板：{i+1}</p></TabPanel>)}</Tabs>
 <div className="flex flex-wrap items-center gap-4"><SegmentedControl aria-label="时间范围" selectedKeys={[segment]} onSelectionChange={keys=>setSegment(String([...keys][0]??"first"))}><SegmentedControlItem id="first">日</SegmentedControlItem><SegmentedControlItem id="second">周</SegmentedControlItem><SegmentedControlItem id="third">月</SegmentedControlItem></SegmentedControl>
 <Select aria-label="地区" selectedKey={selection} onSelectionChange={k=>setSelection(String(k))}><SelectItem id="a">亚洲</SelectItem><SelectItem id="b">欧洲</SelectItem></Select>
 <Dropdown><DropdownTrigger className="rounded-2lg border border-border-button-default px-3 py-2 text-body-medium">操作菜单</DropdownTrigger><DropdownPopover aria-label="方向操作"><DropdownItem onSelect={()=>setAction("编辑")}>编辑</DropdownItem></DropdownPopover></Dropdown></div>
 <div className="grid min-w-0 gap-4 sm:grid-cols-2"><Input label="电子邮箱" type="email" defaultValue="example@example.com" hint="邮箱保持 LTR"/><RadioGroup aria-label="单选方向" value={radio} onChange={setRadio} orientation="horizontal"><Radio value="a">A</Radio><Radio value="b">B</Radio></RadioGroup></div>
 <Slider label="音量" thumbLabel="方向音量" value={volume} onChange={setVolume} minValue={0} maxValue={100}/>
 <Pagination page={page} totalPages={8} onChange={setPage}/>
 <output data-testid="direction-state" className="break-words rounded-lg bg-background-secondary-default p-2 text-body-2-regular" aria-live="polite">{[tab,segment,selection,radio,volume,page,action||"—"].join(" / ")}</output>
 </DirectionProvider>
 </section>;
}
