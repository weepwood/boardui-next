# BoardUI Next 开发规范

- 原版基线见 reference/upstream-manifest.json，未经评审不得漂移。
- MIT 公开源码保留原版权；Pro 项仅独立实现或取得授权，不下载受限源码。
- 不将渲染成功、文件存在或构建通过视为视觉与交互验收完成；每项须记录视觉、交互、API、无障碍、RTL 证据。
- 样式、行为与演示数据分离；优先 React Aria，Headless UI 可选适配，不自行重复实现复杂交互。
- 中文提交、独立 PR。CI 核心：**日常迭代快速检查，高风险改动专项验证，正式发布完整验收**。日常只做锁定依赖安装、注册表测试与类型检查；核心组件、公共样式、依赖、构建部署等风险变更（或 high-risk 标签）追加静态构建和 Chromium 定向冒烟。正式版本执行三浏览器、双主题、全页面截图与 axe 检测，并以逐组件证据清单作为发布门禁。截图用于发现明显视觉回归，不要求逐像素一致；完整组件交互和视觉基线仍须补齐。main 更新自动部署静态预览，不等同正式版本发布。
- 保留既有公共接口和页面，迁移期间采用兼容层。

- PR 审查无阻塞问题且对应风险等级检查通过后直接合并；不重复询问，不绕过失败或缺失的必要检查。未通过专项验收的组件仍不得标记为风格与交互验收通过。

- **还原质量优先于组件数量，公共视觉基础优先于局部修补。** 先统一上游运行时令牌、字体、图标和页面框架；记录真实浏览器几何、计算样式、交互及明显视觉差异。未校准项目不得扩大组件覆盖来掩盖偏差。

- 视觉验收以原版设计语言、信息层级、语义令牌、SVG 图标、状态反馈和动画节奏一致为准；字体栅格化、抗锯齿、轻微尺寸及内容差异不阻塞合并。无需逐像素截图匹配。保留功能、无障碍和 RTL 专项门禁。

## 项目交接（2026-11-24）

- 当前主线：八批基础组件、应用组件及模板首轮改造已合并；#18 目录筛选及浏览器回归修复已合并（main a00428d）。当前工作分支 feat/component-acceptance-matrix，专注 RTL 实验室、逐组件证据与文档。
- 完整验收：基线 #16 run 45384688919（684 页面/主题组合，三浏览器有失败）；修复版 #18 run 45387299806 尚在执行。新助手先通过 GitHub API/gh 检查该 run 的最终结果和最新 PR，不要从历史描述推断 CI 已通过。
- 正式版本仍未发布；104 项清单的正式五维验收仍待完成。reference/evidence/acceptance-observations.json 保存抽样证据，不能批量将 pending 改成 passed。文档页显示独立的来源和验收状态。
- 接手步骤：读 docs/productization.md、docs/visual-parity.md、reference/upstream-manifest.json 和证据清单；先审查当前 PR、完整验收报告，修复真实失败后再合并；按需运行 npm test、npm run typecheck、npm run test:api、npm run test:library。风险改动执行 npm run build:pages、npm run test:export 和定向 browser-check。
- RTL 实验室 /zh-hans/rtl/，验证真实 DirectionProvider locale 切换、方向键、选中指示器、图标、浮层、数值及状态。后续补日期、树、表格、多尺寸、移动端及独立包的剩余方向检查。
- 下一阶段：检查第二轮完整验收结果并修复跨浏览器失败；以真实可复验的视觉、交互、无障碍、API、RTL 证据逐批推进，优先公开基础组件。Pro 不复制；正式发布不得跳过证据门禁。默认每次会话更新此交接段落，避免堆叠对话日志。

## 最新视觉修复交接

- 用户明确要求优先解决肉眼可见的视觉缺陷，而不是继续扩充验收文档。对照固定上游公开主题与 ShowcaseCard 样式，维护语义令牌，不允许未经定义的颜色类；不得用全局边框覆盖掩盖具体令牌错误。
- #19 已合并；当前 fix/docs-visual-foundation 修复首页、全局旧 border-primary、树状侧栏重复激活和独立模板路由。证据见 reference/evidence/docs-shell-regression-20261124.json。
- 下一轮优先实际查看浅色/深色、桌面/移动的页面截图，审计细边界、文本层级、圆角、hover 与 focus；确保新 PR CI 通过后合并。旧完整验收仍失败，不能视为正式发布通过。

- 视觉重构第一批：#20 已合并（main 54ee0e5），当前 feat/docs-visual-refinement；完成首页、目录预览自适应、文档侧栏/顶栏/搜索/预览工具条，16 个双主题/双视口截图布局组合与 10 个专项组合通过。下一批优先弹窗、Select/Dropdown/Popover/Tooltip、表单细节、应用模板实际截图，不继续堆叠验收 UI。

### 2026-11-24 — 集中视觉质量重构

- 用户要求一次性推进全部剩余视觉模块，不再逐类拆分 PR；公共视觉一致性优先，沿用上游公开令牌与设计语言，不任意创造新风格。
- 全部 12 个应用模板及对应文档页已纳入统一视觉与响应式布局治理，使用容器查询；公共浮层、表单状态、应用组合组件同步改进。SettingsModal 已迁移 React Aria Modal。
- 视觉证据：`reference/evidence/consolidated-visual-20261124.json`（本地 Edge，12 个模板 × 2 视口 × 2 主题，48 个组合的布局与运行检查；并非全站像素级验收）。专项浏览器 44 个页面组合与设置弹窗追加回归 7 个组合通过，独立包构建、SSR/类型消费验证、116 个静态页导出检查通过。
- 合并前继续遵守快速检查／风险专项／正式发布三层 CI；不将未验收的上游复现标记为完整验收。后续优先根据实际截图和用户反馈修复具体视觉偏差，勿再把同类视觉调整拆散。

### 导航性能专项（2026-11-24）

- #22 集中视觉重构已合并，基线 main bffce37。本次修复用户反馈的侧栏切换卡顿：根布局持久 DocsShell、有限意图预取（40ms hover、键盘 focus、60s 窗口最多 8 个、节流网络跳过）、独立即时菜单反馈与超过 100ms 的内容占位、延迟挂载搜索、屏幕外文档区 content-visibility。
- 实测两种按组件拆包候选及整树 React 状态驱动加载反馈出现性能退化，已撤销，不要盲目恢复。保留共享文档注册表；NavContext 只暴露稳定操作，轻量 DOM 反馈不决定 URL 或 aria-current；路由完成/超时清理。
- 证据 reference/evidence/navigation-performance-20261124.json；生产静态导出 Edge 实测，模拟 120ms RTT 参数、750000 bytes/s、CPU 4 倍降速，6 次切换 750/262/278/227/432/114ms -> 533/166/133/98/337/96ms。单次序列，不宣称全网或所有设备结果；预取请求不计入点击后的资源列表。
- 复现：构建 Pages 后安装测试所需 Playwright（按 CI 版本），执行 node scripts/benchmark-navigation.mjs /tmp/nav-result.json；本地可设 BROWSER_EXECUTABLE。浏览器回归增加受控慢请求、即时反馈、保持唯一实际激活、折叠状态和 DOM 实例、历史回退检查。

### 导航性能后续治理

- #23 已通过 quick/targeted 并合并至 main 58d2bf3，Pages run 45394236681 成功。保留既有共享注册表和持久 DocsShell，不恢复之前实测退化的拆包方案。
- 新批次：目录 100 张卡片的 88 个可见性订阅共享一个观察器，预览尺寸共享 ResizeObserver 并对同批更新去重；memo 卡片、稳定模板筛选输入，目录入口复用导航反馈。路由占位显示时旧内容 inert；popstate 立即清理导航意图。
- 本地 Edge 测量见 reference/evidence/catalog-observers-20261124.json。初始 IntersectionObserver 实例 89→2，四次筛选后累计 258→2，预览 9→9；计数含框架观察器，不等于耗时同比降低。滚动后视口仍只挂载必要预览。
- browser-check 增加目录共享观察器与卸载清理断言、连续点击时旧延迟请求不能覆盖最后目标、inert/aria-busy 清理检查。12 个专项组合、116 静态 HTML、类型及注册表/令牌/证据通过；其他浏览器仍需复验。

### 首屏加载性能专项

- #24 目录共享观察器与快速导航修复已合并（main c1be8c9）。新批次将 API 参考按当前 slug 传递、验收状态由服务端渲染、目录仅接收精简元数据，保留共享演示注册表缓存优势。
- Noto Sans SC 使用原有固定 Fontsource 版本，构建时通过 subset-font@2.9.0 为静态界面字符生成小型可变字体并拆分互斥 unicode-range；其他字符仍走原完整子集。生成资源不提交、不进入独立组件包。字体许可随站点导出。npm run dev/build/build:pages 自动执行 fonts:prepare；直接使用 Next CLI 前需手动准备。源码字符集/锁文件/脚本签名变化重新生成。
- 冷启动证据 reference/evidence/cold-start-20261124.json；按钮页字体 953240→368316 bytes、压缩 JS 472105→457770 bytes，目录字体 1074924→383112 bytes。FCP 有波动，非稳定速度结论。Edge 抽样常用/回退字符加载与 400/700 字重宽度一致。复现命令 node scripts/benchmark-cold-start.mjs /tmp/cold.json（需要 Playwright，可设 BROWSER_EXECUTABLE）。
- 导航/字体类高风险 PR 加入专用 Chromium、Firefox、WebKit 快速竞态/字体回退测试，不扩大全量日常检查。完整发布门禁不变，后续优先真实跨浏览器回归和低性能设备测量。

### 文档渲染与搜索性能专项

- 基于 #25 的字体/文档数据优化分支，模板目录不再引入演示注册表：基础 CatalogCard/ComponentCatalog 与 LiveComponentCatalog 分离，组件目录仍保留完整实时预览。模板实际冷启动压缩 JS 453747→213540 bytes。静态 HTML 引用脚本 gzip 估算 253013 bytes，test:export 新增 350 KiB 门禁；包含 polyfills，区别于浏览器实际下载量。
- CommandPalette 预计算检索文本，分组线性构造，缓存可选项索引，Memo 结果行与稳定回调，保留全部 109 条结果、键盘循环、无匹配状态和 ARIA。三次本地 Edge 降速测量 20 次方向键的脚本时间中位数 60→44ms，端到端操作时间有波动。复现 node scripts/benchmark-search.mjs /tmp/search.json（Playwright，可设 BROWSER_EXECUTABLE）。
- DataGrid/DataTable 预计算排序键、复用 Intl.Collator、Set 选择查询；千行测试取值 17130→1000 次，数值/自然排序/稳定性回归通过。未增加虚拟列表，也不把取值次数减少等同整体渲染加速。
- 已撤销静态 API 表格服务端 slot 候选：压缩 HTML 增大且测量收益不稳定。长文档整体优化与复杂组件首屏初始化仍待继续测量，保留共享文档缓存和原有 API 内容。证据 reference/evidence/docs-render-performance-20261124.json。不要为了拆包或架构指标盲目引入性能回归。
