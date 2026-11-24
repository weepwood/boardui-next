# 复刻基线

上游固定为 BoardUI/boardui@ec5c5eb3e29c2441be63b9422cd54f411ef23466。theme.css 为原版 MIT 公开源码快照，暂不覆盖现有运行时令牌，避免全站样式回归。目录映射由公开 components-index.ts 与当前文档路由建立；目录外本地项目单列。free 不代表所有资源均获 MIT 授权。

验收状态 pending / passed / failed / not-applicable；后两种通过状态须提供可追溯证据或不适用理由。视觉：同文本、字体、视口、主题、状态下截图与 computed style；交互：鼠标、键盘、焦点恢复及动画中断；API：受控/非受控、ref、事件、表单；无障碍：名称、角色、键盘和 axe；RTL：逻辑方向及浮层。

任何现有实现仅标为 existing-unverified；缺少页面标 missing。此清单不宣称任何组件达到 1:1。

正式维度结论必须关联对应条目的独立证据；not-applicable 也必须关联带明确理由及来源的记录，不能以 partial 替代。对于静态呈现组件仅固有交互可不适用，API、视觉、方向及无障碍仍按实际契约验收。最新候选的完整跨浏览器工作流仍独立执行。
