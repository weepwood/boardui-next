# BoardUI Next 开发规范

- 原版基线见 reference/upstream-manifest.json，未经评审不得漂移。
- MIT 公开源码保留原版权；Pro 项仅独立实现或取得授权，不下载受限源码。
- 不将渲染成功、文件存在或构建通过标为 1:1 完成；每项须记录视觉、交互、API、无障碍、RTL 证据。
- 样式、行为与演示数据分离；优先 React Aria，Headless UI 可选适配，不自行重复实现复杂交互。
- 中文提交，独立 PR；日常执行 npm ci、npm run test、npm run typecheck、npm run build；完整浏览器矩阵留给版本验收。
- 保留既有公共接口和页面，迁移期间采用兼容层。
