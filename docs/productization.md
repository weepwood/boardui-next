# 产品化与发布准备

## 预览包

`npm run test:library` 输出 build/boardui-next 与 build/library-consumer 下的 npm tarball，覆盖真实解包后的 ESM / SSR / 类型消费测试。包不包含 Next 应用、未迁移兼容层或 Pro 源码。安装指南不再指向原版 boardui CLI。

## 模板

Dashboard、AI Chat、Finance、HR、Calendar、Project Board 复用现有公共组件并修复部分无效操作。所有数据为本地演示：CSV 导出为示例数据、对话不接真实模型、邀请等无服务的操作禁用。其他六个模板仍需专项打磨。

## 安全与发布

Next.js 从 15.5.4 升到 15.5.29，官方 npm 审计的 critical 从 1 降为 0；仍有 Next 的 postcss 传递风险与 sharp 高风险。暂不强制覆盖 Next 依赖范围或贸然跨主版本，静态站没有在线 Next 图片优化服务不等同于彻底消除构建/开发风险。正式发布前须进行依赖专项和完整跨浏览器验收。

发布门禁不降低：现有 manifest 仍有待验收项，不发布 v1.0，不创建 npm 发布或正式版本标签。日常快速检查、高风险专项、正式发布完整验收。

## 发布前第二轮

- 六个剩余模板改用公共组件并补齐本地交互；AI 图像生成改为明确标注的渐变样例，所有 AI/医疗/运营内容为示例，不接外部服务。
- 图表及 StatCard、Progress、Meter、AgentProgress 迁入独立包；修复渐变 ID、共享坐标域、密集柱宽和部分非法数值。未直接复制 Pro 图表。
- 新增 examples/react-vite，实际安装 tarball 并构建，浏览器验证受控输入、主题、RTL 和进度；不是仅在仓库内解析模块。
- Next 保持 15.5.29，针对 PostCSS 8.5.33、Sharp 0.35.5 设置明确 override 并更新锁文件。npm ci 后 npm ls 合法，官方 npm 生产依赖审计为零（本次检查时点）；本地静态构建通过。覆盖版本不同于 Next 自身依赖声明，保留回归检查，后续上游修复后移除覆盖。
- 本轮本地 Edge 专项覆盖 23 个页面组合，115 个静态页面导出检查通过；独立 Vite 浏览器测试另计。跨浏览器完整验收、逐组件视觉/API/RTL/无障碍证据仍未完成，暂不发布 v1.0。
