# BoardUI Next 开发规范

### 文档界面细节专项（2026-11-24，候选）

- 独立于 #33 的文档 UI 改进：预览/代码切换保留演示实例，隐藏区域 inert；复制状态统一并防止过期异步结果；代码面板支持键盘滚动、行数提示和窄屏布局。API 折叠层级、类型断行、目录焦点圆角及顶栏操作反馈均沿用现有语义令牌。
- 浏览器回归新增输入状态保留与隐藏焦点隔离断言。提交时尚未执行该候选的完整 CI、真实截图和三浏览器验收，不升级任何正式证据状态；优先收口 #33，再按各自风险门禁合并。

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

### 演示初始化与不可见动效专项

- #26 已通过 CI 并合并至 main b8afb2e。新批次：90 个文档的 preview/demos 变为惰性工厂，328 处 JSX 表达式不再随整个共享 registry 顶层构造；目录只调用可见卡片的工厂。共享模块与静态文档保留，未采用虚拟化或网络分包。
- AgentThinking 使用共享 IntersectionObserver 与页面 visibilitychange，仅在可见时运行 80ms 波纹/旋转和 100ms 计时回调，CSS 装饰动画暂停；恢复时按实际经过时间更新，实时响应 reduced-motion。独立包 API 不变。1.2s Edge 采样：可见 30+48，离开视口 30+48→0+0，恢复 30+48。
- 证据 reference/evidence/preview-initialization-motion-20261124.json，复现 scripts/benchmark-preview-initialization.mjs 与 scripts/benchmark-motion-visibility.mjs（Playwright，BROWSER_EXECUTABLE 可选）。三轮冷启动脚本中位数 button 824→798ms、agent-thinking 755→754ms、catalog 772→727ms；部分 FCP/长任务反而上升，部分测量并行执行其他本地检查，只视为诊断数据，不承诺整页提速。保留真实静态文档、锚点及预览行为。
- npm test 新增文档惰性工厂结构门禁，浏览器专项验证离屏计时暂停、恢复连续性、减少动效。12 个本地组合、116 HTML 导出、独立包构建/SSR/类型消费、类型与 API 检查通过。后续优先隔离环境重复测量长文档布局和其他持续动画；逐组件验收门禁保持不变。

### 持续动效、图表与文档性能专项

- #27 已通过 CI 并合并至 main 8c7519e，Pages run 45398346724 成功。继续沿用共享文档注册表的惰性工厂。
- ComposerLoader、Skeleton、Spinner、WebSearch 使用共享可见性机制，后台或离屏暂停对应装饰动画；共享一个 visibilitychange 监听，ComposerLoader 共享尺寸监听并去重相同尺寸更新。修复 Skeleton 错误 keyframes 名及减少动效；不删除状态组件和 ARIA。未覆盖所有连续动效组件。
- 图表为 SVG viewBox，无需额外 ResizeObserver。面积图叠加前缀累加，32×1000 测试旧基线与总量取值共 528000 次→32000 次，结果一致；折线图共享 domain，桑基图节点索引；唯一 SVG 渐变 ID、修复失效描边变量。语义检查覆盖原始 CSS 颜色变量及 Tailwind 官方主题。
- 长文档 TOC 按稳定标题 ID 订阅、维护交叉观察集合、锚点即时反馈，保留完整静态文档和 API 表。未虚拟化 API 表格，未证明长文档整体加速。
- 新增全站静态压缩预算：JS 550 KiB、HTML 40 KiB，模板目录仍 350 KiB；116 页最高 497843/25775 bytes。属于构建估算，不等于网络耗时；共享脚本压缩缓存。
- 14 个 Edge 专项组合通过；3 次 ComposerLoader 导航往返的相关 IO/RO 观察目标 4/2→0/0，新增 check-activity-cleanup.mjs 风险专项，不等同完整堆内存泄漏审计。证据 reference/evidence/activity-charts-docs-20261124.json。独立包 SSR/类型消费、类型/API、图表单测及静态导出均通过。正式发布门禁不变。

### 质量收口与运行时生命周期审计

- #28 快速/风险专项通过并合并至 main eca3148。正式完整验收 run 45399678321 针对该提交启动，构建/包消费/审计通过，三浏览器矩阵在记录时仍执行。上一份完整报告 run 45387299806 是旧提交 06044e6，683/684 通过，仅 Firefox 浅色 input waitForFunction 超时；旧日志未明确断言，不应臆断根因或当作新版本已通过。
- 新批次修复 Textarea autoResize 在容器宽度变化、隐藏后恢复和字体加载时没有重测的问题。复用共享尺寸观察器，只在宽度变化时重测，清理观察器与字体事件，保留受控/非受控及 maxRows 行为。浏览器检查增加容器缩窄/恢复、输入相关阶段标记，不降低原有断言要求。
- 本地 10 个 Edge 专项组合、116 静态页、类型、API、独立包 SSR/类型消费通过；全站 gzip 最大 JS 498093B、HTML 25777B，低于既有预算。Firefox/WebKit 新候选仍待复验。
- 新增 scripts/audit-runtime-lifecycle.mjs，Chromium CDP 六轮五路由（30 次切换），每轮同一 button 页面 GC 后取 heap/DOM/listeners；后四轮 heap 8373736→8489992B（范围116256B），DOM 2904、监听518保持稳定，文档1、无 pageerror；只证明该场景，不是完整 heap-retainer 审计，不设置脆弱内存绝对门禁。证据 reference/evidence/runtime-lifecycle-20261124.json。
- 发布清单 104 条、五个维度均待完整验收，0 条全验收；不得将页面自动化、性能测试或部分证据标记为完整通过。下一次先查看完整验收 run 45399678321 与新 PR CI，再按实际失败分类治理。

### 基础控件逐组件视觉与交互验收

- #29 CI quick/targeted 成功，已合并 main 34d9f43。本批基于其内容，对照固定公开 MIT 源及官网实时浅色预览 12 个基础控件。官网部署 SHA 未知；Tabs 预览测量选中空占位，不能作原版几何结论。隐藏 native input 的 13px 几何不是可见 glyph。
- 校准主预览七项：IconButton 四项 36/36/32/32px；CloseButton 四尺寸和标签；ButtonGroup 四时间范围（旧受控演示移至 controlled）；Radio 三计费选项；Switch 胶囊/矩形各三尺寸；Textarea 404×80px 必填发行说明；SegmentedControl 每周/月/年 48×28px。保持公共组件 API，Button、Checkbox、Select 不做无意义修改；Input 内部宽度差异仍待复核。
- 本地双主题 24 组截图布局无横溢出及 pageerror，人工抽看 switch 与 dark textarea；32/32 Edge 专项（12 控件加 4 默认页面，每主题 16），新增 switch/radio/textarea 键盘和状态回归，116 静态页及类型、API、预算通过。证据 reference/evidence/basic-components-visual-interaction-20261124.json；复现 scripts/audit-basic-visual.mjs [输出目录]，browser-check.mjs --targeted --both-themes。ledger 增加 12 条视觉与 12 条交互部分证据，修正旧 visual-sample 实际只有 3 个样本；不升级正式验收状态。
- 完整验收 run 45399678321 针对 #28 合并提交 eca3148：Chromium 230/230、Firefox 230/230、WebKit 226/230。WebKit 浅/深 accordion aria-expanded 断言失败，RTL 浅色 React #418、深色布尔断言失败。690 组合中 686 通过，正式门禁仍未通过；下一批优先定位这两个实际问题，再验收 Dropdown/Popover/Tooltip/Dialog/Drawer/Accordion、日期与数值输入。不要把旧完整验收当作本批通过。

### 组合组件、图表与模板逐项视觉/交互验收

- #30 quick/targeted 成功并合并至 main 4185e8a。本批按 02–09 专项覆盖 52 个组件页与 12 个模板页。固定公开 MIT 源 ec5c5eb，官网实时浅色对照 40 个组件及 10 个独立模板；后者整页结构不同，HR/Calendar 无对应原版模板。Pro 独立实现，不取未授权源码。
- 真实修复：Dropdown 主预览操作反馈、Tooltip 三种变体、Table 搜索与状态筛选；ComposerPanel 复用 React Aria Tabs 并可受控；NotificationCenter 新通知同步、分类、未读状态与 430px 轻量面板；AgentCreator 完整配置回调与必填校验。CalendarCard 与 CalendarTemplate 共用月份逻辑，补齐前后月份、今天与选择。面积图沿真实基线闭合，折线图取消叠加填充，五个趋势图增加真实 4/8 月数据范围切换；单系列卡标题指标仍是示例值，不声称业务指标全联动。
- 仪表盘、财务、人力资源、营销模板减少层叠描边/阴影，统一语义次级表面；看板列按宽度伸展、标签自适应，移除非交互卡片误导性悬停。医疗档案仅只读虚构数据；其它模板专项含本地发送、任务新增、筛选、日期切换、关注、预览等，不代表生产后端。
- 最终 Edge 双主题 138/138 组合通过（含默认路由/RTL），64×2 视觉截图无横溢出或 pageerror；图表新增有限几何、唯一 SVG ID 断言。116 静态页、类型、API、单测、独立包 SSR/类型消费及预算通过；全站 gzip 最大 JS 500438B、HTML 25782B，模板目录 253311B。证据 reference/evidence/compound-visual-interaction-20261124.json，8 张代表性实际截图 reference/evidence/screenshots/20261124-compound/。复现 scripts/audit-component-matrix.mjs，CI 额外保留视觉矩阵 artifact。
- WebKit 旧全量 run 45399678321 为 226/230，Chromium/Firefox 各 230/230。Accordion 滚入后等待真实 aria-expanded 状态，RTL 采用确定性可见数字文本与布局/方向提交等待，保留最终断言。当前本地 Firefox 安装缺 libmozglue.dylib，WebKit 安装未完整，不能宣称根因已确认或修复通过。新增 CI WebKit 双主题专项；需检查实际输出再决定合并与完整三浏览器复验。
- ledger 仅新增部分视觉/交互证据；全部 104 项正式验收状态保持原状，不把截图、状态断言或本地 Chromium 专项当作完整跨浏览器/axe 验收。后续优先 WebKit 真实结果、未核验变体及原版模板结构差异。

### 响应式、图表数据与无障碍专项

- #31 quick/targeted 全部通过（含 WebKit Accordion/RTL 双主题与截图矩阵），合并至 main 487eb32；Pages 45406161298 build/deploy 成功，生产通知中心 HTTP 200 并包含“添加示例通知/条未读”。此前 WebKit 指定问题通过，不代表最终完整三浏览器验收。
- 本批候选基于该提交，重查固定 MIT carousel/divider/social-button 源与官网 11 个剩余条目的公开浅色页面，复用上批真实模板截图对照。Carousel 改原生 scroll-snap、边界禁用、方向适配与当前项语义；TagGroup 使用 React Aria remove slot；Questionnaire 真实 radio/checkbox、空白校验及空问题状态；WebSearch 折叠内容 inert、真实文档链接；AuthCard 本地表单校验、回调、清除密码及未连接服务说明；TaskList 状态反馈。
- Dashboard 增加招聘翻页及营收范围；Finance 现金流量主区为守恒样本流向带，范围改变数据；AI Chat 可新建多个会话、保留历史、窄屏切换会话、宽屏工作区显示真实本地消息。看板本轮沿用 #31 的自适应列，非像素复刻；AI 模板仍未连接后端。
- ChartArea 鼠标数据点、键盘可选数据点、实际数值提示；ChartCard 面积/折线图例开关、外部动态数据与空状态；Sankey 按节点入/出流量布局，路径宽度与样本量相称。修复 SVG title 多文本子节点触发 hydration #418，改为确定性单字符串；保留严格 pageerror 门禁。
- 本地 Edge 初始基线 230 个桌面双主题 axe、193 个布局组合、11 个官网采样。新候选全扫 423 组合有 9 项失败（8 hydration、1 暗色 composer-panel 选中 tab aria-controls 瞬态引用）。修复 SVG title 与 axe 前等待真实选中 tabpanel 引用，相关 21 组合复验 0 问题；首轮交互 94/106，修正实际 DOM 角色/名称、保留断言后相关 28/28，按钮 hover/focus/disabled/pressed 等 12/12。不要把不同构建结果拼成单次最终全量成功。最终 CI 另设 423 组合完整复跑并上传 artifact。自动 axe 初始状态不等同人工读屏。
- 116 静态 HTML、类型/API/单测、独立包 SSR/类型消费通过；最大 gzip JS 503239B、HTML 25773B，模板目录 253310B。证据 reference/evidence/responsive-accessibility-20261124.json 与代表截图目录。剩余 20 个条目补齐部分证据，104 项均有范围受限的证据，正式五维验收门禁未升级。下一轮先核查本批 PR CI 的最终全站复扫、实际失败项与部署，再执行真正完整三浏览器/交互态及人工无障碍验收。
- 最后补充图表指针实测：14/14 双主题专项通过；以 SVG 实际屏幕坐标触发数据点，检查 3,400 数值、离开隐藏、键盘选择、图例全部隐藏/恢复、动态更新与空状态。新增两张数据提示截图。共 197 条部分验收记录、104/104 条目覆盖；保留全站复扫与完整正式验收门禁。

### 图表、独立工作区及三浏览器验收

- #32 全部 quick/targeted（423 响应式/axe 组合）成功并合并 main 16c1575；Pages 45408765489 build/deploy 成功，生产面积图 HTTP 200，包含数据点及动态演示。
- 正式基线 run 45408057518 精确 SHA b01522c，Chromium 230/230，Firefox 228/230，WebKit 227/230，合计 685/690；release gate 跳过。Firefox Button 双主题及 WebKit Button 浅色等待超时（旧日志未细分具体断言），WebKit Input 双主题 ResizeObserver 警告。真实报告保存于本批 evidence。Button 改实际 Tab 路径并记录阶段与已访问焦点；Textarea 尺寸观察改下一帧写入，卸载取消，未过滤 pageerror。该候选待 Firefox/WebKit 真实验证，本地官方 Firefox 下载至 100% 但未完成安装，不能宣称已解决。
- 对照固定公开 MIT 源 ec5c5eb 的 app/dashboard/page.tsx、orders-chart-card.tsx、dashboard-sidebar.tsx 与此前官网实际截图。原版订单图是双柱对比，本地改为本年/去年并列柱、两者真实数值、总量和期间选择；保留近4/8月示例而非完整12个月原版。Pro 图表仅独立参考公开表现，不复制未授权源码。
- ChartCard 增量 records 接口（label/value/color/x/y/secondary），雷达、径向、热力、散点、组合及独立柱状演示共享 ChartDataInspector。触摸/鼠标高亮、可键盘选择、实际数据、动态更新、空状态；散点真实负值域/刻度，径向多圈边界，热力实际值，组合柱宽防负。核心包 BarChart/RadarChart/Heatmap 可选 activeIndex 等，API 文档别名校正，41组69导出；应用 ChartCard 不宣称已成为 npm 公共 API。
- 四条独立 /workspace/{dashboard,finance,ai-chat,project-board}/ 静态路由不占文档导航，返回文档/工作区切换/主题；看板搜索、标签筛选、任务标题/状态修改、筛选后 CSV、空态、焦点恢复；不是可拖拽看板，数据仅本地实例，刷新恢复样本。宽屏/移动端实际截图。
- 本地 Edge 36/36 双主题交互（最后 Textarea/Button 修复前），修复后相关 18/18，14/14 双主题触摸与打开态 axe（最后修复前），最终 61/61 布局/初始态 axe。120 HTML、类型/API/单测/独立包 SSR 与类型检查通过；最大 gzip JS 505356 B，HTML 25780 B。保留真实无障碍树、截图及报告 reference/evidence/chart-workspace-20261124.json，不将抽样当成单次完整通过。未进行人工读屏，全站最终三浏览器待验证。
- 新 CI 高风险添加 Firefox/WebKit Button/Input/textarea 双主题专项、工作区/图表触摸状态、全站响应式截图；正式 workflow Chromium 增加触摸检查，原严格门禁保留。下一轮先检查本批 PR CI 和正式工作流实际报告，按失败阶段修复、通过后合并部署。

### PR #33 / #34 收口（2026-11-24）

- #34 quick/targeted 全部成功，合并至 main 9ff45fd。#33 run 45410366059 的 Chromium 专项与 Firefox/WebKit 导航字体均通过，但 Firefox 双主题 button hover 样式超时；Mozilla Bug 2037020 记录 Linux headless Firefox 错报 hover/pointer 能力，当前根因仍需通过真实 CI 验证。Firefox 桌面验收改用 Xvfb headed，增加能力断言，保留真实 hover、焦点及按压检查，不修改发布门禁。已纳入 #34 主分支，需重跑全部必要 CI。

### 订单图表与工作区视觉精修（2026-11-24）

- 基于 #33 修复提交 c2bb0a4，单独堆叠候选，先收口 #33。固定 MIT OrdersChartCard 公开源码：月份 hover/选择联动标题、订单量、去年同期和真实同比；保留触摸和键盘数据点，范围切换清除旧选择但不重新挂载控件。紧凑轴刻度、增高画布、沿用上游 chart-track 与双柱颜色。
- 四个独立工作区共享单行桌面顶栏，移动端导航换行，复用主题切换组件、语义令牌和焦点环。未重构各模板业务内部。
- 最终本地 Edge：22/22 页面主题专项、14/14 触摸/交互态、20/20 双主题双视口布局与截图；120 静态 HTML，最大 gzip JS 506471B、HTML 26491B，模板目录 253422B；类型检查通过。初次候选单测通过，最终 CI 尚待执行。证据 reference/evidence/orders-workspace-polish-20261124.json 与六张代表实际截图；复现 node scripts/audit-workspace-visual.mjs [输出目录]（Playwright，可设 BROWSER_EXECUTABLE）。
- 实际截图仍显示深色次级文字/去年柱对比偏弱；应先测量具体对比度再做令牌兼容治理，不擅自整体改色。正式三浏览器、RTL、人工无障碍和五维门禁不变。
