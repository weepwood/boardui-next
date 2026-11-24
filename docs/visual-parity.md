# 视觉还原优先级

还原质量优先于组件数量，公共视觉基础优先于局部修补。

- 原版主题与排版源固定在 ec5c5eb3e29c2441be63b9422cd54f411ef23466，使用 MIT 源并保留版权。Tailwind 默认 primitives 保留，不再使用早期 CSS 色值抽取覆盖。
- 1440×1000 实测几何见 reference/visual-baseline.json。专项 Chromium 验证详情页布局、主画布、字体与阴影。截图及逐状态像素验证仍待完成。
- 组件总览先使用已经移植的七个真实组件预览；其余明确标注待校准，避免用占位 UI 冒充还原。
- 中文字体使用 Fontsource 自托管 Noto Sans SC Variable；Inter optical size 与 JetBrains Mono 同样本地加载。版本与原站实际字体文件可能不一致，需要实际像素确认。
- 不复制受限 Pro 源码，不将几何测试通过认定为像素级完成。

## 第二轮校准

PR #6 已通过专项检查，本地 Edge 实测详情页与总览页双主题、1440×1000 / 390×844，无横向溢出。主内容区、标题、侧栏、目录、预览高度与桌面参考一致。画布纵坐标尚差 26px，本轮校准工具条与描述换行；Button 文档恢复四个原版演示分组，旧接口放到末尾。总览卡片使用上游轮廓动画；补充卡片几何与预览键盘切换断言。字体版本、SVG 图标与截图差异仍待验收。

## 验收标准调整（用户确认）

设计风格和交互动效一致优先，不再要求逐像素匹配。截图和几何仅作为发现明显偏差的辅助，字体渲染、细微位置、文本内容允许合理差异。视觉验收仍须检查主题、图标、状态、间距层级和动效；不跳过 API、键盘、无障碍、RTL 检查。

### SVG 图标基础

采用与上游一致的 @remixicon/react 4.9.0，按已使用名称生成静态导入表（避免引入整个库）。旧 Icon name/size/className 保留；两个历史无效日历名称映射到相近原版 glyph，未知名称使用问号 SVG。新增图标名后运行 npm run icons:generate；外部组件可直接传入任意 Remix SVG 组件。方向镜像仅针对导航箭头、侧栏折叠，不翻转商标、媒体或趋势。

Button 按压反馈兼容原生 :active 与 React Aria data-pressed；使用浏览器验证原版约 0.98 缩放及回弹，并尊重 reduced motion。

### 输入控件

Input 与 Textarea 接入固定上游 MIT React Aria 组件，复用 Label/HintText、TextFieldContext 和语义状态。旧 icon/suffix/description 与四行默认 textarea 保留。SearchField 为本地扩展，修复非空清除按钮不可见问题，使用同一套灰底与状态反馈。新增受控输入、说明关联、自动增高和清除搜索专项检查。

### 批量导航与浮层重构

移植 Tabs、PillTab、SegmentedControl、Select、Dropdown、Tooltip 及方向/chevron/菜单配方；Combobox 与 Popover 为本地扩展，复用原版共享配方。保留现有数组式适配器及原有 Menu 语义，补齐键盘、过滤、关闭与选中状态测试。

### 第四批：反馈与模态组件

Notification/Announcement 移植上游 MIT 源与 Motion，保留历史调用；Dialog/Drawer/Accordion/Collapsible/Toast 为独立本地扩展，采用原版主题、关闭控件与过渡风格。Drawer 迁移至 React Aria 模态管理；折叠内容关闭时 inert，避免键盘访问不可见内容。新增单选折叠、关闭和焦点测试。Avatar 暂时使用兼容适配器，后续单独迁移。

### 第五批：日期与数值输入

DatePicker、Slider、InputOtp 直接移植公开 MIT 实现；DateCalendar 复用上游 MonthPanel/DayCell，TimeField、NumberField、ColorPicker、TokenInput 为本地扩展。增加共享 field-styles、CalendarDate/Date 转换，保留已有调用方式。日期选择支持草稿/应用/取消、范围约束，滑块增加双端范围，颜色仅提交完整 HEX，标签支持中文逗号与批量粘贴。新增八组专项测试。

### 集中验收与积压清理

将 #9–#12 的依赖链汇总到同一份 main 候选变更，使用单次构建覆盖四个批次，不再等待每个中间分支重复构建。Textarea 自动测量时禁止 height 过渡，避免 reduced-motion 全局规则影响 scrollHeight；Dropdown 交给 React Aria 管理开关、外部关闭和焦点恢复，保留上游视觉配方；NumberField 的键盘测试按实际本地化文本框语义定位。保留原有专项断言及正式发布完整验收。旧 PR 在汇总变更合并前保留，不提前关闭。

### 第六批：数据展示与文件选择

移植 Avatar、Badge、Chip、StatusDot、Pagination、Table、TreeView 的固定上游 MIT 源及表格 CSS；DataGrid 与 DataTable 共用实现，支持数字自然排序、可控选择、行号清理。Progress/Meter 共享轨道与填充，Meter 提供语义值。FileUpload 保留多文件选择接口，接入原版配色，验证扩展名/MIME 与大小、重复项及移除回调；未集成上传服务，不显示伪造上传完成。原版进度上传演示未直接移植。

### 第七批：应用级组合组件

移植 Breadcrumb、AgentThinking、ComposerLoader、免费 AgentComposer 的固定 MIT 上游源码；Pro Composer 不复制，保留本地多行接口并引入公共加载层。NavigationItem 与 Toolbar 是可复用本地组件，侧栏固定图标位置、260/60px 宽度、子项回调；CommandPalette 采用 React Aria 模态管理与局部键盘导航，ContextMenu 使用 portal 和焦点恢复。AgentProgress 增加语义步骤。未配置的工具不伪装可用，AI 演示不接真实服务。

### 第八批：产品化第一轮

已增加实际预览包构建与消费端测试，修复安装说明与六个重点模板的交互，统一共享状态控件。详见 docs/productization.md。仍须完成其他模板和逐组件正式验收。

## 文档外壳视觉回归修复

用户反馈首页黑色描边、组件/模板双激活。重新对照固定上游公开源码 styles/theme.css、components/application/docs/showcase-card.tsx、components/application/dashboard/dashboard-sidebar.tsx。上游仓库根页面是 AgentChat starter，并非官网文档首页；站内首页保持原有导航功能，以公开 ShowcaseCard 的语义令牌和单一边界设计为参考，不声称直接复制完整官网外壳。

实测旧 border-border-primary 未定义，边框使用 currentColor（浅色近黑、深色近白）；迁移所有 border/bg/divide 的旧 border-primary 引用至真实 separator-border 或卡片对应的 border-button-default；修复 text-quaternary 旧引用。首页紧凑入口统一圆角、边界、字号、间距、焦点及悬停，主操作使用 Next Link 按钮样式，不再嵌套按钮。侧栏用唯一标准路径选中，组件与模板分独立页面；保留旧 #templates 锚点；末端树线在最后一项停止，悬停与选中分离。

实测结果 reference/evidence/docs-shell-regression-20261124.json：浅色边框 rgb(235,235,235)，深色 oklch(0.371 0 none)，两种主题均仅选中组件一个菜单。新增静态语义令牌检查、唯一导航路由及首页实际边框/组件模板跳转回归测试。静态检查仅覆盖可识别的语义类名，不能替代人工视觉复核。14 个本地专项组合、116 HTML 导出通过。

## 文档视觉重构第一批

基于已合并 #20；参考公开 ShowcaseCard、DashboardSidebar、AppShell 与主题令牌，保持已有详情页几何基线。首页移除重复的宣传卡片、缩短文案，统一页面栏宽、间距；组件目录保留真实预览与分类筛选，ResizeObserver 按实际画布与内容大小等比缩放预览，固定卡片内的说明与来源不再溢出。统一搜索容器、顶部操作、侧栏固定行高/树线/滚动定位、面包屑、TOC 和命令面板；预览工具条采用可中断 CSS 滑动指示器并支持 reduced-motion，深色画布使用页面背景而非厚重面板背景。未重写业务组件 API。

实际 Edge 截图检查 4 页 × 2 主题 × 2 视口（1440×1000、390×844）16 组合：零横向页面溢出、零卡片说明溢出、零 pageerror；截图人工抽看首页、目录、移动详情。另 10 个专项页面检查和 116 HTML 导出通过。证据 reference/evidence/docs-visual-refinement-20261124.json。仍需逐组件对照动效与设计细节，不将上述抽查视为完整发布验收。

## 初始态回归基线（2026-11-25）

正式 CI 45452007160 的 56e0c4a 提交在 Linux x64 Chromium 141.0.7390.37 捕获 11 路由×双主题×双视口，共44张截图。全部哈希和尺寸经复核，并经 AI 分组视觉检查保留为初始态回归参考，见 reference/evidence/reviewed-initial-baseline-20261125.json；执行 node scripts/verify-reviewed-baseline.mjs 可复验对应截图及审核记录。此基线不等于原站逐状态视觉批准，未审核屏幕外区域和所有动效/打开态，不自动改变 manifest verification。遵循用户已确认的设计风格与交互一致优先标准，而非强制像素一致。
