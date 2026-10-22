# 六类各五套动效模式

按审计结果选机制；不按组件类型硬套。全部为自主实现的原生 Web 范例，可在现有 React/Vue/Svelte 或原生平台中适配语义与机制。六个模块每个导出 `mount(root, id, pref)`，返回 `{ destroy() }`；`pref`来自 `assets/runtime/motion-runtime.mjs` 的 `createPreference()`。HTML由模块构造，配套样式在 `assets/gallery/gallery.css`，仅按需提取。

[可运行展厅](../assets/gallery/index.html) · [深层机制实验室](../assets/lab/index.html) · [三阶段设计合同](design-contract.md)

启动本地静态服务器后访问展厅，ES module 不能保证以双击 file:// 加载。示例请求、播放、复制是明确标记的模拟，不接入真实服务。共享对象示例只在同一局部视图，不能声称跨文档转场。原生 App 当前仅有适配指导，未提供30套SwiftUI/Compose真机代码。

## 按钮微交互

### B1 · 局部按压

- 效果：内层收缩，稳定点击区域，释放受控回弹。
- 适用：高频操作反馈薄弱。
- 不适用：原生反馈已充分；不可交互正文。
- 状态合同：Pointer/Space 按下→释放；操作计数立即更新。
- 可运行代码：[buttons.mjs / b1](../assets/gallery/patterns/buttons.mjs)；[操作范例](../assets/gallery/index.html#b1)

### B2 · 局部标记强调

- 效果：箭头局部缩放与明度协作，位置和方向保持稳定。
- 适用：下一步、打开、跳转等有明确方向的 CTA。
- 不适用：保存、删除等没有前进语义的操作。
- 状态合同：Hover/focus→leave/blur；点击立即确认。
- 可运行代码：[buttons.mjs / b2](../assets/gallery/patterns/buttons.mjs)；[操作范例](../assets/gallery/index.html#b2)

### B3 · 受控磁吸

- 效果：精确指针驱动内层偏移，表面受控跟随，图标无独立位移，离开回弹。
- 适用：少量低频品牌 CTA。
- 不适用：工具栏、触屏、减少动效；不移动点击区。
- 状态合同：Pointer move→leave；触屏/键盘仅状态反馈。
- 可运行代码：[buttons.mjs / b3](../assets/gallery/patterns/buttons.mjs)；[操作范例](../assets/gallery/index.html#b3)

### B4 · 异步按钮状态

- 效果：idle→pending→success/error；短淡变，过期结果隔离。
- 适用：真实提交/重试已有异步状态。
- 不适用：纯同步操作；不能凭动画伪造完成。
- 状态合同：模拟请求；可重试、取消；业务防重独立决定。
- 可运行代码：[buttons.mjs / b4](../assets/gallery/patterns/buttons.mjs)；[操作范例](../assets/gallery/index.html#b4)

### B5 · 有界成功环

- 效果：真实成功后单次描边确认，重复输入替换旧反馈。
- 适用：低频完成动作，短暂确认有帮助。
- 不适用：每次键入、高频工具、无限粒子。
- 状态合同：点击确认→单次 ring；失败不播放成功。
- 可运行代码：[buttons.mjs / b5](../assets/gallery/patterns/buttons.mjs)；[操作范例](../assets/gallery/index.html#b5)

## 导航切换

### N1 · 连续下划线

- 效果：当前位置标记沿相邻目的地接续，保留当前速度。
- 适用：同层可见导航，有明确当前位置。
- 不适用：无同层关系；不为链接伪造 tab 语义。
- 状态合同：点击/方向键/Home/End；最新 tab 即时更新。
- 可运行代码：[navigation.mjs / n1](../assets/gallery/patterns/navigation.mjs)；[操作范例](../assets/gallery/index.html#n1)

### N2 · 分段胶囊

- 效果：稳定标签上的背景标记移动，状态颜色独立过渡。
- 适用：互斥视图、显示方式、短分段选择。
- 不适用：多选筛选、很长标签列表。
- 状态合同：选择切换可反向；宽度按真实端点测量。
- 可运行代码：[navigation.mjs / n2](../assets/gallery/patterns/navigation.mjs)；[操作范例](../assets/gallery/index.html#n2)

### N3 · 层级展开

- 效果：父项箭头在原位对齐淡变，子项共同展开；无长逐项队列。
- 适用：侧栏层级与子项来源需要解释。
- 不适用：平级导航、深树全量入场。
- 状态合同：展开/收起/Escape；收起子项立刻 inert。
- 可运行代码：[navigation.mjs / n3](../assets/gallery/patterns/navigation.mjs)；[操作范例](../assets/gallery/index.html#n3)

### N4 · 路径层级标记

- 效果：祖先路径中的当前层级局部强调；共享标记接续。
- 适用：层级面包屑/钻取，明确当前位置。
- 不适用：把祖先路径误当可随意互换的 flat tabs。
- 状态合同：层级选择→aria-current；真实产品沿用导航链接。
- 可运行代码：[navigation.mjs / n4](../assets/gallery/patterns/navigation.mjs)；[操作范例](../assets/gallery/index.html#n4)

### N5 · 步骤进度关系

- 效果：当前步骤标记与已完成连线关联，保持流程顺序。
- 适用：允许导航的步骤流程，展示完成关系。
- 不适用：强制验证流程不能由视觉绕过；不伪造完成。
- 状态合同：前进/返回→当前步骤即时变化；示例为可自由浏览流程。
- 可运行代码：[navigation.mjs / n5](../assets/gallery/patterns/navigation.mjs)；[操作范例](../assets/gallery/index.html#n5)

## 卡片交互

按[card-direction.md](card-direction.md)比较不同主机制，同族保持一致；下列代码是原料，轻微/短过渡描述范例起点，不是将既有有效反馈一律调弱的规则。

### C1 · 局部行动提示

- 效果：标题静止，行动箭头响应；焦点和触屏也可访问。
- 适用：真实可点击卡片需要探索暗示。
- 不适用：说明卡片、密集阅读区域。
- 状态合同：Hover/focus；链接一直可用，不隐藏操作。
- 可运行代码：[cards.mjs / c1](../assets/gallery/patterns/cards.mjs)；[操作范例](../assets/gallery/index.html#c1)

### C2 · 受限图像探索

- 效果：图片轻微缩放，容器裁切，文字与点击区稳定。
- 适用：作品/商品图片的探索入口。
- 不适用：精确图像对比、医学/测量图片、纯说明图。
- 状态合同：Fine hover；触屏仅 press，减少动效去掉缩放。
- 可运行代码：[cards.mjs / c2](../assets/gallery/patterns/cards.mjs)；[操作范例](../assets/gallery/index.html#c2)

### C3 · 焦点关联强调

- 效果：颜色/边框短过渡说明选中或键盘焦点。
- 适用：选择/编辑对象，强调当前焦点。
- 不适用：把焦点等同已选择；依赖颜色作为唯一提示。
- 状态合同：Focus 与 selected 分离；选中有文本标签。
- 可运行代码：[cards.mjs / c3](../assets/gallery/patterns/cards.mjs)；[操作范例](../assets/gallery/index.html#c3)

### C4 · 上下文摘要展开

- 效果：原位置展开，标题保持锚定，内容短淡变。
- 适用：摘要与细节有明确从属关系。
- 不适用：需要单独路由、很长内容；不要挤压整个列表。
- 状态合同：Expand/close/Escape；折叠时内容不可聚焦。
- 可运行代码：[cards.mjs / c4](../assets/gallery/patterns/cards.mjs)；[操作范例](../assets/gallery/index.html#c4)

### C5 · 比较选择关系

- 效果：勾选与比较槽同步，空间层和真实数量分轨。
- 适用：商品比较/对象选择；来源明确。
- 不适用：不能多选的入口、错误容量限制。
- 状态合同：选择/取消可快速反向；数量立即更新。
- 可运行代码：[cards.mjs / c5](../assets/gallery/patterns/cards.mjs)；[操作范例](../assets/gallery/index.html#c5)

## 视图与对象转场

### T1 · 同级视图交叉淡变

- 效果：旧新视图短重叠，内容容器稳定；语义立即切换。
- 适用：同级摘要、工具视图，无空间方向。
- 不适用：用淡变掩盖加载未完成；高频无必要切换。
- 状态合同：切换/反向；旧视图不可交互且 aria-hidden。
- 可运行代码：[transitions.mjs / t1](../assets/gallery/patterns/transitions.mjs)；[操作范例](../assets/gallery/index.html#t1)

### T2 · 方向一致的推入

- 效果：目的地按导航顺序进入，返回方向反转。
- 适用：层级或有序步骤，方向关系真实。
- 不适用：无顺序平级分类；别强制所有页面横移。
- 状态合同：目标/方向即时决定；可中途返回。
- 可运行代码：[transitions.mjs / t2](../assets/gallery/patterns/transitions.mjs)；[操作范例](../assets/gallery/index.html#t2)

### T3 · 来源锚定展开

- 效果：同一视觉对象在受控区域中展开，正文独立淡入。
- 适用：卡片→详情，真实对象与实际图像身份一致，来源可见；不同封面选择普通弹窗。
- 不适用：无来源身份、跨文档未适配的页面跳转。
- 状态合同：Expand/return；同一DOM身份，不声称跨文档转场。
- 可运行代码：[transitions.mjs / t3](../assets/gallery/patterns/transitions.mjs)；[操作范例](../assets/gallery/index.html#t3)

### T4 · 非模态底部面板

- 效果：底部来源/层级关系，短距离展开，可立即关闭。
- 适用：内嵌详情区、可取消的非模态辅助视图。
- 不适用：阻塞确认必须使用完整dialog焦点与模态语义。
- 状态合同：Open/close/Escape；示例非模态，焦点返回触发器。
- 可运行代码：[transitions.mjs / t4](../assets/gallery/patterns/transitions.mjs)；[操作范例](../assets/gallery/index.html#t4)

### T5 · 同源对象位置交接

- 效果：同一对象在两个位置间平滑移动，标签独立切换。
- 适用：来源和目的都明确的选中项/详情视觉交接。
- 不适用：对象不同、来源消失；不要偷换成整个新界面。
- 状态合同：连续切换/resize→当前x/v接续；示例为局部交接。
- 可运行代码：[transitions.mjs / t5](../assets/gallery/patterns/transitions.mjs)；[操作范例](../assets/gallery/index.html#t5)

## 图标状态

### I1 · 轮廓到填充

- 效果：同一SVG轮廓与填充表达收藏状态，空间确认可选。
- 适用：收藏/喜欢有真实选中状态。
- 不适用：静态装饰icon；不是任意SVG路径morph。
- 状态合同：收藏/取消；aria-pressed与标签立即更新。
- 可运行代码：[icons.mjs / i1](../assets/gallery/patterns/icons.mjs)；[操作范例](../assets/gallery/index.html#i1)

### I2 · 展开标记淡变

- 效果：对齐的展开/收起标记交叉淡变，反向连续。
- 适用：展开/收起、上下层级。
- 不适用：用箭头替代明确标签；不匹配内容状态。
- 状态合同：expanded立即改变；内容状态与箭头一致。
- 可运行代码：[icons.mjs / i2](../assets/gallery/patterns/icons.mjs)；[操作范例](../assets/gallery/index.html#i2)

### I3 · 菜单到关闭

- 效果：菜单与关闭图形保持位置，交叉淡变表达开关。
- 适用：按钮确实控制可关闭区域。
- 不适用：装饰logo、没有关闭状态的导航。
- 状态合同：点击/Escape；对齐的稳定图形，不声称通用路径morph。
- 可运行代码：[icons.mjs / i3](../assets/gallery/patterns/icons.mjs)；[操作范例](../assets/gallery/index.html#i3)

### I4 · 播放与暂停

- 效果：两种语义形状交叉过渡，背景目标不跳动。
- 适用：媒体控件有实际播放状态。
- 不适用：无媒体状态；示例只展示本地状态，不播放音频。
- 状态合同：play/pause→标签即时变化；不中断点击。
- 可运行代码：[icons.mjs / i4](../assets/gallery/patterns/icons.mjs)；[操作范例](../assets/gallery/index.html#i4)

### I5 · 复制结果描边

- 效果：复制请求→成功勾线/失败文本，短确认后恢复。
- 适用：复制结果需要明确反馈。
- 不适用：未经实际成功就打勾；用动画假装复制成功。
- 状态合同：示例模拟结果；接入时只根据Clipboard Promise改变。
- 可运行代码：[icons.mjs / i5](../assets/gallery/patterns/icons.mjs)；[操作范例](../assets/gallery/index.html#i5)

## 数据可视化

### D1 · 共同尺度柱图

- 效果：同一刻度下高度单调补间，最新数据即时可读。
- 适用：两组数值比较，有固定共同尺度。
- 不适用：真实进度不能虚构；基线不一致、极大数据量。
- 状态合同：数据切换/反向；文本始终显示最新真实值。
- 可运行代码：[data.mjs / d1](../assets/gallery/patterns/data.mjs)；[操作范例](../assets/gallery/index.html#d1)

### D2 · 同拓扑折线

- 效果：对应采样点沿真实新值移动，拓扑保持。
- 适用：相同时间点数据更新。
- 不适用：采样身份不同、金融实时报价假显示中间值。
- 状态合同：同样本x位置；文字值即时，图形单调接续。
- 可运行代码：[data.mjs / d2](../assets/gallery/patterns/data.mjs)；[操作范例](../assets/gallery/index.html#d2)

### D3 · 比例环图

- 效果：比例弧长单调变化，标签立即更新。
- 适用：真实构成比例、单值百分比。
- 不适用：伪造上传进度；没明确分母或包含负值。
- 状态合同：最新百分比立即可读；环图不越界、不回弹。
- 可运行代码：[data.mjs / d3](../assets/gallery/patterns/data.mjs)；[操作范例](../assets/gallery/index.html#d3)

### D4 · 正负变化关系

- 效果：从共同零点绘制偏移，符号和数值即时变化。
- 适用：正负增量对比，基线固定。
- 不适用：只有绝对值、故意改变零点夸大变化。
- 状态合同：切换→真实符号；空间轨道无过冲，保留零线。
- 可运行代码：[data.mjs / d4](../assets/gallery/patterns/data.mjs)；[操作范例](../assets/gallery/index.html#d4)

### D5 · 排名身份重排

- 效果：稳定key对象改变位置，最新排名和数值即时展示。
- 适用：少量榜单更新，用户需要追踪同一对象。
- 不适用：大表格、无稳定ID；演示绝对定位不能直接套flow。
- 状态合同：连续排序接续；屏幕阅读顺序按新排名重排。
- 可运行代码：[data.mjs / d5](../assets/gallery/patterns/data.mjs)；[操作范例](../assets/gallery/index.html#d5)

## 公共集成不变量

一个属性一个动画所有者；视觉与语义分轨；最新意图优先；可按当前呈现改目标；卸载释放本控制器的事件、订阅、计时器与动画。以实际静态布局作为端点，测量在范围内的坐标；动态内容尺寸不能照抄demo的固定高度。保持项目既有语义、稳定key、焦点规则和请求管理。Shared element优先平台/现有库，无法保证身份时退回短非空间变化。

实现后按 [validation.md](validation.md) 观察正常、中途反向、快速输入和相关键盘/触控/减少动效。复制代码文件名或出现helper不构成验证。
