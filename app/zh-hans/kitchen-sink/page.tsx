"use client";

import { useState } from "react";
import { DocsLayout } from "@/app/components/docs/DocsLayout";
import { ComponentPreview } from "@/app/components/docs/ComponentPreview";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Switch } from "@/app/components/ui/Switch";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { Radio, RadioGroup } from "@/app/components/ui/Radio";
import { Badge } from "@/app/components/ui/Badge";
import { Divider } from "@/app/components/ui/Divider";
import { Avatar } from "@/app/components/ui/Avatar";
import { Progress } from "@/app/components/ui/Progress";
import { Spinner } from "@/app/components/ui/Spinner";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { Icon } from "@/app/components/ui/Icon";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section id={label} className="flex scroll-mt-14 flex-col gap-3">
      <h2 className="text-title-3-semibold text-text-primary">{label}</h2>
      <ComponentPreview>{children}</ComponentPreview>
    </section>
  );
}

export default function KitchenSinkPage() {
  const [progress, setProgress] = useState(45);

  return (
    <DocsLayout
      breadcrumbs={[
        { label: "BoardUI", href: "/" },
        { label: "组件", href: "/zh-hans/components" },
        { label: "组件实测" },
      ]}
      toc={[
        { id: "按钮", label: "按钮" },
        { id: "输入框", label: "输入框" },
        { id: "开关", label: "开关" },
        { id: "复选框", label: "复选框" },
        { id: "单选", label: "单选" },
        { id: "徽标", label: "徽标" },
        { id: "头像", label: "头像" },
        { id: "进度", label: "进度" },
        { id: "其他", label: "其他" },
      ]}
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-title-1-medium text-text-primary">组件实测</h1>
        <p className="text-headline-medium text-text-secondary">
          原子组件的视觉与交互验证页。所有组件基于 React Aria Components，动效对齐原站。
        </p>
      </header>

      <Row label="按钮">
        <Button>主要</Button>
        <Button variant="secondary">次要</Button>
        <Button variant="ghost">幽灵</Button>
        <Button variant="destructive">危险</Button>
        <Button variant="outline">描边</Button>
        <Button isDisabled>禁用</Button>
        <Button leading={<Icon name="add-line" className="size-4" />}>新建</Button>
        <Button trailing={<Icon name="arrow-right-line" className="size-4" />}>
          继续
        </Button>
      </Row>

      <Row label="输入框">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input
            label="电子邮箱"
            placeholder="输入您的电子邮箱"
            icon={<Icon name="mail-line" className="size-4" />}
          />
          <Input label="搜索" placeholder="搜索组件…" icon={<Icon name="search-line" className="size-4" />} />
          <Input label="禁用" placeholder="不可编辑" isDisabled />
        </div>
      </Row>

      <Row label="开关">
        <Switch defaultSelected>开启</Switch>
        <Switch>关闭</Switch>
        <Switch aria-label="小号开关" size="sm" defaultSelected />
        <Switch aria-label="大号开关" size="lg" defaultSelected />
      </Row>

      <Row label="复选框">
        <Checkbox defaultSelected>已选中</Checkbox>
        <Checkbox>未选中</Checkbox>
        <Checkbox isIndeterminate>部分选中</Checkbox>
        <Checkbox isDisabled defaultSelected>
          禁用
        </Checkbox>
      </Row>

      <Row label="单选">
        <RadioGroup defaultValue="a" label="选择方案">
          <Radio value="a">方案 A</Radio>
          <Radio value="b">方案 B</Radio>
          <Radio value="c">方案 C</Radio>
        </RadioGroup>
      </Row>

      <Row label="徽标">
        <Badge>默认</Badge>
        <Badge variant="accent">全新</Badge>
        <Badge variant="success">成功</Badge>
        <Badge variant="warning">警告</Badge>
        <Badge variant="danger">错误</Badge>
        <Badge variant="pro">Pro</Badge>
      </Row>

      <Row label="头像">
        <Avatar name="张三" size="xs" />
        <Avatar name="李四" size="sm" />
        <Avatar name="王五" size="md" />
        <Avatar name="赵六" size="lg" />
        <Avatar name="钱七" size="xl" />
      </Row>

      <Row label="进度">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Progress value={progress} />
          <Progress value={80} size="sm" />
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
              -10
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
              +10
            </Button>
          </div>
        </div>
      </Row>

      <Row label="其他">
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-3">
            <Spinner className="text-accent-500" />
            <span className="text-body-medium text-text-secondary">加载中…</span>
          </div>
          <Divider />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8" rounded="full" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>
      </Row>
    </DocsLayout>
  );
}
