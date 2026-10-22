# 合格节点判定与覆盖合同

## 什么必须覆盖

范围首先由用户任务/页面/组件限定，不擅自扩展到全产品。范围内满足任一条件即合格：

1. 接受输入或可操作：button、link、tab、toggle、checkbox、radio、slider、input/select、菜单项、可点击卡片、拖拽手柄、分页、icon-button、自定义手势区及原生对应组件。
2. 对用户有可见状态/内容变化：选中、展开、加载/结果、禁用/启用、颜色主题、icon含义/填充、文本或数据更新、内容驱动的自然宽高及邻接布局变化、插入/删除、路由/共享对象交接。
3. 新出现、被滚动带入/带出或所属组显隐：标题、正文段落组、图片、卡片、控件组、弹窗/菜单内容。持续文本用段落/区域的低幅度进入退出，保持阅读，不逐字默认编舞。
4. 可表达接触与材质的对象：拖动、柔软表面、释放/贴边、可操控品牌物体。需要明确材质与操作含义，非交互装饰不能假装可点。

纯静态装饰也可随所属组进退，但不添加虚假的hover/press提示。不可编辑/不可操作文本无须模拟按钮press；每个真实控件不能因频繁/小/原生就被遗漏。disabled控件有disabled状态过渡与组入场，不伪装成启用的点击反馈。

## 每个控件的状态矩阵

出现/移除：可独立或由真实父组覆盖，父组必须实际包含该控件且正常可见；一份共用组件规则可以覆盖所有实例。首次出现、重新打开/插入、滚动重入分别记录。

精确指针：hover enter/move/leave；键盘：focus/blur、activation；触屏：press/release/cancel、状态；其余：selected/toggled、expanded/collapsed、disabled/enabled、loading/success/error及真实相关状态。静态icon作为控件的一部分继承响应，有状态的icon额外获得状态过渡。

矩阵单元是 applied / inherited / native-verified / exception / gap。inherited写具体父组/共享实现；native-verified写已观察到的反馈与端点；exception写条件和替代。仅写“原生”或“已有transition”不能算通过。共同入场不是以后hover/press缺失的替代。

## 覆盖与强度是两件事

合格实例全覆盖；表达强度按语言、频率与结构变化。密集工具可用更短、更小的复合响应，品牌主动作可以更有材料层次；不能把“克制”变成0反馈。也不能用全站统一scale替代设计。keep意味着评估过可行的细化方向，原有生命周期与表现已成熟并有保留理由，reduce/remove只删除冲突/误导轨道，仍保留合格控件必需的反馈。

只有减少动效/用户明确动效偏好、平台管理且不能干预的表面、确实超任务范围/当前无法执行的实现可以具名例外。defer是未完成项，需报告；不能以成本或低优先级宣称全覆盖。资源不足时先完成高风险项，再如实交付剩余缺口。

可复用清单JSON结构：scope、families、instances、appearanceOwner、events、tracks、interruption、reduced、exceptions、evidence。按组件家族收敛重复，抽样验证家族实现并查全部实例是否连接；多个变体/原生平台不能未经检查共用证据。

## 出现/滚动接线必须可追溯

为标题、段落组、图片和UI家族分别登记真实appearanceOwner与scrollOwner、实例选择器/业务ID、外层测量节点和内层呈现节点、滚动容器、首屏/路由/插入及滚动进退触发。父组覆盖须实查后代：只有标题或小标签在动，不能计为整组正文/UI已覆盖。记录applied、inherited的实际接线/呈现证据；定义controller但未mount、错误root、选择器零匹配或仅设data属性均是gap。

内容/状态改变实际外框宽高的变体必须登记layoutOwner与自然端点，沿[layout-continuity.md](layout-continuity.md)验收；实例覆盖与能力完成条件沿[execution-completeness.md](execution-completeness.md)核对。正常模式既有清楚反馈不能默默弱化，卡片主机制不能按组件名统一推断为鼠标跟随。

## 结构变体与实例一致性的证据

家族按语义、可见造型、材质和内部层结构划分：矩形表面、圆形 surface、透明 icon、原生 slider 即使都匹配同一选择器，也不能未经判断共用反馈。相同结构/意图的实例继承同一核心机制，合理差异登记为变体，不按素材类型临时分叉。同组逐项检查 hover/leave 与真实目标层；确保中心 icon、边缘、文字均命中，clip/光效不挡正文。

全实例绑定检查和行为实测分开记录：枚举/计数/事件已绑定只证明接线，不证明悬停可感知、形状正确、恢复可靠或布局连续。至少每个独立结构变体及每条独立打开/关闭入口有实测；余实例继承证据须写具体共享 owner/同构依据，并全查目标/裁切/样式例外。不能把 repeated scene rows 当 unique instances，也不能将 inferred 批量升级为 observed。用户要求全实例实测时执行该范围，未测仍是未测。
