"use client";

import { useState } from "react";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
import { ComponentPreview } from "@/app/components/docs/ComponentPreview";
import { Button } from "@/app/components/ui/Button";
import { ModalDialog, DialogBody, DialogFooter } from "@/app/components/ui/Dialog";
import { MenuTrigger, Menu, BMenuItem } from "@/app/components/ui/Menu";
import { Popover } from "@/app/components/ui/Popover";
import { Tabs, TabList, Tab, TabPanel } from "@/app/components/ui/Tabs";
import { Accordion, AccordionItem } from "@/app/components/ui/Accordion";
import { Select } from "@/app/components/ui/Select";
import { Slider } from "@/app/components/ui/Slider";
import { Tooltip, TooltipTrigger } from "@/app/components/ui/Tooltip";
import { ToggleButtonGroup, ToggleButton } from "@/app/components/ui/ToggleButton";
import { TagGroup, Tag } from "@/app/components/ui/TagGroup";
import { Textarea } from "@/app/components/ui/Textarea";
import { SearchField } from "@/app/components/ui/SearchField";
import { Icon } from "@/app/components/ui/Icon";

function Row({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex scroll-mt-14 flex-col gap-3">
      <h2 className="text-title-3-semibold text-text-primary">{label}</h2>
      <ComponentPreview>{children}</ComponentPreview>
    </section>
  );
}

const SECTIONS = [
  { id: "弹窗", label: "弹窗" },
  { id: "下拉菜单", label: "下拉菜单" },
  { id: "标签页", label: "标签页" },
  { id: "手风琴", label: "手风琴" },
  { id: "选择器", label: "选择器" },
  { id: "滑块", label: "滑块" },
  { id: "提示", label: "提示" },
  { id: "切换组", label: "切换组" },
  { id: "标签组", label: "标签组" },
  { id: "表单", label: "表单" },
];

export default function AdvancedPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState("b");

  return (
    <DocsLayout
      breadcrumbs={[
        { label: "BoardUI", href: "/" },
        { label: "组件", href: "/zh-hans/components" },
        { label: "复合组件实测" },
      ]}
      toc={SECTIONS}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-title-1-medium text-text-primary">复合组件实测</h1>
        <p className="text-headline-medium text-text-secondary">
          带完整交互逻辑的复合组件。所有浮层、动画、键盘操作均基于 React Aria。
        </p>
      </header>

      <Row id="弹窗" label="弹窗">
        <Button onClick={() => setModalOpen(true)}>打开弹窗</Button>
        <ModalDialog
          isOpen={modalOpen}
          onOpenChange={setModalOpen}
          title="邀请团队成员"
          description="他们会收到一封电子邮件，其中包含加入 Acme 工作区的链接。"
        >
          <DialogBody>
            <div className="flex h-9 items-center rounded-2lg bg-background-secondary-default px-3 text-body-medium text-text-placeholder">
              输入邮箱地址…
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setModalOpen(false)}>发送邀请</Button>
          </DialogFooter>
        </ModalDialog>
      </Row>

      <Row id="下拉菜单" label="下拉菜单">
        <MenuTrigger>
          <Button variant="secondary" trailing={<Icon name="arrow-down-s-line" className="size-4" />}>
            操作菜单
          </Button>
          <Popover>
            <Menu>
              <BMenuItem id="edit" label="编辑" icon="edit-line" shortcut="⌘E" />
              <BMenuItem id="copy" label="复制链接" icon="link" shortcut="⌘C" />
              <BMenuItem id="share" label="分享" icon="share-line" />
              <BMenuItem id="delete" label="删除" icon="delete-bin-line" danger />
            </Menu>
          </Popover>
        </MenuTrigger>
      </Row>

      <Row id="标签页" label="标签页">
        <div className="w-full max-w-md">
          <Tabs defaultSelectedKey="a">
            <TabList>
              <Tab id="a">概览</Tab>
              <Tab id="b">设置</Tab>
              <Tab id="c">成员</Tab>
            </TabList>
            <TabPanel id="a" className="rounded-xl border border-separator-border p-4 text-body-regular text-text-secondary">
              概览面板内容。切换标签时淡入。
            </TabPanel>
            <TabPanel id="b" className="rounded-xl border border-separator-border p-4 text-body-regular text-text-secondary">
              设置面板内容。
            </TabPanel>
            <TabPanel id="c" className="rounded-xl border border-separator-border p-4 text-body-regular text-text-secondary">
              成员面板内容。
            </TabPanel>
          </Tabs>
        </div>
      </Row>

      <Row id="手风琴" label="手风琴">
        <div className="w-full max-w-md">
          <Accordion defaultExpandedKeys={["1"]}>
            <AccordionItem id="1" title="什么是 BoardUI？" subtitle="基础概念">
              BoardUI 是面向 Web 应用与 AI 原生产品的组件库，基于 React Aria 构建。
            </AccordionItem>
            <AccordionItem id="2" title="如何安装？">
              运行 npx boardui@latest init 即可完成初始化。
            </AccordionItem>
            <AccordionItem id="3" title="支持暗色模式吗？">
              支持。所有组件都使用语义化颜色令牌，自动跟随主题切换。
            </AccordionItem>
          </Accordion>
        </div>
      </Row>

      <Row id="选择器" label="选择器">
        <div className="w-full max-w-xs">
          <Select
            label="框架"
            value={selectValue}
            onChange={(v) => setSelectValue(String(v))}
            options={[
              { id: "a", label: "React", icon: "reactjs-line" },
              { id: "b", label: "Vue", icon: "vuejs-line" },
              { id: "c", label: "Svelte", icon: "code-s-slash-line" },
            ]}
          />
        </div>
      </Row>

      <Row id="滑块" label="滑块">
        <div className="w-full max-w-sm">
          <Slider label="音量" defaultValue={60} minValue={0} maxValue={100} />
        </div>
      </Row>

      <Row id="提示" label="提示">
        <TooltipTrigger>
          <Button variant="secondary">悬停查看提示</Button>
          <Tooltip>这是一个提示气泡</Tooltip>
        </TooltipTrigger>
      </Row>

      <Row id="切换组" label="切换组">
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
      </Row>

      <Row id="标签组" label="标签组">
        <div className="w-full max-w-md">
          <TagGroup label="技术栈">
            <Tag>React</Tag>
            <Tag>TypeScript</Tag>
            <Tag>Tailwind</Tag>
          </TagGroup>
        </div>
      </Row>

      <Row id="表单" label="表单">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <SearchField placeholder="搜索组件…" />
          <Textarea label="备注" placeholder="输入备注…" description="最多 500 字" />
        </div>
      </Row>
    </DocsLayout>
  );
}
