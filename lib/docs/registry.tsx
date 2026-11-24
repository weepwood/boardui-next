"use client";
import { RiDeleteBinLine } from "@remixicon/react";
import { RiMoreLine } from "@remixicon/react";
import { RiNotification3Line } from "@remixicon/react";

/**
 * 组件文档注册表。
 * 每个条目包含：标题、描述、预览演示、分节演示、代码示例。
 * 演示通过惰性工厂创建：共享模块保留缓存，只创建当前需要的 JSX。
 */
import { useState } from "react";
import { Select as FilterSelect, SelectItem as FilterOption } from "@/packages/react/select";
import { Toolbar } from "@/packages/react/toolbar";
import { AgentComposer } from "@/packages/react/agent-composer";
import { Chip as StatusChip } from "@/packages/react/chip";
import { StatusDot } from "@/packages/react/status-dot";
import { Avatar as CoreAvatar } from "@/packages/react/avatar";
import { DialogTrigger, Dialog } from "react-aria-components";
import { Dropdown, DropdownTrigger, DropdownPopover, DropdownGroup, DropdownItem, DropdownDivider } from "@/packages/react/dropdown";
import { RiMailLine, RiSearchLine, RiAddLine as AddGlyph, RiEditLine as EditGlyph, RiArrowRightLine as ArrowGlyph } from "@remixicon/react";
import type { ReactNode } from "react";

import { Button } from "@/app/components/ui/Button";
import { AriaButton, Button as NativeButton, ButtonLink, IconButton as CoreIconButton, ButtonGroup as CoreButtonGroup, ButtonGroupItem, CloseButton as CoreCloseButton } from "@/packages/react";
import { IconButton } from "@/app/components/ui/IconButton";
import { Chip } from "@/app/components/ui/Chip";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";
import { SearchField } from "@/app/components/ui/SearchField";
import { Switch } from "@/app/components/ui/Switch";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { Radio, RadioGroup } from "@/app/components/ui/Radio";
import { Select } from "@/app/components/ui/Select";
import { Slider, RangeSlider } from "@/app/components/ui/Slider";
import { Badge } from "@/app/components/ui/Badge";
import { Avatar } from "@/app/components/ui/Avatar";
import { Progress } from "@/app/components/ui/Progress";
import { Spinner } from "@/app/components/ui/Spinner";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { Divider } from "@/app/components/ui/Divider";
import { Icon } from "@/app/components/ui/Icon";
import { Tabs, TabList, Tab, TabPanel, TabCount } from "@/app/components/ui/Tabs";
import { Collapsible } from "@/app/components/ui/Collapsible";
import { Notification as CoreNotification } from "@/packages/react/notification";
import { Announcement as CoreAnnouncement } from "@/packages/react/announcement";
import { Accordion, AccordionItem } from "@/app/components/ui/Accordion";
import { Tooltip, TooltipTrigger } from "@/app/components/ui/Tooltip";
import { ToggleButtonGroup, ToggleButton } from "@/app/components/ui/ToggleButton";
import { TagGroup, Tag } from "@/app/components/ui/TagGroup";
import { MenuTrigger, Menu, BMenuItem } from "@/app/components/ui/Menu";
import { Popover } from "@/app/components/ui/Popover";
import { ModalDialog, DialogBody, DialogFooter } from "@/app/components/ui/Dialog";
import { Breadcrumb } from "@/app/components/ui/Breadcrumb";
import { Pagination } from "@/app/components/ui/Pagination";
import { Counter } from "@/app/components/ui/Counter";
import { Announcement } from "@/app/components/ui/Announcement";
import { Notification } from "@/app/components/ui/Notification";
import { ToastProvider, useToast } from "@/app/components/ui/Toast";
import { Drawer } from "@/app/components/ui/Drawer";
import { NumberField } from "@/app/components/ui/NumberField";
import { Combobox } from "@/app/components/ui/Combobox";
import { Table } from "@/app/components/ui/Table";
import { TreeView } from "@/app/components/ui/TreeView";
import { Carousel } from "@/app/components/ui/Carousel";
import { Meter } from "@/app/components/ui/Meter";
import { FileUpload } from "@/app/components/ui/FileUpload";
import { ButtonGroup } from "@/app/components/ui/ButtonGroup";
import { CloseButton } from "@/app/components/ui/CloseButton";
import { LinkButton } from "@/app/components/ui/LinkButton";
import { SegmentedControl } from "@/app/components/ui/SegmentedControl";
import { InputOtp } from "@/app/components/ui/InputOtp";
import { TimeField } from "@/app/components/ui/TimeField";
import { SocialButton } from "@/app/components/ui/SocialButton";
import { ContextMenu } from "@/app/components/ui/ContextMenu";
import { DateCalendar, formatDate } from "@/app/components/ui/DateCalendar";
import { DatePicker } from "@/app/components/ui/DatePicker";
import { ColorPicker } from "@/app/components/ui/ColorPicker";
import { TokenInput } from "@/app/components/ui/TokenInput";
import { CommandPalette } from "@/app/components/ui/CommandPalette";
import { Composer } from "@/app/components/ui/Composer";
import { ComposerAttachments } from "@/app/components/ui/ComposerAttachments";
import { ComposerLoader } from "@/app/components/ui/ComposerLoader";
import { ComposerPanel } from "@/app/components/ui/ComposerPanel";
import { AgentCreator } from "@/app/components/ui/AgentCreator";
import { AgentLimitsCard } from "@/app/components/ui/AgentLimitsCard";
import { AgentProgress } from "@/app/components/ui/AgentProgress";
import { AgentThinking } from "@/app/components/ui/AgentThinking";
import { AuthCard } from "@/app/components/ui/AuthCard";
import { CalendarCard } from "@/app/components/ui/CalendarCard";
import { DataTable } from "@/app/components/ui/DataTable";
import { DataGrid } from "@/app/components/ui/DataGrid";
import { NotificationCenter } from "@/app/components/ui/NotificationCenter";
import { Questionnaire } from "@/app/components/ui/Questionnaire";
import { SettingsModal } from "@/app/components/ui/SettingsModal";
import { AppSidebar } from "@/app/components/ui/AppSidebar";
import { StatCards } from "@/app/components/ui/StatCards";
import { TaskList } from "@/app/components/ui/TaskList";
import { WebSearch } from "@/app/components/ui/WebSearch";
import { ChartCard } from "@/app/components/ui/ChartCard";




export type Demo = {
  id: string;
  title: string;
  description?: string;
  code?: string;
  minHeight?: number;
  node: ReactNode;
};

export type Doc = {
  title: string;
  description: string;
  install?: string;
  previewCode?: string;
  preview: () => ReactNode;
  demos: () => Demo[];
};

/* ---------------- 交互式包装组件 ---------------- */

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开弹窗</Button>
      <ModalDialog
        isOpen={open}
        onOpenChange={setOpen}
        title="邀请团队成员"
        description="他们会收到一封电子邮件，其中包含加入工作区的链接。"
      >
        <DialogBody>
          <Input label="邮箱地址" type="email" placeholder="输入邮箱地址…"/>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={() => setOpen(false)}>发送邀请</Button>
        </DialogFooter>
      </ModalDialog>
    </>
  );
}

function MenuDemo() {
  return (
    <MenuTrigger>
      <Button
        variant="secondary"
        trailing={<Icon name="arrow-down-s-line" className="size-4" />}
      >
        操作菜单
      </Button>
      <Popover>
        <Menu aria-label="操作菜单">
          <BMenuItem id="edit" label="编辑" icon="edit-line" shortcut="⌘E" />
          <BMenuItem id="copy" label="复制链接" icon="link" shortcut="⌘C" />
          <BMenuItem id="share" label="分享" icon="share-line" />
          <BMenuItem id="delete" label="删除" icon="delete-bin-line" danger />
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

function SelectDemo() {
  const [v, setV] = useState("react");
  return (
    <div className="w-full max-w-xs">
      <Select
        label="框架"
        selectedKey={v}
        onSelectionChange={(x) => setV(String(x))}
        options={[
          { id: "react", label: "React", icon: "reactjs-line" },
          { id: "vue", label: "Vue", icon: "vuejs-line" },
          { id: "svelte", label: "Svelte", icon: "code-s-slash-line" },
        ]}
      />
    </div>
  );
}

/* ---------------- 文档注册表 ---------------- */

function ControlledSelectionDemo() {
  const [checked,setChecked]=useState(false);
  const [enabled,setEnabled]=useState(false);
  const [choice,setChoice]=useState("a");
  return <div className="flex flex-col gap-3" data-testid="controlled-selection"><Checkbox isSelected={checked} onChange={setChecked}>受控复选框</Checkbox><Switch isSelected={enabled} onChange={setEnabled}>受控开关</Switch><RadioGroup value={choice} onChange={setChoice} label="受控单选"><Radio value="a">选项 A</Radio><Radio value="b">选项 B</Radio></RadioGroup><output aria-live="polite">{String(checked)} / {String(enabled)} / {choice}</output></div>;
}

function PeriodButtonGroupDemo(){
 const [value,setValue]=useState("month");
 return <CoreButtonGroup aria-label="时间范围">{[["day","日"],["week","周"],["month","月份"],["year","年份"]].map(([id,label])=><ButtonGroupItem key={id} selected={value===id} onClick={()=>setValue(id)}>{label}</ButtonGroupItem>)}</CoreButtonGroup>;
}
function ButtonFamilyDemo() {
  const [selection,setSelection]=useState("left");
  const [count,setCount]=useState(0);
  return <div className="flex flex-col gap-3" data-testid="button-family"><CoreButtonGroup aria-label="对齐方式"><ButtonGroupItem selected={selection==="left"} onClick={()=>setSelection("left")}>左</ButtonGroupItem><ButtonGroupItem selected={selection==="center"} onClick={()=>setSelection("center")}>中</ButtonGroupItem><ButtonGroupItem selected={selection==="right"} onClick={()=>setSelection("right")}>右</ButtonGroupItem></CoreButtonGroup><div className="flex items-center gap-2"><CoreIconButton icon={AddGlyph} aria-label="增加计数" onClick={()=>setCount(n=>n+1)}/><CoreCloseButton aria-label="重置计数" onClick={()=>setCount(0)}/><output aria-live="polite">{selection} / {count}</output></div></div>;
}

function ControlledFormDemo() {
  const [value,setValue]=useState("");
  const [notes,setNotes]=useState("");
  const [search,setSearch]=useState("");
  return <div data-testid="form-fields" className="flex w-full max-w-sm flex-col gap-4">
    <Input label="受控邮箱" type="email" value={value} onChange={setValue} isRequired leadingIcon={RiMailLine} hint="输入有效邮箱" />
    <Textarea label="受控备注" value={notes} onChange={setNotes} rows={2} autoResize maxRows={5} maxLength={100} showCount />
    <SearchField aria-label="受控搜索" value={search} onChange={setSearch} />
    <output aria-live="polite">{value} / {notes.length} / {search}</output>
  </div>;
}
function DropdownSurfaceDemo(){
  const [open,setOpen]=useState(false);
  const [action,setAction]=useState("尚未操作");
  return <div className="flex flex-col items-center gap-3"><Dropdown isOpen={open} onOpenChange={setOpen}>
    <DropdownTrigger className="rounded-2lg border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium shadow-xs">打开分组菜单</DropdownTrigger>
    <DropdownPopover aria-label="分组操作"><DropdownGroup label="项目"><DropdownItem onSelect={()=>{setAction("编辑");setOpen(false)}}><Icon name="edit-line" className="size-5"/>编辑</DropdownItem><DropdownItem onSelect={()=>{setAction("分享");setOpen(false)}}><Icon name="share-line" className="size-5"/>分享</DropdownItem></DropdownGroup><DropdownDivider/><DropdownItem onSelect={()=>{setAction("删除");setOpen(false)}} className="text-text-error-primary">删除</DropdownItem></DropdownPopover>
  </Dropdown><output aria-live="polite">{action}</output></div>;
}
function PopoverDemo(){
  return <DialogTrigger><Button variant="secondary">打开浮层</Button><Popover className="w-64"><Dialog aria-label="设置浮层" className="flex flex-col gap-3 outline-none"><p className="text-body-medium">快速设置</p><Input label="名称" placeholder="输入名称"/><Button slot="close" variant="secondary">关闭</Button></Dialog></Popover></DialogTrigger>;
}
function ToolbarDemo(){
  const [last,setLast]=useState("—");
  return <div className="flex flex-col items-center gap-2"><Toolbar aria-label="编辑工具栏" actions={[{id:"undo",label:"撤销",icon:"arrow-go-back-line",onAction:()=>setLast("撤销")},{id:"redo",label:"重做",icon:"arrow-go-forward-line",onAction:()=>setLast("重做")},{id:"copy",label:"复制",icon:"file-copy-line",onAction:()=>setLast("复制")}]}/><output>操作：{last}</output></div>;
}
function FreeComposerDemo(){
  const [value,setValue]=useState(""),[busy,setBusy]=useState(false),[count,setCount]=useState(0);
  return <div className="w-full max-w-lg"><AgentComposer value={value} onValueChange={setValue} busy={busy} onStop={()=>setBusy(false)} onSubmit={()=>{setCount(c=>c+1);setValue("");setBusy(true)}} messageCount={count}/><p className="mt-2 text-caption-1-regular text-text-tertiary">本地交互演示，未连接模型服务。</p></div>;
}
export const docs: Record<string, Doc> = {
  button: {
    title: "按钮",
    description: "与 BoardUI 设计系统匹配的按钮，提供主要、次要、幽灵及危险四种变体和三种尺寸，支持前导与尾随图标、纯图标模式，以及悬停、按下、焦点和禁用的语义交互状态。",
    previewCode: `import { Button } from "@weepwood/boardui-next";
import { RiArrowRightLine } from "@remixicon/react";
<Button>开始使用</Button>
<Button variant="secondary" trailingIcon={RiArrowRightLine}>继续</Button>
<Button variant="ghost">标记为已完成</Button>
<Button variant="danger">删除</Button>`,
    preview: () => (<><NativeButton>开始使用</NativeButton><NativeButton variant="secondary" trailingIcon={ArrowGlyph}>继续</NativeButton><NativeButton variant="ghost">标记为已完成</NativeButton><NativeButton variant="danger">删除</NativeButton></>),
    demos: () => ([
      {id:"variants",title:"变体",code:`<Button>按钮文字</Button>
<Button variant="secondary">按钮文字</Button>
<Button variant="ghost">按钮文字</Button>
<Button variant="danger">按钮文字</Button>`,node:<><NativeButton>按钮文字</NativeButton><NativeButton variant="secondary">按钮文字</NativeButton><NativeButton variant="ghost">按钮文字</NativeButton><NativeButton variant="danger">按钮文字</NativeButton></>},
      {id:"sizes",title:"尺寸",code:`<Button size="medium">中</Button>
<Button size="small">小</Button>
<Button size="xs">Xs</Button>`,node:<><NativeButton size="medium">中</NativeButton><NativeButton size="small">小</NativeButton><NativeButton size="xs">Xs</NativeButton><NativeButton iconOnly leadingIcon={AddGlyph} aria-label="添加" size="medium"/><NativeButton iconOnly leadingIcon={AddGlyph} aria-label="添加" size="small"/><NativeButton iconOnly leadingIcon={AddGlyph} aria-label="添加" size="xs"/></>},
      {id:"icons",title:"图标",code:`<Button leadingIcon={AddGlyph}>新项目</Button>
<Button variant="secondary" trailingIcon={RiArrowRightLine}>继续</Button>
<Button variant="secondary" iconOnly leadingIcon={AddGlyph} aria-label="添加" />`,node:<><NativeButton leadingIcon={AddGlyph}>新项目</NativeButton><NativeButton variant="secondary" trailingIcon={ArrowGlyph}>继续</NativeButton><NativeButton variant="secondary" iconOnly leadingIcon={AddGlyph} aria-label="添加"/></>},
      {id:"disabled",title:"禁用",code:`<Button disabled>按钮文字</Button>
<Button variant="secondary" disabled>按钮文字</Button>`,node:<><NativeButton disabled>按钮文字</NativeButton><NativeButton variant="secondary" disabled>按钮文字</NativeButton><NativeButton variant="ghost" disabled>按钮文字</NativeButton><NativeButton variant="danger" disabled>按钮文字</NativeButton></>},
      {id:"native",title:"扩展接口：原生链接和 React Aria",node:<><AriaButton>AriaButton</AriaButton><ButtonLink href={(process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/zh-hans/components/"} variant="secondary">查看组件</ButtonLink></>},
      {id:"legacy",title:"旧版兼容接口",description:"保留既有业务页面调用方式。",node:<><Button size="sm">小号</Button><Button variant="outline">描边</Button><Button variant="destructive">危险</Button></>},
    ]),
  },

  "icon-button": {
    title: "图标按钮",
    description: "原版 secondary 样式，36 / 32px 方形容器，10px 圆角，20 / 16px 图标。旧版扩展变体保留在兼容示例。",
    preview: () => (<div className="flex items-center gap-3"><CoreIconButton icon={RiNotification3Line} aria-label="通知"/><CoreIconButton icon={EditGlyph} aria-label="编辑"/><CoreIconButton icon={RiMoreLine} aria-label="更多" size="small"/><CoreIconButton icon={RiDeleteBinLine} aria-label="删除" size="small"/></div>),
    demos: () => ([
      {id:"sizes",title:"原版尺寸",node:<><CoreIconButton icon={AddGlyph} aria-label="中尺寸" size="medium"/><CoreIconButton icon={AddGlyph} aria-label="小尺寸" size="small"/></>},
      {id:"legacy",title:"旧版兼容变体",node:<><IconButton icon="settings-3-line" label="设置" variant="ghost"/><IconButton icon="settings-3-line" label="设置" variant="outline"/><IconButton icon="settings-3-line" label="设置" variant="filled"/></>},
    ]),
  },

  chip: {
    title: "状态与筛选标签",
    description: "可切换的紧凑筛选标签，用于过滤列表与多选场景。",
    install: "npx boardui@latest add chip",
    preview: () => (<><StatusChip color="lime">完成</StatusChip><StatusChip color="rose">失败</StatusChip><StatusChip color="blue" variant="subtle">处理中</StatusChip><StatusChip color="neutral" variant="caption">成员</StatusChip></>),
    demos: () => ([
      {id:"filters",title:"交互筛选（兼容扩展）",node:<ChipDemo/>},
      {
        id: "with-icon",
        title: "带图标",
        node: (
          <>
            <Chip label="全部" icon="apps-line" defaultSelected />
            <Chip label="收藏" icon="star-line" />
            <Chip label="最近" icon="time-line" />
          </>
        ),
      },
    ]),
  },

  input: {
    title: "输入框",
    description: "原版 React Aria 输入框：统一 32/36px 灰底容器、标签、辅助说明与语义状态，聚焦时使用内描边。",
    preview: () => (<div className="w-[250px] max-w-full"><Input label="电子邮箱" placeholder="输入您的电子邮件" type="email" leadingIcon={RiMailLine} isRequired tooltip="输入有效电子邮箱" hint="请输入有效的邮箱地址"/></div>),
    demos: () => ([
      {id:"states",title:"状态",node:<div className="flex w-full max-w-sm flex-col gap-4"><Input label="默认" placeholder="请输入"/><Input label="禁用" defaultValue="不可编辑" isDisabled/><Input label="错误" placeholder="请输入邮箱" isInvalid invalidMessage="邮箱格式有误"/><Input label="只读" defaultValue="只读内容" isReadOnly/></div>},
      {id:"controlled",title:"受控表单",node:<ControlledFormDemo/>},
    ]),
  },

  textarea: {
    title: "多行文本框",
    description: "复用 Input 的标签、辅助文字、语义状态与灰底容器。支持自动增高、最大行数、字符统计及原生调整高度。",
    preview: () => (<div className="w-[420px] max-w-full"><Textarea label="发行说明" placeholder="输入发行说明…" rows={4} isRequired hint="支持 Markdown 格式。"/></div>),
    demos: () => ([
      {id:"auto-resize",title:"自动增高",node:<div className="w-full max-w-sm"><Textarea label="自适应文本域" rows={2} autoResize maxRows={5} maxLength={200} showCount placeholder="输入多行文本…"/></div>},
      {id:"states",title:"状态",node:<div className="flex w-full max-w-sm flex-col gap-4"><Textarea label="禁用" isDisabled defaultValue="不可编辑" rows={2}/><Textarea label="错误" isInvalid hint="请填写备注" rows={2}/></div>},
    ]),
  },

  "search-field": {
    title: "搜索框",
    description: "沿用 BoardUI 输入框的语义令牌与交互节奏，保留胶囊形态、搜索图标及可访问的清除按钮。此项为本地扩展。",
    preview: () => (<div className="w-full max-w-sm"><SearchField placeholder="搜索组件…"/></div>),
    demos: () => ([{id:"states",title:"状态",node:<div className="flex w-full max-w-sm flex-col gap-4"><SearchField aria-label="已有搜索内容" defaultValue="BoardUI"/><SearchField aria-label="禁用搜索" defaultValue="不可编辑" isDisabled/></div>}]),
  },

  switch: {
    title: "开关",
    description:
      "二元状态切换控件。三层结构：渐变轨道 + 白灰渐变圆钮 + 蓝色内芯，支持胶囊与矩形两种形状。",
    install: "npx boardui@latest add switch",
    preview: () => (<div className="flex flex-col gap-6">{(["pill","rect"] as const).map(shape=><div key={shape} className="flex flex-col gap-2"><span className="text-body-2-medium text-text-secondary">{shape==="pill"?"胶囊":"矩形"}</span><div className="flex items-center gap-6">{(["lg","md","sm"] as const).map((size,index)=><div key={size} className="flex flex-col items-center gap-2"><Switch defaultSelected shape={shape} size={size} aria-label={(shape==="pill"?"胶囊":"矩形")+["大","中","小"][index]}/><span className="text-caption-2-regular text-text-secondary">{["大","中","小"][index]}</span></div>)}</div></div>)}</div>),
    demos: () => ([
      {
        id: "sizes",
        title: "胶囊",
        description: "小 28×16、中 42×24、大 56×32，圆钮内含蓝色内芯。",
        node: (
          <>
            <ShapeColumn label="大" shape="pill" size="lg" />
            <ShapeColumn label="中" shape="pill" size="md" />
            <ShapeColumn label="小" shape="pill" size="sm" />
          </>
        ),
      },
      {
        id: "rect",
        title: "矩形",
        description: "按尺寸缩放圆角：轨道 3 / 4.5 / 6px，圆钮 1 / 1.5 / 2px。",
        node: (
          <>
            <ShapeColumn label="大" shape="rect" size="lg" />
            <ShapeColumn label="中" shape="rect" size="md" />
            <ShapeColumn label="小" shape="rect" size="sm" />
          </>
        ),
      },
      {
        id: "disabled",
        title: "禁用",
        node: (
          <>
            <Switch isDisabled defaultSelected>禁用且选中</Switch>
            <Switch isDisabled>禁用且未选</Switch>
          </>
        ),
      },
    ]),
  },

  checkbox: {
    title: "复选框",
    description: "多选控件，支持选中、未选中、不确定三种状态。",
    install: "npx boardui@latest add checkbox",
    preview: () => (<div className="flex flex-wrap items-center justify-center gap-6"><Checkbox aria-label="未选中"/><Checkbox aria-label="已选中" defaultSelected/><Checkbox aria-label="不确定" isIndeterminate/><Checkbox aria-label="禁用" isDisabled/><Checkbox aria-label="禁用且选中" isDisabled defaultSelected/></div>),
    demos: () => ([
      { id: "controlled", title: "受控状态", node: <ControlledSelectionDemo /> },
      {
        id: "disabled",
        title: "禁用",
        node: (
          <>
            <Checkbox isDisabled defaultSelected>禁用且选中</Checkbox>
            <Checkbox isDisabled>禁用且未选</Checkbox>
          </>
        ),
      },
    ]),
  },

  radio: {
    title: "单选框",
    description: "互斥单选控件，配合单选组使用。",
    install: "npx boardui@latest add radio",
    preview: () => ((
      <RadioGroup defaultValue="a" aria-label="计费方式">
        <Radio value="a">按月计费</Radio>
        <Radio value="b">按年计费</Radio>
        <Radio value="c">基于使用情况</Radio>
      </RadioGroup>
    )),
    demos: () => ([]),
  },

  select: {
    title: "选择器",
    description: "原版单选触发器与共享浮层，支持旋转箭头、键盘选择和外部点击关闭。",
    install: "npx boardui@latest add select",
    preview: () => (<div className="flex flex-wrap items-center justify-center gap-3"><FilterSelect aria-label="按价格过滤" defaultSelectedKey="all"><FilterOption id="all">所有价格</FilterOption><FilterOption id="low">100 元以内</FilterOption><FilterOption id="high">100 元以上</FilterOption></FilterSelect><FilterSelect aria-label="按地区过滤" defaultSelectedKey="all"><FilterOption id="all">所有地区</FilterOption><FilterOption id="europe">欧洲</FilterOption><FilterOption id="americas">美洲</FilterOption></FilterSelect></div>),
    demos: () => ([{id:"framework",title:"受控选择与图标",node:<SelectDemo/>}]),

  },

  slider: {
    title: "滑块",
    description: "沿轨道拖动的数值选择控件。",
    install: "npx boardui@latest add slider",
    preview: () => ((
      <div className="w-full max-w-sm">
        <Slider label="音量" defaultValue={60} minValue={0} maxValue={100} />
      </div>
    )),
    demos: () => ([
      {
        id: "range",
        title: "范围滑块",
        node: (
          <div className="flex w-full max-w-sm flex-col gap-4">
            <RangeSlider label="价格区间" defaultValue={[20,80]} minValue={0} maxValue={100} thumbLabels={["最低值","最高值"]} className="w-full"/>
            <Slider label="禁用" defaultValue={50} isDisabled/>
          </div>
        ),
      },
    ]),
  },

  badge: {
    title: "徽标",
    description: "状态标记小胶囊，用于标注分类、状态或计数。",
    install: "npx boardui@latest add badge",
    preview: () => ((
      <>
        <Badge>默认</Badge>
        <Badge variant="accent">全新</Badge>
        <Badge variant="success">成功</Badge>
        <Badge variant="warning">警告</Badge>
        <Badge variant="danger">错误</Badge>
        <Badge variant="pro">Pro</Badge>
      </>
    )),
    demos: () => ([{id:"status",title:"状态指示",node:<><StatusDot color="green"/><StatusDot color="yellow"/><StatusDot color="indigo"/></>}]),
  },

  avatar: {
    title: "头像",
    description: "用户或实体的图形标识。无图片时以首字母着色展示。",
    install: "npx boardui@latest add avatar",
    preview: () => ((
      <>
        <Avatar name="张三" size="lg" />
        <Avatar name="李四" size="lg" />
        <Avatar name="王五" size="lg" />
      </>
    )),
    demos: () => ([
      {id:"fallback",title:"图片加载失败回退",node:<CoreAvatar src="data:image/png;base64,broken" alt="测试头像" initials="A" aria-label="回退头像"/>},
      {
        id: "sizes",
        title: "尺寸",
        node: (
          <>
            <Avatar name="赵" size="xs" />
            <Avatar name="赵六" size="sm" />
            <Avatar name="赵六" size="md" />
            <Avatar name="赵六" size="lg" />
            <Avatar name="赵六" size="xl" />
          </>
        ),
      },
    ]),
  },

  progress: {
    title: "进度条",
    description: "线性进度指示，蓝色渐变填充。",
    install: "npx boardui@latest add progress",
    preview: () => ((
      <div className="w-full max-w-sm">
        <Progress aria-label="任务进度" value={45} />
      </div>
    )),
    demos: () => ([
      {
        id: "sizes",
        title: "尺寸",
        node: (
          <div className="flex w-full max-w-sm flex-col gap-3">
            <Progress aria-label="小型进度" value={70} size="sm" />
            <Progress aria-label="中型进度" value={70} size="md" />
            <Progress aria-label="加载中" isIndeterminate/>
          </div>
        ),
      },
    ]),
  },

  spinner: {
    title: "加载圈",
    description: "不确定进度指示器，用于等待态。",
    install: "npx boardui@latest add spinner",
    preview: () => ((
      <>
        <Spinner className="text-accent-500" size={20} />
        <Spinner className="text-accent-500" size={28} />
      </>
    )),
    demos: () => ([]),
  },

  skeleton: {
    title: "骨架屏",
    description: "内容加载占位，带微光扫过动画。",
    install: "npx boardui@latest add skeleton",
    preview: () => ((
      <div className="flex w-full max-w-sm items-center gap-3">
        <Skeleton className="size-10" rounded="full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>
    )),
    demos: () => ([]),
  },

  divider: {
    title: "分隔线",
    description: "内容分隔，支持水平与垂直方向。",
    install: "npx boardui@latest add divider",
    preview: () => ((
      <div className="flex w-full max-w-sm flex-col gap-3">
        <span className="text-body-regular text-text-secondary">上方内容</span>
        <Divider />
        <span className="text-body-regular text-text-secondary">下方内容</span>
      </div>
    )),
    demos: () => ([]),
  },

  tabs: {
    title: "标签页",
    description: "原版下划线标签页，动态测量选中项并平滑移动指示线。",
    install: "npx boardui@latest add tabs",
    preview: () => (<TabsDemo />),
    demos: () => ([]),
  },

  accordion: {
    title: "手风琴",
    description: "把内容折叠进原地展开的面板，使用 grid 行高动画。",
    install: "npx boardui@latest add accordion",
    preview: () => (<AccordionDemo />),
    demos: () => ([{id:"single",title:"单项展开与禁用",node:<div className="w-full max-w-sm"><Accordion allowsMultiple={false} defaultExpandedKeys={["first"]}><AccordionItem id="first" title="第一项">第一项内容</AccordionItem><AccordionItem id="second" title="第二项">第二项内容</AccordionItem><AccordionItem id="disabled" title="禁用项" isDisabled>不可展开</AccordionItem></Accordion><Collapsible title="更多设置"><Input label="折叠内输入框"/></Collapsible></div>}]),
  },

  tooltip: {
    title: "提示气泡",
    description: "原版浅色语义卡片、方向感知箭头、淡入缩放及模糊过渡。",
    install: "npx boardui@latest add tooltip",
    preview: () => ((
      <TooltipTrigger delay={120}>
        <AriaButton variant="secondary">悬停查看提示</AriaButton>
        <Tooltip>这是一个提示气泡</Tooltip>
      </TooltipTrigger>
    )),
    demos: () => ([]),
  },

  "toggle-button": {
    title: "切换按钮",
    description: "分段式切换组，选中项白底高亮。",
    install: "npx boardui@latest add toggle-button",
    preview: () => ((
      <ToggleButtonGroup defaultSelectedKeys={["list"]} selectionMode="single">
        <ToggleButton id="list">
          <Icon name="list-unordered" className="size-4" />
          列表
        </ToggleButton>
        <ToggleButton id="grid">
          <Icon name="grid-line" className="size-4" />
          网格
        </ToggleButton>
      </ToggleButtonGroup>
    )),
    demos: () => ([]),
  },

  "tag-group": {
    title: "标签组",
    description: "可移除的标签集合，用于展示已选项。",
    install: "npx boardui@latest add tag-group",
    preview: () => ((
      <div className="w-full max-w-md">
        <TagGroup label="技术栈">
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag>Tailwind</Tag>
        </TagGroup>
      </div>
    )),
    demos: () => ([]),
  },

  dropdown: {
    title: "下拉菜单",
    description: "触发式操作菜单，支持图标、快捷键与危险项。",
    install: "npx boardui@latest add dropdown",
    preview: () => (<MenuDemo />),
    demos: () => ([{id:"grouped",title:"分组菜单",node:<DropdownSurfaceDemo/>}]),
  },

  modal: {
    title: "弹窗",
    description: "居中模态对话框，480px 宽、24px 圆角，带遮罩与缩放进入动效。",
    install: "npx boardui@latest add modal",
    preview: () => (<ModalDemo />),
    demos: () => ([]),
  },

  popover: {
    title: "弹出层",
    description: "锚定于触发元素的浮层面板。",
    install: "npx boardui@latest add popover",
    preview: () => (<PopoverDemo />),
    demos: () => ([]),
  },

  breadcrumb: {
    title: "面包屑导航",
    description: "层级路径指示，末项为当前页不可点击。",
    install: "npx boardui@latest add breadcrumb",
    preview: () => ((
      <Breadcrumb
        items={[
          { id: "1", label: "BoardUI", href: (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/" },
          { id: "2", label: "组件", href: (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/zh-hans/components/" },
          { id: "3", label: "面包屑导航" },
        ]}
      />
    )),
    demos: () => ([]),
  },

  pagination: {
    title: "分页",
    description: "原版分页，当前页白底描边与细阴影，窄容器自动切换紧凑布局。",
    install: "npx boardui@latest add pagination",
    preview: () => (<PaginationDemo />),
    demos: () => ([]),
  },

  counter: {
    title: "计数器",
    description: "带步进按钮的数值控件。",
    install: "npx boardui@latest add counter",
    preview: () => (<CounterDemo />),
    demos: () => ([]),
  },

  announcement: {
    title: "公告",
    description: "原版紧凑卡片结构，支持语义图标、操作和柔和关闭动画。",
    install: "npx boardui@latest add announcement",
    preview: () => ((
      <div className="flex w-full flex-col gap-2">
        <Announcement variant="info" title="新版本已发布" description="BoardUI 1.2 带来了 12 个新组件。" />
        <Announcement variant="success" title="部署成功" description="构建产物已发布到生产环境。" />
        <Announcement variant="warning" title="额度即将用完" description="本月剩余 12% 的调用额度。" />
        <Announcement variant="error" title="同步失败" description="无法连接到远端仓库，请检查网络。" />
      </div>
    )),
    demos: () => ([{id:"dismiss",title:"操作与关闭",node:<div className="w-full max-w-xs"><CoreAnnouncement title="完善工作区" description="管理工作区设置。" actionLabel="查看设置" dismissible closeLabel="关闭示例公告"/></div>}]),
  },

  notification: {
    title: "通知",
    description: "带色块图标的高强调提示，常用于操作结果反馈。",
    install: "npx boardui@latest add notification",
    preview: () => ((
      <div className="flex w-full flex-col gap-2">
        <Notification variant="information" title="有新版本可用" description="刷新页面即可加载最新内容。" />
        <Notification variant="success" title="保存成功" description="你的修改已自动保存。" />
        <Notification variant="error" title="上传失败" description="文件大小超过限制，请压缩后重试。" />
      </div>
    )),
    demos: () => ([{id:"dismiss",title:"关闭与操作",node:<div className="w-full max-w-sm"><CoreNotification title="任务已完成" description="可手动关闭通知。" status="success" closeLabel="关闭示例通知" actions={[{label:"查看详情",variant:"secondary"}]}/></div>}]),
  },

  toast: {
    title: "轻提示",
    description: "底部浮出的短暂提示，2.6 秒自动消失。",
    install: "npx boardui@latest add toast",
    preview: () => (<ToastDemo />),
    demos: () => ([]),
  },

  drawer: {
    title: "抽屉",
    description: "从侧边滑入的面板，适合承载次要表单与详情。",
    install: "npx boardui@latest add drawer",
    preview: () => (<DrawerDemo />),
    demos: () => ([]),
  },

  "number-field": {
    title: "数字输入",
    description: "带上下步进的数值输入框。",
    install: "npx boardui@latest add number-field",
    preview: () => ((
      <div className="w-full max-w-xs">
        <NumberField label="数量" defaultValue={3} minValue={0} maxValue={99} />
      </div>
    )),
    demos: () => ([]),
  },

  combobox: {
    title: "组合框",
    description: "可输入过滤的下拉选择，适合长选项列表。",
    install: "npx boardui@latest add combobox",
    preview: () => ((
      <div className="w-full max-w-xs">
        <Combobox
          label="城市"
          options={[
            { id: "bj", label: "北京" },
            { id: "sh", label: "上海" },
            { id: "gz", label: "广州" },
            { id: "sz", label: "深圳" },
            { id: "hz", label: "杭州" },
          ]}
        />
      </div>
    )),
    demos: () => ([]),
  },

  table: {
    title: "表格",
    description: "原版表格配方，语义表头、键盘导航与统一行分隔线。",
    install: "npx boardui@latest add table",
    preview: () => ((
      <div className="w-full">
        <Table
          aria-label="成员列表"
          columns={[
            { id: "name", label: "姓名", isRowHeader: true },
            { id: "role", label: "角色" },
            { id: "status", label: "状态" },
          ]}
          rows={[
            { id: "1", cells: { name: "张三", role: "前端工程师", status: "在职" } },
            { id: "2", cells: { name: "李四", role: "设计师", status: "在职" } },
            { id: "3", cells: { name: "王五", role: "产品经理", status: "休假" } },
          ]}
        />
      </div>
    )),
    demos: () => ([]),
  },

  "tree-view": {
    title: "树形视图",
    description: "可展开的层级结构导航。",
    install: "npx boardui@latest add tree-view",
    preview: () => ((
      <div className="w-full max-w-sm">
        <TreeView
          defaultSelected="b1"
          nodes={[
            {
              id: "a",
              label: "src",
              icon: "folder-line",
              children: [
                { id: "a1", label: "components", icon: "folder-line" },
                { id: "a2", label: "utils.ts", icon: "file-code-line" },
              ],
            },
            {
              id: "b",
              label: "app",
              icon: "folder-line",
              children: [
                { id: "b1", label: "page.tsx", icon: "file-code-line" },
                { id: "b2", label: "layout.tsx", icon: "file-code-line" },
              ],
            },
          ]}
        />
      </div>
    )),
    demos: () => ([]),
  },

  carousel: {
    title: "轮播",
    description: "横向切换的卡片容器，带箭头与指示点。",
    install: "npx boardui@latest add carousel",
    preview: () => ((
      <div className="w-full max-w-md">
        <Carousel
          items={[
            { id: "1", title: "第一张", description: "使用 transform 过渡", hue: 215 },
            { id: "2", title: "第二张", description: "缓动对齐原站", hue: 280 },
            { id: "3", title: "第三张", description: "指示点可点击", hue: 160 },
          ]}
        />
      </div>
    )),
    demos: () => ([]),
  },

  meter: {
    title: "度量条",
    description: "展示容量、健康度等比例指标，支持四种色调。",
    install: "npx boardui@latest add meter",
    preview: () => ((
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Meter label="存储空间" value={68} tone="accent" />
        <Meter label="内存使用" value={42} tone="success" />
        <Meter label="CPU" value={81} tone="warning" />
        <Meter label="磁盘" value={93} tone="danger" />
      </div>
    )),
    demos: () => ([]),
  },

  "file-upload": {
    title: "文件上传",
    description: "拖拽或点击选择文件，支持格式与大小验证、去重和删除；上传由应用接入。",
    install: "npx boardui@latest add file-upload",
    preview: () => ((
      <div className="w-full max-w-md">
        <FileUpload accept=".png,.jpg,.pdf" />
      </div>
    )),
    demos: () => ([]),
  },

  "button-group": {
    title: "按钮组",
    description: "原版共用边框、阴影和分隔线；支持独立操作、受控选中、图标及键盘焦点。",
    preview: () => (<PeriodButtonGroupDemo/>),
    demos: () => ([
      {id:"controlled",title:"受控操作",node:<ButtonFamilyDemo/>},
      {id:"small",title:"小尺寸",node:<CoreButtonGroup size="small" aria-label="小按钮组"><ButtonGroupItem size="small">复制</ButtonGroupItem><ButtonGroupItem size="small" leadingIcon={EditGlyph}>编辑</ButtonGroupItem><ButtonGroupItem size="small" disabled>删除</ButtonGroupItem></CoreButtonGroup>},
      {id:"vertical",title:"旧版垂直扩展",node:<ButtonGroup orientation="vertical"><Button variant="secondary">复制</Button><Button variant="secondary">移动</Button><Button variant="secondary">删除</Button></ButtonGroup>},
    ]),
  },

  "close-button": {
    title: "关闭按钮",
    description: "原版独立 SVG 路径：16 / 20 / 24 / 32px 容器及各自精确线宽。",
    preview: () => (<div className="flex items-end gap-5">{([{size:"2xs",label:"2xs",px:16},{size:"xs",label:"xs",px:20},{size:"sm",label:"SM",px:24},{size:"md",label:"MD",px:32}] as const).map(({size,label,px})=><div key={size} className="flex flex-col items-center gap-2"><CoreCloseButton size={size} aria-label={"关闭 "+px}/><span className="text-caption-2-regular text-text-secondary">{label}</span></div>)}</div>),
    demos: () => ([{id:"legacy",title:"旧版兼容样式",node:<><CloseButton size="sm"/><CloseButton size="lg"/><CloseButton variant="filled"/></>}]),
  },

  "link-button": {
    title: "链接按钮",
    description: "外观像内联链接，带图标与下划线展开动效。",
    install: "npx boardui@latest add link-button",
    preview: () => ((
      <div className="flex flex-col gap-2">
        <LinkButton href="/zh-hans/components" trailingIcon="arrow-right-line">
          浏览全部组件
        </LinkButton>
        <LinkButton href="/zh-hans/components" variant="accent" icon="book-open-line">
          阅读文档
        </LinkButton>
        <LinkButton href="/zh-hans/components" variant="muted">
          弱化样式链接
        </LinkButton>
      </div>
    )),
    demos: () => ([]),
  },

  "segmented-control": {
    title: "分段控件",
    description: "灰底容器 + 白底选中项 + 滑动指示器。",
    install: "npx boardui@latest add segmented-control",
    preview: () => (<SegmentedDemo />),
    demos: () => ([
      {
        id: "small",
        title: "小尺寸",
        node: (
          <SegmentedControl
            size="sm"
            options={[
              { id: "d", label: "日" },
              { id: "w", label: "周" },
              { id: "m", label: "月" },
            ]}
          />
        ),
      },
    ]),
  },

  "input-otp": {
    title: "验证码输入框",
    description: "分格输入，自动跳格、退格回退、粘贴自动分发。",
    install: "npx boardui@latest add input-otp",
    preview: () => (<OtpDemo />),
    demos: () => ([
      {
        id: "four",
        title: "4 位",
        node: <InputOtp length={4} />,
      },
    ]),
  },

  "time-field": {
    title: "时间输入框",
    description: "基于 React Aria 时间分段输入，支持受控时分、键盘步进和本地化。",
    install: "npx boardui@latest add time-field",
    preview: () => (<TimeDemo />),
    demos: () => ([]),
  },

  "social-button": {
    title: "第三方登录",
    description: "内置 Google、GitHub、Apple、X、微信的品牌图形。",
    install: "npx boardui@latest add social-button",
    preview: () => ((
      <div className="flex w-full max-w-[260px] flex-col gap-2">
        <SocialButton provider="google" />
        <SocialButton provider="github" />
        <SocialButton provider="apple" />
        <SocialButton provider="wechat" />
      </div>
    )),
    demos: () => ([]),
  },

  "context-menu": {
    title: "右键菜单",
    description: "右键或 Shift+F10 打开，支持键盘方向导航、边界避让及焦点恢复。",
    install: "npx boardui@latest add context-menu",
    preview: () => (<ContextMenuDemo />),
    demos: () => ([]),
  },

  "date-calendar": {
    title: "日期日历",
    description: "月视图日期选择，支持上下月切换、今日高亮、禁用过去日期。",
    install: "npx boardui@latest add date-calendar",
    preview: () => (<CalendarDemo />),
    demos: () => ([]),
  },

  "date-picker": {
    title: "日期选择器",
    description: "原版日期弹层，支持月导航、日期编辑、取消和应用。未应用时不修改已选值。",
    install: "npx boardui@latest add date-picker",
    preview: () => (<DatePickerDemo />),
    demos: () => ([]),
  },

  "color-picker": {
    title: "颜色选择器",
    description: "预设色板与 HEX 草稿；只提交有效六位颜色，支持键盘操作。",
    install: "npx boardui@latest add color-picker",
    preview: () => (<ColorDemo />),
    demos: () => ([]),
  },

  "token-input": {
    title: "Token 输入框",
    description: "多值标签输入，支持 Enter、逗号、批量粘贴、去重与校验；输入法组词期间不会误提交。",
    install: "npx boardui@latest add token-input",
    preview: () => (<TokenDemo />),
    demos: () => ([]),
  },

  "command-palette": {
    title: "命令面板",
    description: "⌘K 风格快捷操作面板，支持分组、过滤与键盘导航。",
    install: "npx boardui@latest add command-palette",
    preview: () => (<CommandDemo />),
    demos: () => ([]),
  },

  composer: {
    title: "对话输入框",
    description: "多行自适应输入，Enter 发送、Shift+Enter 换行，带工具按钮与发送态。",
    install: "npx boardui@latest add composer",
    preview: () => (<ComposerDemo />),
    demos: () => ([{id:"free-composer",title:"原版免费对话输入",node:<FreeComposerDemo/>},{id:"toolbar",title:"键盘工具栏",node:<ToolbarDemo/>}]),
  },

  "composer-attachments": {
    title: "输入框附件",
    description: "待发送文件以横向卡片展示，可单个移除。",
    install: "npx boardui@latest add composer-attachments",
    preview: () => (<AttachmentsDemo />),
    demos: () => ([]),
  },

  "composer-loader": {
    title: "输入框加载",
    description: "原版 SVG 环绕光带、渐变辉光及淡入淡出，支持减少动效。",
    install: "npx boardui@latest add composer-loader",
    preview: () => ((
      <div className="flex w-full max-w-sm flex-col gap-2">
        <ComposerLoader text="正在思考" />
        <ComposerLoader text="正在检索网页" />
      </div>
    )),
    demos: () => ([]),
  },

  "composer-panel": {
    title: "对话输入面板",
    description: "带标签页的工具面板，可嵌入输入框上方。",
    install: "npx boardui@latest add composer-panel",
    preview: () => ((
      <div className="w-full max-w-md">
        <ComposerPanel
          tabs={[
            { id: "tools", label: "工具", icon: "tools-line" },
            { id: "files", label: "文件", icon: "folder-line" },
            { id: "prompts", label: "提示词", icon: "sparkling-line" },
          ]}
        >
          <span className="text-caption-1-regular text-text-tertiary">
            选中标签后显示对应工具内容
          </span>
        </ComposerPanel>
      </div>
    )),
    demos: () => ([]),
  },

  "agent-creator": {
    title: "智能体创建器",
    description: "名称、角色设定、模型、温度与能力配置的一体化表单。",
    install: "npx boardui@latest add agent-creator",
    preview: () => (<AgentCreatorDemo />),
    demos: () => ([]),
  },

  "agent-limits-card": {
    title: "智能体额度",
    description: "多项用量进度，接近上限自动转为警告色。",
    install: "npx boardui@latest add agent-limits-card",
    preview: () => ((
      <div className="w-full max-w-[300px]">
        <AgentLimitsCard
          resetText="12 月 1 日重置"
          limits={[
            { id: "1", label: "消息数", used: 820, max: 1000 },
            { id: "2", label: "Token", used: 186000, max: 200000 },
            { id: "3", label: "文件上传", used: 12, max: 50 },
          ]}
        />
      </div>
    )),
    demos: () => ([]),
  },

  "agent-progress": {
    title: "智能体任务进度",
    description: "垂直步骤条，当前步骤脉冲高亮，完成步骤连线变绿。",
    install: "npx boardui@latest add agent-progress",
    preview: () => ((
      <div className="w-full max-w-[320px]">
        <AgentProgress
          title="重构 Button 组件"
          steps={[
            { id: "1", label: "解析现有结构", state: "done" },
            { id: "2", label: "抽取样式令牌", state: "done" },
            { id: "3", label: "重写组件实现", state: "active" },
            { id: "4", label: "运行视觉回归", state: "pending" },
          ]}
        />
      </div>
    )),
    demos: () => ([]),
  },

  "agent-thinking": {
    title: "智能体思考状态",
    description: "原版四种思考动画（波浪、旋转、星光、无穷），支持主题语义色、流光与计时。",
    install: "npx boardui@latest add agent-thinking",
    preview: () => ((
      <div className="flex flex-col items-start gap-2">
        <AgentThinking text="正在分析你的请求" />
        <AgentThinking text="正在整理 12 个来源" variant="spin" />
        <AgentThinking text="正在构思方案" variant="stars" />
        <AgentThinking text="正在生成回复" variant="infinity" tone="accent" />
      </div>
    )),
    demos: () => ([]),
  },

  "auth-card": {
    title: "身份验证卡片",
    description: "登录 / 注册双模式，含第三方登录与协议勾选。",
    install: "npx boardui@latest add auth-card",
    preview: () => (<AuthCard />),
    demos: () => ([]),
  },

  calendar: {
    title: "日历",
    description: "月视图 + 事件色块 + 侧栏日程详情的完整日历。",
    install: "npx boardui@latest add calendar",
    preview: () => (<CalendarCard />),
    demos: () => ([]),
  },

  "data-table": {
    title: "数据表格",
    description: "排序 + 多选 + 空状态 + 选中计数。",
    install: "npx boardui@latest add data-table",
    preview: () => (<DataTableDemo />),
    demos: () => ([]),
  },

  "data-grid": {
    title: "数据网格",
    description: "紧凑行高的数据表格变体，适合后台批量处理。",
    install: "npx boardui@latest add data-grid",
    preview: () => (<DataGridDemo />),
    demos: () => ([]),
  },

  "notification-center": {
    title: "通知中心",
    description: "通知列表 + 未读气泡 + 全部已读。",
    install: "npx boardui@latest add notification-center",
    preview: () => (<NoticeDemo />),
    demos: () => ([]),
  },

  questionnaire: {
    title: "问卷",
    description: "分步问答，单选/多选/文本，带进度与回退。",
    install: "npx boardui@latest add questionnaire",
    preview: () => (<QuestionnaireDemo />),
    demos: () => ([]),
  },

  "settings-modal": {
    title: "设置对话框",
    description: "左侧分类导航 + 右侧表单的完整设置面板。",
    install: "npx boardui@latest add settings-modal",
    preview: () => (<SettingsDemo />),
    demos: () => ([]),
  },

  sidebar: {
    title: "侧边栏",
    description: "260/60px 浮动侧栏，固定图标位置、渐变选中态及文字渐隐，支持二级导航。",
    install: "npx boardui@latest add sidebar",
    preview: () => (<AppSidebarDemo />),
    demos: () => ([]),
  },

  "stat-cards": {
    title: "指标卡片",
    description: "统一响应式网格的统计卡组。",
    install: "npx boardui@latest add stat-cards",
    preview: () => ((
      <div className="w-full">
        <StatCards
          items={[
            { label: "总收入", value: "¥128,430", delta: "+12.5%", trend: "up", icon: "money-dollar-circle-line" },
            { label: "订单数", value: "1,284", delta: "+8.2%", trend: "up", icon: "shopping-bag-3-line" },
            { label: "活跃用户", value: "8,621", delta: "-2.4%", trend: "down", icon: "user-line" },
            { label: "转化率", value: "3.84%", delta: "+0.6%", trend: "up", icon: "line-chart-line" },
          ]}
        />
      </div>
    )),
    demos: () => ([]),
  },

  "task-list": {
    title: "任务列表",
    description: "可勾选清单，带优先级徽标与截止时间，完成项划线。",
    install: "npx boardui@latest add task-list",
    preview: () => ((
      <div className="w-full max-w-[400px]">
        <TaskList
          tasks={[
            { id: "1", title: "定义高架表面的语义变量", done: true, priority: "高", due: "11-24" },
            { id: "2", title: "为模型选择器添加键盘导航", priority: "中", due: "11-26" },
            { id: "3", title: "调整暗色图表对比度", priority: "低", due: "11-30" },
            { id: "4", title: "补充无障碍标签", priority: "中" },
          ]}
        />
      </div>
    )),
    demos: () => ([]),
  },

  "web-search": {
    title: "网页搜索",
    description: "检索状态卡 + 可展开的引用来源列表。",
    install: "npx boardui@latest add web-search",
    preview: () => ((
      <div className="w-full max-w-[400px]">
        <WebSearch
          query="React Aria Components 如何实现可访问的下拉菜单"
          sources={[
            { id: "1", title: "React Aria 官方文档", url: "#", snippet: "使用 Select 与 Popover 组合，内置键盘导航与焦点管理。" },
            { id: "2", title: "无障碍设计指南", url: "#", snippet: "下拉菜单需要正确处理 aria-expanded 与 aria-activedescendant。" },
          ]}
        />
      </div>
    )),
    demos: () => ([]),
  },

  "activity-rings-card": {
    title: "活动圆环",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add activity-rings-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="rings" title="今日目标完成度"
            delta="完成 78%" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "area-chart-card": {
    title: "面积图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add area-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="area" title="访客" value="94,700" delta="+8.2%" height={180} />
      </div>
    )),
    demos: () => ([]),
  },

  "bar-list-card": {
    title: "条形列表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add bar-list-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="bar-list" title="流量来源" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "combo-chart-card": {
    title: "组合图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add combo-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="combo" title="收入与订单" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "contributions-card": {
    title: "贡献记录",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add contributions-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="contributions" title="提交记录" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "earnings-chart-card": {
    title: "收入图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add earnings-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="earnings" title="本月收入" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "funnel-chart-card": {
    title: "漏斗图",
    description: "水平流动漏斗，四阶段平滑相连，段内白底胶囊标注占比，底部图例卡给出各阶段数值。",
    install: "npx boardui@latest add funnel-chart-card",
    preview: () => ((
      <div className="w-full max-w-[460px]">
        <ChartCard kind="funnel" title="注册漏斗" value="197" delta="+5.2%" height={150} />
      </div>
    )),
    demos: () => ([]),
  },

  "heatmap-chart-card": {
    title: "热力图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add heatmap-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="heatmap" title="活跃热力图" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "line-chart-card": {
    title: "折线图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add line-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="line" title="流量对比" value="24,860" delta="+12.6%" height={180} />
      </div>
    )),
    demos: () => ([]),
  },

  "most-active-days-card": {
    title: "最活跃的日期",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add most-active-days-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="active-days" title="一周活跃分布" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "orders-chart-card": {
    title: "订单图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add orders-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="orders" title="订单量"
            delta="+8.2%" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "radar-chart-card": {
    title: "雷达图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add radar-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="radar" title="能力评估" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "radial-chart-card": {
    title: "径向图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add radial-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="radial" title="目标完成度" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "revenue-chart-card": {
    title: "营收图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add revenue-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="revenue" title="累计营收" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "sankey-chart-card": {
    title: "桑基图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add sankey-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="sankey" title="用户流转" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "scatter-chart-card": {
    title: "散点图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add scatter-chart-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="scatter" title="相关性分布" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "sleep-score-card": {
    title: "睡眠评分",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add sleep-score-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="sleep" title="睡眠评分" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "stage-bars-card": {
    title: "阶段条形图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add stage-bars-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="stage-bars" title="各阶段进度" height={120} />
      </div>
    )),
    demos: () => ([]),
  },

  "steps-card": {
    title: "步数图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
    install: "npx boardui@latest add steps-card",
    preview: () => ((
      <div className="w-full max-w-[420px]">
        <ChartCard kind="steps" title="今日步数" height={120} />
      </div>
    )),
    demos: () => ([]),
  },
};
/* ---------------- 内部演示组件 ---------------- */

function ChipDemo() {
  return (
    <>
      <Chip label="全部" icon="apps-line" defaultSelected />
      <Chip label="收藏" icon="star-line" />
      <Chip label="最近" icon="time-line" />
    </>
  );
}

function TabsDemo() {
  const items = [
    { id: "banners", label: "横幅", icon: "image-line", count: 152 },
    { id: "posts", label: "帖子", icon: "article-line", count: 32 },
    { id: "qr", label: "二维码", icon: "qr-code-line", count: 14 },
    { id: "member", label: "会员", icon: "user-line" },
  ];
  return (
    <div className="w-full max-w-lg">
      <Tabs defaultSelectedKey="banners">
        <TabList>
          {items.map((it) => (
            <Tab key={it.id} id={it.id}>
              <Icon name={it.icon} className="size-4" />
              {it.label}
              {it.count != null && <TabCount count={it.count} />}
            </Tab>
          ))}
        </TabList>
        {items.map((it) => (
          <TabPanel
            key={it.id}
            id={it.id}
            className="rounded-2lg border border-separator-border p-4 text-body-regular text-text-secondary"
          >
            {it.label}面板内容。底部指示线随选中项移动。
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

function AccordionDemo() {
  return (
    <div className="w-full max-w-md">
      <Accordion defaultExpandedKeys={["1"]}>
        <AccordionItem id="1" title="什么是 BoardUI？" subtitle="基础概念">
          BoardUI 是面向 Web 应用与 AI 原生产品的组件库，基于 React Aria 构建。
        </AccordionItem>
        <AccordionItem id="2" title="如何安装？">
          运行 npx boardui@latest init 即可完成初始化。
        </AccordionItem>
        <AccordionItem id="3" title="支持暗色模式吗？">
          支持。所有组件使用语义化颜色令牌，自动跟随主题切换。
        </AccordionItem>
      </Accordion>
    </div>
  );
}


function PaginationDemo() {
  const [page, setPage] = useState(3);
  return <Pagination page={page} total={12} onChange={setPage} />;
}

function CounterDemo() {
  const [n, setN] = useState(1);
  return <Counter value={n} onChange={setN} max={10} />;
}

function ToastDemo() {
  return (
    <ToastProvider>
      <ToastInner />
    </ToastProvider>
  );
}

function ToastInner() {
  const toast = useToast();
  return (
    <>
      <Button variant="secondary" onClick={() => toast("已保存", "success")}>
        成功提示
      </Button>
      <Button variant="secondary" onClick={() => toast("操作已完成", "info")}>
        普通提示
      </Button>
      <Button variant="secondary" onClick={() => toast("出现错误", "error")}>
        错误提示
      </Button>
    </>
  );
}

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开抽屉</Button>
      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title="项目设置"
        description="修改后会立即生效"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>取消</Button>
            <Button onClick={() => setOpen(false)}>保存</Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <NumberField label="成员上限" defaultValue={10} />
          <Meter label="已用额度" value={60} />
        </div>
      </Drawer>
    </>
  );
}


function SegmentedDemo() {
  const [v, setV] = useState("week");
  return (
    <SegmentedControl
      value={v}
      onChange={setV}
      options={[
        { id: "week", label: "每周" },
        { id: "month", label: "每月" },
        { id: "year", label: "每年" },
      ]}
    />
  );
}

function OtpDemo() {
  const [v, setV] = useState("");
  return (
    <div className="flex flex-col items-center gap-2">
      <InputOtp value={v} onChange={setV} />
      <span className="text-caption-2-regular text-text-tertiary">
        已输入 {v.length} / 6
      </span>
    </div>
  );
}

function TimeDemo() {
  const [t, setT] = useState({ hour: 9, minute: 30 });
  return (
    <div className="flex flex-col gap-1">
      <TimeField label="会议时间" value={t} onChange={setT} />
      <span className="text-caption-2-regular text-text-tertiary">
        {String(t.hour).padStart(2, "0")}:{String(t.minute).padStart(2, "0")}
      </span>
    </div>
  );
}

function ContextMenuDemo() {
  const [last, setLast] = useState("—");
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <ContextMenu
        items={[
          { id: "copy", label: "复制", icon: "file-copy-line", shortcut: "⌘C", onSelect: () => setLast("复制") },
          { id: "paste", label: "粘贴", icon: "clipboard-line", shortcut: "⌘V", onSelect: () => setLast("粘贴") },
          { id: "rename", label: "重命名", icon: "edit-line", onSelect: () => setLast("重命名") },
          { id: "delete", label: "删除", icon: "delete-bin-line", danger: true, dividerBefore: true, onSelect: () => setLast("删除") },
        ]}
      >
        <div className="flex h-28 w-full max-w-sm cursor-context-menu flex-col items-center justify-center gap-1 rounded-2lg border-2 border-dashed border-border-button-default bg-background-secondary-default">
          <Icon name="mouse-line" className="size-5 text-foreground-icon-tertiary" />
          <span className="text-caption-1-regular text-text-secondary">在此区域内右键</span>
        </div>
      </ContextMenu>
      <span className="text-caption-2-regular text-text-tertiary">上次操作：{last}</span>
    </div>
  );
}

function CalendarDemo() {
  const [d, setD] = useState<Date | undefined>(new Date(2026,10,24));
  return (
    <div className="flex flex-wrap items-start gap-3">
      <DateCalendar value={d} onChange={setD} />
      <div className="flex flex-col gap-1">
        <span className="text-caption-2-semibold text-text-tertiary">当前选中</span>
        <span className="text-body-2-medium tabular-nums text-text-primary">
          {d ? formatDate(d) : "未选择"}
        </span>
      </div>
    </div>
  );
}

function DatePickerDemo() {
  const [d, setD] = useState<Date | undefined>(new Date(2026,10,24));
  return <div className="flex flex-col items-start gap-2"><DatePicker label="开始日期" value={d} onChange={setD}/><output data-testid="date-committed">{formatDate(d)}</output></div>;
}

function ColorDemo() {
  const [c, setC] = useState("#3080ff");
  return <div className="flex flex-col gap-2"><ColorPicker label="主题色" value={c} onChange={setC}/><output data-testid="color-committed">{c}</output></div>;
}

function TokenDemo() {
  const [t, setT] = useState(["admin@acme.com", "dev@acme.com"]);
  return (
    <div className="w-full max-w-sm">
      <TokenInput
        label="收件人"
        value={t}
        onChange={setT}
        validate={(v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)}
      />
    </div>
  );
}

function CommandDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState("—");
  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant="secondary" onClick={() => setOpen(true)} leading={<Icon name="command-line" className="size-4" />}>
        打开命令面板
      </Button>
      <span className="text-caption-2-regular text-text-tertiary">上次执行：{last}</span>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={[
          { id: "1", label: "新建文档", group: "文件", icon: "file-add-line", shortcut: "⌘N", onSelect: () => setLast("新建文档") },
          { id: "2", label: "打开设置", group: "文件", icon: "settings-3-line", shortcut: "⌘,", onSelect: () => setLast("打开设置") },
          { id: "3", label: "切换主题", group: "视图", icon: "moon-line", onSelect: () => setLast("切换主题") },
          { id: "4", label: "全屏显示", group: "视图", icon: "fullscreen-line", shortcut: "F11", onSelect: () => setLast("全屏显示") },
          { id: "5", label: "搜索组件", group: "导航", icon: "search-line", onSelect: () => setLast("搜索组件") },
          { id: "6", label: "查看快捷键", group: "帮助", icon: "question-line", shortcut: "?", onSelect: () => setLast("查看快捷键") },
        ]}
      />
    </div>
  );
}


function ComposerDemo() {
  const [log, setLog] = useState("—");
  return (
    <div className="w-full max-w-sm">
      <Composer onSend={(v) => v.trim() && setLog(v)} onAttach={()=>setLog("选择附件")} />
      <span className="mt-1 block text-caption-2-regular text-text-tertiary">已发送：{log}</span>
    </div>
  );
}

function AttachmentsDemo() {
  const [items, setItems] = useState([
    { id: "a1", name: "设计稿.pdf", size: "2.4 MB" },
    { id: "a2", name: "封面图.png", size: "890 KB", kind: "image" as const },
    { id: "a3", name: "需求文档.docx", size: "128 KB" },
  ]);
  return (
    <div className="w-full max-w-sm">
      <ComposerAttachments items={items} onRemove={(id) => setItems((p) => p.filter((x) => x.id !== id))} />
    </div>
  );
}

function AgentCreatorDemo() {
  const [msg, setMsg] = useState("—");
  return (
    <div className="w-full max-w-[380px]">
      <AgentCreator onSubmit={(d) => setMsg(d.name)} />
      <span className="mt-1 block text-center text-caption-2-regular text-text-tertiary">
        上次创建：{msg}
      </span>
    </div>
  );
}

function DataTableDemo() {
  return (
    <div className="w-full">
      <DataTable
        columns={[
          { id: "name", label: "姓名", sortable: true },
          { id: "role", label: "角色", sortable: true },
          { id: "status", label: "状态" },
          { id: "amount", label: "金额", align: "end", sortable: true },
        ]}
        rows={[
          { id: "1", cells: { name: "张三", role: "前端工程师", status: "在职", amount: "¥28,000" }, badgeColumn: "status", badgeVariant: { 在职: "success", 休假: "warning" } },
          { id: "2", cells: { name: "李四", role: "设计师", status: "在职", amount: "¥24,000" }, badgeColumn: "status", badgeVariant: { 在职: "success" } },
          { id: "3", cells: { name: "王五", role: "产品经理", status: "休假", amount: "¥26,000" }, badgeColumn: "status", badgeVariant: { 休假: "warning" } },
        ]}
      />
    </div>
  );
}

function DataGridDemo() {
  return (
    <div className="w-full">
      <DataGrid
        columns={[
          { id: "id", label: "编号" },
          { id: "item", label: "项目", sortable: true },
          { id: "qty", label: "数量", align: "end", sortable: true },
          { id: "state", label: "状态" },
        ]}
        rows={[
          { id: "1", cells: { id: "IT-001", item: "设计令牌同步", qty: "12", state: "完成" }, badgeColumn: "state", badgeVariant: { 完成: "success", 待办: "neutral" } },
          { id: "2", cells: { id: "IT-002", item: "组件文档补全", qty: "8", state: "待办" }, badgeColumn: "state", badgeVariant: { 待办: "neutral" } },
          { id: "3", cells: { id: "IT-003", item: "回归测试", qty: "24", state: "完成" }, badgeColumn: "state", badgeVariant: { 完成: "success" } },
        ]}
      />
    </div>
  );
}

function NoticeDemo() {
  return (
    <div className="flex w-full justify-center">
      <NotificationCenter
        items={[
          { id: "1", title: "构建已完成", body: "生产环境部署成功，耗时 42 秒。", time: "2 分钟前", unread: true, avatar: "李四" },
          { id: "2", title: "新评论", body: "王五在「手风琴」文档下留了言。", time: "1 小时前", unread: true, avatar: "王五" },
          { id: "3", title: "额度提醒", body: "本月 Token 用量已达 93%。", time: "昨天", icon: "alert-line" },
        ]}
      />
    </div>
  );
}

function QuestionnaireDemo() {
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <Icon name="checkbox-circle-line" className="size-8 text-lime-500" />
        <span className="text-body-2-medium text-text-primary">感谢填写</span>
        <Button size="sm" variant="secondary" onClick={() => setDone(false)}>重新填写</Button>
      </div>
    );
  }
  return (
    <Questionnaire
      onSubmit={() => setDone(true)}
      questions={[
        { id: "q1", title: "你主要用 BoardUI 做什么？", type: "single", options: ["后台管理", "AI 产品", "营销落地页"] },
        { id: "q2", title: "最需要哪些能力？", description: "可多选", type: "multi", options: ["无障碍", "暗色模式", "图表", "表单"] },
        { id: "q3", title: "还有什么建议？", type: "text" },
      ]}
    />
  );
}

function SettingsDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>打开设置</Button>
      <SettingsModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

function AppSidebarDemo() {
  const [active,setActive]=useState("home");
  return (
    <div className="h-[340px]">
      <AppSidebar active={active} onActiveChange={setActive} user={{name:"张三",description:"个人工作区"}}
        items={[
          { id: "home", label: "概览", icon: "dashboard-line" },
          { id: "docs", label: "文档", icon: "book-open-line", children: [{ id: "d1", label: "按钮" }, { id: "d2", label: "表格" }] },
          { id: "team", label: "团队", icon: "team-line", badge: "3" },
          { id: "settings", label: "设置", icon: "settings-3-line" },
        ]}
      />
    </div>
  );
}


/** 开关的形状/尺寸演示：上下各一个（开启/关闭） */
function ShapeColumn({
  label,
  shape,
  size,
}: {
  label: string;
  shape: "pill" | "rect";
  size: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Switch shape={shape} size={size} defaultSelected aria-label={`${label}开启`} />
      <Switch shape={shape} size={size} aria-label={`${label}关闭`} />
      <span className="text-caption-2-regular text-text-tertiary">{label}</span>
    </div>
  );
}
