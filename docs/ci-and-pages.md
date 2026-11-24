# CI 与 GitHub Pages

核心：日常迭代快速检查，高风险改动专项验证，正式发布完整验收。

| 阶段 | 触发 | 验证 |
|---|---|---|
| 日常 | PR | npm ci、注册表测试、类型检查 |
| 风险 | 核心组件/公共样式/依赖/工作流/构建配置或 high-risk 标签 | 静态导出、内部链接检查、Chromium 重点页、变更组件路由及主题冒烟 |
| 发布 | v* tag 或手动 | 一次构建、三浏览器双主题全页面截图、axe、逐组件证据门禁 |
| 预览部署 | main 更新或手动 | 静态构建一次、导出检查、复用同一 artifact 部署 |

正式验收流程已经有全站基础覆盖，但截图比对基线、逐组件完整交互/RTL 用例仍待建立；验收清单 pending 项会阻止正式验收通过。

Pages 地址：https://weepwood.github.io/boardui-next/ 。Settings → Pages → Build and deployment → Source 选择 GitHub Actions。如自动启用权限不足，需仓库管理员首次配置。GitHub Pages 为静态预览，不提供 Next.js 服务端运行时。开发仍可 npm run dev；本地导出 npm run build:pages（out/）。

浏览器验证固定 ubuntu-24.04，避免 ubuntu-latest 自动切换到 Playwright 尚不支持的系统版本。
