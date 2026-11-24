/**
 * 组件元数据（纯数据，服务端与客户端均可读取）。
 * 演示内容在 registry.tsx（客户端组件）中，此文件只提供静态路由所需的键与标题。
 */

export type DocMeta = {
  slug: string;
  title: string;
  description: string;
};

export const docMetas: DocMeta[] = [
  {
    slug: "button",
    title: "按钮",
    description:
      "与 BoardUI 设计系统相匹配的按钮——三种尺寸的主要、次要、幽灵和危险变体。",
  },
  {
    slug: "icon-button",
    title: "图标按钮",
    description: "纯图标按钮，用于工具栏与紧凑操作区。必须提供无障碍标签。",
  },
  {
    slug: "chip",
    title: "筛选胶囊",
    description: "可切换的紧凑筛选标签，用于过滤列表与多选场景。",
  },
  {
    slug: "input",
    title: "输入框",
    description: "单行文本输入。浅灰底无边框，聚焦时切换为白底加描边。",
  },
  {
    slug: "textarea",
    title: "多行文本框",
    description: "多行文本输入，支持自适应高度。",
  },
  {
    slug: "search-field",
    title: "搜索框",
    description: "带清除按钮的搜索输入，遵循 iOS 风格圆角胶囊。",
  },
  {
    slug: "switch",
    title: "开关",
    description: "二元状态的即时切换控件。选中态使用蓝色渐变轨道。",
  },
  {
    slug: "checkbox",
    title: "复选框",
    description: "多选控件，支持选中、未选中、不确定三种状态。",
  },
  {
    slug: "radio",
    title: "单选框",
    description: "互斥单选控件，配合单选组使用。",
  },
  {
    slug: "select",
    title: "选择器",
    description: "下拉单选，触发按钮白底描边，面板带选中对勾。",
  },
  {
    slug: "slider",
    title: "滑块",
    description: "沿轨道拖动的数值选择控件。",
  },
  {
    slug: "badge",
    title: "徽标",
    description: "状态标记小胶囊，用于标注分类、状态或计数。",
  },
  {
    slug: "avatar",
    title: "头像",
    description: "用户或实体的图形标识。无图片时以首字母着色展示。",
  },
  {
    slug: "progress",
    title: "进度条",
    description: "线性进度指示，蓝色渐变填充。",
  },
  {
    slug: "spinner",
    title: "加载圈",
    description: "不确定进度指示器，用于等待态。",
  },
  {
    slug: "skeleton",
    title: "骨架屏",
    description: "内容加载占位，带微光扫过动画。",
  },
  {
    slug: "divider",
    title: "分隔线",
    description: "内容分隔，支持水平与垂直方向。",
  },
  {
    slug: "tabs",
    title: "标签页",
    description: "分段式切换视图，选中项白底带细阴影，切换时内容淡入。",
  },
  {
    slug: "accordion",
    title: "手风琴",
    description: "把内容折叠进原地展开的面板，使用 grid 行高动画。",
  },
  {
    slug: "tooltip",
    title: "提示气泡",
    description: "悬停或聚焦时显示的简短说明。",
  },
  {
    slug: "toggle-button",
    title: "切换按钮",
    description: "分段式切换组，选中项白底高亮。",
  },
  {
    slug: "tag-group",
    title: "标签组",
    description: "可移除的标签集合，用于展示已选项。",
  },
  {
    slug: "dropdown",
    title: "下拉菜单",
    description: "触发式操作菜单，支持图标、快捷键与危险项。",
  },
  {
    slug: "modal",
    title: "弹窗",
    description: "居中模态对话框，480px 宽、24px 圆角，带遮罩与缩放进入动效。",
  },
  {
    slug: "popover",
    title: "弹出层",
    description: "锚定于触发元素的浮层面板。",
  },
  {
    slug: "breadcrumb",
    title: "面包屑导航",
    description: "层级路径指示，末项为当前页不可点击。",
  },
  {
    slug: "pagination",
    title: "分页",
    description: "页码导航，当前页蓝底白字，长列表自动省略中间页。",
  },
  {
    slug: "counter",
    title: "计数器",
    description: "带步进按钮的数值控件。",
  },
  {
    slug: "announcement",
    title: "公告",
    description: "页面级提示条，四种语义变体，可关闭。",
  },
  {
    slug: "notification",
    title: "通知",
    description: "带色块图标的高强调提示，常用于操作结果反馈。",
  },
  {
    slug: "toast",
    title: "轻提示",
    description: "底部浮出的短暂提示，2.6 秒自动消失。",
  },
  {
    slug: "drawer",
    title: "抽屉",
    description: "从侧边滑入的面板，适合承载次要表单与详情。",
  },
  {
    slug: "number-field",
    title: "数字输入",
    description: "带上下步进的数值输入框。",
  },
  {
    slug: "combobox",
    title: "组合框",
    description: "可输入过滤的下拉选择，适合长选项列表。",
  },
  {
    slug: "table",
    title: "表格",
    description: "带表头、悬停高亮与行选中态的表格。",
  },
  {
    slug: "tree-view",
    title: "树形视图",
    description: "可展开的层级结构导航。",
  },
  {
    slug: "carousel",
    title: "轮播",
    description: "横向切换的卡片容器，带箭头与指示点。",
  },
  {
    slug: "meter",
    title: "度量条",
    description: "展示容量、健康度等比例指标，支持四种色调。",
  },
  {
    slug: "file-upload",
    title: "文件上传",
    description: "拖拽或点击上传，支持多文件与列表管理。",
  },
  {
    slug: "button-group",
    title: "按钮组",
    description: "相邻按钮合并为整体，仅首尾保留圆角，用于并列操作。",
  },
  {
    slug: "close-button",
    title: "关闭按钮",
    description: "弹窗、标签、提示等场景的统一关闭控件。",
  },
  {
    slug: "link-button",
    title: "链接按钮",
    description: "外观像内联链接，带图标与下划线展开动效。",
  },
  {
    slug: "segmented-control",
    title: "分段控件",
    description: "灰底容器 + 白底选中项 + 滑动指示器。",
  },
  {
    slug: "input-otp",
    title: "验证码输入框",
    description: "分格输入，自动跳格、退格回退、粘贴自动分发。",
  },
  {
    slug: "time-field",
    title: "时间输入框",
    description: "时/分双格输入，支持方向键步进。",
  },
  {
    slug: "social-button",
    title: "第三方登录",
    description: "内置 Google、GitHub、Apple、X、微信的品牌图形。",
  },
  {
    slug: "context-menu",
    title: "右键菜单",
    description: "区域内右键唤出，位置自动避让视口边界，点击外部关闭。",
  },
  {
    slug: "date-calendar",
    title: "日期日历",
    description: "月视图日期选择，支持上下月切换、今日高亮、禁用过去日期。",
  },
  {
    slug: "date-picker",
    title: "日期选择器",
    description: "输入框 + 弹出日历，点击外部或 Esc 关闭。",
  },
  {
    slug: "color-picker",
    title: "颜色选择器",
    description: "预设色板 + HEX 输入，实时预览。",
  },
  {
    slug: "token-input",
    title: "Token 输入框",
    description: "多值标签输入，Enter 添加、Backspace 删除末项、支持格式校验。",
  },
  {
    slug: "command-palette",
    title: "命令面板",
    description: "⌘K 风格快捷操作面板，支持分组、过滤与键盘导航。",
  },
  {
    slug: "composer",
    title: "对话输入框",
    description: "多行自适应输入，Enter 发送、Shift+Enter 换行，带工具按钮与发送态。",
  },
  {
    slug: "composer-attachments",
    title: "输入框附件",
    description: "待发送文件以横向卡片展示，可单个移除。",
  },
  {
    slug: "composer-loader",
    title: "输入框加载",
    description: "AI 生成中的三点跳动占位。",
  },
  {
    slug: "composer-panel",
    title: "对话输入面板",
    description: "带标签页的工具面板，可嵌入输入框上方。",
  },
  {
    slug: "agent-creator",
    title: "智能体创建器",
    description: "名称、角色设定、模型、温度与能力配置的一体化表单。",
  },
  {
    slug: "agent-limits-card",
    title: "智能体额度",
    description: "多项用量进度，接近上限自动转为警告色。",
  },
  {
    slug: "agent-progress",
    title: "智能体任务进度",
    description: "垂直步骤条，当前步骤脉冲高亮，完成步骤连线变绿。",
  },
  {
    slug: "agent-thinking",
    title: "智能体思考状态",
    description: "闪烁星标 + 流光文字，用于 AI 推理中的占位。",
  },
  {
    slug: "auth-card",
    title: "身份验证卡片",
    description: "登录 / 注册双模式，含第三方登录与协议勾选。",
  },
  {
    slug: "calendar",
    title: "日历",
    description: "月视图 + 事件色块 + 侧栏日程详情的完整日历。",
  },
  {
    slug: "data-table",
    title: "数据表格",
    description: "排序 + 多选 + 空状态 + 选中计数。",
  },
  {
    slug: "data-grid",
    title: "数据网格",
    description: "紧凑行高的数据表格变体，适合后台批量处理。",
  },
  {
    slug: "notification-center",
    title: "通知中心",
    description: "通知列表 + 未读气泡 + 全部已读。",
  },
  {
    slug: "questionnaire",
    title: "问卷",
    description: "分步问答，单选/多选/文本，带进度与回退。",
  },
  {
    slug: "settings-modal",
    title: "设置对话框",
    description: "左侧分类导航 + 右侧表单的完整设置面板。",
  },
  {
    slug: "sidebar",
    title: "侧边栏",
    description: "图标 + 文字 + 二级展开 + 收起模式。",
  },
  {
    slug: "stat-cards",
    title: "指标卡片",
    description: "统一响应式网格的统计卡组。",
  },
  {
    slug: "task-list",
    title: "任务列表",
    description: "可勾选清单，带优先级徽标与截止时间，完成项划线。",
  },
  {
    slug: "web-search",
    title: "网页搜索",
    description: "检索状态卡 + 可展开的引用来源列表。",
  },
  {
    slug: "activity-rings-card",
    title: "活动圆环",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "area-chart-card",
    title: "面积图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "bar-list-card",
    title: "条形列表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "combo-chart-card",
    title: "组合图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "contributions-card",
    title: "贡献记录",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "earnings-chart-card",
    title: "收入图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "funnel-chart-card",
    title: "漏斗图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "heatmap-chart-card",
    title: "热力图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "line-chart-card",
    title: "折线图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "most-active-days-card",
    title: "最活跃的日期",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "orders-chart-card",
    title: "订单图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "radar-chart-card",
    title: "雷达图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "radial-chart-card",
    title: "径向图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "revenue-chart-card",
    title: "营收图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "sankey-chart-card",
    title: "桑基图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "scatter-chart-card",
    title: "散点图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "sleep-score-card",
    title: "睡眠评分",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "stage-bars-card",
    title: "阶段条形图",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
  {
    slug: "steps-card",
    title: "步数图表",
    description: "带标题与指标的图表卡片，可直接嵌入仪表盘。",
  },
];

export const docMetaMap = new Map(docMetas.map((m) => [m.slug, m]));
