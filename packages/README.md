# 组件库源码层（开发中）

首批 Button / ButtonLink（原生语义与上游一致）和 AriaButton（React Aria 适配）共享 styles/button.ts。应用导入 packages/react/index.ts，样式由 app/globals.css 引入。独立 npm 打包、外部项目安装、SVG 图标自动 RTL 映射和完整视觉验收尚未完成；当前不宣称已发布。

新增 Checkbox、Radio、Switch（React Aria）与 IconButton、IconLinkButton、ButtonGroup、ButtonGroupItem、CloseButton（原版原生语义），文档示例与兼容层分开；所有组件仍以验收清单为准。
