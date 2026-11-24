# 视觉还原优先级

还原质量优先于组件数量，公共视觉基础优先于局部修补。

- 原版主题与排版源固定在 ec5c5eb3e29c2441be63b9422cd54f411ef23466，使用 MIT 源并保留版权。Tailwind 默认 primitives 保留，不再使用早期 CSS 色值抽取覆盖。
- 1440×1000 实测几何见 reference/visual-baseline.json。专项 Chromium 验证详情页布局、主画布、字体与阴影。截图及逐状态像素验证仍待完成。
- 组件总览先使用已经移植的七个真实组件预览；其余明确标注待校准，避免用占位 UI 冒充还原。
- 中文字体使用 Fontsource 自托管 Noto Sans SC Variable；Inter optical size 与 JetBrains Mono 同样本地加载。版本与原站实际字体文件可能不一致，需要实际像素确认。
- 不复制受限 Pro 源码，不将几何测试通过认定为像素级完成。
