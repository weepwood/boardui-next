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
