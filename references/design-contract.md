# 可实施的组件与路径合同

合同按组件家族复用；复杂空间/手势/异步保留全部相关字段，简单控件内联记录。全覆盖不要求每个实例独立文件。

~~~yaml
node_family: component/native identity + actual instances
scope: 当前授权页面/控件
aesthetic_value: 功能/美感/品牌/氛围；已有润色keep/调整/删除的证据与保留替代
purpose_scheme: 操作用途与productive/expressive/narrative
framework_review: Apple/Material/Disney/Fluent/Carbon并列；各自采用/调整/不适用及理由、关联轨道与验收；不设来源权重
reference_recipe: 使用时记录React Bits/Vue Bits等来源、候选理由、版本/代码路径、核心机制、采用/调整/组合/重写/keep、改动、预览/源码/项目运行证据；无匹配/访问受限的降级理由
material_scheme: standard/expressive/custom/借鉴分轨；平台版本与实际token或自定参数
coverage: 首屏/路由/插入appearance owner，真实文字/图片/UI实例、scroll root与外层测量/内层呈现； hover/focus/press/state; exit/reentry; native-verified/exception
states: 真实idle/pressed/selected/loading/success/error/disabled等
semantic: 输入后立即更新的值、aria、标签、焦点与可操作性
perceptual_baseline: 正常模式既有主反馈、幅度/对比/显露行程/节奏与比较证据；替代或调弱理由，机制候选比较
content_layout: 真实宽高/跨呈现方式变化、自然端点与父约束、测量坐标空间、图像尺寸/位置/朝向/裁切、外框/图文/邻接owner及协同事务；新标签不挤入旧窄宽度；打断/恢复auto无跳变及中间证据
identity_geometry: stable id、来源/目标、命中区、材料坐标、边界
tracks: 主响应与相关次响应；每属性owner、非线性规律、时长/omega/zeta、幅度
track_classification: 每条spatial/effects/direct-input轨道的属性、范围、速度档、owner与取消/改向
orchestration: 主次、组时序、总延迟预算
hover_focus: pointerInside/focusVisible/pressed分开，复合轨道同状态快照与恢复策略；按可见轮廓/材质决定反馈、全命中范围，Icon局部位置/方向稳定；媒体裁切不伤叠加内容；同构实例共用机制，合理造型变体具名
overlay: 触发源ID/矩形/可见性→目标，实际封面/视觉asset身份与shared资格、采用理由/用户策略或默认普通弹出选择（所有入口及返回），关闭前后背景锚点/scroll/可用宽度与滚动锁恢复，媒体/蒙层/内容分轨，关闭重测与缺来源替代，取消/焦点/媒体生命周期、源控件hover/press/扫光统一校准；Icon/标签/海报/媒体首帧各阶段可见性、重叠交接及chrome策略
interruption: 当前呈现、速度、反向/改目标/取消、过期异步隔离
scroll: 同一对象在真实可见带上下双边缘进入/退出实测，真实文字/图片/UI的透明度0→1与下方偏移→自然位置、进入/可见/退出/重入、方向反转、可见操作目标focus/held保护，不因离屏遗留焦点冻结整组
fallback: 减少动效、触控/键盘、API/no-JS、来源消失
acceptance: 初段/中途/末态、一次反向、快速重复、真实输入、非法边界
evidence: observed/inferred/unknown + 实际环境
regression: pointer-click/drag→leave无需额外点击，backdrop alpha终态与关闭barrier，首帧/全部survivor及outgoing真实身份，原版/增强版媒体与邻接几何；适用路径实际证据与未验证边界
~~~

shared图像transition必须同时有真实对象身份与一致的实际视觉素材；不同封面、缺身份或未知时使用完整普通弹出，不强行同图飞行后换图。已有静态端点保留；动画临时副本不携带真实业务类/ID/data-action。复杂材料写清输入真实位置、内部形变与释放恢复各属于哪一层。
