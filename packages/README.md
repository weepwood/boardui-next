# BoardUI Next React 预览包（非官方）

React 19、ESM、TypeScript 声明和编译后的 CSS；固定公开 MIT 上游源码及独立扩展。尚未发布 npm，也未提供官方 BoardUI CLI。

## 从仓库构建及安装
```sh
npm ci
npm run test:library
# 在你的 React 项目中：
npm install /绝对路径/boardui-next/build/library-consumer/weepwood-boardui-next-0.1.0.tgz
```

```tsx
import "@weepwood/boardui-next/styles.css";
import { Button, DirectionProvider, Input, Switch } from "@weepwood/boardui-next";

export function Example() {
  return <DirectionProvider locale="zh-CN">
    <Input label="名称" defaultValue="项目" />
    <Switch defaultSelected>启用</Switch>
    <Button onClick={() => console.log("保存")}>保存</Button>
  </DirectionProvider>;
}
```

受控组件使用对应的 value / onChange 或 isSelected / onChange 等 API；React Aria 组件遵循其状态约定。通过包的类型声明查看准确的属性定义。Button 是原生按钮；AriaButton 为 React Aria 适配。应用内旧数组式适配器尚未全部导出。

静态 CSS 含 Tailwind 基础层，适合独立应用；已有 Tailwind v4 项目也可以引入源文件：
```css
@import "tailwindcss";
@import "@weepwood/boardui-next/tailwind.css";
```

两种 CSS 方式二选一。字体由消费应用提供（可选 Noto Sans SC Variable、Inter Variable、JetBrains Mono Variable），暗色使用根节点 .dark。RTL 使用 DirectionProvider。未绑定主题控制器或 Next.js；不包含应用模板、Pro 源码、服务端或模拟 AI 服务。包中 CSS 包含现阶段公共及应用样式配方，进一步拆分和作用域隔离待完善。

## 验收边界

test:library 构建实际 tarball，解包后验证 ESM 导入、SSR、CSS 及 TypeScript 消费端。当前是本地预览产物，尚未通过正式发布的跨浏览器、无障碍、逐组件风格/交互与安全门禁。详见 reference/upstream-manifest.json。
