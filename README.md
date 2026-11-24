# BoardUI 复刻工程

> CI 原则：日常迭代快速检查，高风险改动专项验证，正式发布完整验收。详见 [CI 与部署](docs/ci-and-pages.md)。
>
> GitHub Pages 预览（首次部署成功后可用）：https://weepwood.github.io/boardui-next/

基于 **Next.js 15 + React Aria Components + Tailwind v4**，对 BoardUI 官网文档站进行 1:1 复刻。

## 快速开始

```bash
cd boardui-app
npm install
npm run build && npm start   # 生产模式 http://localhost:3000
```

> 注意：`next dev` 在受限沙箱内会因清理 `.next` 失败，建议直接用 build + start。

## 已实现内容

### 组件（90 个，均有独立文档页）

| 分类 | 组件 |
|---|---|
| 操作 | 按钮、图标按钮、筛选胶囊、切换按钮、计数器、按钮组、关闭按钮、链接按钮、分段控件 |
| 输入 | 输入框、多行文本框、搜索框、开关、复选框、单选框、选择器、滑块、数字输入、组合框、文件上传、验证码输入、时间输入、Token 输入、颜色选择器、日期选择器、日期日历 |
| 展示 | 徽标、头像、进度条、加载圈、骨架屏、分隔线、度量条、表格、数据表格、数据网格、树形视图、轮播、面包屑、分页、日历 |
| 反馈 | 公告、通知、通知中心、轻提示、提示气泡、问卷、设置对话框 |
| 布局 | 标签页、手风琴、标签组、弹出层、下拉菜单、弹窗、抽屉、右键菜单、命令面板、侧边栏、第三方登录、身份验证卡片 |
| AI | 对话输入框、输入框附件、输入框加载、对话输入面板、智能体创建器、智能体额度、智能体任务进度、智能体思考状态、网页搜索 |
| 图表（19） | 活动圆环、面积图、条形列表、组合图表、贡献记录、收入图表、漏斗图、热力图、折线图、最活跃日期、订单图表、雷达图、径向图、营收图表、桑基图、散点图、睡眠评分、阶段条形图、步数图表 |

### 模板（12 个）

| 模板 | 核心内容 |
|---|---|
| 仪表盘 | 统计卡 + 面积图 + 环形进度 + 热力图 + 订单表 |
| AI 聊天 | 会话列表 + 消息流 + 复合输入区（可真实发送） |
| 项目看板 | 四列看板 + 任务卡 + 看板/列表双视图 |
| 日历 | 月视图网格 + 事件色块 + 侧栏日程 |
| 财务 | 现金流 + 收支结构 + 毛利率 + 交易明细 |
| 营销 | 流量趋势 + 转化漏斗 + 渠道 ROI + 活动列表 |
| 人力资源 | 成员负载表 + 部门分布 + 负责人 |
| 医疗档案 | 生命体征 + 活动圆环 + 用药 + 就诊时间线 |
| AI 个人资料 | 封面 + 数据条 + 简介/能力/作品三标签页 |
| AI 图像生成 | 提示词面板 + 参数 + 结果网格 + 加载态 |
| 聊天入门 | 空白态引导 + 建议卡片 + 首条输入 |
| 多智能体聊天 | 智能体列表 + 执行步骤 + 协作记录 |

### 页面

- `/` 首页（Hero + 特性 + 组件入口）
- `/zh-hans/components` 组件总览（按分组，标注实现状态）
- `/zh-hans/components/{slug}` 90 个组件文档页（预览 / 代码切换 / 安装说明 / TOC）
- `/zh-hans/components/color` 颜色规范（7 组调色板 + 语义色）
- `/zh-hans/components/typography` 排版规范（字号阶梯 + 字重）
- `/zh-hans/templates/{slug}` 12 个模板页：
  仪表盘、AI 聊天、项目看板、日历、财务、营销、人力资源、
  医疗档案、AI 个人资料、AI 图像生成、聊天入门、多智能体聊天
- `/zh-hans/kitchen-sink` 基础组件实测
- `/zh-hans/advanced` 复合组件实测

### 站点功能

- ⌘K / Ctrl+K 全局搜索（键盘上下选择、回车跳转）
- 侧边栏三级导航树（树状导引线、折叠动画、当前项高亮）
- 右侧 TOC 目录（滚动监听高亮）
- 暗色模式（View Transitions 过渡）
- 面包屑、预览/代码双视图、代码复制

## 核心设计

### 设计令牌（程序化抽取，非手抄）

| 文件 | 内容 | 数量 |
|---|---|---|
| `app/styles/tokens.css` | 颜色 / 阴影 / 圆角 / 渐变 | 538 |
| `app/styles/typography.css` | 完整排版系统 | 212 |
| `app/styles/keyframes.css` | 全部动画帧 | 45 |

重新生成：

```bash
python3 scripts/extract_tokens.py
python3 scripts/extract_typography.py
```

### 动效规格

- 缓动曲线：`cubic-bezier(0.22, 1, 0.36, 1)`（`ease-bui`）
- 侧边栏 / 手风琴折叠：`grid-template-rows` 0fr↔1fr，300ms
- 按钮按压：`data-pressed` → `scale(0.98)` + 渐变换色，150ms
- 弹窗进入：`scale(0.96) + translateY(6px)`，220ms
- 主题切换：View Transitions API
- 全局尊重 `prefers-reduced-motion`

### 五个关键工程约定

1. **令牌必须写在 `@theme` 里**
   Tailwind v4 只识别 `@theme` 块内的令牌。写成普通 `:root` 时变量存在但
   `bg-*` / `text-*` / `shadow-*` 工具类**不会生成**，样式静默失效。

2. **非标准圆角档位需显式注册**
   `--radius-2lg` 必须在 `@theme` 声明，否则 `rounded-2lg` 不生成。

3. **状态样式用 render prop，不用复杂任意变体**
   `{({isSelected}) => ...}` + 静态条件类名可靠；
   `[&[data-selected]>span]` 这类 Tailwind 扫描不到。

4. **客户端注册表不能给服务端用**
   `"use client"` 模块在服务端读到的是空引用。路由元数据放在 `lib/docs/meta.ts`，
   演示内容放 `lib/docs/registry.tsx`，由客户端组件渲染。

5. **React Aria 的 Checkbox/Radio 是 `<label>` + 隐藏原生 input**
   没有 `role="checkbox"`，验证时要用 `input[type="checkbox"]`。

## 目录结构

```
app/
├── components/
│   ├── docs/          # 布局：Sidebar / TopBar / TOC / 预览 / 搜索
│   ├── ui/            # 80 个组件文件
│   └── templates/     # 12 个模板页（仪表盘、AI 聊天、看板、日历…）
├── styles/            # 抽取的令牌
└── zh-hans/           # 文档路由
lib/
├── navigation.ts      # 导航树（108 个链接）
└── docs/              # 文档注册表 + 元数据
scripts/
├── extract_tokens.py       # 令牌抽取
├── extract_typography.py   # 排版抽取
└── verify_interactions.mjs # CDP 交互验证
```

## 验收结果

| 项目 | 实测 | 原站 |
|---|---|---|
| 按钮尺寸 | 60×36，圆角 10px | 80×36，10px |
| 按钮渐变 | `rgb(48,128,255) → rgb(21,93,252)` | 同 |
| 按压反馈 | `data-pressed` + `scale(0.982)` | 同 |
| 弹窗 | 480px / 24px 圆角 / 16px 0 padding | 同 |
| 菜单 | 10px 圆角 / 1px `rgb(235,235,235)` 描边 | 同 |
| 侧边栏折叠 | 188px → 55px → 0px，300ms | 同 |
| 深色模式 | `#121212` / `#fafafa` | 同 |

## 全站验证结果（最终）

| 项目 | 数量 | 状态 |
|---|---|---|
| 组件文件 | 80 | ✅ |
| 组件文档页 | 90 | ✅ |
| 模板页 | 12 | ✅ |
| 文档页合计（组件 + 模板） | 102 | ✅ |
| 站点总页面（含首页/总览/规范/kitchen-sink/advanced） | 111 | ✅ |
| 代码行数 | 17,016 | — |
| 设计令牌 | 538 + 212 排版 + 56 动画 | — |

### 新增收获（第三批 51 个组件）

- **服务端组件不能读客户端模块**：总览页曾用 `docs`（`"use client"`）判断实现状态，
  服务端读到空对象，导致全部显示"待实现"。改用纯数据 `docMetaMap.has(slug)` 修复。
- **派生组件比重写省事**：DataGrid 由 DataTable 派生（改行高），CalendarCard 由
  CalendarTemplate 派生（改函数名），省去大量重复代码。
- **ChartCard 用 kind 枚举统一 19 种图表**，避免 19 个近乎相同的文件。

## 视觉一致性校准（逐组件实测）

所有组件样式均通过 CDP 读取原站 `getComputedStyle` 实测校准，非凭印象实现。

`scripts/probe.mjs` — 在指定 URL 执行探测表达式，返回几何与样式数值
`scripts/precise-diff.mjs` — 原站 vs 本地批量比对

### 关键实测结论

**输入类组件统一规范**（Input / Textarea / NumberField / Combobox / SearchField）
- 背景 `rgb(235, 235, 235)`（background-tertiary-default）
- 无 border，10px 圆角（搜索框为全圆角）
- 焦点：`ring-2 ring-inset ring-border-focus-ring`
- 高度 36px

**开关三层结构**
```
轨道（渐变 + inset 高光）
└── 圆钮（白 → #f7f7f7 渐变，圆形或 2px 圆角）
    └── 内芯（蓝色渐变 + 0.5px 描边）
```
尺寸：28×16 / 42×24 / 56×32，内芯 0 / 7.5px / 10px

**滑块**
- 轨道 6px，底轨带 `inset 0 1px 1px rgb(0 0 0/.06)`
- 填充 `accent-500 → accent-600` 横向渐变 + 内高光
- 圆钮 20×20，1px `#ebebeb`，`0 2px 4px rgb(0 0 0/.10), inset 0 1px 0 rgb(255 255 255/.8)`
- 拖拽/悬停时弹出数值气泡

**标签页是下划线样式**（不是分段胶囊）
- 容器底部 1px 分隔线，项 padding 8px 10px
- 选中：文字 accent-600 + 底部 2px 蓝线

**分段控件**（SegmentedControl 才是胶囊样式）
- 容器 padding 4px，项 6px 圆角、padding 4px 10px

**表格**：padding 10px 12px，表头 bg `rgb(247,247,247)`
**分页**：按钮 84×32，8px 圆角

### 第二轮校准（kitchen-sink / advanced 逐块严查）

| 组件 | 实测规格 |
|---|---|
| Checkbox | 16×16，4px 圆角，SVG 16×16 viewBox（勾路径 `M4 7.7 L6.646 10.347 L12 5.7`） |
| Radio | 16×16，`shadow-xs` |
| Button | padding **8px**，字号 14px/500，圆角 10px，图标间距 **2px** |
| Accordion | **无边框列表**，项仅底部 1px 分隔线；按钮 h54 / padding 16px 0 / 圆角 8px |
| 预览切换条 | 容器 padding 4px，项 6px 圆角 / padding 4px 10px |

**开关几何校验（实测确认）**
- 中号：轨道 42×24，圆钮 18×18，开启 left 21px、关闭 left 3px（间距均 3px）
- 小号：轨道 28×16，圆钮 12×12，开启 left 14px

### 第三轮校准（19 个图表组件）

图表类的偏差比基础组件更大——原站用 recharts / 手绘 SVG，结构复杂度高，
我最初做的多是「简化示意」，缺失坐标轴、网格、图例。

| 图表 | 原站真实结构 | 修正内容 |
|---|---|---|
| 面积/折线/营收类 | recharts 渲染，**4 条网格 + Y 轴刻度 + X 轴月份 + 多条曲线 + 图例卡** | 新增 `ChartArea`：网格、双轴、多 series、渐变填充 |
| 图例卡 | 181×57、10px 圆角、白底、padding 8px 10px、**色点 12px 圆角 4px（方块非圆点）** | 重写 `ChartLegend` / `FunnelLegend` |
| 图表卡片外壳 | **576×365、16px 圆角、浅灰底 `rgb(247,247,247)`、padding 16/16/12、无边框无阴影** | 由白底描边卡改为浅灰无边框卡 |
| 漏斗图 | **水平流向**，4 段梯形平滑相连，段内白底胶囊标注占比，底部 4 张图例卡 | 由垂直梯形改为水平连接梯形 |
| 径向图 | **5 圈同心环**，每圈一分类，同色淡底轨 + 彩色弧，下图例卡 | 由单值圆环改为多圈环 |
| 活动圆环 | **图例卡在顶部**，3 圈粗环（宽 8.6%），同色 16% 底轨，圆头端点 | 补图例、加粗环、改底轨为同色淡底 |
| 条形列表 | **带标签栏**（设备/浏览器/操作系统），行内浅蓝胶囊条含图标+名称，右侧百分比 | 由条形图改为标签页式列表 |

**关键教训**：图表不能靠「看着像」实现。原站漏斗是水平流动，我第一版做成垂直梯形堆叠，
方向就是错的。必须截图确认结构，再量尺寸。
