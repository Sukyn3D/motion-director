---
name: motion-director
description: "为网页与 App 设计、实现和优化连续且丰富的 UI 动效：完整覆盖控件微交互、出现/离开与滚动进退，结合案例库源码、语义与材质编排复合响应，并验证中途反向、物理交接、状态和真实输入。适用于从零规划及保留现有界面的优化。"
metadata:
  version: "1.0"
---

# Motion Director 1.0

把 Motion Orchestrator 的运动设计与物理语言，与 Motion Director 的发现、合同、实际轨迹验证合并。目标是范围内每个合格节点都获得精心设计的运动表达，同一对象的动作接得住后续输入；完整覆盖和表现深度都要落实。

## 工作模式与执行

- **Enhancement**：保留现有内容、布局端点、品牌、业务与技术栈，补全覆盖并升级运动；读 [enhancement.md](references/enhancement.md)。
- **Art Direction**：从零设计或完整动效规划，结合视觉风格定义运动语言；读 [art-direction.md](references/art-direction.md)。
- 审查任务输出诊断、建议与验收计划，不改产品；沿案例库参考中的审查例外查相关实现，无须重新搜全目录。已授权的实现直接推进；简单修改内联记录，复杂路径才写完整合同。

实现任务先读 [execution-completeness.md](references/execution-completeness.md)：把适用能力落实到范围内的真实家族、变体、实例与代码入口，按现有覆盖矩阵追踪设计、接线和运行证据。完整执行表示适用项没有静默遗漏，不表示把全部技术套给每个对象；正常模式的效果要可感知，原有有效反馈不能默认削弱。

优化现有界面时，以静态几何和实际输入为回归基线；涉及控件、覆盖层、过滤重排或新增动效层时读 [lifecycle-regressions.md](references/lifecycle-regressions.md)。普通逻辑 focus 不能维持探索反馈；退出完成包含蒙层；布局提交与逆变换必须在同一可见帧前完成；动效层不得改变原有布局约束。规则须落实到通用家族实现与真实验收，不能仅针对被报告的选择器打补丁。

### 1. Audit：完整发现

沿出现/离开→hover/focus→press/activate→状态/icon→布局/导航→拖动/释放→滚动进退扫描。按 [coverage.md](references/coverage.md) 建立节点与状态清单，所有可操作控件都有微动效和出现动画；内容组与滚动对象也有进入、退出及重入表达。已有动效也要审查精细度、辨识度和连续层次，寻找贴合结构的提升；评估后确实成熟的才记 keep并说明理由；遗漏不能用“优先级低”悄悄跳过。先解决断点与高风险关系，再完成余项。读 [audit.md](references/audit.md)。美感、品牌气质、氛围与精致度是有效价值；不能仅因没有功能性目的删除已有润色，删减必须说明实际冲突与保留/替代。

### 2. Design：从单薄反馈到复合连续响应

设计阶段统一阅读[design-foundations.md](references/design-foundations.md)及[principles.md](references/principles.md)。Apple、Google Material 3、Disney、Microsoft Fluent 2、IBM Carbon是同层级、同地位的并列设计依据，阅读入口、家族评审和采纳决策相同，不设来源权重，不把任何体系降为背景或补充。按五个视角共同审查连续跟手、轨道分类、主次表现、全局编排与语义效率；详细机制按任务展开。WAI的可访问性要求对所有方案统一生效。

每次设计或优化动效，在审计后按交互场景、品牌风格与现有技术栈检索 React Bits / Vue Bits，读 [reference-libraries.md](references/reference-libraries.md)。查看候选的可操作预览、参数、依赖与实际源码，优先从适合的成熟实现中选择、改造或组合，提炼其有辨识度的运动机制；同结构、同意图的家族统一核心机制，按形状/材质划分合理变体；用户不满意并要求更多方案时，按案例库规则制作六个可交互且主机制不同的适配方案，等待选择后再整合。不同交互家族按结构比较不同主机制，不机械套用整个组件或默认参数，卡片不默认磁吸/跟随。将选择理由、来源、改造和验证记入现有家族合同。两库是实现与审美资源，五套设计依据的并列地位及现有不变量保持；无匹配或访问受限时按资源中的降级路径继续，并记录证据边界。

读 [motion-language.md](references/motion-language.md) 和 [composition.md](references/composition.md)：选 productive / expressive / narrative 基础语言，按控件结构、动作含义、材质和频率决定主响应、相关次响应与稳定姿态。表达强度有主次；不能靠重复一套 fade/scale 或堆效果交差。需要材料、手势、弹性时读 [physics.md](references/physics.md)；滚动读 [scroll.md](references/scroll.md)，文本/图片/UI的首次出现与双向边缘进退分别落实，并登记实际实例、滚动容器和运行证据；仅有规则或helper不算接线。交互造型读[experience-quality.md](references/experience-quality.md)：Icon本身不做独立位移或旋转，按语义使用缩放、颜色/描边/填充、形状或对齐淡变；hover/focus不一律加底色，反馈贴合实际造型，不给图标、圆形控件、滑块统一套矩形按压框。图片运动和正文/按钮分层，不能裁掉可读内容。组合反馈或覆盖层返回时读[interaction-state.md](references/interaction-state.md)，统一校准真实hover、键盘焦点与按压状态。弹出/详情/视频播放器读[overlays.md](references/overlays.md)，先核对源/目标实际图片与呈现身份：图片不同用普通弹窗入退，不强行同图飞行；普通弹窗为默认；图片一致且身份成立仅提供共享转场资格，还须有适合的语义与设计决策。用户禁用飞行时覆盖所有入口和返回路径。关闭后背景布局、滚动与控件状态稳定。内容或状态会改宽高时必读 [layout-continuity.md](references/layout-continuity.md)，在真实组件上接入尺寸与邻接布局过渡，不能仅给颜色/Icon加transition；图库跨呈现方式须连续交接同一图像的位置、尺寸、裁切与朝向，按钮和弹窗须协同内外布局，不能先重排内容再补外框动画。

为节点/组件家族记录五个并列视角的采用/调整/不适用及理由，以及触发、状态、锚点、轨道、时序、打断、输入替代与验收；模板见[design-contract.md](references/design-contract.md)。各体系的细节按相关机制展开，共用家族评审，不增加某一来源的专属必填字段或逐项打卡。同族规则覆盖全部实例，小任务内联记录，不反复创建文档。

空间与透明度/颜色分轨，各自有owner、范围、速度档和重定向策略，不能共享带过冲的空间输出。Material方案与本包用途模式分别记录。轨道关系由对象语义、结构与五个并列依据共同决定：Apple连续交接、Material分轨、Disney主次跟随、Fluent层级编排和Carbon语义一致。结果和操作立即有效，预备/表演不得阻塞输入。

### 3. Implement & Review：落地闭环

沿项目现有栈接入选中的案例源码或改写其机制，核对实际版本、实例生命周期与现有属性owner；结合 [patterns.md](references/patterns.md) 补齐连续交接与项目端点；当前库里的单模式只是原料，必须补齐本版本的控件/滚动生命周期。[完整交互实验](assets/craft/index.html) 演示复合响应、状态反向、滚动进退和软体释放。

[交互体验实验](assets/experience/index.html)提供可操作样本。验收覆盖实际文字/UI、控件内部图形、窗口返回及内部附属层，不只检查外框和最终态；范例通过不能替代项目检查。

按 [validation.md](references/validation.md) 用真实输入查看初段、中途、结束与改目标后的接续；按 execution-completeness 核对适用项的真实接线和运行证据，包含外框尺寸、滚动内容、弹窗前后背景和原有反馈感知；未接入或无中间呈现的项仍是gap，修复后复测受影响路径。Web与App机制见 [platforms.md](references/platforms.md)，不因技能而换库。

## 七项设计规则

1. **自主过渡非线性**：进入、退出、状态、布局和释放都用有加减速的缓动或连续物理运动，避免恒速位移、硬启动/硬停止。中途改向继承当前呈现及合理速度，不强迫已有运动先停下再从零加速。直接操控/真实进度忠实跟随输入，材料与释放层再体现非线性。
2. **合格节点完整覆盖**：每个操作控件的出现、hover（设备支持时）、focus、press/activate、状态变化都有对应设计；文字/内容按有界组进入离开。原生反馈可计入，但须实际审查其生命周期、连续性和表现；静止理由不能替代遗漏的控件反馈。
3. **材质与动力学有因果**：适合的柔软对象根据接触、方向、速度/加速度形变与跟随，释放继承速度、受约束并耗散至稳定；形变不是固定播放的假摆动，真实拖动位置与材料层分离。
4. **弹性按对象设计**：适合的空间/装饰轨道使用有界轻弹性并自然稳定；任务密集场景保持较短恢复。颜色、透明度、正文、真值和命中区不随弹簧越界。弹簧也可无明显回弹。
5. **同控件状态连续**：颜色、形状、填充、图标、内容驱动的宽高及相关布局从当前呈现过渡；兼容形状可变形，不兼容用对齐的交叉淡变/局部重构，不假称通用morph。业务值、aria和结果立即更新；视觉不替代真实状态。
6. **滚动进入与退出可逆**：正常模式对下方尚未进入的文字组、图片和UI落实可感知reveal：透明度0与向下偏移→上移至自然位置且完全不透明；再按真实边缘关系提供退出与重入，保持中央阅读区稳定。初始已可见/滚动恢复内容不倒退隐藏；快速反向从当前呈现接续。保留系统滚动；不把退出做成删除DOM，不将聚焦/操作对象隐藏。减少动效保留静态内容和必要进度。
7. **丰富来自相关轨道协作**：交互设计考虑表面/空间/边缘、子元素/图标与时序的关联；通常选择一个主响应和一个有因果的次响应。单一换色、放大或淡入是待深化起点；每种控件选择适合自己的组合，不能把某个按钮演示提升为全站模板，也不把卡片hover统一为跟随鼠标；保留有效表现的感知强度，以机制、材质和节奏深化，而非统一缩小幅度。已有表现也评估能否细化材质、显露方式、主次和接续；无明确问题不删除美感润色，成熟方案可有证据地保留。

## 实现不变量

**内容驱动的尺寸与布局连续**：同一对象因文案、状态、异步内容、展开收起或响应式布局改变自然尺寸时，宽度、高度及受影响的相邻布局从当前实际呈现非线性过渡到新端点，避免跳动。保留对象身份，业务与语义立即更新；文字、Icon和图像不随外框拉伸。按真实布局测量或平台layout机制实现，途中反向接续当前尺寸与位置，结束恢复自然布局并适应后续内容变化；减少动效直接呈现可用端点。具体适配见 [layout-continuity.md](references/layout-continuity.md)。

**几何透明的动效层**：没有业务布局变化时，接入动效前后及清理后的占位、父约束、断点、图文顺序、合法裁切与可点击区域相同。新增 wrapper、portal、占位或 CSS 覆盖必须核对 direct-child/grid/flex/定位上下文、媒体 auto/max 尺寸与祖先变换；不能用固定高度、全局 overflow:hidden 或降低 z-index 掩盖图片侵入。默认复用已有呈现层；必要的新层按原约束适配，并通过全家族几何回归。

语义与业务立即响应，不等待视觉结束、不为表演锁住控件。位置连续（C0）；可打断空间尽量速度连续（C1）；身份、锚点与状态也连续。弹出与返回交接涵盖图像、Icon、标签、蒙层、正文和媒体chrome；附属元素按端点可见性从当前呈现过渡，不能在移除临时层时硬闪。一个属性同一时刻一个所有者，layout/drag/press/material分层，取消与过期回调有明确出口。

命中区、焦点、平台返回/滚动可靠；触屏和键盘有等价响应。临时视觉层 inert/aria-hidden，隔离真实组件的类、ID、data-action、业务查询与事件绑定，清理后不残留。处理失焦、取消、卸载、动态减少动效。减少动效、平台不可覆盖区域、明确超出任务范围是覆盖例外，必须具名记录；不能以“高级感不需要”默认豁免控件。

## 按需资源与交付

| 需要 | 资源 |
|---|---|
| 完整执行、实际接线与完成条件 | [execution-completeness.md](references/execution-completeness.md) |
| 覆盖判定、清单与例外 | [coverage.md](references/coverage.md)、[audit.md](references/audit.md) |
| 必读设计依据、风格与复合编排 | [design-foundations.md](references/design-foundations.md)、[principles.md](references/principles.md)、[motion-language.md](references/motion-language.md)、[composition.md](references/composition.md)、[experience-quality.md](references/experience-quality.md) |
| 物理、参数、帧率 | [physics.md](references/physics.md)、[tokens-physics.md](references/tokens-physics.md)、[motion-tokens.json](assets/motion-tokens.json) |
| 滚动、合同、平台 | [scroll.md](references/scroll.md)、[design-contract.md](references/design-contract.md)、[platforms.md](references/platforms.md)、[overlays.md](references/overlays.md) |
| 案例库查找、源码改造与选型证据 | [reference-libraries.md](references/reference-libraries.md) |
| 模式、语义配方与来源 | [patterns.md](references/patterns.md)、[recipes.md](references/recipes.md)、[catalog.md](references/catalog.md)、[sources.md](references/sources.md)、[inspiration.md](references/inspiration.md) |
| 输入状态、复合反馈与覆盖层返回 | [interaction-state.md](references/interaction-state.md) |
| 焦点来源、蒙层退出、首帧重排与布局回归 | [lifecycle-regressions.md](references/lifecycle-regressions.md)、[独立可操作回归样例](assets/regressions/index.html) |
| 实际验证、独立对照 | [validation.md](references/validation.md)、[benchmark.md](references/benchmark.md) |

大范围交付覆盖矩阵、运动语言、实施项、真实输入/轨迹证据与未覆盖原因；小任务缩减为相关状态与验证结果。完成标准：范围内适用能力落实到全部合格实例，尺寸/滚动等有真实中间呈现，弹窗关闭无背景抖动，原有有效反馈无未说明的感知降级；复合表达贴合结构、连续操作可靠、物理有界、减少动效功能一致。动画数量不能代替品质。资源已测不等于真实项目已测；没有运行证据时标明未验证，不承诺普遍审美优胜、所有设备无缺陷或原生App真机性能。
