# 按需模式库

先读覆盖、audit和composition决策与项目现有栈，再按 [reference-libraries.md](reference-libraries.md) 检索外部案例并选机制。本页用于补齐连续交接、组合与访问受限时的实现；当前范例是单机制原料，不是控件生命周期完整覆盖；scroll/复合微交互默认优先[完整交互实验](../assets/craft/index.html)与[continuous.mjs](../assets/craft/continuous.mjs)。每项含适用、不适用、关键不变量、原生 Web 可运行模块；`assets/lab/index.html` 是整合实验室。模块参数/生命周期见文件导出函数，HTML 结构和接线见 `assets/lab/lab.mjs`。不要把整个实验室复制进产品。

| 模式 | 适用与问题 | 不适用/退让 | 可运行资源 |
|---|---|---|---|
| 稳定点击区 + 局部 press | 有操作但触觉反馈薄弱；内层缩放，目标不移动 | 已有native-verified完整反馈可keep；正文不变形 | [press.mjs](../assets/patterns/press.mjs) |
| 身份稳定的 icon 状态 | 收藏、开关图标含义变化；业务/aria 立即、填充单调过渡 | 无状态图标跟随所属控件反馈；无兼容路径不承诺morph | [icon-state.mjs](../assets/patterns/icon-state.mjs) |
| 导航空间标记 | 需要显示当前位置与切换方向；标记重定向保留速度 | 大量异构导航、用户无法看到来源；优先平台原生 | [navigation.mjs](../assets/patterns/navigation.mjs) |
| 来源锚定的详情交接 | 同一图/对象进入详情，返回应找到来源 | 无共享身份、仅为炫技扩大图片；保留原端点 | [anchored-detail.mjs](../assets/patterns/anchored-detail.mjs) |
| 身份稳定的列表重排 | 筛选/排序时对象关系容易丢失；新目标接续旧状态 | 数据密集场景不需要长入场；大量节点需性能策略 | [identity-list.mjs](../assets/patterns/identity-list.mjs) |
| 真实数值 + 图形过渡 | 比较两组数据；数字立即、图形短单调变化 | 真实计时/进度造假、把最新值弹到不存在的数字 | [data-chart.mjs](../assets/patterns/data-chart.mjs) |
| 受控内容组入场 | 新内容有阅读先后；父组或短序列 | 一次入场机制需结合scroll进退；避免控件等待长队列 | [group-entry.mjs](../assets/patterns/group-entry.mjs) |
| 稳定目标的品牌磁吸 | 少数低频核心 CTA，品牌目标明确 | 高频工具、触屏、减少动效；不会为了按钮类型自动用 | [brand-magnet.mjs](../assets/patterns/brand-magnet.mjs) |
| 操作与材料分层 | 柔软品牌对象、拖动/释放；中心直接跟手 | 文字/数据、无材料语义、需要真正流体/碰撞求解 | [soft-drag.mjs](../assets/patterns/soft-drag.mjs) |

卡片设计另读 [card-direction.md](card-direction.md)，按结构选择主机制，不能把品牌磁吸模式作为全部卡片默认。窗口先按 [overlays.md](overlays.md) 核对实际封面一致性，内容变化的真实尺寸按 [layout-continuity.md](layout-continuity.md) 接线。

## 从范例到项目

需要更细的候选时读 [catalog.md](catalog.md)：按钮、导航、卡片、视图转场、图标、数据各五套，共30套；[展厅](../assets/gallery/index.html) 提供可运行交互与适用/不适用说明。它们与下方集成步骤共用原有 runtime。复杂连续交接/拖动继续优先原有9个深层机制范例。不要默认装载30套，也不要将演示假数据/模拟异步接入真实业务。

1. 明确目标节点、状态来源与端点。检查哪些属性已被现有 CSS/动画库写入。
2. 只带入所需机制，沿用现有组件、稳定 key、平台动画与 cleanup。坐标与布局算法需要适配，不硬套实验室绝对定位。
3. 颜色/透明度使用单调效果轨道；空间 helper 保留当前位置/速度。磁吸、按压、拖动分层，不能同写一个 transform。
4. 明确指针取消、键盘、失焦、prefers-reduced-motion 动态变化和卸载；示例的 destroy 必须释放自己的资源。
5. 使用正常速度验收。实验室展示原理，不是有/无 skill 的独立生成胜率测试。

Icon 范例是同一 SVG 的轮廓/填充过渡，没有声称通用路径 morph。详情范例为同一可见图层的锚定展开，不声称实现跨文档 View Transition。列表范例在隔离容器里展示稳定身份和改目标；真实 CSS flow 优先原有框架 layout 或适配 FLIP 坐标变换。软体范例是受限二维近似。
