# 并列设计依据

Apple、Google Material 3、Disney、Microsoft Fluent 2、IBM Carbon同层级、同地位，共同参与设计。统一阅读本页及[principles.md](principles.md)的原则表；不按来源顺序、篇幅、详细规则数量或目标平台决定体系优先级。WAI的可访问性规则统一约束全部方案，本包覆盖与交互规则共同执行。

| 并列依据 | 必须评估的视角 | 关联验收 |
|---|---|---|
| Apple | 输入跟手、身份/位置/速度连续、改目标和释放交接 | 真实输入、中途反向、快速重复与恢复，命中/焦点可靠 |
| Google Material 3 | 空间/效果分轨、方案与速度层级、范围和属性owner | 分别采样空间与效果，检查边界、合法区间和重定向 |
| Disney | 主次、节奏、重量、材质与表演性，十二原则UI适配 | 已用原则有呈现证据，预备不阻塞操作，视觉评审清楚 |
| Microsoft Fluent 2 | 功能、自然、一致与吸引力，层级及多元素编排 | 路径/层级一致，组节奏清楚，多区域不争抢注意 |
| IBM Carbon | 语义一致、效率与表达强度，反馈和任务成本 | 同义动作规律一致，密集操作反馈完整、无漫长排队 |

每个组件家族按五个视角使用相同的采用/调整/不适用方式记录理由与证据。技术细节按任务展开，同族复用。平台不兼容时说明适配，不能用“不在该平台”跳过该设计视角。冲突按用户意图、可操作性、真实语义和测量结果解决，不按来源身份排序。来源见[sources.md](sources.md)。

## Material 3 空间与效果分轨

依据[官方运动物理系统](https://m3.material.io/styles/motion/overview/how-it-works)与[Material Components官方实现文档](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)。本节将公开体系应用于跨平台项目，具体Web编排和验收字段是本包适配。

| 类别 | 归属属性与职责 | 实施与验收 |
|---|---|---|
| spatial空间 | 位置、尺寸、旋转、圆角/形体几何，解释对象在哪里以及怎样受力 | 选择合适弹簧/非线性机制，允许有界且有意义的轻弹性；保留锚点、可读性与当前位置/合理速度，测试改向及边界 |
| effects效果 | 颜色、透明度及明确的视觉呈现量，解释对象是什么状态与怎样显现 | 无过冲且合法范围内过渡；可用平台effects spring或本项目非线性效果轨道。不能复制空间回弹，不能把clamp当作设计；测试真正中间色/alpha和快速反向 |
| direct input直接输入 | 手指/指针拖动位置、真实进度；这是输入责任分类而非Material的第三种token | 忠实跟随真实输入；装饰跟随层可属于spatial，释放明确交接。不能套自主缓动制造迟滞或改变真实进度 |
| semantics语义 | 业务值、aria、标签、焦点、是否可操作；不是动画轨道 | 输入后立即准确，与视觉过渡并行；不按弹簧结束时机提交结果 |

形变/圆角属于几何责任，色彩/opacity属于效果责任；一个复杂视觉可拆成多个子层。新增自定义材质时说明材料层的坐标、约束与owner。属性重叠先分层，不能让layout、press和material互相覆盖同一个transform。

Material的scheme为standard或expressive，速度层级为fast/default/slow；结合对象尺寸、变化规模、距离、频率与设备选择。以统一基础scheme为主，少量有语义的局部变化需具名。数值/API按目标框架版本读取，禁止把本包omega/zeta和毫秒起点冒称Google官方token。

本包productive/expressive/narrative是用途与编排语言，并不与Material scheme一一相等。项目采用Material时记录实际scheme与token；其它视觉体系可以借鉴分轨结构，用项目已有曲线/弹簧，无需强制换组件库。

## 表演与材质细节（Disney视角）

Disney[Animation官方说明](https://www.disneyanimation.com/process/animation/)强调节奏、清晰演出、形变、预备、跟随、次要动作、重量与表现。十二项的完整名称由Frank Thomas与Ollie Johnston的[原则页](https://frankandollie.com/PhysicalAnimation.html)核对。完整逐项产品适配表见[principles.md](principles.md)，不是声称官方页面本身列出全部十二项，也未取得著作全文。

十二项UI迁移细节见[principles.md](principles.md)，按相关机制查阅，与各体系细节处于同一层级，采纳决定共用framework_review。无需另立十二项必填清单或专属验收流程；适用的形变、节奏、跟随和吸引力落入实际轨道证据。

## 让并列依据共同形成一个设计

例如可切换控件：Apple视角检查快速反向与跟手；Material视角区分thumb位置、颜色和标记显隐；Disney视角安排主体、次响应与跟随；Fluent视角协调它与相邻设置项的层级/节奏；Carbon视角保持同类设置一致且高频操作利落。选中值立即准确，具体形变、弧线或夸张按结构评估，不机械加入。

验收必须分别证明分类、范围/重定向与主次关系；只看CSS出现spring或两个属性不足。若需要减少运动，降低空间/材料/表演层，保持状态、焦点与结果清楚。参考依据不取消用户的全控件覆盖要求。
